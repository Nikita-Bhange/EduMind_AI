import Document from "../models/Document";
import Flashcard from "../models/Flashcard";
import Quiz from "../models/Quiz";
import ChatHistory from "../models/ChatHistory";
import * as geminiService from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker";

export const generateFlashcards = async (req, res) => {
  try {
    const { documentId, count=10 } = req.body;
    if (!documentId) {
        return res.status(400).json({ success: false, error: 'Document ID is required',statusCode:400 });
    }

    const document = await Document.findOne({
        _id: documentId,
        userId :req.user._id,
        status:'ready'
    })

    if(!document){
        return res.status(404).json({ success: false, error: 'Document not found or not ready',statusCode:404 });
    }

    //generate flashcards using gemini
    const cards = await geminiService.generateFlashcards(document.extractedtext, parseInt(count));

    //save to db
    const flashcardSet = new Flashcard.create({
        userId:req.user._id,
        documentId:document._id,
        cards:cards.map(card=>({
            question: card.question,
            answer: card.answer,
            difficulty: card.difficulty
        } ))
    } )
}
        catch (error) {
            console.error('Error saving flashcards:', error);
        }

    
}

//
export const generateQuiz = async(req,res,next)=>{
    try{
        const {
            documentId,numQuestions = 5,title 
        } = req.body;
        
          if (!documentId) {
        return res.status(400).json({ success: false, error: 'Document ID is required',statusCode:400 });
    }

    const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status :'ready'
    })
         if (!document){ return res.status(404).json({ success: false, error: 'Document not found or not ready',statusCode:404 });
    }

    //generate flashcards using gemini
    const questions = await geminiService.generateQuiz(document.extractedtext, parseInt(numQuestions));

    //save to db
    const quiz = new Quiz.create({
        userId:req.user._id,
        documentId:document._id,
        title:title|| `${document.title}-Quiz`,
        questions:questions,
        totalQuestions:questions.length,
        userAnswer:[],
        score:0
    } )

    res.status(201).json({
        success:true,
        data:Quiz,
        message:'Quiz generate successfully'

    })

    } catch(error){
        next(error)
    }
}



export const generateSummary = async(req,res,next)=>{
    try{
        const {  documentId} = req.body;
        
          if (!documentId) {
        return res.status(400).json({ success: false, error: 'Document ID is required',statusCode:400 });
    }

    const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status :'ready'
    })
         if (!document){ return res.status(404).json({ success: false, error: 'Document not found or not ready',statusCode:404 });
    }

    //generate flashcards using gemini
    const summary = await geminiService.generateSummary(document.extractedtext);

   
    res.status(200).json({
        success:true,
        data:{
            documentId:document._id,
            title:document.title,
            summary
        },
        message:'Summary generated successfully'
    })

    } catch(error){
        next(error)
    }
}

export const chat = async(req,res,next)=>{
    try{
        const { documentId,question} = req.body;

            if (!documentId || !message) {
                return res.status(400).json({ success: false, error: 'Document ID and message are required', statusCode: 400 });
            }

            const document =    await Document.findOne({
                _id:documentId,
                userId:req.user._id,
                status:'ready',
                statusCode:404
            })

            //find relevant chunks
            const chunks = await findRelevantChunks(document.chunks,question,3);
            const chunkIndices = findRelevantChunks.map(c=>c.chunkIndex);

            //get or create chat history
            let chatHistory = await ChatHistory.findone({
                userId:req.user._id,
                documentId:document._id
            })

            if(!chatHistory){
                chatHistory = await ChatHistory.create({
                    userId: req.user._id,
                    documentId:document._id,
                    messages:[]
                })
            }
            const answer = await geminiService.chatWithContext(question, relevantChunks);

            //save conversation
            chatHistory.messages.push({
                role:'user',
                content:question,
                timestamp:new Date(),
                relevantChunks:[]
            },
            {
                role:'assistant',
                content:answer,
                timestamp :new Date(),
                relevantChunks:chunkIndices
            }
        )

        await chatHistory.save();

            res.status(200).json({
        success:true,
        data:{
            question,
            answer,
            relevantChunks:chunkIndices,
            chatHistoryId:chatHistory._id
        },
        message:'response generated successfully'
    })

        }catch(error){
                next(error)
            }
   };

   export const explainConcept = async(req,res,next)=>{
    try{
             const { documentId,concept} = req.body;

            if (!documentId || !concept) {
                return res.status(400).json({ success: false, error: 'Document ID and concept are required', statusCode: 400 });
            }

            const document =    await Document.findOne({
                _id:documentId,
                userId:req.user._id,
                status:'ready',
             
            })
             if (!document){ return res.status(404).json({ success: false, error: 'Document not found or not ready',statusCode:404 });
    }


            //find relevant chunks for the concept
            const revelantChunks = await findRelevantChunks(document.chunks,concept,3);
            const context = RelevantChunks.map(c=>c.content).join('\n\n');

            //generate explanation using gemini
            const explanation = await geminiService.explainConcept(concept,context);

              res.status(200).json({
        success:true,
        data:{
            concept,
            explanation,
            relevantChunks: relevantChunks.map(c=>c.chunkIndex)
        },
        message:'response generated successfully'
    })


           
    }catch(error){

    }
   }


   export const getChatHistory = async (req,res,next)=>{

    try{
      const {   documentId } = req.params;
        
     if (!documentId) {return res.status(400).json({ success: false, error: 'Document ID is required',statusCode:400 }); }

    
      
    const chatHistory = await ChatHistory.findOne({
        userId:req.user._id,
        documentId:documentId
    }).select('messages');

    if(!chatHistory){
         res.status(200).json({
        success:true,
        data:[],
        message:'no chat history found for this document'
    })
    }

    res.status(200).json({
        success:true,
        data:chatHistory.messages,
        message:'Chat history retrieved successfully'
    })

    }catch(error){
        next(error)
    }
   }