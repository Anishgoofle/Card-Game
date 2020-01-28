const readline = require('readline');
const _ = require('lodash');


const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


console.log(`
Drunk-Card-Game

Welcome to the Drunk-Card-Game app! 
Version: 1.0.0.

Usage: 
1.Basic card game where in the cards are shuffled and dealt between players (min - 2)
2.Each player is assigned shuffled cards
3.Winner is decided based on the order of achievement of the following:
-All the card are same(have same rank value, 'A' or 'Ace' being the top one)
-Next is the sequence in order(ex 4, 5, 6)
-Next is to check pair (ex two 'K' or two 'Q')
-If all else fails ,the card having the top value wins!
`);

const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
const values = ["A", "K", "Q", "J", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
let deck = [];
let players = [];
let winner = '';
let cards = 0;


r1.question('Enter the number of players: ', numPlayers => {
    r1.question('Enter the number of cards to be distributed to each Player: ', numCards => {
        startGame(numPlayers, Number(numCards));
        if (winner) r1.close(console.log('Thanks for Playing'));
    });
});