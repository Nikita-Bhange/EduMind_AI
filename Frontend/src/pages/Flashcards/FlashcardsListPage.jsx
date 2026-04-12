import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import FlashcardSetCard from '../../components/flashcards/flashcardSetCard'

const FlashcardsListPage = () => {
  const[flashcardSets ,setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchFlashcardSets = async()=>{
      try{
        const response = await flashcardService.getAllFlashcardSets();

        console.log("fetchFlashcardSets__",response.data);
        setFlashcardSets(response.data);
      }catch(error){
        toast.error("fail to fetch card sets")
          console.error(error)
      } finally{
        setLoading(false);
      }
    }
  },[])

  const renderContent =()=>{
    if(loading){
      return <Spinner/>
    }
  }

if (flashcardSets.length === 0) {
  return (
    <EmptyState
      title="No Flashcard Sets Found"
      description="You have not created any flashcard sets yet."
    />
  );
}

return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {flashcardSets.map((set) => (
      <FlashcardSetCard key={set._id} flashcardSet={set} />
    ))}
  </div>
);
      
      return(
        <>
        <div >
          <PageHeader title="All Flashcard Sets"/>
          {renderContent()}
        </div>
        </>
      )

};

export default FlashcardsListPage;
