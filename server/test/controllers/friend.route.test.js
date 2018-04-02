const assert = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');

const app = require('../../src/app');
const User = require('../../src/models/user.model');

describe('POST /friend/request', () => {
    let idUser1, idUser2, token1, token2;
    beforeEach('Create users for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'ti', '321');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
    });

    it ('Can create friend request by POST', async () => {
        const response = await request(app).post('/friend/request')
        .send({ idReceiver: idUser2 })
        .set({ token: token1 });
        assert.equal(response.body.success, true);
        assert.equal(response.body.user.name, 'ti');
        const sender = await User.findById(idUser1).populate('sentRequests');
        assert.equal(sender.sentRequests.length, 1);
        assert.equal(sender.sentRequests[0].name, 'ti');
    });

    it ('Cannot create friend request without token', async () => {
        const response = await request(app).post('/friend/request')
        .send({ idReceiver: idUser2 })
        assert.equal(response.body.success, false);
        assert.equal(response.status, 400);
    });

    it ('Cannot send friend request with wrong friendId', async () => {
        const response = await request(app).post('/friend/request')
        .send({ idReceiver: idUser2 + 'x' })
        .set({ token: token1 });
        assert.equal(response.body.success, false);
        assert.equal(response.status, 404);
    });
});

describe('POST /friend/accept', () => {
    let idUser1, idUser2, token1, token2;
    beforeEach('Create users and send friend request for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'ti', '321');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        await User.sendFriendRequest(idUser1, idUser2);
    });

    it('Can accept friend request', async () => {
        const response = await request(app)
        .post('/friend/accept')
        .send({ idSender: idUser1 })
        .set({ token: token2 });
        const sender = await User.findById(idUser1).populate('friends').populate('sentRequests');
        const receiver = await User.findById(idUser2).populate('friends').populate('incommingRequests');
        assert.equal(sender.friends.length, 1);
        assert.equal(receiver.friends.length, 1);
        assert.equal(sender.friends[0].name, 'ti');
        assert.equal(receiver.friends[0].name, 'teo');
    });

    it('Cannot accept friend with user out of incommingRequests', async () => {
        const response = await request(app)
        .post('/friend/accept')
        .send({ idSender: idUser2 })
        .set({ token: token1 });
        const sender = await User.findById(idUser1).populate('friends').populate('sentRequests');
        const receiver = await User.findById(idUser2).populate('friends').populate('incommingRequests');
        assert.equal(sender.friends.length, 0);
        assert.equal(receiver.friends.length, 0);
        assert.equal(sender.sentRequests[0].name, 'ti');
        assert.equal(receiver.incommingRequests[0].name, 'teo');
        assert.equal(response.status, 404);
    });
});

describe('DELETE /friend/:id', () => {
    let idUser1, idUser2, token1, token2;
    beforeEach('Create users and send friend request for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'ti', '321');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        await User.sendFriendRequest(idUser1, idUser2);
        await User.acceptFriendRequest(idUser2, idUser1);
    });

    it('Can remove friend by DELETE', async () => {
        const response = await request(app).delete(`/friend/${idUser2}`).set({ token: token1 });
        assert.equal(response.status, 200);
        const sender = await User.findById(idUser1).populate('friends');
        const receiver = await User.findById(idUser2).populate('friends');
        assert.equal(sender.friends.length, 0);
        assert.equal(receiver.friends.length, 0);
    });

    it('Cannot remove friend without token', async () => {
        const response = await request(app).delete(`/friend/${idUser2}`);
        assert.equal(response.status, 400);
        const sender = await User.findById(idUser1).populate('friends');
        const receiver = await User.findById(idUser2).populate('friends');
        assert.equal(sender.friends.length, 1);
        assert.equal(receiver.friends.length, 1);
    });

    it('Cannot remove friend with wrong friendId', async () => {
        const response = await request(app).delete(`/friend/${idUser2}x`).set({ token: token1 });
        assert.equal(response.status, 404);
        const sender = await User.findById(idUser1).populate('friends');
        const receiver = await User.findById(idUser2).populate('friends');
        assert.equal(sender.friends.length, 1);
        assert.equal(receiver.friends.length, 1);
    });
});

