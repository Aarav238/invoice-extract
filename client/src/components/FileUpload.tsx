import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface FileUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onExtractComplete: (data: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onExtractComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
      const response = await axios.post<any>('https://invoice-extract.onrender.com/api/invoice/extract', formData, {
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
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {file ? (
              <>
                <svg className="w-10 h-10 mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">File selected:</p>
                <p className="text-sm font-semibold text-gray-900">{file.name}</p>
              </>
            ) : (
              <>
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PDF (MAX. 800x400px)</p>
              </>
            )}
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading || !file}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Extracting...' : 'Extract Invoice Details'}
      </button>
    </form>
  );
};

export default FileUpload;