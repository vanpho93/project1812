const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Story = require('../../src/models/story.model');
const Comment = require('../../src/models/comment.model');

describe('Test POST /comment', () => {
    let idUser1, idUser2, idStory1, idStory2, token1, token2;
    beforeEach('Create story for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'ti', '321');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        const story1 = await Story.createStory(idUser1, 'abcd');
        const story2 = await Story.createStory(idUser2, 'dcab');
        idStory1 = story1._id;
        idStory2 = story2._id;
    });

    it('Can create comment by POST', async () => {
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ idStory: idStory1, content: 'Hello Ti.' });
        const { success, comment } = response.body;
        const { author, content, story, _id } = comment;
        assert.equal(success, true);
        assert.equal(author, idUser2);
        assert.equal(story, idStory1);
        const storyDb = await Story.findById(idStory1);
        assert.equal(storyDb.comments[0], _id);
    });

    it('Can create comment without token', async () => {
        const response = await request(app)
        .post('/comment')
        .send({ idStory: idStory1, content: 'Hello Ti.' });
        const { success, message } = response.body;
        assert.equal(success, false);
        assert.equal(message, 'Invalid token.');
    });

    it('Cannot create comment for invalid story', async () => {
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ idStory: idStory1 + 'x', content: 'Hello Ti.' });
        const { success, code } = response.body;
        assert.equal(success, false);
        assert.equal(code, 'INVALID_ID');
    });

    it('Cannot create comment for removed story', async () => {
        await Story.findByIdAndRemove(idStory2);
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ idStory: idStory2, content: 'Hello Ti.' });
        const { success, code } = response.body;
        assert.equal(success, false);
        assert.equal(code, 'CANNOT_FIND_STORY');
        const commentCount = await Comment.count({});
        assert.equal(commentCount, 0);
    });
});


describe('Test POST /comment', () => {
    let idUser1, idUser2, idStory1, idStory2, token1, token2;

    beforeEach('Create story for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'ti', '321');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        const story1 = await Story.createStory(idUser1, 'abcd');
        const story2 = await Story.createStory(idUser2, 'dcab');
        idStory1 = story1._id;
        idStory2 = story2._id;
        await Comment.createComment(idUser1, idStory1, 'xyz');
    });
    
    it('Can delete comment by DELETE /:id', async () => {

    });

    it('Cannot delete comment with invalid ID', async () => {

    });

    it('Cannot remove comment without token', async () => {

    });
});
