const express = require('express');
const User = require('./models/user.model');
// const parser = require('body-parser').urlencoded({ extended: false });
const parser = require('body-parser').json();
const { storyRouter } = require('./controllers/story.route');
const { userRouter } = require('./controllers/user.route');
const { friendRouter } = require('./controllers/friend.route');
const { commentRouter } = require('./controllers/comment.route');

const app = express();

app.use('/user', userRouter);
app.use('/story', storyRouter);
app.use('/friend', friendRouter);
app.use('/comment', commentRouter);

module.exports = app;
