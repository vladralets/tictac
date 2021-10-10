import React from 'react';
import './App.css';

function Square(props) {
    return (
      <button 
      className={props.isWinner ? "square painted-square" : "square"}
      onClick={props.onClick}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinner={this.props.isWinner ? this.props.isWinner.includes(i) ? true : false : false}
        key={i}
      />
    );
  }

  renderAll(max) {
    const field = [];
    for (let counter = 0; counter < max;){
      const line = [];
      for (let count = 0; count < 3; count+=1, counter+=1) {
        line.push(this.renderSquare(counter));
      }
      field.push(line);
    }
    return field;
  }


  render() {

    return (
      <div>
        {this.renderAll(9).map((line, index) => {
          return (
            <div className={"board-row"} key={index}>
              {line}
            </div>
          )
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        winnerList: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      movesListIsReversed: false,
      prevList: null,
    };
  }

  jumpTo(step) {
    this.setState((state)=> ({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    }));
  }

  handleClick = (i) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: calculateWinner(squares) 
      ? history.concat([{
        squares: squares,
        winnerList: calculateWinner(squares)[1],
      }])
      : history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ?
        `go to move # ${move}`:
        `start again`;
        return (
          <li key={move}>
            <button
              className={move === this.state.stepNumber && move !== history.length - 1
                ? "active_move"
                : ""}
              onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          </li>
        )
    })
    moves = this.state.movesListIsReversed ? [...moves].reverse() : moves;
    let status;
    if (winner) {
      status = `Won ${winner[0]}`;
    } else {
      status = `Next turn: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    if (!winner && this.state.stepNumber === 9) {
      status = `NO ONE WON`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            isWinner={this.state.history[this.state.stepNumber].winnerList}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState((state)=>({ movesListIsReversed: !state.movesListIsReversed }))}>
            reverse list of moves
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [...lines[i]]];
    }
  }
  return null;
}

export default Game;

