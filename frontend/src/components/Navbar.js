import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({userRole}) => {

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">Voyage Viewer</NavLink>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/destinations">Destinations</NavLink>
            </li>
            {userRole === "ADMIN" && (
              <>
                <li className='nav-item'>
                  <NavLink className="nav-link" to="/destination/add">Add Destination</NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
