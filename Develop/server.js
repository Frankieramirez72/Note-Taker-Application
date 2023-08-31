const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
//declaring port 
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('Develop/public'));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;

        const notes = JSON.parse(data);
        newNote.id = Date.now().toString();
        notes.push(newNote);

        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;

        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
            ]        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.json({message: "Note deleted"});
        });
    });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);