const assert = require('assert');
const game = require('../card-game.js');

const deck = game.createDeck();
describe('createDeck', () => {
    it('creates a deck of cards', () => {
        assert.deepEqual(game.createDeck(), deck);
    });
});


describe('shuffle', () => {
    it('randomly shuffles deck of cards', () => {
        const shuffle = game.shuffle(deck);
        const shuffleCopy = [...deck];
        assert.notEqual(shuffle, shuffleCopy);
    });
});

describe('createPlayers', () => {
    it('creates the set of players', () => {
        const numPlayers = 4;
        const players = game.createPlayers(numPlayers);
        assert.equal(players.length, numPlayers);
    });
});

describe('deal', () => {
    it('deals the shuffled cards between players', () => {
        const numCards = 3;
        const players = game.deal(numCards);
        assert.equal(players[0].hand.length, numCards);
    });
});

// describe('check', () => {
//     it('', () => {

//     });
// });