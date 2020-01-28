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



/*
 Global vars
  -suits - contains the types for cards
  -values - contains all the values of cards from 'A','K','Q'... and so on
  -deck - array containing the number of cards
  -players - array containing the number of players
  -winner - variable for storing the winning player
  -cards - variable for storing the user input for number of cards
*/
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


/*
 Function for starting game
 -The first process consists of creating deck
 -The cards are randomly shuffled
 -Players are created
 -The shuffled cards are dealt between the players
 -The check function is called to determine the winner
  Input variables:-
    -numPlayers - user input for number of players
    -numCards - user input for number of cards to be distributed to each player
*/

function startGame(numPlayers, numCards) {
    cards = numCards;
    createDeck();
    shuffle();
    createPlayers(numPlayers);
    deal(cards);
    check();
}


//Function for creating deck
function createDeck() {
    deck = [];
    for (let i = 0; i < values.length; i++) {
        for (let x = 0; x < suits.length; x++) {
            let weight = parseInt(values[i]);
            if (values[i] == "A")
                weight = 14;
            if (values[i] == "K")
                weight = 13;
            if (values[i] == "Q")
                weight = 12;
            if (values[i] == "J")
                weight = 11;
            let card = { value: values[i], suit: suits[x], weight: weight };
            deck.push(card);
        }
    }
}


//Function for creating players
function createPlayers(num) {
    players = [];
    for (let i = 1; i <= num; i++) {
        let hand = [];
        let player = { name: 'Player ' + i, id: i, points: 0, hand: hand };
        players.push(player);
    }
}
