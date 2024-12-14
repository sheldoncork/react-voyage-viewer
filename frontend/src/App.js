import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Destinations from './components/Destinations';
import Authentication from './components/Login';
import AddDestination from './components/AddDestination';
import Destination from './components/Destination';

function App() {
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState(localStorage.getItem('username') || ""); // use localStorage because it's not working without it
  const [password, setPassword] = useState("");

  return (
    <Router>
      {userRole ? (
        <>
        <Navbar userRole={userRole} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/destinations" element={<Destinations username={username} userRole={userRole} />} />
          <Route path="/destination" element={<Destination username={username} />}/>
            {userRole === "ADMIN" && (
                <>
                  <Route path="/destination/add" element={<AddDestination /> }/>
                </>
              )}
        </Routes>
        </>
      ) : (
        <Authentication
        username={username} setUsername={setUsername}
        password={password} setPassword={setPassword}
        setUserRole={setUserRole} />
      )}
    </Router>
  );
}

export default App;
