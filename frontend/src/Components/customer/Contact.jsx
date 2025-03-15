import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram } from "react-icons/fa";

const Contact = () => {
  return (
    <div id="contact" className="py-28 flex justify-center items-center">
      <div className="card bg-neutral  w-full max-w-lg shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-10">Contact Us</h1>
        <div className="space-y-4 text-lg">
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-primary" />
            <span>60/A, Sournapuri Layout, Kombai Thottam, Tirupur-4.</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-primary" />
            <span>+91 9994600337, 0421 4254969</span>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-primary" />
            <span>izoleclothingcompany@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <FaInstagram className="text-primary" />
            <span>@izole_clothing_company</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
