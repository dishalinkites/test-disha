(function(){
  const game = (typeof module === 'object' && module.exports) ? require('./game.js') : window.game; // allow direct script if bundled elsewhere
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('reset');
  const vsAiEl = document.getElementById('vs-ai');
  const xScoreEl = document.getElementById('x-score');
  const oScoreEl = document.getElementById('o-score');
  const dScoreEl = document.getElementById('d-score');

  let board = game.createEmptyBoard();
  let current = 'X';
  let over = false;
  let scores = { X:0, O:0, D:0 };

  function render(){
    boardEl.innerHTML = '';
    for(let i=0;i<9;i++){
      const btn = document.createElement('button');
      btn.className = 'cell';
      btn.setAttribute('role','gridcell');
      btn.dataset.index = i;
      btn.textContent = board[i] || '';
      btn.disabled = !!board[i] || over;
      btn.addEventListener('click', onCellClick);
      boardEl.appendChild(btn);
    }
    const w = game.checkWinner(board);
    if(w){ statusEl.textContent = `${w} wins!`; }
    else if(game.isDraw(board)){ statusEl.textContent = 'Draw!'; }
    else { statusEl.textContent = `${current}'s turn${vsAiEl.checked && current==='O' ? ' (AI)' : ''}`; }

    xScoreEl.textContent = String(scores.X);
    oScoreEl.textContent = String(scores.O);
    dScoreEl.textContent = String(scores.D);
  }

  function finishIfOver(){
    const w = game.checkWinner(board);
    if(w){ over = true; scores[w]++; render(); return true; }
    if(game.isDraw(board)){ over = true; scores.D++; render(); return true; }
    return false;
  }

  function onCellClick(e){
    const idx = Number(e.currentTarget.dataset.index);
    const res = game.makeMove(board, idx, current);
    if(!res.ok) return;
    board = res.board;
    if(finishIfOver()) return;
    current = game.nextPlayer(current);
    render();

    if(vsAiEl.checked && current==='O' && !over){
      // AI move after a small delay
      setTimeout(()=>{
        const aiIdx = game.getBestMove(board, 'O');
        const r = game.makeMove(board, aiIdx, 'O');
        if(r.ok){ board = r.board; }
        if(finishIfOver()) return;
        current = game.nextPlayer(current);
        render();
      }, 200);
    }
  }

  function reset(){ board = game.createEmptyBoard(); current = 'X'; over = false; render(); }

  resetBtn.addEventListener('click', reset);
  render();
})();
