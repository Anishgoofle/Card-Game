/**
 * Global vars
 * @var suits - contains the types for cards
 * @var values - contains all the values of cards from 'A','K','Q'... and so on
 * @var deck - array containing the number of cards
 * @var players - array containing the number of players
 * @var winner - variable for storing the winning player
 * @var cards - variable for storing the user input for number of cards
 */

const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
const values = ["A", "K", "Q", "J", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
let deck = [];
let players = [];
let winner = '';
let cards = 0;


/**
 * Function for starting game
 * The first process consists of creating deck
 * The cards are randomly shuffled
 * Players are created
 * The shuffled cards are dealt between the players
 * The check function is called to determine the winner
 * @param {string} numPlayers - user input for number of players
 * @param {number} numCards - user input for number of cards to be distributed to each player
*/

function startGame(numPlayers, numCards) {
    cards = numCards;
    createDeck();
    shuffle();
    createPlayers(numPlayers);
    deal(cards);
    check();
}


/**
 * Function for creating deck
 * @returns deck of cards
 */
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
    return deck;
}


/**
 * Function for switching the values of two random cards
 * @returns shuffled deck of cards
 */

function shuffle() {
    let randCard;
    let temp;
    for (let index = deck.length - 1; index >= 0; index--) {
        randCard = Math.floor(Math.random() * deck.length);
        temp = deck[index];
        deck[index] = deck[randCard];
        deck[randCard] = temp;
    }
    return deck;
}


/**
 * Function for creating players
 * @param {number} num - number of players to be created
 * @returns the @var player array
 */

function createPlayers(num) {
    players = [];
    for (let i = 1; i <= num; i++) {
        let hand = [];
        let player = { name: 'Player ' + i, id: i, points: 0, hand: hand };
        players.push(player);
    }
    return players;
}

/** 
 * Function for alternate handing cards to each player
 * @param {number} numCards - number of cards to be distributed to each player
 * @returns the updated @var player array containing cards
 */

function deal(numCards) {
    for (let i = 0; i < numCards; i++) {
        for (let x = 0; x < players.length; x++) {
            let card = deck.pop();
            players[x].hand.push(card);
            updatePoints(players);
        }
    }
    return players;
}

/**
 * Function for updating player score
 * @param {array} players - array of players
 * @returns callback of @function getPoints
*/
function updatePoints(players) {
    for (let i = 0; i < players.length; i++) {
        getPoints(i, players);
    }
}

/** 
 * Function that returns the number of points that a player has in hand
 * @param {number} player - the player number from the players array
 * @param {array} players - array of players
 * @returns update points for the player
 */

function getPoints(player, players) {
    let points = 0;
    for (let i = 0; i < players[player].hand.length; i++) {
        points += players[player].hand[i].weight;
    }
    players[player].points = points;
    return points;
}

/**
 * Function called to determine the winner
 * The check function reduces the global players variable to contain only the player name and the hand array(array storing the card info)
 * These are the useful info we require to determine the winner
 * The @function detectWinner is called with the reduced array passed as a parameter
 */

function check() {
    let result = players.reduce((res, arr) => {
        res.push({
            name: arr.name,
            hand: arr.hand
        });
        return res;
    }, []);
    let winner = detectWinner(result, cards);
    console.log(`Winner is ${winner[0]} -- ${winner[1]}`);
}


/**
 * This function takes the reduced array and sort the array(hand) containing the cards based on their rank values ('weights' key in array) in descending order.
 * The sorted array is then passed through the following conditions:-
 * First victory condition - @function checkEqual - to check all cards are same (ex - 3A's for a player having three cards)
 * Second victory condition - @function checkSequence - to check if card are in sequence ..(ex 4, 5, 6)
 * Third victory condition - @function checkPair - to check if the cards contain a pair.. (ex 2'K' or 2'A')
 * Fourth victory conditon - @function checkTopCard- if above all 3 conditions fail, then the winnner is determined by taking the top card (by rank(weight)) and checking which player has the highest card by rank value.
 * In case of  a tie, the tied players are then allowed to pick a new card from the deck until a winner is found
 * @param {array} item - reduced array containg player name and his cards object
 * @param {number} cards - number of cards
 * @returns the winning player
*/

function detectWinner(item, cards) {
    //Sort each value rankwise
    item.map(val => val.hand.sort((a, b) => (a.weight < b.weight) ? 1 : (b.weight < a.weight) ? -1 : 0));
    let vCondition1 = checkEqual(item, cards);
    if (vCondition1 !== undefined) {
        winner = vCondition1;
        return [winner, 'All Cards Same'];
    }
    if (!winner) {
        let vCondition2 = checkSequence(item, cards);
        if (vCondition2 !== undefined) {
            winner = vCondition2;
            return [winner, 'Card Sequence In Order'];
        }
    }
    if (!winner) {
        let vCondition3 = checkPair(item, cards);
        if (vCondition3 !== undefined) {
            winner = vCondition3;
            return [winner, 'Card Pair Found'];
        }
    }
    if (!winner) {
        let vCondition4 = checkTopCard(item, cards);
        if (vCondition4 !== undefined) {
            winner = ` Player ${vCondition4 + 1}`;
            return [winner, 'All Cases Failed, Player won by topcard rank value'];
        }
    }
}

/**
 * First victory condition function
 * The array is passed to check if one of the players have all the cards with same rank value.
 * The player found is the winner
 * If there are more than one player found with the victory condition then @function checkTieWinner is called with condition passed as @param allEqual otherwise the function returns the player name who wins the game.
 * @param {array} item - sorted and reduced array according to rank
 * @param {number} cards - number of cards
 * @returns the winner player to main function else tie checker
 */

function checkEqual(item, cards) {
    let handArr = [];
    let players = [];
    item.map((el, i) => {
        el.hand.map(val => {
            handArr.push(val);
            if (handArr.length == cards) {
                if (handArr.every(val => val.value == handArr[0].value)) {
                    players.push({ name: el.name, i });
                    handArr = [];
                }
                else {
                    handArr = [];
                }
            }
        });
    });
    if (players.length > 1) return checkTieWinner(players, 'allEqual', item, cards);
    if (players.length > 0) return players[0].name;
}

/**
 * If first victory condition fails, then this is triggered.
 * The array is passed to check if one of the players have the cards with their value in sequence.(for ex a player with 3 cards have card sequence as 4, 5, 6)
 * The player found is the winner 
 * If there are more than one player found with the victory condition  then @function checkTieWinner is called with condition passed as @param sequence otherwise the function returns the player name who wins the game.
 * @param {array} item - sorted and reduced array according to rank
 * @param {number} cards - number of cards
 * @returns the winner player to main function else tie checker
 */

function checkSequence(item, cards) {
    let weightArr = [];
    let players = [];
    item.map((el, i) => {
        el.hand.map(val => {
            weightArr.push(val.weight);
            if (weightArr.length == cards) {
                let diffArr = weightArr.slice(1).map((n, i) => weightArr[i] - n);
                diffArr = diffArr.map(v => Math.abs(v));
                const isDiff = diffArr.every(val => val == 1);
                if (isDiff) players.push({ name: el.name, i });
                weightArr = [];
            }
        });
    });
    if (players.length > 1) return checkTieWinner(players, 'sequence', item, cards);
    if (players.length > 0) return players[0].name;
}

/**
 * If second victory condition fails, then this is triggered.
 * The array is passed to check if one of the players have two similar cards (for ex two 'K' or 'A').
 * The player found is the winner
 * If there are more than one player found with the victory condition then @function checkTieWinner is called with condition passed as @param pair otherwise the function returns the player name who wins the game.
 * @param {array} item - sorted and reduced array according to rank
 * @param {number} cards - number of cards
 * @returns the winner player to main function else tie checker
 */

function checkPair(item, cards) {
    let pairArr = [];
    let players = [];
    item.map((el, i) => {
        el.hand.map(val => {
            pairArr.push(val.value);
            if (pairArr.length == cards) {
                const unique = checkIfUniqueArr(pairArr);
                if (!unique) players.push({ name: el.name, i });
                pairArr = [];
            }
        });
    });
    if (players.length > 1) return checkTieWinner(players, 'pair', item, cards);
    if (players.length > 0) return players[0].name;
}


/**
 * Fourth victory condition function
 * The array is passed to check the top card of each player.
 * The player with a top and unique card found is the winner
 * If there is more than one player found with the victory condition
 * then @function checkTopCardTie is called with tied players and top card values passes as params
 * for ex if there are 4 players with 3 cards each
 * Player 1 - 'A', '2' ,'3'
 * Player 2 - 'K', '4' ,'10'
 * Player 3 - 'A', '5' ,'6'
 * Player 4 - 'Q', '7' ,'9'
 * we can see that top cards for each player is A, K, A, Q
 * but in this case we also see a tie between two players - 1 & 3 so @function checkTopCardTie is called to break the tie
 * if the case was A, K, K, Q - although the array contains tie but the winner is the player having card 'A'
 * Array duplicacy is checked with the help of @function checkIfUniqueArr
 * @param {array} item - sorted and reduced array according to rank
 * @param {number} cards - number of cards
 * @returns the winner player index to main function else tie checker for top card
*/

function checkTopCard(item, cards) {
    let topCardArr = [];
    let values = [];
    let max = 0;
    let count = 0;
    item.map((el, i) => {
        el.hand.map(val => {
            max = Math.max(max, val.weight);
            count++;
            if (count == cards) {
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
            return checkTopCardTie(topCardArr, deck, players);
        }
    } else {
        topCardArr.map(el => values.push(el.max));
        max = Math.max(...values);
        return values.indexOf(max);
    }
}

/**
 * Function to check if array contains duplicates
 * @param {array} arr
 * @returns boolean value
 */

function checkIfUniqueArr(arr) {
    return arr.length === new Set(arr).size;
}

/**
 * This function checks for the tie breaker between the players
 * for ex if 4 players have top cards of 'A','A','K','K'
 * then there is also a tie breaker and also we have the max or the top rank
 * value card for the tie breaker, in this case 'A','A' will go for the tie
 * breaker and then the rest of the game will follow.
 * The functions handles all these corner cases.
 * @param {array} arr containing the top card for each of the players
 * @param {array} deck - the shuffled deck
 * @param {array} players - array of players
 * @returns the result for tie breaker
 */

function checkTopCardTie(arr, deck, players) {
    let tieCards = [];
    let max = 0;
    arr.map(el => tieCards.push(el.max));
    max = Math.max(...tieCards);
    arr = arr.filter(val => val.max == max);
    return dealTie(arr, deck, players);
}

/**
 * After all the cases for players have been checked and the tied players are sorted and filtered according to the criteria. 
 * function is called in the end to determine the winner.
 * Each tied player has to start a new game with  a new card given to him
 * The game goes on until a top card is found
 * @param {array} arr - array of players containing the top value card
 * @param {array} deck - the shuffled deck
 * @param {array} players - array containing players info
 * @returns the winner player index
 */

function dealTie(arr, deck, players) {
    let tiePlayers = [];
    let max = 0;
    while (true) {
        let tiedPoints = [];
        for (let x = 0; x < arr.length; x++) {
            let card = deck.pop();
            tiePlayers.push(players[arr[x].i]);
            tiePlayers[x].hand = [];
            tiePlayers[x].hand.push(card);
            updatePoints(tiePlayers);
        }
        tiePlayers.map(el => tiedPoints.push(el.points));
        const unique = checkIfUniqueArr(tiedPoints);
        if (unique) {
            max = Math.max(...tiedPoints);
            return tiedPoints.indexOf(max);
        }
        else {
            continue;
        }
    }
}

/**
 * This function is triggered when any of the first 3 victory conditions are satisfied 
 * but the number of players satisfying the condition is greater than 1
 * @param {array} tiePlayers - number of players satisfying the victory condition
 * @param {string} condition - the string passed in all three cases @param allEqual, @param sequence or @param pair
 * @param {array} arr - the reduced array 
 * @param {number} cards - number of cards for each player
 * @returns the winner player name
 */

function checkTieWinner(tiePlayers, condition, arr, cards) {
    let max = 0;
    let pairValue = [];
    var map = {};
    var filterObj = {};
    var playerArr1 = {};
    var tiedPoints = [];
    switch (condition) {
        case 'allEqual':
            playerArr = tiePlayers.map(player => arr[player.i].hand.reduce((a, b) => a + b.weight, 0));
            max = Math.max(...playerArr);
            return tiePlayers[playerArr.indexOf(max)].name;
        case 'sequence':
            playerArr = tiePlayers.map(player => arr[player.i].hand.reduce((a, b) => a + b.weight, 0));
            max = Math.max(...playerArr);
            return tiePlayers[playerArr.indexOf(max)].name;
        case 'pair':
            tiePlayers.map(player => {
                arr[player.i].hand.map(el => {
                    pairValue.push(el);
                    if (pairValue.length === cards) {
                        map = pairValue.reduce((obj, b) => {
                            obj[b.value] = ++obj[b.value] || 1;
                            return obj;
                        }, {});
                        filterObj = Object.keys(map).filter(val => map[val] == 2);
                        pairValue = pairValue.filter(val => val.value == filterObj[0]);
                        playerArr1 = pairValue.reduce((a, b) => a + b.weight, 0);
                        tiedPoints.push(playerArr1);
                        pairValue = [];
                    }
                });
            });
            if (!checkIfUniqueArr(tiedPoints)) {
                let doubleTie = [];
                doubleTie = tiePlayers.map(players => arr[players.i]);
                let tieBreaker = checkTopCard(doubleTie, cards);
                return doubleTie[tieBreaker].name;
            } else {
                max = Math.max(...tiedPoints);
                return tiePlayers[tiedPoints.indexOf(max)].name;
            }
        default:
            break;
    }
}

module.exports = {
    winner,
    startGame,
    createDeck,
    shuffle,
    createPlayers,
    deal,
    checkIfUniqueArr,
    detectWinner,
    checkEqual,
    checkSequence,
    checkPair,
    checkTopCard,
    dealTie,
    checkTieWinner
};


