const express = require('express');
const friendRouter = express.Router();
const parser = require('body-parser').json();
const { mustBeUser } = require('./mustBeUser');

const User = require('../models/user.model');

friendRouter.use(mustBeUser);
friendRouter.use(parser);

friendRouter.post('/request', (req, res) => {
    const { idReceiver } = req.body;
    User.sendFriendRequest(req.idUser, idReceiver)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

friendRouter.post('/accept', (req, res) => {
    const { idSender } = req.body;
    User.acceptFriendRequest(req.idUser, idSender)
    .then(friend => res.send({ success: true, friend }))
    .catch(error =>  res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

friendRouter.delete('/:friendId', (req, res) => {
    User.removeFriend(req.idUser, req.params.friendId)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

module.exports = { friendRouter };
