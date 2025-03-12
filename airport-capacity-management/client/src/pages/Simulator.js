import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Simulator.css';

import SimulatorHeader from '../components/SimulatorHeader';
import SimulatorAllPlanes from '../components/SimulatorAllPlanes';
import SimulatorAlerts from '../components/SimulatorAlerts';

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

    // 
    // FOR TESTING WITHOUT USING THE DB
    // 
    // const [allPlanes, setAllPlanes] = useState([
    //     {
    //         acid: "N12345",
    //         status: "Arriving",
    //         plane_type: "Gulfstream G650",
    //         event: new Date().toISOString(),
    //     },
    //     {
    //         acid: "N67890",
    //         status: "Departing",
    //         plane_type: "Cessna Citation X",
    //         event: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    //     },
    //     {
    //         acid: "N54321",
    //         status: "Parked",
    //         plane_type: "Embraer Phenom 300",
    //         event: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
    //     },
    //     {
    //         acid: "N98765",
    //         status: "Maintenance",
    //         plane_type: "Bombardier Global 6000",
    //         event: new Date(Date.now() + 10800000).toISOString(), // 3 hours later
    //     },
    //     {
    //         acid: "N12345",
    //         status: "Arriving",
    //         plane_type: "Gulfstream G650",
    //         event: new Date().toISOString(),
    //     },
    //     {
    //         acid: "N67890",
    //         status: "Departing",
    //         plane_type: "Cessna Citation X",
    //         event: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    //     },
    //     {
    //         acid: "N54321",
    //         status: "Parked",
    //         plane_type: "Embraer Phenom 300",
    //         event: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
    //     },
    //     {
    //         acid: "N98765",
    //         status: "Maintenance",
    //         plane_type: "Bombardier Global 6000",
    //         event: new Date(Date.now() + 10800000).toISOString(), // 3 hours later
    //     },
    //     {
    //         acid: "N12345",
    //         status: "Arriving",
    //         plane_type: "Gulfstream G650",
    //         event: new Date().toISOString(),
    //     },
    //     {
    //         acid: "N67890",
    //         status: "Departing",
    //         plane_type: "Cessna Citation X",
    //         event: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    //     },
    //     {
    //         acid: "N54321",
    //         status: "Parked",
    //         plane_type: "Embraer Phenom 300",
    //         event: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
    //     },
    //     {
    //         acid: "N98765",
    //         status: "Maintenance",
    //         plane_type: "Bombardier Global 6000",
    //         event: new Date(Date.now() + 10800000).toISOString(), // 3 hours later
    //     },
    //     {
    //         acid: "N67890",
    //         status: "Departing",
    //         plane_type: "Cessna Citation X",
    //         event: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    //     },
    //     {
    //         acid: "N54321",
    //         status: "Parked",
    //         plane_type: "Embraer Phenom 300",
    //         event: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
    //     },
    //     {
    //         acid: "N98765",
    //         status: "Maintenance",
    //         plane_type: "Bombardier Global 6000",
    //         event: new Date(Date.now() + 10800000).toISOString(), // 3 hours later
    //     },
    //     {
    //         acid: "N67890",
    //         status: "Departing",
    //         plane_type: "Cessna Citation X",
    //         event: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    //     },
    //     {
    //         acid: "N54321",
    //         status: "Parked",
    //         plane_type: "Embraer Phenom 300",
    //         event: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
    //     },
    //     {
    //         acid: "N98765",
    //         status: "Maintenance",
    //         plane_type: "Bombardier Global 6000",
    //         event: new Date(Date.now() + 10800000).toISOString(), // 3 hours later
    //     },
    //     {
    //         acid: "N67890",
    //         status: "Departing",
    //         plane_type: "Cessna Citation X",
    //         event: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    //     },
    //     {
    //         acid: "N54321",
    //         status: "Parked",
    //         plane_type: "Embraer Phenom 300",
    //         event: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
    //     },
    //     {
    //         acid: "N98765",
    //         status: "Maintenance",
    //         plane_type: "Bombardier Global 6000",
    //         event: new Date(Date.now() + 10800000).toISOString(), // 3 hours later
    //     },
    //     {
    //         acid: "N67890",
    //         status: "Departing",
    //         plane_type: "Cessna Citation X",
    //         event: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    //     },
    //     {
    //         acid: "N54321",
    //         status: "Parked",
    //         plane_type: "Embraer Phenom 300",
    //         event: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
    //     },
    //     {
    //         acid: "N98765",
    //         status: "Maintenance",
    //         plane_type: "Bombardier Global 6000",
    //         event: new Date(Date.now() + 10800000).toISOString(), // 3 hours later
    //     },{
    //         acid: "N67890",
    //         status: "Departing",
    //         plane_type: "Cessna Citation X",
    //         event: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    //     },
    //     {
    //         acid: "N54321",
    //         status: "Parked",
    //         plane_type: "Embraer Phenom 300",
    //         event: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
    //     },
    //     {
    //         acid: "N98765",
    //         status: "Maintenance",
    //         plane_type: "Bombardier Global 6000",
    //         event: new Date(Date.now() + 10800000).toISOString(), // 3 hours later
    //     }
        
    // ]);

    // const [recs, setRecs] = useState([
    //     {
    //         tailNumber: "N12345",
    //         status: "Arriving",
    //         nextEvent: "02/24/2025 14:30",
    //         recString: "Move to Gate B3 upon arrival."
    //     },
    //     {
    //         tailNumber: "N67890",
    //         status: "Departing",
    //         nextEvent: "02/24/2025 16:00",
    //         recString: "Prepare for refueling before departure."
    //     },
    //     {
    //         tailNumber: "N54321",
    //         status: "Parked",
    //         nextEvent: "02/25/2025 08:00",
    //         recString: "Relocate to Hangar 5 for maintenance."
    //     },
    //     {
    //         tailNumber: "N09876",
    //         status: "Maintenance",
    //         nextEvent: "02/25/2025 10:45",
    //         recString: "Scheduled engine check at 10:45 AM."
    //     },
    //     {
    //         tailNumber: "N12345",
    //         status: "Arriving",
    //         nextEvent: "02/24/2025 14:30",
    //         recString: "Move to Gate B3 upon arrival."
    //     },
    //     {
    //         tailNumber: "N67890",
    //         status: "Departing",
    //         nextEvent: "02/24/2025 16:00",
    //         recString: "Prepare for refueling before departure."
    //     },
    //     {
    //         tailNumber: "N54321",
    //         status: "Parked",
    //         nextEvent: "02/25/2025 08:00",
    //         recString: "Relocate to Hangar 5 for maintenance."
    //     },
    //     {
    //         tailNumber: "N09876",
    //         status: "Maintenance",
    //         nextEvent: "02/25/2025 10:45",
    //         recString: "Scheduled engine check at 10:45 AM."
    //     },
    //     {
    //         tailNumber: "N12345",
    //         status: "Arriving",
    //         nextEvent: "02/24/2025 14:30",
    //         recString: "Move to Gate B3 upon arrival."
    //     },
    //     {
    //         tailNumber: "N67890",
    //         status: "Departing",
    //         nextEvent: "02/24/2025 16:00",
    //         recString: "Prepare for refueling before departure."
    //     },
    //     {
    //         tailNumber: "N54321",
    //         status: "Parked",
    //         nextEvent: "02/25/2025 08:00",
    //         recString: "Relocate to Hangar 5 for maintenance."
    //     },
    //     {
    //         tailNumber: "N09876",
    //         status: "Maintenance",
    //         nextEvent: "02/25/2025 10:45",
    //         recString: "Scheduled engine check at 10:45 AM."
    //     },
    //     {
    //         tailNumber: "N12345",
    //         status: "Arriving",
    //         nextEvent: "02/24/2025 14:30",
    //         recString: "Move to Gate B3 upon arrival."
    //     },
    //     {
    //         tailNumber: "N67890",
    //         status: "Departing",
    //         nextEvent: "02/24/2025 16:00",
    //         recString: "Prepare for refueling before departure."
    //     },
    //     {
    //         tailNumber: "N54321",
    //         status: "Parked",
    //         nextEvent: "02/25/2025 08:00",
    //         recString: "Relocate to Hangar 5 for maintenance."
    //     },
    //     {
    //         tailNumber: "N09876",
    //         status: "Maintenance",
    //         nextEvent: "02/25/2025 10:45",
    //         recString: "Scheduled engine check at 10:45 AM."
    //     }
    // ]);
    

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
                {/* Top Segment of Dashboard */}
                <SimulatorHeader
                    selectedAirport={selectedAirport}
                    selectedFBO={selectedFBO}
                    takenSpace={takenSpace}
                    totalSpace={totalSpace}
                    searchTerm={searchTerm}
                    handleTailNumberChange={handleTailNumberChange}
                    handleFBOChange={handleFBOChange}
                    filteredFleetData={filteredFleetData}
                    fboData={fboData}
                    localTime={localTime}
                    selectedSpots={selectedSpots}
                    selectedPlaneType={selectedPlaneType}
                    selectedPlaneSize={selectedPlaneSize}
                    selectedPlaneLocation={selectedPlaneLocation}
                />

                <div id="main-wrapper">
                    <SimulatorAllPlanes
                        allPlanes={allPlanes}
                    />

                    <SimulatorAlerts
                        recs={recs}
                        toggleRow={toggleRow}
                        expandedRow={expandedRow}
                    />
                </div>
            </div>
        </div>
    );
};

export default SimulatorComponent;