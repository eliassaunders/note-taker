const addRequestId = require('express-request-id')();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { send } = require('process');
const { rejects } = require('assert');

const PORT = process.env.PORT || 3001;
const app = express();



app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'))
app.use(addRequestId);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err) {
            req.status(400)
            return;
        }
        res.send(data);
    })
})

app.post('/api/notes', (req, res) => {

    const newNote = {
        ...req.body,
        id: uuidv4()
    }

    let info = [];

    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(400)
            console.log(err);
            return;
        }
        console.log(data);
        info = JSON.parse(data);
        info.push(newNote);
        const stringed = JSON.stringify(info);
        fs.writeFile('db/db.json', stringed, err => {
            if (err) {
                res.status(400)
                return;
            } else {
                res.json({ message: "success" });
            }
        })
    })



});


app.use((req, res) => {
    res.status(400).end();
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});