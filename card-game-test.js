const assert = require('assert');
const game = require('./card-game.js');

it('creates a array of cards', () => {
    assert.equal(game.createDeck, '[]');
});