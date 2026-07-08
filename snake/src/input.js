(function(){
  const keyMap={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',a:'left',s:'down',d:'right',W:'up',A:'left',S:'down',D:'right'};
  window.Input={
    bind(game){
      document.addEventListener('keydown',(e)=>{
        if(keyMap[e.key]){ e.preventDefault(); window.dispatchEvent(new CustomEvent('dir',{detail:keyMap[e.key]})); }
        else if(e.key===' '){ e.preventDefault(); window.dispatchEvent(new Event('toggle-pause')); }
        else if(e.key==='r'||e.key==='R'){ e.preventDefault(); window.dispatchEvent(new Event('restart')); }
      });
      const dpad=document.getElementById('dpad');
      if(dpad){ dpad.addEventListener('touchstart',(e)=>{ const t=e.target.closest('button[data-dir]'); if(t){ e.preventDefault(); window.dispatchEvent(new CustomEvent('dir',{detail:t.dataset.dir})) } },{passive:false}); }
    }
  }
})();
