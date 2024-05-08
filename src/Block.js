import React, { useState, useEffect } from 'react';
import axios from 'axios';

// const dotenv = require('dotenv').config();

const Block = () => {
  const [block, setBlock] = useState([]);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/numbers"); // Update with your server URL
        setBlock(response.data.numbers);
      } catch (error) {
        console.error('Error fetching numbers:', error);
      }
    };

    fetchNumbers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white p-2 m-2">Block Details</h2>
      <div className="overflow-x-auto whitespace-nowrap p-2 m-2">
        {block.map((block, index) => (
          <div key={index} className="inline-block bg-[#3a1c61] border border-[#1bd8f4] items-center mr-4 p-8">
            <div>
              <p className="font-bold text-white">Value:</p>
              <p className="text-[#1bd8f4]">{block.value}</p>
              <p className="font-bold mt-2 text-white">Timestamp:</p>
              <p className="text-[#1bd8f4]">{new Date(block.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Block;
