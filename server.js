const { rejects } = require('assert');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { send } = require('process');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.get('/notes', (req, res) => {
   res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            req.status(400)
            return;
        } 
        res.send(data);
    })
})

app.post('/api/notes', (req, res) => {
    const note = JSON.stringify(req.body)

    fs.writeFileSync('./db/db.json', note, err => {
        if (err) {
            res.status(400)
            return;
        } else {
            res.json({message: "success"});
        }
    })
});


app.use((req, res) => {
    res.status(400).end();
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});