import './std-js/shims.js';
import {$} from './std-js/functions.js';
import {drawBoard} from './TicTacToe.js';

function readyHandler() {
	const $doc = $(document.documentElement);
	const board = document.getElementById('game-board');

	document.getElementById('reset-btn').addEventListener('click', () =>{
		if (confirm('Are you sure you want to reset your game?')) {
			drawBoard(board);
		}
	});

	$doc.replaceClass('no-js', 'js');
	drawBoard(board);
}

$(self).ready(readyHandler,{once: true});
