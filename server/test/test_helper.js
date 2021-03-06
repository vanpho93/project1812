const User = require('../src/models/user.model');
const Comment = require('../src/models/comment.model');
const Story = require('../src/models/story.model');
require('../src/startDatabase');

beforeEach('Remove all data before each test', async () => {
    await User.remove();
    await Story.remove();
    await Comment.remove();
});
