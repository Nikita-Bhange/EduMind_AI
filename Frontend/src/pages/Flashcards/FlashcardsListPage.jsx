import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import FlashcardSetCard from "../../components/flashcards/FlashcardSetCard";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getAllFlashcardSets();
      setFlashcardSets(response.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch flashcard sets.");
      setFlashcardSets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  const handleDeleteRequest = (flashcardSet) => {
    setSelectedSet(flashcardSet);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteFlashcardSet = async () => {
    if (!selectedSet?._id) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(selectedSet._id);
      toast.success("Flashcard set deleted successfully.");
      setFlashcardSets((prevSets) => prevSets.filter((set) => set._id !== selectedSet._id));
      setIsDeleteModalOpen(false);
      setSelectedSet(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader title="All Flashcard Sets" />

      {loading ? (
        <Spinner />
      ) : flashcardSets.length === 0 ? (
        <EmptyState
          title="No Flashcard Sets Found"
          description="You have not created any flashcard sets yet."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {flashcardSets.map((set) => (
            <FlashcardSetCard key={set._id} flashcardSet={set} onDelete={handleDeleteRequest} />
          ))}
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete
            {" "}
            <span className="font-semibold text-neutral-800">
              {selectedSet?.documentId?.title || "this flashcard set"}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
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

export default FlashcardsListPage;
