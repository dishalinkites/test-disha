(function(){
  const canvas=document.getElementById('game'); const ctx=canvas.getContext('2d');
  const scoreEl=document.getElementById('score'); const speedEl=document.getElementById('speed');
  const pauseBtn=document.getElementById('pauseBtn'); const restartBtn=document.getElementById('restartBtn');
  const game=new window.Game({gridSize:21});
  window.Input.bind(game);
  let paused=false; let interval=140; let acc=0; let last=performance.now();
  function updateSpeed(){ const level=1+Math.floor(game.score/5); speedEl.textContent=level+"x"; interval=Math.max(60,140- (level-1)*10); }
  function togglePause(){ paused=!paused; pauseBtn.textContent=paused? 'Resume':'Pause'; }
  pauseBtn.addEventListener('click',togglePause); restartBtn.addEventListener('click',()=>{ game.reset(); paused=false; pauseBtn.textContent='Pause'; scoreEl.textContent='0'; updateSpeed(); });
  window.addEventListener('toggle-pause',togglePause);
  window.addEventListener('restart',()=>{ game.reset(); paused=false; pauseBtn.textContent='Pause'; scoreEl.textContent='0'; updateSpeed(); });
  window.addEventListener('dir',(e)=>{ game.changeDirection(e.detail) });
  function loop(now){ const dt=now-last; last=now; acc+=dt; while(acc>=interval){ game.step(); acc-=interval; }
    if(game.gameOver){ paused=true; }
    if(!paused){ scoreEl.textContent=String(game.score); updateSpeed(); }
    window.Renderer.render(ctx,game,Math.min(canvas.width,canvas.height)); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
})();
