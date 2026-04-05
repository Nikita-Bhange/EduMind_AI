import Document from '../models/Document.js'
import Flashcard  from '../models/Flashcard.js'
import Quiz from '../models/Quiz.js'
import {extractTextFromPDF} from '../utils/pdfParser.js'
import{chunkText} from '../utils/textChunker.js'
import fs from 'fs/promises'
import mongoose from 'mongoose'

//@desc upload Pdf document
//@route post /api/documents/upload
//@access private

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF file',
        statusCode: 400
      });
    }

    const { title } = req.body;

    if (!title) {
      // Delete uploaded file if no title provided
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Please provide a document title',
        statusCode: 400
      });
    }

    // Construct the URL for the uploaded file
    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;
    //create document entry in database
    const document = await Document.create({
        userId:req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl,
      fileSize: req.file.size,
      status: 'processing'
    });
  
    // Process the PDF in the background
    processPDF(document._id, req.file.path).catch(err=>{
        console.error('Error processing PDF:', err);
    })

    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully and is being processed'
    });
  }
    catch(error){
        //clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{});
        }
        next (error);
    }
}

//helper function to process PDF, extract text, create flashcards and quizzes
const processPDF = async(documentId,filePath)=>{
    try{
        //extract text from PDF
        const {text} = await extractTextFromPDF(filePath);

        //create chunks from text
        const chunks = chunkText(text, 500, 50);

        //update document with chunks and set status to completed
        await Document.findByIdAndUpdate(documentId,{
            extractedText:text,
            chunks:chunks,
            status:'ready',
        })
        console.log(`Documents ${documentId} processed successfully with ${chunks.length} chunks.`);
    }catch(error){
        console.error('Error processing PDF:', error);
        //update document status to failed
        await Document.findByIdAndUpdate(documentId, {
            status: 'failed'
        });
    }
}

//@desc get all user  document
//@route get /api/documents
//@access 


export const getDocuments = async (req, res, next)=>{
    try{
        const documents = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 }).select('-extractedText -chunks');
        res.status(200).json({
            success: true,
            data: documents
        });

    }catch(error){
        next (error);
    }
}

//@desc get single  user  document  with chunks
//@route get /api/documents/:id
//@access private

export const getDocument = async (req, res, next)=>{
    try{
        const document = await Document.findOne({_id:req.params.id,userId:req.user._id});

        if(!document){
            return res.status(404).json({
                success:false,
                error:'Document not found',
                statusCode:404
            })
        }

        //get counts of assciated flashcards and quizzes
        const flashcardCount = await Flashcard.countDocuments({documentId:document._id,userId:req.user._id});
        const quizCount = await Quiz.countDocuments({documentId:document._id,userId:req.user._id});

        //update last accessed
        document.lastAccessed = Date.now();
        await document.save();

        //combine documnt data with counts
        const documentData = document.toObject();
        documentData.flashcardCount = flashcardCount;
        documentData.quizCount = quizCount

        res.status(200).json({
            success:true,
            data:documentData
        });

    }catch(error){
        //clean up file on error
       
        next (error);
    }
}

//@desc delete document
//@route delete /api/documents/:id
//@access private

export const deleteDocuments = async (req, res, next)=>{
    try{
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id

        });
        if(!document){
            return res.status(404).json({
                success:false,
                error:'Document not found',
                statusCode:404
            })
        }

        //delete file from filesystem
        await fs.unlink(document.filePath).catch(() => {});

        //delete document
        await document.deleteOne();
        res.status(200).json({
            success:true,
            message:'Document deleted successfully'
        });

    }catch(error){
        //clean up file on error
        
        next (error);
    }
}

//@desc update  document
//@route update /api/documents
//@access private

// export const updateDocuments = async (req, res, next)=>{
//     try{
        
//     }catch(error){
//         //clean up file on error
//         if(req.file){
//             await fs.unlink(req.file.path).catch(()=>{});
//         }
//         next (error);
//     }
// }