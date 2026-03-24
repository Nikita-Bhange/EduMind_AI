
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS  } from "../utils/apiPaths";

const getDocuments=  async()=>{
  try{
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS)

    return response.data;
  }catch(error){
    throw error.response?.data || {message: 'failed to fetch documents'}
  }
}



const uploadDocuments=  async(formData)=>{
  try{
    const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD_DOCUMENT, formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })

    return response.data;
  }catch(error){
    throw error.response?.data || {message: 'failed to upload document'}
  }
}


const deleteDocuments=  async(id)=>{
  try{
    const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id))

    return response.data;
  }catch(error){
    throw error.response?.data || {message: 'failed to delete documents'}
  }
}


const getDocumentById=  async(id)=>{
  try{
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id))

    return response.data;
  }catch(error){
    throw error.response?.data || {message: 'failed to fetch document'}
  }
}


const documentService ={
    getDocuments,
    uploadDocuments,
    deleteDocuments,
    getDocumentById
}

export default documentService;

// export const uploadDocument = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please upload a PDF file',
//         statusCode: 400
//       });
//     }

//     const { title } = req.body;

//     if (!title) {
//       // Delete uploaded file if no title provided
//       await fs.unlink(req.file.path);
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide a document title',
//         statusCode: 400
//       });
//     }

//     // Construct the URL for the uploaded file
//     const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
//     const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

//   } catch (error) {
//     // Clean up file on error
//     if (req.file) {
//       await fs.unlink(req.file.path).catch(() => {});
//     }
//     next(error);
//   }
// };