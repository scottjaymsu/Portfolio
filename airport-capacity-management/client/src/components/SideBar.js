import React from 'react';
import './component.css';
import { getStatusColor } from '../utils/helpers';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sidebar = ({
  searchTerm,
  setSearchTerm,
  locations,
  onLocationClick,
  resetMap,
  visible,
  toggleVisibility,
}) => {
  return (
    <div id="side-bar" className={visible ? 'visible' : ''}>
      <div id="search-container">
        <button id="collapse-button" onClick={toggleVisibility}>
        {visible ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
        </button>
        <input
          id="map-search"
          type="text"
          placeholder="Search for an airport..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul id="location-list" className={visible ? 'visible' : ''}>
        {locations.map((loc) => (
          <li className="list-ele" key={loc.title} onClick={() => onLocationClick(loc)}>
            {loc.title}
            <div
              className="status-icon"
              style={{ backgroundColor: getStatusColor(loc.status) }}
            >
              {loc.total_planes}/{loc.capacity}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
