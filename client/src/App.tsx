import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import InvoiceDetails from './components/Invoice';


function App() {
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  return (
    <div className="App">
      <h1>Invoice Detail Extractor</h1>
      <FileUpload onExtractComplete={setInvoiceDetails} />
      <InvoiceDetails details={invoiceDetails} />
    </div>
  );
}

export default App;