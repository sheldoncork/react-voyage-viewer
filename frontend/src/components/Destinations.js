// import React, { useState, useEffect } from 'react';

// function Destinations() {
//     const [destinations, setDestinations] = useState([]);

//     useEffect(() => {
//       fetchDestinations();
//     }, []);
  
//     const fetchDestinations = async () => {
//       try {
//         const response = await fetch('http://localhost:8081/destination');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setDestinations(data);
//       } catch (error) {
//         console.error('Error fetching destinations:', error);
//       }
//     };
  
//     return (
//       <div className="container">
//         <h2>Destinations</h2>
//         <div className="row">
//           {destinations.map((destination) => (
//             <div key={destination._id} className="col">
//               <div className="card">
//                 <img 
//                   src={destination.image} 
//                   className="card-img-top" 
//                   alt={destination.location} 
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{destination.location}</h5>
//                   <p className="card-text">{destination.description}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
// }

// export default Destinations;
import React, { useState, useEffect } from 'react';

function Destinations() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch('http://localhost:8081/destination', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add CORS headers if needed
          'Access-Control-Allow-Origin': '*'
        }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDestinations(data.locations || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  return (
    <div className="container">
      <h2>Destinations</h2>
      <div className="row">
        {destinations.map((destination, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <img 
                src={destination.image} 
                className="card-img-top" 
                alt={destination.location} 
              />
              <div className="card-body">
                <h5 className="card-title">{destination.location}</h5>
                <p className="card-text">{destination.description}</p>
                <div className="individual-images mt-3">
                  {destination.individualImages?.map((img, idx) => (
                    <img 
                      key={idx}
                      src={img}
                      className="img-thumbnail me-2"
                      alt={`${destination.location} ${idx + 1}`}
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Destinations;
