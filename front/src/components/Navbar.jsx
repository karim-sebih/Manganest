import React from "react";
import { Link } from "react-router";

export default function Navbar() {
    return(
        <nav className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4">
                <Link to="/" className="text-xl font-bold">Manganest</Link>
            </div>
        </nav>
    );
}