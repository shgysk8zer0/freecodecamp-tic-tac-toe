import './std-js/shims.js';
import {$} from './std-js/functions.js';
import {randomInt as random, range} from './std-js/math.js';

function rowWin(gameState, player) {
	return gameState.some(row => [...row].every(cell => cell === player.value));
}

function columnWin(gameState, player) {
	return [0,1,2].some(col => {
		return [0,1,2].every(row => {
			return gameState[row][col] === player.value;
		});
	});
}

function diagonalWin(gameState, player) {
	const diagonals = [
		[gameState[0][0], gameState[1][1], gameState[2][2]],
		[gameState[0][2], gameState[1][1], gameState[2][0]],
	];
	return diagonals.some(diagonal => diagonal.every(cell => cell === player.value));
}

function hasWon(board, player) {
	const state = getState(board);
	return rowWin(state, player) || columnWin(state, player) || diagonalWin(state, player);
}

function getState(board) {
	return [...board.children].map(row => {
		return [...row.children].map(cell => {
			return cell.dataset.playerMove;
		});
	});
}

function drawBoard(board) {
	let row = 0;
	const players = turn();
	let player = players.next();
	let won = false;
	[...board.children].forEach(child =>child.remove());

	while (row++ < 3) {
		let rowEl = document.createElement('div');
		let col = 0;
		rowEl.classList.add('row');

		while (col++ < 3) {
			let cell = document.createElement('span');
			cell.classList.add('game-cell', 'inline-block');
			cell.textContent = ' ';
			cell.dataset.row = row;
			cell.dataset.column = col;
			cell.addEventListener('click', async event => {
				event.preventDefault();
				event.stopPropagation();

				if (! cell.dataset.hasOwnProperty('playerMove')) {
					cell.dataset.playerMove = player.value;
					cell.textContent = player.value;

					if (await hasWon(board, player)) {
						alert(`${player.value} has won!`);
						drawBoard(board);
					} else {
						player = players.next();

						if (player.done) {
							alert('Draw!');
							drawBoard(board);
						}
					}
				}
			});
			rowEl.appendChild(cell);
		}
		board.appendChild(rowEl);
	}
}

function* turn({player1 = 'X', player2 = 'O'} = {}) {
	let counter = 0;
	while (counter++ < 9) {
		yield counter % 2 === 0 ? player1 : player2;
	}
}

$(self).ready(() => {
	const $doc = $(document.documentElement);
	const board = document.getElementById('game-board');

	document.getElementById('reset-btn').addEventListener('click', () =>{
		if (confirm('Are you sure you want to reset your game?')) {
			drawBoard(board);
		}
	});

	$doc.replaceClass('no-js', 'js');
	drawBoard(board);
},{once: true});
