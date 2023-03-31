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
                        조회
                    </Link>
                </li>
                <li className="menu-item">
                    <Link
                        to="/provision"
                        className={`menu-link${location.pathname === '/provision' ? ' menu-link--active' : ''}`}
                    >
                        지급
                    </Link>
                </li>
                <li className="menu-item">
                    <Link
                        to="/return"
                        className={`menu-link${location.pathname === '/return' ? ' menu-link--active' : ''}`}
                    >
                        반납
                    </Link>
                </li>
            </ul>
        </nav>
    );
}