const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Process contact form submissions
const processContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate request data
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // For logging purposes
    console.log(`Contact form submission from ${name} (${email}): ${subject}`);

    // Send email notification to admin
    const mailOptions = {
      from: email,
      to: process.env.EMAIL || "izoleclothingcompany@gmail.com",
      subject: `New Contact Form: ${subject || "Contact Form Inquiry"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send auto-reply to customer
    const customerMailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Thank You for Contacting Izole Clothing",
      html: `
        <h2>Thank You for Contacting Us</h2>
        <p>Dear ${name},</p>
        <p>We've received your message and will get back to you as soon as possible.</p>
        <p>For urgent inquiries, please contact us directly at +91 9994600337.</p>
        <br>
        <p>Best regards,</p>
        <p>Izole Clothing Company</p>
      `,
    };

    // Use environment variable to determine if emails should be sent
    // This helps in development/testing environments
    await transporter.sendMail(customerMailOptions);
    
    // Store in database (optional - could be added later)

    // Return success response
    res.status(200).json({
      success: true,
      message: "Your message has been received. We will contact you soon!",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

module.exports = { processContactForm };
