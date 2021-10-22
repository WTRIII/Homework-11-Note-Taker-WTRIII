const { readFromFile, readAndAppend, readAndDelete } = require('./helpers/fsUtils');
const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid');
// const database = require('./db/db.json');
// add delete function to const

// need the other thing for heroku
const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for index
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for parsing notes
app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// POST Route for a new note
app.post('/api/notes', (req, res) => {

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});
// DELETE route for notes
// Received coding assistance from Ethan Cho, Damien Luzzo, and Mitchell Robbins
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readAndDelete(noteId);
  res.json(`Note deleted successfully.`)
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
