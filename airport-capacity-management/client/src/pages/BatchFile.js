import React, { useState } from 'react';
import Papa from "papaparse";
import axios from 'axios';

function BatchFile() {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleParse = async () => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        console.log(results.data)
        try {
            const response = await axios.post('http://localhost:5000/batch/insertBatchData', results.data);
  
            if (response.status === 200) {
              console.log('Data successfully inserted!');
            }
          } catch (error) {
            console.error('Error sending data to the backend:', error);
          }
      },
    });
  };


  return (
    <div>
      <h1>Batch File Component</h1>
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileUpload} 
      />
      <div>
            <button onClick={handleParse}>
                Parse
            </button>
        </div>
    </div>
  );
}

export default BatchFile;
