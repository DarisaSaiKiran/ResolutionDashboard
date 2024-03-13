import React from 'react';
import { Navbar } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


function UserDashboard() {
    const handleClick = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <Navbar className="navbar navbar-light navbar-custom navbar-with-line">
            <div className="container-fluid">
                <label className="navbar-brand">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ikea_logo.svg/2560px-Ikea_logo.svg.png"
                        alt=""
                        width="120"
                        height="50"
                        className="d-inline-block align-text-top"
                    />
                </label>
                <label className="display-10  fw-bold text-dark text-center mx-auto text-uppercase">
            Incidents-IKEA Production{" "}
          </label>
                
            </div>
        </Navbar>
    );
}

export default UserDashboard;
