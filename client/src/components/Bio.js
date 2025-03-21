import React from 'react';
import './Bio.css';

const Bio = () => {
    return (
        <div className="bio">
            <img src="/images/profile.png" alt="profile" />
            <div class="bio-text">
                <h1>Hi, I'm Jay! 👋</h1>
                
                <p>I'm a senior at Michigan State University, working towards a Bachelor of Science in Computer Science with a minor in Computational Mathematics, Science, and Engineering. Currently, I'm contributing as a Software Engineer at the MSU-DOE Plant research lab, where I'm engaged in impactful projects. I'm passionate about exploring future opportunities in software engineering and eager to apply my skills and knowledge to make meaningful contributions in the field.</p>                           
            </div>
        </div>
    );
};

export default Bio;