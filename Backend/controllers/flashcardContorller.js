import Flashcard from "../models/Flashcard";

//@desc get all flashcards for a document
//@route Get /api/flashcards/:documentId
//@access Private
export const getFlashcards = async(req, res, next)=>{
    try{
        const flashcards = await Flashcard.find({
            userId: req.user._id,
            documentId: req.params.documentId
        })
        .populate('documentId','titlefileName').sort({createdAt:-1});

        res.status(200).json({
                success:true,
                count: flashcards.length,
                data:flashcards
                

            })
    }catch(error){
        next(error);
    }
}

//@desc get all flashcards set for  user
//@route Get /api/flashcards
//@access Private
export const getAllFlashcardSets = async(req, res, next)=>{
    try{
        const flashcardSets = await Flashcard.find({userId:req.user._id})
        .populate('documentId','title').sort({createdAt :-1})

        res.status(200).json({
            success:true,
             count: flashcardSets.length,
                data:flashcardSets
                
        })
    }catch(error){
        next(error);
    }
}

//@desc mark flashcard as reviewed
//@route post /api/flashcards/:cardId/review
//@access Private
export const reviewFlashcard = async(req, res, next)=>{
    try{
        const flashcardSet = await Flashcard.findOne({
            'cards._id':req.params.cardId,
            userId: req.user._id
        })

        if(!flashcardSet){
            return res.status(404).json({
                success:false,
             error: 'flashcard set or card not found',
                statusCode:404
            })
        }

        const cardIndex = flashcardSet.cards.findIndex(card=>card._id.toString()=== req.params.cardId);

        if (cardIndex ===-1){
            return  res.status(404).json({
                success:flase,
             error: 'card not found in set',
                statusCode:404
            });
        }

        //update review info
        flashcardSet.cards[cardIndex].lastReviewed = new Date();
        flashcardSet.card[cardIndex].reviewCount +=1;

        await flashcardSet.save();
         res.status(200).json({
                success:true,
             data: flashcardSet,
                message:'Flashcard review successfully'
            });

    }catch(error){
        next(error);
    }
}

//@desc Toggle star/favorite on flashcard
//@route put /api/flashcards/:cardId/star
//@access private
export const toggleStarFlashcard = async(req,res, next)=>{
     try{
        const flashcardSet = await Flashcard.findOne({
            'cards._id':req.params.cardId,
            userId: req.user._id
        })

        if(!flashcardSet){
            return res.status(404).json({
                success:false,
             error: 'flashcard set or card not found',
                statusCode:404
            })
        }

        const cardIndex = flashcardSet.cards.findIndex(card=>card._id.toString()=== req.params.cardId);

        if (cardIndex ===-1){
            return  res.status(404).json({
                success:flase,
             error: 'card not found in set',
                statusCode:404
            });
        }

        //toggle star
        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;
       

        await flashcardSet.save();
         res.status(200).json({
                success:true,
             data: flashcardSet,
                message:`Flashcard ${flashcardSet.cards[cardIndex].isStarred? 'starred':'unstarred'}`
            });
        
        
    }catch(error){
        next(error);
    }
};

//@desc Delete flashcard set
//@route Delete /api/flashcards/:id
//@access Private

export const deleteFlashcardSet= async(req,res,next)=>{
try{
        const flashcardSet = await Flashcard.findOne({
            'cards._id':req.params.cardId,
            userId: req.user._id
        })

        if(!flashcardSet){
            return res.status(404).json({
                success:false,
             error: 'flashcard set or card not found',
                statusCode:404
            })
        }

         await flashcardSet.deleteOne();
         res.status(200).json({
                success:true,
           
                message:'flashcard set deleted successfully'
            });
        
    }catch(error){
        next(error);
    }
}