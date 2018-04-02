const express = require('express');
const commentRouter = express.Router();
const parser = require('body-parser').json();

const Comment = require('../models/comment.model');
const { mustBeUser } = require('./mustBeUser');

commentRouter.use(parser);
commentRouter.use(mustBeUser);

commentRouter.post('/', (req, res) => {
    const { idStory, content } = req.body;
    Comment.createComment(req.idUser, idStory, content)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.delete('/:id', (req, res) => {
    Comment.removeComment(req.idUser, req.params.id)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.put('/:id', (req, res) => {
    Comment.updateComment(req.idUser, req.params.id, req.body.content)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.post('/like/:idStory', (req, res) => {
});

commentRouter.post('/dislike/:idStory', (req, res) => {
});

module.exports = { commentRouter };
