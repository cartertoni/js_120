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
    winRatio: {},
    weightedChoices: [],

    calculateWinRatio() {
      let historyObj = {};
      if (RPSGame.history) {
        historyObj = RPSGame.history.reduce((acc, current) => {
          let [humanMove, computerMove, result] = current;
          if (acc[computerMove]) {
            acc[computerMove].push(result);
          } else {
            acc[computerMove] = [result];
          }
          return acc;
        }, {});
      }

      for (let key in historyObj) {
        this.winRatio[key] =
          historyObj[key].filter(result => result === 'computer').length /
          historyObj[key].filter(result => result === 'computer' || 'human')
            .length;
      }
    },

    weightChoices() {
      this.weightedChoices = this.choices.reduce((acc, current) => {
        if (this.winRatio[current] > 0.6)
          return acc.concat([current, current, current]);
        else if (this.winRatio[current] < 0.4) return acc.concat(current);
        else return acc.concat([current, current]);
      }, []);
    },

    choose() {
      this.calculateWinRatio();
      this.weightChoices();
      let randomIndex = Math.floor(Math.random() * this.weightedChoices.length);
      this.move = this.weightedChoices[randomIndex];
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
        console.log(
          `Please choose ${this.choices.join(
            ', '
          )}. Enter 'history' to view your move history.`
        );
        choice = readline.question();
        if (this.choices.includes(choice)) break;
        else if (choice === 'history') {
          console.clear();
          RPSGame.displayHistory();
        } else {
          console.clear();
          console.log('Sorry, invalid choice.\n');
        }
      }

      this.move = choice;
    },
  };
  return Object.assign(playerObject, humanObject);
}

const RPSGame = {
  PLAY_TO_SCORE: 5,
  history: [],

  human: createHuman(),
  computer: createComputer(),
  winner: null,

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Rock, Paper, Scissors, Spock, Lizard!\n');
  },

  determineWinner() {
    if (this.human.win[this.human.move].includes(this.computer.move)) {
      this.winner = 'human';
      this.human.score += 1;
      if (this.human.score === this.PLAY_TO_SCORE) {
        this.human.matchWinner = true;
      }
    } else if (
      this.computer.win[this.computer.move].includes(this.human.move)
    ) {
      this.winner = 'computer';
      this.computer.score += 1;
      if (this.computer.score === this.PLAY_TO_SCORE) {
        this.computer.matchWinner = true;
      }
    } else {
      this.winner = 'tie';
    }
  },

  displayWinner() {
    console.clear();
    console.log(`You chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}`);
    console.log(
      `${
        this.winner === 'tie'
          ? "It's a tie!"
          : `${
              this.winner.slice(0, 1).toUpperCase() + this.winner.slice(1)
            } wins!`
      } The score is ${this.human.score} - ${this.computer.score}\n`
    );
  },

  addToHistory() {
    this.history.push([this.human.move, this.computer.move, this.winner]);
  },

  displayHistory() {
    if (this.history.length === 0) {
      console.log(`No move history to display.\n`);
    }
    this.history.forEach(([humanMove, computerMove, winner], index) => {
      console.log(
        `Game ${index + 1}\nHuman move: ${
          humanMove.slice(0, 1).toUpperCase() + humanMove.slice(1)
        }\nComputer move: ${
          computerMove.slice(0, 1).toUpperCase() + computerMove.slice(1)
        }\nWinner: ${winner.slice(0, 1).toUpperCase() + winner.slice(1)} \n`
      );
    });
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
        console.log(this.computer.weightedChoices);
        console.log(this.computer.winRatio);
        this.human.choose(this.playerType);
        this.computer.choose(this.playerType);
        this.determineWinner();
        this.displayWinner();
        this.addToHistory();
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
