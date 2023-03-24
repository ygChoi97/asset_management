import React from "react";
import { Link, useLocation } from "react-router-dom";
import './menu.css';
export default function Menu() {
    const location = useLocation();
    return (
        <nav className="menu">
            <ul className="menu-list">
                <li className="menu-item">
                    <Link
                        to="/"
                        className={`menu-link${location.pathname === '/' ? ' menu-link--active' : ''}`}
                    >
                        Home
                    </Link>
                </li>
                <li className="menu-item">
                    <Link
                        to="/about"
                        className={`menu-link${location.pathname === '/about' ? ' menu-link--active' : ''}`}
                    >
                        About
                    </Link>
                </li>
                <li className="menu-item">
                    <Link
                        to="/contact"
                        className={`menu-link${location.pathname === '/contact' ? ' menu-link--active' : ''}`}
                    >
                        Contact
                    </Link>
                </li>
            </ul>
        </nav>
    );
}