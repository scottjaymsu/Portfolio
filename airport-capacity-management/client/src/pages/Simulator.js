import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Simulator.css';

const SimulatorComponent = () => {
    const { airportCode } = useParams();
    const [expandedRow, setExpandedRow] = useState(null);
    const [fboData, setFboData] = useState([]);
    const [fleetData, setFleetData] = useState([]);
    const [selectedPlaneType, setSelectedPlaneType] = useState('');
    const [selectedPlaneLocation, setSelectedPlaneLocation] = useState('');
    const [selectedPlaneSize, setSelectedPlaneSize] = useState('');
    const [selectedSpots, setSelecteedSpots] = useState(''); 
    const [searchTerm, setSearchTerm] = useState('');


    // Data for all flight plans this airport 
    const [allPlanes, setAllPlanes] = useState([]);

//  SPACES CHANGING THAT NEED TO CHANGE WITH NEW DATA?
    const [totalSpace, setTotalSpace] = useState(0);
    const [takenSpace, setTakenSpace] = useState(0);
    const [selectedFBO, setSelectedFBO] = useState(null);
    const [selectedAirport, setSelectedAirport] = useState(null);
    const [localTime, setLocalTime] = useState(new Date().toLocaleString());

    const [recs, setRecs] = useState([]);

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    useEffect(() => {
        const getAirportFBOs = async () => {
            try {
                console.log(`Fetching data for location: ${airportCode}`);
                const response = await axios.get(`http://localhost:5001/simulator/getAirportFBOs/${airportCode}`);
                setFboData(response.data);
                const totalSpace = response.data.reduce((sum, fbo) => sum + (fbo.Total_Space || 0), 0);
                setTotalSpace(totalSpace);
                const takenSpace = response.data.reduce((sum, fbo) => sum + (fbo.Parking_Space_Taken || 0), 0);
                setTakenSpace(takenSpace);
                if (response.data.length > 0) {
                    setSelectedFBO(response.data[0]);
                    setSelectedAirport(response.data[0].Airport_Code);
                }
            } catch (error) {
                console.error('Error fetching airport FBOs AHHHHHH:', error);
            }
        };

        // Get ALL NetJets tail numbers, current location, cabin size, spots required 
        const getNetjetsFleet = async () => {
            try {
                const response = await axios.get('http://localhost:5001/simulator/getNetjetsFleet');
                setFleetData(response.data);
            } catch (error) {
                console.error('Error fetching NetJets fleet:', error);
            }
        };

        const getAllPlanes = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/simulator/getAllPlanes/${airportCode}`);
                setAllPlanes(response.data);
            } catch (error) {
                console.error('Error fetching all planes:', error);
            }
        };

        // Get reccomendations to populate from rec engine
        const getRecommendations = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/simulator/getRecommendations/${airportCode}`);
                setRecs(response.data);
                console.log('Recommendations:', response.data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        getNetjetsFleet();
        getAirportFBOs();
        getAllPlanes();
        getRecommendations();

    }, [airportCode]);

    // For updating local time 
    // Currently just our time but can change individual airport times 
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const formattedDate = now.toLocaleString('en-GB', {
                timeZone: 'GMT',
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }) + ' GMT';
            setLocalTime(formattedDate);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // When FBO is selected from dropdown
    // Changes var to selected one that changes other divs on page 
    const handleFBOChange = (event) => {
        const selectedFBOName = event.target.value;
        const selectedFBO = fboData.find(fbo => fbo.FBO_Name === selectedFBOName);
        setSelectedFBO(selectedFBO);
    };

    // When a plane from NetJets fleet is selected from dropdown
    const handleTailNumberChange = (event) => {
        const selectedTailNumber = event.target.value;
        setSearchTerm(selectedTailNumber);
        const selectedPlane = fleetData.find(plane => plane.acid === selectedTailNumber);
        setSelectedPlaneType(selectedPlane && selectedPlane.plane_type ? selectedPlane.plane_type: 'Unavailable');
        setSelectedPlaneLocation(selectedPlane && selectedPlane.current_location ? selectedPlane.current_location: 'N/A');
        setSelectedPlaneSize(selectedPlane && selectedPlane.size ? selectedPlane.size: 'Unavailable');
        setSelecteedSpots(selectedPlane && selectedPlane.numberSpots ? selectedPlane.numberSpots: '1'); 
        setSearchTerm(event.target.value); // For autofilling dropdown
    };

    // Filtered fleet data for dropdown 
    const filteredFleetData = fleetData.filter(plane =>
        plane.acid.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    return (
        <div>
            <div id="simulator-grid">
                <div id="head-dashboard">
                    <div id="header1">
                        <div className='header-segment-large'>
                            <div id="title-wrapper">
                                <button id="back-button-sim">
                                    <img src="/back-arrow.png" alt="Back Button"></img>
                                </button>
                                <div id="airport-title">{selectedAirport}</div>
                                <div id="sim-title">Flight Simulator</div>
                            </div>
                            <div id='fbo-title-sim'>{selectedFBO ? selectedFBO.FBO_Name : 'Select an FBO'}</div>
                        </div>
                    </div>
                    <div className='header-segment-small'>
                        <div >{selectedAirport} Capacity</div>
                        <div>{takenSpace}/{totalSpace}</div>
                        <div>FBO Capacity</div>
                        {selectedFBO && (
                            <div>{selectedFBO.Parking_Space_Taken}/{selectedFBO.Total_Space}</div>
                        )}
                    </div>
                    <div className='header-segment-small'>
                        <div className='legend-row'>
                            <div className='legend-square blue-color'></div>
                            <div>Arriving</div>
                        </div>
                        <div className='legend-row'>
                            <div className='legend-square yellow-color'></div>
                            <div>Departing</div>
                        </div>
                        <div className='legend-row'>
                            <div className='legend-square green-color'></div>
                            <div>Parked</div>
                        </div>
                        <div className='legend-row'>
                            <div className='legend-square red-color'></div>
                            <div>Maintenance</div>
                        </div>
                    </div>
                    <div className='header-segment-small'>
                        <input 
                            type="text" 
                            id="dropdown" 
                            name="dropdown" 
                            value={searchTerm} 
                            onChange={handleTailNumberChange} 
                            placeholder="Search Tail Number"
                            list="tailNumbers"
                        />
                        <datalist id="tailNumbers">
                            {filteredFleetData.map((data, index) => (
                                <option key={index} value={data.acid}>{data.acid}</option>
                            ))}
                        </datalist>
    

{/*                         
                        <select id="dropdown" name="dropdown" onChange={handleTailNumberChange}>
                        
                            {fleetData.map((data, index) => (
                                <option key={index}>{data.acid}</option>
                            ))}
                          
                        </select> */}
                        <label htmlFor="dropdown">FBO</label>
                        <select id="dropdown" name="dropdown" onChange={handleFBOChange} value={selectedFBO ? selectedFBO.FBO_Name : ''}>
                            {fboData.map((data, index) => (
                                <option key={index}>{data.FBO_Name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='header-segment-small'>
                        <label htmlFor="datetime">Arrival Time</label>
                        <input type="datetime-local" id="time" name="time"></input>
                        <label htmlFor="local-datetime">Local Time</label>
                        <input type="text" id="local-datetime" readOnly value={localTime}></input>
                    </div>
                    <div className='header-segment-large'>
                        <div id="plane-info-wrapper">
                            <div className="plane-info-section">
                                <div className="plane-section-title">Spots Required</div>
                                <div className="plane-section-status">{selectedSpots}</div>
                            </div>
                            <div className="plane-info-section">
                                <div className="plane-section-title">Type Name</div>
                                <div className="plane-section-status">{selectedPlaneType}</div>
                            </div>
                            <div className="plane-info-section">
                                <div className="plane-section-title">Cabin Size</div>
                                <div className="plane-section-status">{selectedPlaneSize}</div>
                            </div>
                            <div className="plane-info-section">
                                <div className="plane-section-title">Current Location</div>
                                <div className="plane-section-status">{selectedPlaneLocation}</div>
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
                            <tbody>
                                {allPlanes.map((val, key) => (
                                    <tr key={key}>
                                        <td className="status-wrapper">
                                            <div className={`status-box ${val.status === 'Arriving' ? 'blue-color' : val.status === 'Departing' ? 'yellow-color' : val.status === 'Parked' ? 'green-color' : 'red-color'}`}></div>
                                        </td>
                                        
                                        <td>{val.acid}</td> {/* Tail # */}
                                        <td>{val.status}</td> {/* Status  */}
                                        <td>{val.plane_type ? val.plane_type: 'Unavailable'}</td> {/*plane type */}
                                        <td>
                                        {new Date(val.event).toLocaleDateString('en-us', {day: 'numeric', month: 'numeric', year: 'numeric'})} {new Date(val.event).toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit', hour12: false})}
                                        </td> {/* next event */}
                                    </tr>
                                ))}
                                

                                
                            </tbody>
                        </table>
                    </div>
                    <div id="alerts-center">
                        <div id="alerts-title">ALERTS</div>
                        <div>Move Recommendations</div>
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
                                    {recs.map((val, key) => (
                                        <React.Fragment key={key}>
                                            <tr className="expandable-row">
                                                <td className="alert-wrapper">
                                                    <div className="alert-box green-color"></div>
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
                                                    <td colSpan="5">{val.recString}</td>
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