const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const dotenv = require('dotenv').config();

const connectDB = async () => {
    await mongoose.connect(process.env.REACT_APP_MONGODB_URI);
    console.log(`DB is connected with ${mongoose.connection.host}`);
}

connectDB();

const NumberSchema = new mongoose.Schema({
    value: Number,
    timestamp: { type: Date, default: Date.now }
});

const NumberModel = mongoose.model('Number', NumberSchema);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.REACT_APP_FRONTEND_URL);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


async function fetchAndUpdateNumber() {
    try {
        const response = await axios.get(process.env.REACT_APP_MEMPOOL_API_URL);
        const number = response.data;
        const lastSavedNumber = await NumberModel.findOne().sort({ _id: -1 });
        if (!lastSavedNumber || number !== lastSavedNumber.value) {
            await pushNumber(number);
            console.log(`Number ${number} saved to the database.`);
        } else {
            console.log('Number is already up to date in the database.');
        }
    } catch (error) {
        console.error('Error fetching and updating number:', error);
    }
}

async function pushNumber(num) {
    try {
        const newNumber = new NumberModel({ value: num });
        await newNumber.save();
    } catch (err) {
        console.error('Error saving number to the database', err);
    }
}

// Fetch and update number initially
fetchAndUpdateNumber();

setInterval(fetchAndUpdateNumber, 60000); 

app.get('/numbers', async (req, res) => {
    try {
        const numbers = await NumberModel.find({}, 'value timestamp');
        res.status(200).json({ numbers });
    } catch (err) {
        console.error('Error fetching numbers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
