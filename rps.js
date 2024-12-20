/*

Rock: Lizard, Scissors
Paper: Rock, Spock
Scisssors: Paper, Lizard
Spock: Scissors, Rock
Lizard: Spock, Paper

*/

const readline = require('readline-sync');

function createPlayer() {
  return {
    move: null,
    choices: ['rock', 'paper', 'scissors', 'spock', 'lizard'],
    win: {
      rock: ['scissors', 'lizard'],
      paper: ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      spock: ['scissors', 'rock'],
      lizard: ['spock', 'paper'],
    },
    score: 0,
    matchWinner: false,
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      let randomIndex = Math.floor(Math.random() * this.choices.length);
      this.move = this.choices[randomIndex];
    },
  };
  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log(`Please choose ${this.choices.join(', ')}`);
        choice = readline.question();
        if (this.choices.includes(choice)) break;
        console.clear();
        console.log('Sorry, invalid choice.\n');
      }

      this.move = choice;
    },
  };
  return Object.assign(playerObject, humanObject);
}

const RPSGame = {
  PLAY_TO_SCORE: 5,

  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Rock, Paper, Scissors, Spock, Lizard!\n');
  },

  determineWinner() {
    if (this.human.win[this.human.move].includes(this.computer.move)) {
      this.human.score += 1;
      if (this.human.score === this.PLAY_TO_SCORE) {
        this.human.matchWinner = true;
      }
      return 'human';
    } else if (
      this.computer.win[this.computer.move].includes(this.human.move)
    ) {
      this.computer.score += 1;
      if (this.computer.score === this.PLAY_TO_SCORE) {
        this.computer.matchWinner = true;
      }
      return 'computer';
    } else {
      return 'tie';
    }
  },

  displayWinner(winner) {
    console.clear();
    console.log(`You chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}`);
    console.log(
      `${winner === 'tie' ? "It's a tie!" : `${winner} wins!`} The score is ${
        this.human.score
      } - ${this.computer.score}\n`
    );
  },

  checkForMatchWinner() {
    return this.human.matchWinner || this.computer.matchWinner;
  },

  displayMatchWinner() {
    console.log(
      `${
        this.human.matchWinner
          ? 'You win the match!'
          : 'Computer wins the match!'
      }`
    );
  },

  displayGoodbyeMessage() {
    console.log(
      'Thanks for playing Rock, Paper, Scissors, Spock, Lizard. Goodbye!'
    );
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    return answer.toLowerCase() === 'y';
  },

  resetGame() {
    this.human.score = 0;
    this.computer.score = 0;
    this.human.matchWinner = false;
    this.computer.matchWinner = false;
  },

  play() {
    while (true) {
      this.displayWelcomeMessage();
      while (true) {
        this.human.choose(this.playerType);
        this.computer.choose(this.playerType);
        this.displayWinner(this.determineWinner());
        if (this.checkForMatchWinner()) break;
      }
      this.displayMatchWinner();
      if (!this.playAgain()) break;
      this.resetGame();
    }
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();
