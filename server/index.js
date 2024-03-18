const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');



const app = express();
const port = 3000;

app.use(cors());

// Configure multer to save the incoming file under a specific name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Save files in the "uploads" directory; make sure this directory exists
    },
    filename: (req, file, cb) => {
        // Save the file with a fixed name; in a real app, consider a unique name to avoid overwrites
        cb(null, 'audio_capture02.flac');
    },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('Server is up and running.');
});

app.post('/upload-audio', upload.single('audio'), (req, res) => {
    // Audio file is saved; send a response back to the client
    res.json({ message: 'Audio file saved successfully.' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
