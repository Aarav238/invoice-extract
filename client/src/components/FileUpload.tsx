import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface FileUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onExtractComplete: (data: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onExtractComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('invoice', file);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await axios.post<any>('http://localhost:5000/api/invoice/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onExtractComplete(response.data);
    } catch (error) {
      console.error('Error extracting invoice details:', error);
      alert('Error extracting invoice details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} accept=".pdf" />
      <button type="submit" disabled={loading}>
        {loading ? 'Extracting...' : 'Extract Invoice Details'}
      </button>
    </form>
  );
};

export default FileUpload;