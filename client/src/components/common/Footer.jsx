import React from "react";
import logo from '../../assets/NouraLogo.png';

export default function Footer() {
  return (
    <footer className="bg-[#2D1C65] text-white py-8 text-center">
      <p className="text-lg mb-4">Ready to transform your study routine?</p>
      <div className="flex justify-center items-center gap-2 mb-6">
        <img
          src={logo}
          alt="Logo"
          className="w-6 h-6"
        />
        <span className="text-lg font-medium">is here to help</span>
      </div>
      <p className="text-sm text-gray-300">
        noura@gmail.com &nbsp; | &nbsp; +91 9354488259 &nbsp; | &nbsp; © 2025 copyright
      </p>
    </footer>
  );
}
