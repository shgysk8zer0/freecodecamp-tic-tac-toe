import './std-js/shims.js';
import {$} from './std-js/functions.js';

async function hasWon(board, player) {
	return false;
}

function resetBoard(board) {
	const $cells = $('[data-player-move]', board);
	$cells.data({playerMove: false});
	$cells.each(cell => cell.textContent = ' ');
}

function drawBoard(board) {
	let row = 0;
	const players = turn();
	let player = players.next();
	let won = false;

	while (row++ < 3) {
		let rowEl = document.createElement('div');
		let col = 0;
		rowEl.classList.add('row');

		while (col++ < 3) {
			let cell = document.createElement('span');
			cell.classList.add('game-cell', 'inline-block');
			cell.textContent = ' ';
			cell.addEventListener('click', async event => {
				event.preventDefault();
				event.stopPropagation();

				if (! cell.dataset.hasOwnProperty('playerMove')) {
					cell.dataset.playerMove = player.value;
					cell.textContent = player.value;

					won = await hasWon(board, player);
					console.info(won);
					if (won) {
						alert(`${player.value} has won!`);
						resetBoard(board);
					} else {
						player = players.next();

						if (player.done) {
							alert('Draw!');
							resetBoard(board);
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
		yield counter %2 == 0 ? player1 : player2;
	}
}

$(self).ready(() => {
	const $doc = $(document.documentElement);
	const board = document.getElementById('game-board');

	$doc.replaceClass('no-js', 'js');
	drawBoard(board);
},{once: true});
