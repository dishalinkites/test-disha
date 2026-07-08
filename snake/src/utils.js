(function(root,factory){if(typeof module==='object'&&module.exports){module.exports=factory()}else{root.Utils=factory()}})(typeof self!=='undefined'?self:this,function(){
  function randomGridPosition(gridSize, rng){const r=rng||Math.random;return {x:1+Math.floor(r()*gridSize), y:1+Math.floor(r()*gridSize)}}
  function positionsEqual(a,b){return a&&b&&a.x===b.x&&a.y===b.y}
  function inBounds(pos,gridSize){return pos.x>=1&&pos.x<=gridSize&&pos.y>=1&&pos.y<=gridSize}
  return {randomGridPosition, positionsEqual, inBounds}
});
