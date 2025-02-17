import React from 'react';
import '../styles/Table.css'

const Table = ({ headers, rows, title, className }) => {
  return (
    <div>
      <h2>{title}</h2>
      <table cellPadding="10" className={className}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <div className="tbody-wrapper">
            <tbody>
            {rows.map((row, index) => (
                <tr key={index}>
                {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                ))}
                </tr>
            ))}
            </tbody>
        </div>
      </table>
    </div>
  );
};

export default Table;
