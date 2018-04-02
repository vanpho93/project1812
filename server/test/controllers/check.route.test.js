const assert = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');

const app = require('../../src/app');
const User = require('../../src/models/user.model');

describe('Test POST /user/check', () => {
    let token;
    beforeEach('Sign up a user for test', async () => {
        await User.signUp('pho100@gmail.com', '123', 'Pho', '012398219434');
        const user = await User.signIn('pho100@gmail.com', '123');
        token = user.token;
    });

    it('Can verify token by POST /user/check', async () => {
        const response = await request(app).post('/user/check').set({ token });
        assert.equal(response.body.success, true);
        assert.equal(response.status, 200);
        assert.equal(response.body.user.name, 'Pho');
    });

    it('Cannot verify wrong token', async () => {
        const response = await request(app).post('/user/check').set({ token: 'a.b.c' });
        assert.equal(response.body.success, false);
        assert.equal(response.status, 400);
    });
});
