import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    <span className="logo-text">COOTRANSURES</span>
                </Link>

                <ul className="nav-links">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/#quienes-somos">Quiénes Somos</Link></li>
                    <li><Link to="/#servicios">Servicios</Link></li>
                    <li><Link to="/informes">Informes</Link></li>
                    <li><a href="#contactanos" className="btn-contact">Contáctanos</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
