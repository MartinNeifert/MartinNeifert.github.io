var rows = 5;
var cols = 5;
var fields = new Array(rows * cols)
var fieldSize = 70
var xOff = 20
var yOff = 20

function setup(){
  var canvas = createCanvas(500, 500);
  canvas.parent('TriangleTexture');
  var n = 0;
  
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      fields[n] = new Field(j*fieldSize, i*fieldSize, fieldSize, fieldSize, false, 2, 4);
      n++;
    }
  }  
}

function draw(){
  translate(mouseX/15 + xOff, mouseY/15 + yOff);
  applyMatrix(1, 0, 0, 1, mouseX/2000, 0);
  clear();
  for(var i = 0; i < fields.length; i++){
    fields[i].step();
  }
  for(var i = 0; i < fields.length; i++){
    fields[i].draw();
  }
}

function mouseClicked(){
  setup();
}