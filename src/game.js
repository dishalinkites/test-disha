// Pure game logic (CommonJS for Jest)
const LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diags
];

function createEmptyBoard(){ return Array(9).fill(null); }

function checkWinner(board){
  for(const [a,b,c] of LINES){
    if(board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function isDraw(board){ return !checkWinner(board) && board.every(v => v); }

function availableMoves(board){ return board.map((v,i)=>v?null:i).filter(i=>i!==null); }

function makeMove(board, index, player){
  if(index<0 || index>8) return { board, ok:false };
  if(board[index]) return { board, ok:false };
  const next = board.slice();
  next[index] = player;
  return { board: next, ok:true };
}

function nextPlayer(p){ return p === 'X' ? 'O' : 'X'; }

function score(board, ai){
  const w = checkWinner(board);
  if(w === ai) return 1;
  if(w && w !== ai) return -1;
  if(isDraw(board)) return 0;
  return null;
}

function minimax(board, ai, turn){
  const terminal = score(board, ai);
  if(terminal !== null) return { score: terminal };
  const moves = availableMoves(board);
  let best = { score: turn===ai ? -Infinity : Infinity, index: moves[0] };
  for(const m of moves){
    const { board: nb } = makeMove(board, m, turn);
    const res = minimax(nb, ai, nextPlayer(turn));
    if(turn===ai){
      if(res.score > best.score){ best = { score: res.score, index: m }; }
    } else {
      if(res.score < best.score){ best = { score: res.score, index: m }; }
    }
  }
  return best;
}

function getBestMove(board, aiPlayer){
  return minimax(board, aiPlayer, aiPlayer).index;
}

module.exports = { createEmptyBoard, checkWinner, isDraw, availableMoves, makeMove, nextPlayer, getBestMove };
