import React, { useEffect } from 'react'
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast"
import DocumentCard from '../../components/documents/DocumentCard';
import documentService from "../../services/documentService"
import Spinner from "../../components/common/Spinner"

const DocumentListPage = () => {
        const [documents, setDocuments] = useState([]);
        const [loading, setLoading] = useState(true);

        //state for upload modal
        const [isUploadMoalOpen, setIsUploadModalOpen] = useState(false);
        const [uploadFile, setUploadFile] = useState(null);
        const [uploadTitle, setUploadTitle] = useState("");
        const [uploading, setUploading] = useState(false);

        //state for delete confirmation model
        const [isDeleteModalOpen,] = useState(false);
        const [deleting, setDeleteing] = useState(false);
        const [seletectedDoc, setSeletectedDoc] = useState(null);

        const fetchDocuments = async()=> {
        try {
          const data = await documentService.getDocuments()
          setDocuments(data)
        } catch (error) {
          toast.error("failed to fetch document")
        } finally {
          setLoading(false)
        }
      }

      useEffect(() => {
        fetchDocuments();
      }, [])

      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setUploadFile(file);
          setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      };

      const handleUpload = async (e) => {
        e.preventDefault();

        if (!uploadFile || !uploadTitle) {
          toast.error("Please provide a title and select a file.");
          return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("title", uploadTitle);

        try {
          await documentService.uploadDocument(formData);
          toast.success("Document uploaded successfully!");

          setIsUploadModalOpen(false);
          setUploadFile(null);
          setUploadTitle("");
          setLoading(true);

          fetchDocuments();
        } catch (error) {
          toast.error("Upload failed. Please try again.");
        } finally {
          setUploading(false);
        }
      };

      const handleConfirmDelete = async () => {
        if (!selectedDoc) return;

        setDeleting(true);
        try {
          await documentService.deleteDocument(selectedDoc._id);
          toast.success(`${selectedDoc.title} deleted.`);

          setIsDeleteModalOpen(false);
          setSelectedDoc(null);

          setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
        } catch (error) {
          toast.error(error.message || "Failed to delete document.");
        } finally {
          setDeleting(false);
        }
      };

      const renderContent = () => {
        if(loading){
          return(
                          <div className="flex items-center justify-center min-h-100">
              <Spinner/>
            </div>
          )
        }
        if(documents.length === 0 ){
          return(
              <div className="flex items-center justify-center min-h-100">
                <div className="text-center max-w-md">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-100 mb-4">
                    <FileText className='w-10 h-10 text-slate-400'strokeWidth={1.5}/>
                  </div>
                  <h3 className='text-xl font-medium text-slate-900 tracking-tight mb-2' >No Document Yet</h3>
                  <p className='text-sm text-slate-500 mb-6'>Get started by uploading your first PDF document to begin  learning </p>
                  <button onClick={()=>setIsUploadModalOpen(true)} className='inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600  hover:to-teal-600   hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-200 active:scale-[0.98]'>
                      <Plus className='w-4 h-4 'strokeWidth={2.5}/>
                      Upload Button
                  </button>
                </div>
              </div>
          )
        }

        return(
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid:cols-4 gap-5">
            {
              documents?.map((doc)=>(
                <DocumentCard
                key={doc._id}
                document={doc}
                onDelete={handleDeleteRequest}
                />
              ))
            }
          </div>
        )
      }
      return (
        <>
        <div className="min-h-screen">
          {/* subtle bg pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent-1px)] bg-size-[16px_16px] opacity-30 pointer-events-none"/>

            <div className="relative max-w-7xl mx-auto">
              {/* header */}
              <div className="flex items-center justify-between mb-10">
                <div >
                  <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'> My Document</h1>
                  <p className='text-slate-500 text-sm'>Manage and organize your learning materials</p>
                </div>
                {
                  documents.length >0 && (
                  <  Button onClick={()=> setIsUploadModalOpen(true)}>
                    <Plus  className='' strokeWidth={2.5}/>
                    </Button>
                  )
                }
              </div>
              {renderContent()}
            </div>
          </div>
     
        </>
      );

  }
  
  
export default DocumentListPage