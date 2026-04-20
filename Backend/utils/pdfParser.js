import fs from "fs/promises"
import { PDFParse } from "pdf-parse"

/*
extract text form pdf file, param(string) filepath - path to pdf file
return{promises<{text:string, numpages:number}}
*/

export const extractTextFromPDF = async(filePath)=>{
    let parser;
    try{
        const dataBuffer = await fs.readFile(filePath);
        parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();

         return {
            text:data.text,
            numPages:data.numPages,
            info:data.info,
         }
    }

    catch(error){
        console.error("PDF parsing error:",error)
        throw new Error("failed to extract text from PDF");
    } finally {
        if (parser) {
            await parser.destroy().catch(() => {});
        }
    }
}
