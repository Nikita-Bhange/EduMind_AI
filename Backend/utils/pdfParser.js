import fs from "fs/promises"
import { PDFParse } from "pdf-parse"

/*
extract text form pdf file, param(string) filepath - path to pdf file
return{promises<{text:string, numpages:number}}
*/

export const extractTextFromPDF = async(filePath)=>{
    try{
        const dataBuffer = await fs.readFile(filePath);
        //pdf-parse exprects a Unit8Array, not a Buffer
         const parse = new PDFParse(new Unit8Array(dataBuffer));
         const data = await parse.getText();

         return {
            text:data.text,
            numPages:data.numPages,
            info:data.info,
         }
    }

    catch(error){
        console.error("PDF parsing error:",error)
        throw new Error("failed to extract text from PDF");
    }
}