
import React from 'react';

interface InfoCardProps {
  title: string;
  content: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, content }) => {
  return (
    <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-teal-300 mb-2">{title}</h3>
      <p className="text-white">{content}</p>
    </div>
  );
};

export default InfoCard;