(function(root,factory){if(typeof module==='object'&&module.exports){module.exports=factory()}else{root.Game=factory()}})(typeof self!=='undefined'?self:this,function(){
  const Utils=(typeof require==='function'? (function(){try{return require('./utils.js')}catch(e){return (typeof Utils!=='undefined'?Utils:null)}})(): (typeof Utils!=='undefined'?Utils:null));
  class Game{
    constructor({gridSize=21, rng=Math.random}={}){
      this.gridSize=gridSize; this.rng=rng; this.reset();
    }
    reset(){
      this.direction={x:1,y:0}; this.nextDir={x:1,y:0};
      const mid=Math.ceil(this.gridSize/2);
      this.snake=[{x:mid,y:mid}]; this.growBy=0;
      this.score=0; this.gameOver=false; this.placeFood();
    }
    changeDirection(dir){
      const map={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
      const nd=map[dir]||dir; if(!nd) return;
      if(this.direction.x+nd.x===0 && this.direction.y+nd.y===0) return; // prevent reverse
      this.nextDir=nd;
    }
    step(){ if(this.gameOver) return;
      this.direction=this.nextDir;
      const head=this.snake[0]; const newHead={x:head.x+this.direction.x,y:head.y+this.direction.y};
      if(!Utils.inBounds(newHead,this.gridSize) || this.isCollision(newHead)){ this.gameOver=true; return; }
      this.snake.unshift(newHead);
      if(this.willEatFood(newHead)) { this.score++; this.growBy+=1; this.placeFood(); }
      if(this.growBy>0){ this.growBy--; } else { this.snake.pop(); }
    }
    isCollision(pos){ for(let i=0;i<this.snake.length;i++){ if(Utils.positionsEqual(this.snake[i],pos)) return true } return false }
    willEatFood(head){ return Utils.positionsEqual(head,this.food) }
    placeFood(){
      let tries=0; do{ this.food=Utils.randomGridPosition(this.gridSize,this.rng); tries++; if(tries>1000) break } while(this.snake.some(s=>s.x===this.food.x&&s.y===this.food.y));
    }
  }
  return Game;
});
