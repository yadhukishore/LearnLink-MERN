import React from 'react';

interface ProofViewerProps {
  url: string;
  alt: string;
}

const ProofViewer: React.FC<ProofViewerProps> = ({ url, alt }) => {
  const isPDF = url.toLowerCase().endsWith('.pdf');

  if (isPDF) {
    return (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          View PDF
        </a>
      </div>
    );
  }

  return <img src={url} alt={alt} className="w-full h-48 object-cover rounded cursor-pointer" />;
};

export default ProofViewer;