const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message.' });
  }

  try {
    // 1. Save to MongoDB
    const newMessage = new Message({
      name,
      email,
      message,
    });
    await newMessage.save();

    // 2. Send Email using Nodemailer (Optional / Best Effort)
    // We wrap it in try/catch so if email fails, we still return success for DB save
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail', // or any other service
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: email,
          to: process.env.EMAIL_USER,
          subject: `Portfolio Contact from ${name}`,
          text: `You have a new message from your portfolio site.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email notification sent for contact message.');
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    res.status(201).json({ success: true, message: 'Message received successfully!' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;
