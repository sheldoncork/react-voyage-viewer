import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const Authentication = ({ username, setUsername, password, setPassword, setUserRole }) => {
    const [error, setError] = useState("");

    const handleLogin = async (e) =>{
        e.preventDefault();
        try {
        const response = await
        fetch("http://localhost:8081/login", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            setError(data.error);
            return;
        }
        
        localStorage.setItem('username', username);
        setUserRole(data.user.role); // Set the user role (admin/user)
        } catch (err) {
            console.log("Failed to log in. Please try again."+err);
            setError("Failed to log in. Please try again. " + err);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Login to Voyage Viewer</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                            <input type="text" className="form-control" value={username}
                            onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password}
                            onChange={(e) => setPassword(e.target.value)} required />
                    </div>
            {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">Login</button>
                </form>
        </div>
    );
}

export default Authentication;
