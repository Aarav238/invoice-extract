const { OpenAI } = require("@langchain/openai");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { PromptTemplate } = require("@langchain/core/prompts");
const fs = require('fs').promises;

const extractInvoiceDetails = async (filePath) => {
  try {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    
    const llm = new OpenAI({ temperature: 0 });

    // Combine content from all pages
    const fullContent = docs.map(doc => doc.pageContent).join('\n');



    const template = `
    Extract the following information from the invoice:
    1. Customer details
    2. Products
    3. Total Amount

   
    Invoice content:
    {invoiceContent}

     There may be more than one invoice in a invoice content in that case make an array and store invoices in form object
     Provide the extracted information in JSON format.
     The json object should contain these keys only:
     customer_details: details of the customer 
     products: all the products
     total_amount: total amount in the invoice
    `;

    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["invoiceContent"],
      });
    
      const chainedPrompt = await prompt.format({
        invoiceContent: fullContent,
      });
    
      const result = await llm.call(chainedPrompt);
      console.log(result)

      await fs.unlink(filePath);

      return JSON.parse(result);

    

    // Delete the file after processing


    return result;
  } catch (error) {
    console.error('Error in extractInvoiceDetails:', error);
    throw error;
  }
};

module.exports = { extractInvoiceDetails };