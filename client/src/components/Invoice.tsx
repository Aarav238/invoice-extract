import React from 'react';

interface CustomerDetails {
  name: string;
  address: string;
  email?: string;
  phone?: string;
}

interface Product {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface InvoiceData {
  customer_details: CustomerDetails;
  products: Product[];
  total_amount: number;
}

interface InvoiceDetailsProps {
  details: InvoiceData | null;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ details }) => {

  if (!details) return( <h1>Nothing</h1>);
  console.log(details);
  return (
    <div>
      <h2>Extracted Invoice Details</h2>
      <h3>Customer Details</h3>
      <pre>{JSON.stringify(details.customer_details, null, 2)}</pre>
      <h3>Products</h3>
      <pre>{JSON.stringify(details.products, null, 2)}</pre>
      <h3>Total Amount</h3>
      <p>{details.total_amount}</p>
    </div>
  );
};

export default InvoiceDetails;