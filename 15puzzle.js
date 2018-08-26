//15puzzle
var PICTURE_URL = "mainpic.png";
var BLOCK_W = 150;
var BLOCK_H = 150;
var ROW_COUNT = 4;//列を何枚に切るか
var COL_COUNT = 4;//行を何枚に切るか
var NUM_BLOCKS = ROW_COUNT * COL_COUNT;
var UDLR = [[0, -1],[0, 1],[-1, 0],[1, 0]];
var context, image;
var blocks = [];
var isLock;

function init(){
  var canvas = document.getElementById("gameCanvas");
  if (!canvas.getContext){
    alert("Canvasをサポートしていません！"); return;
  }
  context = canvas.getContext("2d");
  canvas.onmousedown =mouseHandler;
  image = new Image();
  image.src = PICTURE_URL;
  image.onload = initGame(); //元は()がついてない
}

function rand(x){
  return Math.floor(Math.random() * x);
}

function initGame(){
  isLock = true;
  for(var i=0; i<NUM_BLOCKS; i++){
    blocks[i] = i;
  }
  blocks[NUM_BLOCKS - 1] = -1;
  drawPuzzle();
  setTimeout(shufflePuzzle(), 1000); //ここも元は()がない？
}

function shufflePuzzle(){
  var scount = 20;
  var blank = NUM_BLOCKS - 1;
  var shuffle = function(){ //shuffle関数
    scount--;
    if(scount <= 0){
      isLock = false;
      return;
    }
    var r, px, py, no;
    while(1){
      r = rand(UDLR.length);
      px = getCol(blank) + UDLR[r][0];
      py = getRow(blank) + UDLR[r][1];
      if(px < 0 || px >= COL_COUNT) continue;
      if(py < 0 || py >= ROW_COUNT) continue;
      no = getIndex(px, py);
      break;
    }
    blocks[blank] = blocks[no];
    blocks[no] = -1;
    blank = no;
    drawPuzzle();
    setTimeout(shuffle, 100);
  };
  shuffle();
}

function drawPuzzle(){
  for(var i = 0; i < NUM_BLOCKS; i++){
    var dx = (i % COL_COUNT) * BLOCK_W;
    var dy = Math.floor(i / COL_COUNT) * BLOCK_H;
    var no = blocks[i];
    if(no < 0){
      context.fillStyle = "#0000FF";
      context.fillRect(dx, dy, BLOCK_W, BLOCK_H);
    } else{
      var sx = (no % COL_COUNT) * BLOCK_W;
      var sy = Math.floor(no / COL_COUNT) * BLOCK_H;
      context.drawImage(image,
        sx, sy, BLOCK_W, BLOCK_H,
        dx, dy, BLOCK_W, BLOCK_H);
    }
    context.beginPath();
    context.strokeStyle = "white";
    context.lineWidth = 3;
    context.rect(dx, dy, BLOCK_W, BLOCK_H);
    context.stroke();
    context.closePath();
    context.fillStyle = "white";
    context.font = "bold 40px Arial";
    var cx = dx + (BLOCK_W - 40) / 2;
    var cy = dy + BLOCK_H / 2;
    context.fillText(no, cx, cy);
  }
}

function mouseHandler(t){
  if(isLock) return;
  var px = t.offsetX, py = t.offsetY;
  if(px === undefined){
    var p = t.currentTarget;
    px = t.layerX - p.offsetLeft;
    py = t.layerY - p.offsetTop;
  }
  var px2 = Math.floor(px / BLOCK_W);
  var py2 = Math.floor(py / BLOCK_H);
  var no = getIndex(px2, py2);
  if(blocks[no] == -1) return;
  for(var i = 0; i < UDLR.length; i++){
    var pt = UDLR[i];
    var xx = px2 + pt[0];
    var yy = py2 + pt[1];
    var nox = getIndex(xx, yy);
    if(xx < 0 || xx > COL_COUNT) continue;
    if(yy < 0 || yy > ROW_COUNT) continue;
    if(blocks[nox] == -1){
      blocks[nox] = blocks[getIndex(px2, py2)];
      blocks[getIndex(px2, py2)] = -1;
      drawPuzzle();
      checkClear();
      break;
    }
  }
}

function checkClear(){
  var flag = true;
  for(var i = 0; i < (NUM_BLOCKS - 1); i++){
    if(blocks[i] != i){
      flag = false; break;
    }
  }
  if(flag){
    alert("ゲームクリア！！");
    initGame(); //ここは()ついてる！！
  }
}

function getIndex(col, row){
  return row * COL_COUNT + col;
}

function getCol(no){ return no % COL_COUNT;}
function getRow(no){
  return Math.floor(no / COL_COUNT);
}