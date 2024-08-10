const { OpenAI } = require("@langchain/openai");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { PromptTemplate } = require("@langchain/core/prompts");
const StructuredOutputParser = require("langchain/output_parsers");
const fs = require('fs').promises;

const extractInvoiceDetails = async (filePath) => {
  try {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    
    const llm = new OpenAI({ temperature: 0 });

    // Combine content from all pages
    const fullContent = docs.map(doc => doc.pageContent).join('\n');

    // Define the output parser
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      customerDetails: "Details of the customer",
      products: "List of products in the invoice",
      totalAmount: "The total amount of the invoice"
    });

    const formatInstructions = parser.getFormatInstructions();

    const template = `
    Extract the following information from the invoice:
    1. Customer details
    2. Products
    3. Total Amount

    Invoice content:
    {invoiceContent}

    {format_instructions}
    `;

    const prompt = PromptTemplate.fromTemplate(template);
    const chain = prompt.pipe(llm).pipe(parser);
    const result = chain.invoke({
        invoiceContent: fullContent,
        format_instructions: formatInstructions
    })

    

    // Delete the file after processing
    await fs.unlink(filePath);

    return result;
  } catch (error) {
    console.error('Error in extractInvoiceDetails:', error);
    throw error;
  }
};

module.exports = { extractInvoiceDetails };