import React from 'react';
import '../App.css'

function Home() {
  const handleRandomCity = () => {
    // Implement random city selection logic here
    console.log('Random city button clicked');
  };

  return (
    <div className="bg-image">
      <div className="bg-overlay">
        <div className="bg-text text-center">
          <h1 className="display-3">Welcome to Voyage Viewer!</h1>
          <p className="text-wrap">Here you can find where you want to go for your next vacation.</p>
          <button className="button" onClick={handleRandomCity}>
            Choose a city for me!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
