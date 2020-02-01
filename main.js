const readline = require('readline');
const game = require('./card-game.js');


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


r1.question('Enter the number of players: ', numPlayers => {
    if (numPlayers <= 1) {
        console.log(`You need minimum 2 players to start the game !!!`);
        process.exit(0);
    }
    r1.question('Enter the number of cards to be distributed to each player: ', numCards => {
        game.startGame(numPlayers, Number(numCards));
        r1.close();
        if (game.winner) process.exit(0);
    });
});