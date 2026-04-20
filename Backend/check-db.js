import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const Document = mongoose.model('Document', new mongoose.Schema({
      title: String,
      fileName: String,
      filePath: String,
      status: String,
      extractedText: String,
      createdAt: Date,
    }, { strict: false }));
    
    const docs = await Document.find().sort({ createdAt: -1 }).limit(3);
    console.log("Latest 3 documents:");
    docs.forEach((d, i) => {
      console.log(`\n--- Doc ${i + 1} ---`);
      console.log("ID:", d._id);
      console.log("Title:", d.title);
      console.log("Status:", d.status);
      console.log("File Path:", d.filePath);
      console.log("Has Extracted Text:", d.extractedText ? `Yes (length: ${d.extractedText.length})` : "No");
    });
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
