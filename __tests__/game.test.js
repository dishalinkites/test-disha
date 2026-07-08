const { createEmptyBoard, checkWinner, isDraw, makeMove, nextPlayer, getBestMove } = require('../src/game');

test('empty board has no winner and is not draw', () => {
  const b = createEmptyBoard();
  expect(checkWinner(b)).toBe(null);
  expect(isDraw(b)).toBe(false);
});

test('X wins on a row', () => {
  const b = ['X','X','X', null,null,null, null,null,null];
  expect(checkWinner(b)).toBe('X');
});

test('O wins on a diagonal', () => {
  const b = ['O',null,null, null,'O',null, null,null,'O'];
  expect(checkWinner(b)).toBe('O');
});

test('detect draw', () => {
  const b = ['X','O','X','X','O','O','O','X','X'];
  expect(checkWinner(b)).toBe(null);
  expect(isDraw(b)).toBe(true);
});

test('makeMove places mark and toggles with nextPlayer', () => {
  let b = createEmptyBoard();
  let res = makeMove(b, 0, 'X');
  expect(res.ok).toBe(true); expect(res.board[0]).toBe('X');
  const np = nextPlayer('X'); expect(np).toBe('O');
});

test('AI selects a winning move when available', () => {
  // O to play and can win at index 2
  const b = ['O','O',null,'X','X',null,null,null,null];
  const move = getBestMove(b, 'O');
  expect(move).toBe(2);
});

test('AI blocks opponent immediate win', () => {
  // X threatens at index 2
  const b = ['X','X',null,null,'O',null,null,null,null];
  const move = getBestMove(b, 'O');
  expect(move).toBe(2);
});
