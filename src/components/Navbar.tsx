import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <a href="#inicio" className="logo">
                    <span className="logo-text">COOTRANSURES</span>
                </a>

                <ul className="nav-links">
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#quienes-somos">Quiénes Somos</a></li>
                    <li><a href="#servicios">Servicios</a></li>
                    <li><Link to="/informes">Informes</Link></li>
                    <li><a href="#contactanos" className="btn-contact">Contáctanos</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
