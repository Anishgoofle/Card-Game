const assert = require('assert');
const game = require('../card-game.js');
const expect = require('chai').expect;

const deck = game.createDeck();
const numPlayers = 4;
const numCards = 3;
let globalPlayersArr = [];
let globalReducedArr = [];

describe('createDeck', () => {
    it('creates a deck of cards', () => {
        assert.deepEqual(game.createDeck(), deck);
        expect(deck).to.be.an('array');
        expect(deck).to.have.lengthOf(52);
    });
});


describe('shuffle', () => {
    it('randomly shuffles deck of cards', () => {
        const shuffle = game.shuffle();
        assert.notEqual(shuffle, deck);
        expect(deck).to.have.lengthOf(52);
    });
});


describe('createPlayers', () => {
    it('creates the set of players', () => {
        const players = game.createPlayers(numPlayers);
        globalPlayersArr = players;
        assert.equal(players.length, numPlayers);
    });
});


describe('deal', () => {
    it('deals the shuffled cards between players', () => {
        const players = game.deal(numCards);
        assert.equal(players[0].hand.length, numCards);
        expect(players[0].hand).to.have.lengthOf(numCards);
    });
});


describe('checkIfUniqueArr', () => {
    it('returns true if array is unique', () => {
        const arr = [1, 2, 3, 4, 5];
        const isUnique = game.checkIfUniqueArr(arr);
        expect(isUnique).to.be.a('boolean').and.equal(true);
    });
    it('returns false if array has duplicates', () => {
        const arr = [1, 2, 3, 4, 4];
        const isUnique = game.checkIfUniqueArr(arr);
        expect(isUnique).to.be.a('boolean').and.equal(false);
    });
});


describe('detectWinner', () => {
    it('checks all conditions and prints winner with its victory condition', () => {
        const players = globalPlayersArr;
        let result = players.reduce((res, arr) => {
            res.push({
                name: arr.name,
                hand: arr.hand
            });
            return res;
        }, []);
        globalReducedArr = result;
        game.winner = game.detectWinner(result, numCards);
        expect(game.winner).to.be.an('array');
        expect(game.winner).to.have.lengthOf(2);
    });
});

describe('checkEqual', () => {
    it('returns player if all cards of the player are same', () => {
        const arr = [{
            name: 'Player 1',
            hand: [{ value: 'A', suit: 'Spades', weight: 14 },
            { value: 'A', suit: 'Diamonds', weight: 5 },
            { value: 'A', suit: 'Hearts', weight: 2 }]
        }];
        const player = game.checkEqual(arr, numCards);
        expect(player).to.be.a('string').and.equal('Player 1');
    });
});

describe('checkSequence', () => {
    it('returns player if the cards are in sequence', () => {
        const arr = [{
            name: 'Player 1',
            hand: [{ value: '4', suit: 'Spades', weight: 4 },
            { value: '5', suit: 'Diamonds', weight: 5 },
            { value: '6', suit: 'Hearts', weight: 6 }]
        }];
        const player = game.checkSequence(arr, numCards);
        expect(player).to.be.a('string').and.equal('Player 1');
    });
});

describe('checkPair', () => {
    it('returns player if the cards are in pair', () => {
        const arr = [{
            name: 'Player 1',
            hand: [{ value: 'K', suit: 'Spades', weight: 13 },
            { value: 'K', suit: 'Diamonds', weight: 13 },
            { value: '6', suit: 'Hearts', weight: 6 }]
        }];
        const player = game.checkPair(arr, numCards);
        expect(player).to.be.a('string').and.equal('Player 1');
    });
});

describe('checkTopCard', () => {
    it('returns index of the player having the top card', () => {
        const arr = [{
            name: 'Player 1',
            hand: [{ value: '10', suit: 'Spades', weight: 10 },
            { value: '8', suit: 'Diamonds', weight: 8 },
            { value: '2', suit: 'Hearts', weight: 2 }]
        }, {
            name: 'Player 2',
            hand: [{ value: '7', suit: 'Spades', weight: 7 },
            { value: 'K', suit: 'Diamonds', weight: 13 },
            { value: '9', suit: 'Hearts', weight: 6 }]
        }];
        const index = game.checkTopCard(arr, numCards);
        expect(index).to.be.a('number').and.equal(1);
    });
});

describe('dealTie', () => {
    it('checks the top card tie condition and returns the winner player index based on new card deal value', () => {
        //max key is the weight or the rank of the top card
        //i determines the index of the player having the top card
        //here max = 14 means the two tied players had the top card as 'A'
        const arr = [{ max: 14, i: 1 }, { max: 14, i: 2 }];
        const index = game.dealTie(arr);
        expect(index).to.be.a('number');
    });
});

describe('checkTieWinner', () => {
    context('for same cards tie condition', () => {
        it('returns the player with high rank value card', () => {
            const arr = [{
                name: 'Player 1',
                hand: [{ value: 'A', suit: 'Spades', weight: 14 },
                { value: 'A', suit: 'Diamonds', weight: 14 },
                { value: 'A', suit: 'Hearts', weight: 14 }]
            }, {
                name: 'Player 2',
                hand: [{ value: 'K', suit: 'Spades', weight: 13 },
                { value: 'K', suit: 'Diamonds', weight: 13 },
                { value: 'K', suit: 'Hearts', weight: 13 }]
            }];
            const players = [{ name: 'Player 1', i: 0 }, { name: 'Player 2', i: 1 }];
            const name = game.checkTieWinner(players, 'allEqual', arr);
            expect(name).to.be.a('string').and.equal('Player 1');
        });
    });

    context('for cards in sequence tie condition', () => {
        it('returns the player with high rank value cards in order', () => {
            const arr = [{
                name: 'Player 1',
                hand: [{ value: '8', suit: 'Spades', weight: 8 },
                { value: '9', suit: 'Diamonds', weight: 9 },
                { value: '10', suit: 'Hearts', weight: 10 }]
            }, {
                name: 'Player 2',
                hand: [{ value: '2', suit: 'Spades', weight: 2 },
                { value: '3', suit: 'Diamonds', weight: 3 },
                { value: '4', suit: 'Hearts', weight: 4 }]
            }];
            const players = [{ name: 'Player 1', i: 0 }, { name: 'Player 2', i: 1 }];
            const name = game.checkTieWinner(players, 'sequence', arr);
            expect(name).to.be.a('string').and.equal('Player 1');
        });
    });

    context('for cards in pair tie condition', () => {
        it('returns the player with high rank value paired cards', () => {
            const arr = [{
                name: 'Player 1',
                hand: [{ value: '8', suit: 'Spades', weight: 8 },
                { value: '8', suit: 'Diamonds', weight: 8 },
                { value: 'A', suit: 'Hearts', weight: 14 }]
            }, {
                name: 'Player 2',
                hand: [{ value: '10', suit: 'Spades', weight: 10 },
                { value: '10', suit: 'Diamonds', weight: 10 },
                { value: '2', suit: 'Hearts', weight: 2 }]
            }];
            const players = [{ name: 'Player 1', i: 0 }, { name: 'Player 2', i: 1 }];
            const name = game.checkTieWinner(players, 'pair', arr);
            expect(name).to.be.a('string').and.equal('Player 2');
        });
    });
});
