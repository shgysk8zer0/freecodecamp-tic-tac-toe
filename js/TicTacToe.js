import {randomInt as random} from './std-js/math.js';

function rowWin(gameState, player) {
	return gameState.some(row => [...row].every(cell => cell === player.value));
}

function playerWins({player, board} = {}) {
	try {
		const template = document.getElementById('game-over-template');
		const tmp = template.content.cloneNode(true);
		const dialog = tmp.querySelector('dialog');
		dialog.id = 'game-over-dialog';
		dialog.addEventListener('close', () => dialog.remove());
		[...dialog.querySelectorAll('[data-close]')].forEach(btn => btn.dataset.close = `#${dialog.id}`);
		dialog.querySelector('[data-field="player"]').textContent = `Player ${player.value}`;
		console.log(document.body.appendChild(tmp));
		dialog.showModal();
	} catch(error) {
		alert(`${player.value} won!`);
		console.error(error);
	}
	drawBoard(board);
}

function getAvailableCells(board) {
	return [...board.querySelectorAll('[data-row][data-column]:not([data-player-move])')];
}

function isDraw(board) {
	return getAvailableCells(board).length === 0;
}

function gameIsDraw(board) {
	alert('Draw!');
	drawBoard(board);
}

function aiMove({board, player} = {}) {
	const cells = getAvailableCells(board);
	if (cells.length !== 0) {
		const cell = cells[random(0, cells.length - 1)];

		takeMove({
			board,
			player,
			row: cell.dataset.row,
			column: cell.dataset.column,
		});

		return gameOver({player, board});
	}
}

function gameOver({board, player} = {}) {
	if (hasWon({board, player})) {
		playerWins({board, player});
		return true;
	} else if (isDraw(board)) {
		gameIsDraw(board);
		return true;
	} else {
		return false;
	}
}

function takeMove({
	row,
	column,
	board,
	player,
} = {}) {
	const cell = board.querySelector(`[data-row="${row}"][data-column="${column}"]`);

	if (! cell.dataset.hasOwnProperty('playerMove')) {
		cell.dataset.playerMove = player.value;
		cell.textContent = player.value;
		return true;
	} else {
		return false;
	}
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

function hasWon({board, player} = {}) {
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

export function drawBoard(board) {
	let row = 0;
	const players = turn();
	const rows = Array(3);
	let player = players.next();
	[...board.children].forEach(child =>child.remove());

	while (row < 3) {
		let rowEl = document.createElement('div');
		let col = 0;
		rowEl.classList.add('game-row');

		while (col++ < 3) {
			let cell = document.createElement('span');
			cell.classList.add('game-cell', 'inline-block');
			cell.textContent = ' ';
			cell.dataset.row = row;
			cell.dataset.column = col;
			cell.addEventListener('click', async event => {
				event.preventDefault();
				event.stopPropagation();

				if (takeMove({
					player,
					board,
					row: cell.dataset.row,
					column: cell.dataset.column,
				})) {
					if (! gameOver({board, player})) {
						player = players.next();
						aiMove({board, player});
						player = players.next();
					}
				}
			});
			rowEl.appendChild(cell);
		}
		rows[row++] = rowEl;
	}
	board.append(...rows);
}

function* turn({player1 = 'X', player2 = 'O'} = {}) {
	let counter = 0;
	while (counter++ < 9) {
		yield counter % 2 === 0 ? player1 : player2;
	}
}
