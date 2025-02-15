import React, { useState } from 'react';


import '../styles/Simulator.css';




const data = [
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
    { tailNumber: "N246QS", status: "Parked", type: "CL-650S", nextEvent: "2 / 3 / 2025 11:15:00"},
]

const recc =[
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
    {tailNumber: "N246QS", status: "Parked", nextEvent: "2 / 3 / 2025 ", details: "extra extra extra"},
]

const SimulatorComponent = () => {
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);

    };


    return (
        <div>
            
            <div id="simulator-grid">
                <div id="head-dashboard">
                    <div id="header1">
                        <div className='header-segment-large'>
                            <div id="title-wrapper">
                                <button id="back-button">
                                    <img src="/back-arrow.png" alt="Back Button"></img>
                                </button>
                                
                                <div id="airport-title">KTEB</div>
                                <div id="sim-title">Flight Simulator</div>
                            </div>

                            <div id="fbo-title">Atlantic Aviation</div>
                        </div>
                    </div>

                    <div className='header-segment-small'>
                        <div>KTEB Capacity</div>
                        <div>25/35</div>
                        <div>FBO Capacity</div>
                        <div>10/12</div>
                    </div>
                    <div className='header-segment-small'>
                        <div className='legend-row'>
                            <div className='legend-square red-color'></div>
                            <div>Maintenance</div>
                        </div>
                        <div className='legend-row'>
                            <div className='legend-square yellow-color'></div>
                            <div>Departing</div>
                        </div>
                        <div className='legend-row'>
                            <div className='legend-square green-color'></div>
                            <div>Parked</div>
                        </div>
                        
                        
                    </div>
                    <div className='header-segment-small'>
                        <label for="dropdown">Tail Number</label>
                        <select id="dropdown" name="dropdown">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                        </select>

                        <label for="dropdown">FBO</label>
                        <select id="dropdown" name="dropdown">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                        </select>
                    </div>
                    <div className='header-segment-small'>
                        <label for="datetime">Arrival Time</label>
                        <input type="datetime-local" id="time" name="time"></input>

                        <label for="local-datetime">Local Time</label>
                        <input type="text" id="local-datetime" readonly></input>
                    </div>
                    <div className='header-segment-large'>
                        <div id="plane-info-wrapper">
                            <div className="plane-info-section">
                                <div className="plane-section-title">Spots Required</div>
                                <div className="plane-section-status">1</div>
                            </div>
                            <div className="plane-info-section">
                                <div className="plane-section-title">Type Name</div>
                                <div className="plane-section-status">CL-650S</div>
                            </div>
                            <div className="plane-info-section">
                                <div className="plane-section-title">Cabin Size</div>
                                <div className="plane-section-status">Large</div>
                            </div>
                            <div className="plane-info-section">
                                <div className="plane-section-title">Current Location</div>
                                <div className="plane-section-status">KEGE</div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div id="main-wrapper">
                    <div id="planes-table">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Tail Number</th>
                                    <th>Status</th>
                                    <th>Type</th>
                                    <th>Next Event</th>
                                </tr>
                            </thead>
                            <div className="table-body-wrapper">
                                <tbody>
                                        {data.map((val,key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="status-wrapper">
                                                        <div className="status-box"></div>
                                                    </td>
                                                    <td>{val.tailNumber}</td>
                                                    <td>{val.status}</td>
                                                    <td>{val.type}</td>
                                                    <td>{val.nextEvent}</td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </div>
                        </table>
                            
                     
                    </div>
                    <div id="alerts-center">
                        <div id="alerts-title">ALERTS</div>
                        <div>Move Reccomendations</div>
                        <div id="rec-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tail Number</th>
                                        <th>Status</th>
                                        <th>Next Event</th>
                                      
                                      
                                    </tr>
                                </thead>
                                <tbody>
                                    {recc.map((val,key) => (
                                        <React.Fragment>
                                            <tr className="expandable-row">
                                                <td className="alert-wrapper">
                                                    <div className="alert-box"></div>
                                                    <span>{val.tailNumber}</span>
                                                </td>
                                         
                                                <td>{val.status}</td>
                                                <td className='alert-wrapper'>
                                                    <span>{val.nextEvent}</span>
                                                    <div onClick={() => toggleRow(key)} className={expandedRow === key ? 'up-arrow' : 'down-arrow'}></div>
                                                </td>
                                              
                                            </tr>
                                            {expandedRow === key && (
                                                <tr className="expanded-content active">
                                                    <td colSpan="5">{val.details}</td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                    </div>
                </div>
            </div>
          
            
            
            
        </div>
    );

};

export default SimulatorComponent; 