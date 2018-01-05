import './std-js/shims.js';
import './std-js/deprefixer.js';
import {$, ready} from './std-js/functions.js';
import {drawBoard} from './TicTacToe.js';
import * as shares from './share-config.js';
import WebShareAPI from './std-js/webShareApi.js';
import * as Mutations from './std-js/mutations.js';

WebShareAPI(...Object.values(shares));

ready().then(() => {
	const $doc = $(document.documentElement);
	const board = document.getElementById('game-board');

	document.getElementById('reset-btn').addEventListener('click', () =>{
		if (confirm('Are you sure you want to reset your game?')) {
			drawBoard(board);
		}
	});

	$doc.replaceClass('no-js', 'js');
	drawBoard(board);
	Mutations.init();
	$doc.watch(Mutations.events, Mutations.options, Mutations.filter);
});
