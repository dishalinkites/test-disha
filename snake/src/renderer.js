(function(){
  function drawGrid(ctx,size,cell){ ctx.strokeStyle='#1a1a1f'; ctx.lineWidth=1; for(let i=0;i<=size;i++){ ctx.beginPath(); ctx.moveTo(i*cell+0.5,0); ctx.lineTo(i*cell+0.5,size*cell); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i*cell+0.5); ctx.lineTo(size*cell,i*cell+0.5); ctx.stroke(); } }
  function drawSnake(ctx,snake,cell){ ctx.fillStyle='#6dfc6d'; for(let i=snake.length-1;i>=0;i--){ const s=snake[i]; ctx.fillStyle= i===0? '#2bd1ff' : '#6dfc6d'; ctx.fillRect((s.x-1)*cell+1,(s.y-1)*cell+1,cell-2,cell-2); } }
  function drawFood(ctx,food,cell){ ctx.fillStyle='#ff5c5c'; ctx.beginPath(); const x=(food.x-0.5)*cell, y=(food.y-0.5)*cell; ctx.arc(x,y,cell*0.35,0,Math.PI*2); ctx.fill(); }
  window.Renderer={
    render(ctx, game, sizePx){ const cell=Math.floor(sizePx/game.gridSize); ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); drawGrid(ctx,game.gridSize,cell); drawSnake(ctx,game.snake,cell); drawFood(ctx,game.food,cell); }
  }
})();
