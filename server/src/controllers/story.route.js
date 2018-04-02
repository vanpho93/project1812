const express = require('express');
const storyRouter = express.Router();
const parser = require('body-parser').json();

const Story = require('../models/story.model');
const { mustBeUser } = require('./mustBeUser');

storyRouter.use(parser);
storyRouter.use(mustBeUser);

storyRouter.post('/', (req, res) => {
    Story.createStory(req.idUser, req.body.content)
    .then(story => res.send({ success: true, story }))
    .catch(error => {
        res.send({ success: false, code: error.code, message: error.message });
    });
});

storyRouter.delete('/:id', (req, res) => {
    Story.removeStory(req.idUser, req.params.id)
    .then(story => res.send({ success: true, story }))
    .catch(error => {
        res.status(error.statusCode)
        .send({ success: false, code: error.code, message: error.message });
    });
});

storyRouter.put('/:id', (req, res) => {
    Story.updateStory(req.idUser, req.params.id, req.body.content)
    .then(story => res.send({ success: true, story }))
    .catch(error => {
        res.status(error.statusCode)
        .send({ success: false, code: error.code, message: error.message });
    });
});

storyRouter.post('/like/:idStory', (req, res) => {
    Story.likeStory(req.idUser, req.params.idStory)
    .then(story => res.send({ success: true, story }))
    .catch(error => {
        res.status(error.statusCode)
        .send({ success: false, code: error.code, message: error.message });
    });
});


storyRouter.post('/dislike/:idStory', (req, res) => {
    Story.dislikeStory(req.idUser, req.params.idStory)
    .then(story => res.send({ success: true, story }))
    .catch(error => {
        res.status(error.statusCode)
        .send({ success: false, code: error.code, message: error.message });
    });
});

module.exports = { storyRouter };
