import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div className="header">
            <div className="header-name">
                <p style={{fontWeight: "bold"}}>Jay Scott Jr.</p>
                <p style={{ fontSize: "20px" }}>Software Engineer</p>
            </div>               
            <div className="header-links">
                <a href="#">Resume</a>
                <a href="#">Projects</a>
                <a href="#">Email</a>
            </div>       
        </div>
    );
};

export default Header;