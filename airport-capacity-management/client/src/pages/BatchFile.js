import React, { useState } from 'react';
import Papa from "papaparse";
import axios from 'axios';

function BatchFile() {
  const [file, setFile] = useState(null);
  const [airportFile, setAirportFile] = useState(null);

  const handleFileUpload = (event) => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);}};

  const handleAirportFileUpload = (event) => {
    if (event.target.files[0]) {
      setAirportFile(event.target.files[0]);}};

  const handleParse = async () => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        try {
            const response = await axios.post('http://localhost:5001/batch/insertBatchData', results.data);
  
            if (response.status === 200) {
              console.log('Data successfully inserted!');
            }
          } catch (error) {
            console.error('Error sending data to the backend:', error);
          }
      },
    });};

    const handleAirportParse = async () => {
      Papa.parse(airportFile, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          try {
              const response = await axios.post('http://localhost:5001/batch/insertAirportData', results.data);
    
              if (response.status === 200) {
                console.log('Data successfully inserted!');
              }
            } catch (error) {
              console.error('Error sending data to the backend:', error);
            }
        },
      });};

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
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleAirportFileUpload} 
      />
      <div>
            <button onClick={handleAirportParse}>
                Parse
            </button>
        </div>
    </div>
  );}

export default BatchFile;
