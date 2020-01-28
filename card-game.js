const readline = require('readline');
const _ = require('lodash');


const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


console.log(`
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
    if (numPlayers <= 1) {
        console.log(`You need minimum 2 players to start the game !!!`);
        process.exit(0);
    }
    r1.question('Enter the number of cards to be distributed to each player: ', numCards => {
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

/*
  First victory condition function
  -The array is passed to check if one of the players have all
   the cards with same rank value.The player found is the winner
   If there are more than one player found with the victory condition
   then checkTieWinner() is called with condition passed as
   "allEqual" otherwise the function returns the player name who wins the game.
*/
function checkEqual(item) {
    let handArr = [];
    let players = [];
    item.map((el, i) => {
        el.hand.map(val => {
            handArr.push(val);
            if (handArr.length === cards) {
                if (_.differenceBy(handArr[0], handArr[1], handArr[2], 'value') === []) {
                    players.push({ name: el.name, i });
                    handArr = [];
                }
                else {
                    handArr = [];
                }
            }
        });
    });
    if (players.length > 1) return checkTieWinner(players, 'allEqual');
    if (players.length > 0) return players[0].name;
}

//If first fails
/*
  Second victory condition function
  -The array is passed to check if one of the players have
   the cards with their value in sequence.(for ex a player with 3 cards have card sequence as 4, 5, 6)
   The player found is the winner If there are more than one player found with the victory condition
   then checkTieWinner() is called with condition passed as
   "sequence" otherwise the function returns the player name who wins the game.
*/
function checkSequence(item) {
    let weightArr = [];
    let players = [];
    item.map((el, i) => {
        el.hand.map(val => {
            weightArr.push(val.weight);
            if (weightArr.length === cards) {
                const diffArr = weightArr.slice(1).map((n, i) => weightArr[i] - n);
                Math.abs(diffArr);
                const isDiff = diffArr.every(val => val == 1);
                if (isDiff) players.push({ name: el.name, i });
                weightArr = [];
            }
        });
    });
    if (players.length > 1) return checkTieWinner(players, 'sequence');
    if (players.length > 0) return players[0].name;
}

//If second fails
/*
  Third victory condition function
  -The array is passed to check if one of the players have
   two similar cards (for ex two 'K' or 'A').The player found is the winner
   If there are more than one player found with the victory condition
   then checkTieWinner() is called with condition passed as
   "pair" otherwise the function returns the player name who wins the game.
*/
function checkPair(item) {
    let pairArr = [];
    let players = [];
    item.map((el, i) => {
        el.hand.map(val => {
            pairArr.push(val.value);
            if (pairArr.length === cards) {
                const unique = checkIfUniqueArr(pairArr);
                if (!unique) players.push({ name: el.name, i });
                pairArr = [];
            }
        });
    });
    if (players.length > 1) return checkTieWinner(players, 'pair');
    if (players.length > 0) return players[0].name;
}

//If all condition fail
/*
  Fourth victory condition function
  -The array is passed to check the top card of each player.
   The player with a top and unique card found is the winner
   If there are more than one player found with the victory condition
   then checkTopCardTie() is called with tied players and top card 
   values passes as params
   for ex if there are 4 players with 3 cards each
   Player 1 - 'A', '2' ,'3'
   Player 2 - 'K', '1' ,'10'
   Player 3 - 'A', '5' ,'0'
   Player 4 - 'Q', '7' ,'9'
   we can see that top cards for each player is A, K, A, Q
   but in this case we also see a tie between two players - 1 & 3
   so checkTopCardTie is called to break the tie
   ***if the case was A, K, K, Q - although the array contains tie but
   the winner is the player having card 'A'***
   Array duplicacy is checked with the help of checkIfUniqueArr()
*/

function checkTopCard(item) {
    let topCardArr = [];
    let values = [];
    let max = 0;
    let count = 0;
    item.map((el, i) => {
        el.hand.map(val => {
            max = Math.max(max, val.weight);
            count++;
            if (count === cards) {
                topCardArr.push({ max, i });
                count = 0;
                max = 0;
            }
        });
    });
    const unique = checkIfUniqueArr(topCardArr.map(el => el.max));
    if (!unique) {
        topCardArr.map(el => values.push(el.max));
        max = Math.max(...values);
        var map = new Map();
        topCardArr.forEach(val => map.set(val.max, (map.get(val.max) || 0) + 1));
        topCardArr = topCardArr.filter(val => map.get(val.max) > 1);
        if (max > topCardArr[0].max) {
            return values.indexOf(max);
        }
        else {
            return checkTopCardTie(topCardArr);
        }
    } else {
        topCardArr.map(el => values.push(el.max));
        max = Math.max(...values);
        return values.indexOf(max);
    }
}

//Function to check if array contains duplicates
function checkIfUniqueArr(arr) {
    return arr.length === new Set(arr).size;
}

/*
 checkTopCardTie()
 -This function checks for the tie breaker between the players
 for ex if 4 players have top cards of 'A','A','K','K'
 then there is also a tie breaker and also we have the max or the top rank
 value card for the tie breaker, in this case 'A','A' will go for the tie 
 breaker and then the rest of the game will follow.
 The functions handles all these corner cases
*/
function checkTopCardTie(arr) {
    let tieCards = [];
    let max = 0;
    arr.map(el => tieCards.push(el.max));
    max = Math.max(...tieCards);
    arr = arr.filter(val => val.max == max);
    return dealTie(arr);
}

/*
 dealTie()
 -After all the cases for players have been checked and the tied players are 
 sorted and filtered according the criteria , then this function is called in
 the end to determine the winner.
 Each tied player has to start a new game with  a new card given to him
 The game goes on until a top card is found
*/
function dealTie(arr) {
    let tiePlayers = [];
    let max = 0;
    while (true) {
        let tieWeight = [];
        for (let x = 0; x < arr.length; x++) {
            let card = deck.pop();
            tiePlayers.push(players[arr[x].i]);
            tiePlayers[x].hand = [];
            tiePlayers[x].hand.push(card);
        }
        tiePlayers.map(val => val.hand.map(el => tieWeight.push(el.weight)));
        const unique = checkIfUniqueArr(tieWeight);
        if (unique) {
            max = Math.max(...tieWeight);
            return tieWeight.indexOf(max);
        }
        else {
            continue;
        }
    }
}

/*
This function is triggered when any of the first 3 
victory conditions are satisfied but the number of 
players satisfying the condition is greater than 1
*/
function checkTieWinner(tiePlayers, condition) {
    let playerArr1 = [];
    let max = 0;
    let pairValue = [];
    var map = new Map();
    switch (condition) {
        case 'allEqual':
            playerArr1 = tiePlayers.map(player => players[player.i].hand.reduce((a, b) => a + b.weight, 0));
            max = Math.max(...playerArr1);
            return tiePlayers[playerArr1.indexOf(max)].name;
        case 'sequence':
            playerArr1 = tiePlayers.map(player => players[player.i].hand.reduce((a, b) => a + b.weight, 0));
            max = Math.max(...playerArr1);
            return tiePlayers[playerArr1.indexOf(max)].name;
        case 'pair':
            pairValue = tiePlayers.map(player => players[player.i].hand);
            pairValue.forEach(val => val.forEach(el => map.set(el.weight, (map.get(el.weight) || 0) + 1)));
            pairValue = pairValue.map(val => val.filter(el => map.get(el.weight) > 1));
            playerArr1 = pairValue.map(val => val.reduce((a, b) => a + b.weight, 0));
            max = Math.max(...playerArr1);
            return tiePlayers[playerArr1.indexOf(max)].name;
        default:
            break;
    }
}

