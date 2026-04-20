import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        
    },
   
    title:{
        type:String,
        trim:true,
        required:[true,'please provide a document title'],
    },
    fileName:{
        type:String,
        required:true
    },
    filePath:{
        type:String,
        required:true
    },
    fileSize:{
        type:Number,
        required:true
    },
    aiFileUri:{
        type:String,
        default:''
    },
    aiFileMimeType:{
        type:String,
        default:''
    },
    aiFileName:{
        type:String,
        default:''
    },
    extractedText:{
        type:String,
        default:''
    },
    chunks:[{
      content  :{
            type:String,
            required:true
        },
      
        pageNumber:{
            type:String,
            default:0
        },
          chunkIndex:{
            type:Number,
            required:true
        }
    }],
    uploadDate:{
        type:Date,
        default:Date.now
    },
    lastAccessed:{
        type:Date,
        default:Date.now
    },
        status:{
            type:String,
            enum:['processing','ready','failed'],
            default:'processing'
        }
    },{
    timestamps:true
})


//Index for faster queries
documentSchema.index({userId:1, uploadDate:-1});
documentSchema.index({userId:1, lastAccessed:-1});

const Document = mongoose.model('Document', documentSchema);

export default Document;
