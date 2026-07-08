const Game = require('../src/game.js');

function seededRng(seed){ let x=seed>>>0; return function(){ x^=x<<13; x^=x>>>17; x^=x<<5; return (x>>>0)/4294967296; } }

describe('Game basics', ()=>{
  test('initializes within bounds and length 1', ()=>{
    const g=new Game({gridSize:21, rng:seededRng(1)});
    expect(g.snake.length).toBe(1);
    const h=g.snake[0];
    expect(h.x).toBeGreaterThanOrEqual(1); expect(h.x).toBeLessThanOrEqual(21);
    expect(h.y).toBeGreaterThanOrEqual(1); expect(h.y).toBeLessThanOrEqual(21);
    expect(g.gameOver).toBe(false);
  });
  test('step advances according to direction', ()=>{
    const g=new Game({gridSize:10, rng:seededRng(2)});
    const h0={...g.snake[0]}; g.step(); const h1=g.snake[0];
    expect(h1.x).toBe(h0.x+1); expect(h1.y).toBe(h0.y);
  });
  test('grows by 1 when eating food', ()=>{
    const g=new Game({gridSize:10, rng:seededRng(3)});
    const head=g.snake[0]; g.food={x:head.x+1,y:head.y}; g.step();
    expect(g.score).toBe(1); expect(g.snake.length).toBe(2);
  });
  test('collision sets gameOver', ()=>{
    const g=new Game({gridSize:5, rng:seededRng(4)});
    g.snake=[{x:3,y:3},{x:2,y:3},{x:1,y:3}]; g.direction={x:1,y:0}; g.nextDir={x:1,y:0};
    g.step(); // move to (4,3)
    g.changeDirection('down'); g.step(); // (4,4)
    g.changeDirection('left'); g.step(); // (3,4)
    g.changeDirection('up'); g.step(); // (3,3) -> collide with body
    expect(g.gameOver).toBe(true);
  });
  test('placeFood avoids snake cells', ()=>{
    const g=new Game({gridSize:8, rng:seededRng(5)});
    g.snake=[{x:4,y:4},{x:3,y:4},{x:2,y:4}];
    for(let i=0;i<50;i++){ g.placeFood(); expect(g.snake.some(s=>s.x===g.food.x&&s.y===g.food.y)).toBe(false); }
  });
});
