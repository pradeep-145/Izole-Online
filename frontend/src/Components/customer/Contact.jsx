import React, { useState } from "react";
import { Phone, MapPin, Mail, Instagram, Clock, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });

    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div id="contact" className="text-mustard bg-wineRed py-24">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold font-serif mb-4">Contact Us</h2>
          <div className="w-24 h-1 bg-mustard mx-auto mb-8"></div>
          <p className="text-xl max-w-3xl mx-auto">
            We'd love to hear from you. Reach out with any questions, feedback, or inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-wineRed rounded-xl shadow-lg p-8 h-full">
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: "Our Location", details: "60/A, Sournapuri Layout, Kombai Thottam, Tirupur-4, Tamil Nadu, India" },
                  { icon: Phone, title: "Phone Number", details: "+91 9994600337\n0421 4254969" },
                  { icon: Mail, title: "Email Address", details: "izoleclothingcompany@gmail.com" },
                  { icon: Instagram, title: "Social Media", details: "@izole_clothing_company" },
                  { icon: Clock, title: "Business Hours", details: "Monday - Saturday: 9AM - 6PM\nSunday: Closed" }
                ].map(({ icon: Icon, title, details }, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="bg-mustard p-3 rounded-full flex-shrink-0">
                      <Icon className="h-6 w-6 text-wineRed" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{title}</h4>
                      <p className="whitespace-pre-line">{details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-wineRed rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-mustard">Your Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="input input-bordered w-full bg-wineRed border border-mustard placeholder:text-mustard focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-mustard">Email Address</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="input input-bordered w-full bg-wineRed border border-mustard placeholder:text-mustard focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium text-mustard">Subject</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="input input-bordered w-full bg-wineRed border border-mustard placeholder:text-mustard focus:outline-none"
                    required
                  />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium text-mustard">Message</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    className="textarea textarea-bordered w-full h-32 bg-wineRed border border-mustard placeholder:text-mustard focus:outline-none"
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn bg-mustard text-wineRed hover:bg-mustard/90 btn-lg gap-2 rounded-lg">
                  Send Message <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 justify-center flex">
          <div className=" rounded-xl p-4">
            <div className=" w-80 h-80 rounded-lg bg-mustard shadow-2xl flex items-center justify-center">
              <div className="text-center p-8 text-wineRed">
                <MapPin className="h-6 w-6 mx-auto mb-4 text-wineRed" />
                <h4 className="text-2xl font-bold mb-2">Visit Our Store</h4>
                <p className="text-lg max-w-md mx-auto text-wineRed">
                  Come visit our store at Sournapuri Layout, Tirupur. We're conveniently located near Kombai Thottam with ample parking space.
                </p>
                <div className="mt-6">
                  <a 
                    href="https://maps.google.com/?q=60/A,+Sournapuri+Layout,+Kombai+Thottam,+Tirupur-4,+Tamil+Nadu,+India" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn bg-wineRed text-mustard hover:bg-wineRed/90"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
