import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Square = (props) => {
  return (
    <button
      className="square"
      // 親がonClick=>this.handleClick(i)で渡しているから関数を実行するときは関数名ではなくonClickとなる
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      // 現在何手目なのか確認する
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // 巻き戻し後その時点で新しい着手を起こした場合にそこからみて将来にある履歴を確実に捨て去る
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // 配列のコピーを作成している→配列にsliceすると全く同じ配列が生成される
    const squares = current.squares.slice();
    // ゲームの決着がついているもしくはマス目が埋まっている場合、returnで切り抜け
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // クリックされたところにXを入力する
    squares[i] = this.state.xIsNext ? "X" : "O";
    // squaresを常に最新なものに更新する
    this.setState({
      // concatは元の配列をミューテートしないため採用。pushは元の配列をミューテートする
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    // 今回の盤面を引数で渡す
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to tove #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
    // linesに3つの要素が揃った時
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 勝者（X or O）を返す
      return squares[a];
    }
  }
  return null;
}
