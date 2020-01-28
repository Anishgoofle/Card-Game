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

//Function for switching the values of two random cards
function shuffle() {
    let randCard;
    let temp;
    for (let index = deck.length - 1; index >= 0; index--) {
        randCard = Math.floor(Math.random() * deck.length);
        temp = deck[index];
        deck[index] = deck[randCard];
        deck[randCard] = temp;
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

//Function for alternate handing cards to each player
function deal(numCards) {
    for (let i = 0; i < numCards; i++) {
        for (let x = 0; x < players.length; x++) {
            let card = deck.pop();
            players[x].hand.push(card);
            updatePoints();
        }
    }
}

//Function for updating player score
function updatePoints() {
    for (let i = 0; i < players.length; i++) {
        getPoints(i);
    }
}

// Function that returns the number of points that a player has in hand
function getPoints(player) {
    let points = 0;
    for (let i = 0; i < players[player].hand.length; i++) {
        points += players[player].hand[i].weight;
    }
    players[player].points = points;
    return points;
}

/*
 Function called to determine the winner
 The check function reduces the global players variable 
 to contain only the player name and the hand array(array storing the card info)
 These are the useful info we require to determine the winner
 The detectWinner function is called with the reduced array passed as a parameter
*/
function check() {
    let result = players.reduce((res, arr) => {
        res.push({
            name: arr.name,
            hand: arr.hand
        });
        return res;
    }, []);
    detectWinner(result);
}


/*
 detectWinner()
 -This function takes the reduced array and sort the array(hand)
  containing the cards based on their rank values ('weights' key in array) in descending
  order.
-The sorted array is then passed through the following conditions:-
 -First victory condition - 'checkEqual()' - to check all cards are same (ex - 3A's for a player having three cards)
 -Second victory condition - 'checkSequence()' - to check if card are in sequence ..(ex 4, 5, 6)
 -Third victory condition - 'checkPair()' - to check if the cards contain a pair.. (ex 2'K' or 2'A')
 -Fourth victory conditon - 'checkTopCard()' - if above all 3 conditions fail, then the winnner is determined
   by taking the top card (by rank(weight)) and checking which player has the highest card by rank value.
   ***In case of  a tie, the tied players are then allowed to pick a new card from the deck until a winner is found***
*/

function detectWinner(item) {
    //Sort each value rankwise
    item.map(val => val.hand.sort((a, b) => (a.weight < b.weight) ? 1 : (b.weight < a.weight) ? -1 : 0));
    let vCondition1 = checkEqual(item);
    if (vCondition1 !== undefined) {
        winner = vCondition1;
        console.log(`Winner is ${winner} --> All Cards Same`);
        return;
    }
    if (!winner) {
        let vCondition2 = checkSequence(item);
        if (vCondition2 !== undefined) {
            winner = vCondition2;
            console.log(`Winner is ${winner} --> Card Sequence In Order`);
            return;
        }
    }
    if (!winner) {
        let vCondition3 = checkPair(item);
        if (vCondition3 !== undefined) {
            winner = vCondition3;
            console.log(`Winner is ${winner} --> Pair Check`);
            return;
        }
    }
    if (!winner) {
        let vCondition4 = checkTopCard(item);
        if (vCondition4 !== undefined) {
            winner = ` Player ${vCondition4 + 1}`;
            console.log(`Winner is ${winner} --> All Cases Failed, Won By Topcard Rank Value`);
            return;
        }
    }
}



