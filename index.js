import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    const classes = `square ${(props.isWinner) ? 'winner':''}`;
    return (
        <button className={classes}
                onClick={props.onClick}>
            {props.value}
        </button>        
    );
}


class Board extends React.Component {
    constructor() {
        super();
        this.cols = 3;
        this.rows = 3;
    }

    renderSquare(i) {
        const isWinner = this.props.winningSquares ? this.props.winningSquares.includes(i) : false;
        return (
            <Square
                key={i}
                isWinner={isWinner}
                value={this.props.squares[i]}
                onClick={() => this.props.squareClickHandler(i)}
            />
        );
    }

    renderBoardRow(rowNum) {
        const startNum = rowNum * this.cols; 
        let squareComponents = [];
        for (let i = startNum; i < startNum + this.cols; i++) {
            squareComponents.push(this.renderSquare(i));
        }

        return (
            <div key={rowNum} className="board-row">{squareComponents}</div>      
        );
    }

    render() {
        let rowComponents = [];
        for (let i=0; i < this.rows; i++) {
            rowComponents.push(this.renderBoardRow(i));
        }

        return (
            <div>{rowComponents}</div>      
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this._PlayerTokens = ['X', 'O'];
        this.state = {
            currentPlayer: this._PlayerTokens[1],
            history: [
                { squares: Array(9).fill(null) },
            ],
        };
    }

    getNextPlayer() {
        let currentToken = this.state.currentPlayer;
        if (currentToken === this._PlayerTokens[0]){
            return this._PlayerTokens[1];
        }
        return this._PlayerTokens[0];
    }

    getCurrentBoardState() {
        const lastMove = this.state.history.length - 1;
        return this.state.history[lastMove].squares;
    }

    handleSquareClick(i) {
        const history = this.state.history;
        let squares = this.getCurrentBoardState().slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.getNextPlayer();
        this.setState({
            currentPlayer: this.getNextPlayer(),
            history: history.concat([{ squares }]),
        });
    }

    jumpToState(stateNumber) {
        const currentPlayer = this.state.currentPlayer;
        const history = this.state.history.slice(0, stateNumber + 1);
        this.setState({
            currentPlayer,
            history,
        });
    }

    renderMoveList() {
        return this.state.history.map((state, move) => {
            const description = (move === 0) ? 'Game Start' : `Move #${move}`;
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpToState(move)}>{description}</a>
                </li>
            );
        });
    }
    
    render() {
        const winStats = calculateWinner(this.getCurrentBoardState());
        let status;
        if (winStats) {
            status = `Winner: ${winStats.winner}`;
        } else {
            status = `Next player: ${this.getNextPlayer()}`;
        }
    
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={this.getCurrentBoardState()}
                           squareClickHandler={(i) => this.handleSquareClick(i)}
                           winningSquares={winStats ? winStats.squares : null}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{this.renderMoveList()}</ol>
                </div>
            </div>  
        );
    }
}

function calculateWinner(squares) {
    const lineChecks = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2],
    ];

    for (let lineCheck of lineChecks) {
        const [a, b, c] = lineCheck;
        if (squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]) {
            return { winner: squares[a], squares: [a, b, c] };
        }
    }
    return null;
}

// =======================================
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

