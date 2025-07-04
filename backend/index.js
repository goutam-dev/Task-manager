require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connect } = require('http2');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')
const reportRoutes = require('./routes/reportRoutes')
const fs = require('fs');

const app= express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ['GET',"POST","PUT","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json())

connectDB();

app.use('/api/auth', authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/tasks',taskRoutes)
app.use('/api/reports',reportRoutes)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{console.log("Server started ");
})