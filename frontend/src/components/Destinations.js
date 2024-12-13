import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Destinations = ({username, userRole}) => {
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSaved, setShowSaved] = useState(false);
    const [savedDestinations, setSavedDestinations] = useState([]);

    useEffect(() => {
        fetchDestinations();
        fetchSavedDestinations();
    }, []);

    const deleteDestination = async (destinationID) => {
        if (window.confirm('Are you sure you want to delete this destination?')) {
          try {
            const response = await fetch(`http://localhost:8081/destination/${destinationID}`, {
              method: 'DELETE',
            });
      
            if (!response.ok) {
              throw new Error('Failed to delete destination');
            }
      
            // Remove the deleted destination from the state
            setDestinations(destinations.filter(dest => dest.id !== destinationID));
            setFilteredDestinations(filteredDestinations.filter(dest => dest.id !== destinationID));
      
            alert('Destination deleted successfully');
          } catch (error) {
            console.error('Error deleting destination:', error);
            alert('Failed to delete destination');
          }
        }
    };
      
    const fetchDestinations = async () => {
        try {
            const response = await fetch('http://localhost:8081/destinations');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDestinations(data);
            setFilteredDestinations(data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    const fetchSavedDestinations = async () => {
        try {
            const response = await fetch(`http://localhost:8081/saved-locations?username=${username}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSavedDestinations(data.data); // mongo returns data: {}
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        filterDestinations(value, showSaved);
    };

    const toggleSavedLocations = () => {
        setShowSaved(!showSaved);
        filterDestinations(searchTerm, !showSaved);
    };

    const filterDestinations = (search, saved) => {
        let filtered = destinations;
        
        // Apply search filter
        if (search) {
            filtered = filtered.filter(destination =>
                destination.location.toLowerCase().includes(search)
            );
        }
        
        // Apply saved filter        
        if (saved) {
            filtered = filtered.filter(destination =>
                savedDestinations.includes(Number(destination.id))
            );
        }
        
        setFilteredDestinations(filtered);
    };

    const unsave = async (destinationID) => {
        try {
            const response = await fetch("http://localhost:8081/save-destination/remove", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username,
                destinationID: destinationID,
              }),
            });
      
            const result = await response.json();
            if (response.ok) {
                console.log(result.message);

                // Update destinations view
                let newSaved = savedDestinations.filter(id => id !== destinationID);
                setSavedDestinations(newSaved);

                const filtered = destinations.filter(destination => 
                    newSaved.includes(Number(destination.id))
                );
                setFilteredDestinations(filtered);
            } else {
              console.error("Failed to unsave destination:", result.message);
            }
          } catch (error) {
            console.error("Error unsave destination:", error);
          }
    }

    return (
        <div className="container">
            <h2>Destinations</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search destinations"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                <button 
                    onClick={toggleSavedLocations}
                    className={`btn ${showSaved ? 'btn-custom-success' : 'btn-custom'} ms-2`}>
                    {showSaved ? 'Show All' : 'Saved Locations'}
                </button>

            </div>
            <div className="row">
                {filteredDestinations.map((destination) => (
                    <div key={destination._id} className="col">
                        <div className="card">
                            <img 
                                src={destination.image} 
                                className="card-img-top" 
                                alt={destination.location} 
                            />
                            <div className="card-body">
                                <h5 className="card-title">{destination.location}</h5>
                                <p className="card-text">{destination.description}</p>
                                <Link to={`/destination?id=${destination.id}`} className="btn btn-primary">
                                    Learn More
                                </Link>
                                {showSaved && (<button onClick={() => unsave(destination.id)} className="btn btn-unsave">
                                    Unsave
                                </button>)}
                                {userRole === 'ADMIN' && (
                                    <>
                                    <Link to={`/destination/update?id=${destination.id}`} className="btn btn-primary bg-success">
                                    Edit
                                    </Link>
                                    <button onClick={() => deleteDestination(destination.id)} className='btn btn-secondary bg-danger'>
                                        Delete
                                    </button>

                                </>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Destinations;
