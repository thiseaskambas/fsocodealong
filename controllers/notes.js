const Note = require('../models/note');
const User = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  response.json(notes);
});

router.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

router.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

router.post('/', async (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    });
  }
  const user = await User.findById(body.userId);
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();
  response.status(201).json(savedNote);
});

router.put('/:id', (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true }
  )
    .then(updatedNote => {
      response.json(updatedNote);
    })
    .catch(error => next(error));
});

module.exports = router;
