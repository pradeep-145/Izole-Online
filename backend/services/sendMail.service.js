const nodemailer= require("nodemailer");
const sendMail = async (email, subject, text, bulk) => {
    try {
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        });
    
        const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text,
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
    }

module.exports={
    
}