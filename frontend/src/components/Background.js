import React from 'react';
import './Background.css'; // Ensure the path is correct

const Background = ({ children }) => {
    return (
        <div className="glass-effect">
            {children}
        </div>
    );
};

export default Background;
