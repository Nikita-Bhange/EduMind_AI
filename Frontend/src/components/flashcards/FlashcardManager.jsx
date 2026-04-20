import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      const sets = response.data || [];
      setFlashcardSets(sets);

      if (!sets.length) {
        setSelectedSet(null);
        setCurrentCardIndex(0);
        return;
      }

      setSelectedSet((prevSelectedSet) => {
        if (!prevSelectedSet) return sets[0];
        return sets.find((set) => set._id === prevSelectedSet._id) || sets[0];
      });
      setCurrentCardIndex(0);
    } catch (error) {
      toast.error(error.message || "Failed to fetch flashcards.");
      setFlashcardSets([]);
      setSelectedSet(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcards();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      const response = await aiService.generateFlashcards(documentId);
      toast.success(response.message || "Flashcards generated successfully.");
      await fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleReview = async (index) => {
    const card = selectedSet?.cards?.[index];
    if (!card) return;

    try {
      await flashcardService.reviewFlashcard(card._id, index);
    } catch (error) {
      toast.error(error.message || "Failed to review flashcard.");
    }
  };

  const handleNextCard = () => {
    if (!selectedSet?.cards?.length) return;
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % selectedSet.cards.length);
  };

  const handlePrevCard = () => {
    if (!selectedSet?.cards?.length) return;
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length);
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcardSets((prevSets) =>
        prevSets.map((set) => ({
          ...set,
          cards: set.cards.map((card) =>
            card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
          ),
        }))
      );
      setSelectedSet((prevSelectedSet) =>
        prevSelectedSet
          ? {
              ...prevSelectedSet,
              cards: prevSelectedSet.cards.map((card) =>
                card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
              ),
            }
          : prevSelectedSet
      );
    } catch (error) {
      toast.error(error.message || "Failed to update star.");
    }
  };

  const handleDeleteFlashcardSet = async () => {
    if (!selectedSet) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(selectedSet._id);
      toast.success("Flashcard set deleted successfully.");
      setIsDeleteModalOpen(false);
      await fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!flashcardSets.length) {
    return (
      <EmptyState
        title="No Flashcards Yet"
        description="Generate flashcards from this document to start studying."
        buttonText={generating ? "Generating..." : "Generate Flashcards"}
        onActionClick={generating ? undefined : handleGenerateFlashcards}
      />
    );
  }

  const currentCard = selectedSet?.cards?.[currentCardIndex];

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Flashcards</h3>
          <p className="text-sm text-neutral-500">
            {selectedSet?.cards?.length || 0} cards in this set
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateFlashcards} disabled={generating}>
            <Plus size={16} />
            {generating ? "Generating..." : "Generate New Set"}
          </Button>
          <Button onClick={() => setIsDeleteModalOpen(true)} variant="secondary" disabled={!selectedSet || deleting}>
            <Trash2 size={16} />
            Delete Set
          </Button>
        </div>
      </div>

      {flashcardSets.length > 1 && !selectedSet && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {flashcardSets.map((set) => (
            <button
              key={set._id}
              type="button"
              onClick={() => {
                setSelectedSet(set);
                setCurrentCardIndex(0);
              }}
              className="rounded-lg border border-neutral-200 p-4 text-left hover:border-neutral-300 transition-colors"
            >
              <div className="text-sm font-semibold text-neutral-900">Flashcard Set</div>
              <div className="text-sm text-neutral-500 mt-1">{set.cards.length} cards</div>
            </button>
          ))}
        </div>
      )}

      {selectedSet && currentCard && (
        <div className="space-y-4">
          {flashcardSets.length > 1 && (
            <button
              type="button"
              onClick={() => {
                setSelectedSet(null);
                setCurrentCardIndex(0);
              }}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
            >
              <ArrowLeft size={16} />
              Back to Sets
            </button>
          )}

          <div className="max-w-2xl mx-auto">
            <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button onClick={handlePrevCard} variant="secondary" disabled={selectedSet.cards.length <= 1}>
              <ChevronLeft size={16} />
              Previous
            </Button>
            <span className="text-sm text-neutral-600">
              {currentCardIndex + 1} / {selectedSet.cards.length}
            </span>
            <Button onClick={handleNextCard} variant="secondary" disabled={selectedSet.cards.length <= 1}>
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete this flashcard set? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button onClick={handleDeleteFlashcardSet} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardManager;
