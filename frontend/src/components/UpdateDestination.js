import React from 'react';

const UpdateDestination = async ({}) => {

    const response = await
        fetch("http://localhost:8081/updateDestination", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({}),
        });

    return (
        <>
            <h1>Update Destinations!</h1>
        </>
    );
}

export default UpdateDestination;