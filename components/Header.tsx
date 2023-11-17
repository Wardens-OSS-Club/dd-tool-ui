import React from 'react';
import Image from 'next/image';
import headerImage from '../public/warden-oss-club-logo.png';

const Header: React.FC = () => {
  const headerStyle = {
    backgroundColor: 'white',  // Dark background for a sleek look
    color: 'black',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'  // subtle shadow for depth
  };

  const projectNameStyle = {
    display: 'flex',
    fontWeight: 'bold',
    fontSize: '1.5em',
    color: 'linear-gradient(to right, #bdc3c7, #2c3e50)',
    alignItems: 'center'
  };

  const pocBuilderStyle = {
    fontSize: '1.2em'
  };

  const headerImageStyle = {
    height: '50px', 
    marginRight: '10px'
  };

  return (
    <header style={headerStyle}>
      <div style={projectNameStyle}>
        <Image 
          src={headerImage} 
          alt="Header Logo" 
          height={100} // Adjust as necessary
          width={100} // Adjust based on the aspect ratio of your image
        />
        <span>Warden OSS Club</span>
      </div>
      <div style={pocBuilderStyle}>Proof Of Concept Builder</div>
    </header>
  );
};

export default Header;
