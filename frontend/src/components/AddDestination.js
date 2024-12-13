import React, { useState } from 'react';

function AddDestination() {
    const [formData, setFormData] = useState({
        location: '',
        type: '',
        description: '',
        image: null,
        individualImages: [],
        individualDescriptions: [],
        activities: [''],
        pros_and_cons: [''],
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMainImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleIndividualImagesChange = (e) => {
        setFormData(prev => ({
            ...prev,
            individualImages: Array.from(e.target.files)
        }));
    };

    const handleIndividualDescriptionChange = (e, index) => {
        const newDescriptions = [...formData.individualDescriptions];
        newDescriptions[index] = e.target.value;
        setFormData(prev => ({
            ...prev,
            individualDescriptions: newDescriptions
        }));
    };

    const handleActivityChange = (index, value) => {
      const newActivities = [...formData.activities];
      newActivities[index] = value;
      setFormData(prev => ({
          ...prev,
          activities: newActivities
      }));
    };

    const handleProConChange = (index, value) => {
      const newProsCons = [...formData.pros_and_cons];
      newProsCons[index] = value;
      setFormData(prev => ({
          ...prev,
          pros_and_cons: newProsCons
      }));
    };

    const handleAddActivity = () => {
      setFormData(prev => ({
          ...prev,
          activities: [...prev.activities, '']
      }));
    };

    const handleAddProCon = () => {
      setFormData(prev => ({
          ...prev,
          pros_and_cons: [...prev.pros_and_cons, '']
      }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('location', formData.location);
        data.append('type', formData.type);
        data.append('description', formData.description);
        data.append('activities', JSON.stringify(formData.activities.filter(activity => activity.trim() !== '')));
        data.append('pros_and_cons', JSON.stringify(formData.pros_and_cons.filter(proCon => proCon.trim() !== '')));
        
        // Append main image
        if (formData.image) {
            data.append('image', formData.image);
        }
    
        // Append individual images
        formData.individualImages.forEach((file) => {
            data.append('individualImages', file);
        });
    
        // Append individual descriptions
        data.append('individualDescriptions', JSON.stringify(formData.individualDescriptions));
    
        try {
            console.log(data);
            const response = await fetch("http://localhost:8081/destination", {
                method: "POST",
                body: data,
            });
            const results = await response.json()
            console.log('Upload successful', results);
            
            if(response.status === 200){
              document.querySelectorAll('input').forEach((element) =>{
                element.input = '';
                element.disabled = true;
              });
              document.querySelectorAll('textarea').forEach((element) =>{
                element.input = '';
                element.disabled = true;
              });
              const submitB = document.querySelector('button');
              submitB.disabled = true;
              submitB.innerText = 'Successfully uploaded!';
              alert("Successful upload!");
            }
        } catch (error) {
            alert(error);
            console.error('Upload failed', error);
        }
    };

    return (
        <div className="container my-5">
          <h2 className="text-center mb-4">Add a New Destination</h2>
          <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter the location"
                required
              />
            </div>
    
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Type
              </label>
              <input
                type="text"
                name="type"
                id="type"
                className="form-control"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="Enter the type (e.g. city)"
                required
              />
            </div>
    
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                className="form-control"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a detailed description"
                required
              />
            </div>
    
            {/* Main Image Upload */}
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Main Image
              </label>
              <input
                type="file"
                name="image"
                id="image"
                className="form-control"
                onChange={handleMainImageChange}
                required
              />
            </div>
    
            {/* Individual Images Upload */}
            <div className="mb-3">
              <label htmlFor="individualImages" className="form-label">
                Individual Images
              </label>
              <input
                type="file"
                multiple
                name="individualImages"
                id="individualImages"
                className="form-control"
                onChange={handleIndividualImagesChange}
              />
            </div>
    
            {/* Individual Descriptions */}
            <div className="mb-3">
              <label className="form-label">Individual Descriptions</label>
              {formData.individualImages.map((file, index) => (
                <textarea
                  key={index}
                  className="form-control mb-2"
                  value={formData.individualDescriptions[index]}
                  onChange={(e) => handleIndividualDescriptionChange(e, index)}
                  placeholder={`Description for ${file.name}`}
                />
              ))}
            </div>

            {/* Activities */}
            <div className="mb-3">
              <label className="form-label">Activities</label>
              {formData.activities.map((activity, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={activity}
                    onChange={(e) => handleActivityChange(index, e.target.value)}
                    placeholder={`Activity ${index + 1}`}
                  />
                  {index === formData.activities.length - 1 && (
                    <button type="button" className="btn btn-outline-secondary" onClick={handleAddActivity}>
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Pros and Cons */}
            <div className="mb-3">
              <label className="form-label">Pros and Cons</label>
              {formData.pros_and_cons.map((proCon, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={proCon}
                    onChange={(e) => handleProConChange(index, e.target.value)}
                    placeholder={`Pro/Con ${index + 1}`}
                  />
                  {index === formData.pros_and_cons.length - 1 && (
                    <button type="button" className="btn btn-outline-secondary" onClick={handleAddProCon}>
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4">
              Upload Destination
            </button>
          </form>
        </div>
      );
    };

export default AddDestination;