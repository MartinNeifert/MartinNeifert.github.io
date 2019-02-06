
function WaterWindow( p5 ) {
  var rows = 8;
  var cols = 8;
  var numThreads = 4;
  var fields = new Array(rows * cols);
  var p;
  var fieldSize = 100;
  var xOff = 50;
  var yOff = 50;
  var imgs = ["Creative-p5/WaterWindow/img/HtxiYED.jpg",
              "Creative-p5/WaterWindow/img/oPm033N.jpg",
              "Creative-p5/WaterWindow/img/w2VUppj.jpg"];
  var img = 0;
  var loaded = new Array(imgs.length);
  
  p5.setup = function(){
    p5.createCanvas(1000, 1000);
    var n = 0;
    for(var i = 0; i < rows; i++){
      for(var j = 0; j < cols; j++){
        fields[n] = new Field(j*fieldSize, i*fieldSize, fieldSize, fieldSize, 3, 4, p5);
        n++;
      }
    }
    for(var i = 0; i < imgs.length; i++){
      loaded[i] = p5.loadImage(imgs[i]);
    }
    p = loaded[img];
    img = (img+1) % loaded.length;
  };
  
  p5.draw = function(){
    p5.scale(.5);
    p5.translate(p5.mouseX/15 + xOff, p5.mouseY/15 + yOff);
    p5.background(255)
    p5.image(p, 0, 0);
    for(var i = 0; i < fields.length; i++){
      fields[i].step();
      for(var j = 0; j < fields[i].particles.length; j ++){
        getFill(fields[i], j);
      }
    }
    drawFields();
  };
  
  function drawFields(){
    for(var i = 0; i < fields.length; i++){
      drawSquares(fields[i]);
    }
  };

  function getFill(field, i){
    var r, g, b, c0, c1, c2, c3;

    c0 = p.get((field.particles[i].neighbors[0].x + field.xOffset), (field.particles[i].neighbors[0].y + field.yOffset));
    c1 = p.get((field.particles[i].neighbors[1].x + field.xOffset), (field.particles[i].neighbors[1].y + field.yOffset));
    c2 = p.get((field.particles[i].neighbors[2].x + field.xOffset), (field.particles[i].neighbors[2].y + field.yOffset));
    c3 = p.get((field.particles[i].neighbors[3].x + field.xOffset), (field.particles[i].neighbors[3].y + field.yOffset));

    r = p5.red(c0) * p5.red(c0) + p5.red(c1) * p5.red(c1) + p5.red(c2) * p5.red(c2) + p5.red(c3) * p5.red(c3);
    g = p5.green(c0) * p5.green(c0) + p5.green(c1) * p5.green(c1) + p5.green(c2) * p5.green(c2) + p5.green(c3) * p5.green(c3);
    b = p5.blue(c0) * p5.blue(c0) + p5.blue(c1) * p5.blue(c1) + p5.blue(c2) * p5.blue(c2) + p5.blue(c3) * p5.blue(c3);
    field.particles[i].c = p5.color(p5.sqrt(r)/2, p5.sqrt(g)/2, p5.sqrt(b)/2);
  }

  function drawSquares(field){
    var x0, y0, x1, y1, x2, y2, x3, y3;
    for(var i = 0; i < field.numNodes; i++){

      x0 = field.particles[i].neighbors[0].x;
      x1 = field.particles[i].neighbors[1].x;
      x2 = field.particles[i].neighbors[2].x;
      x3 = field.particles[i].neighbors[3].x;

      y0 = field.particles[i].neighbors[0].y;
      y1 = field.particles[i].neighbors[1].y;
      y2 = field.particles[i].neighbors[2].y;
      y3 = field.particles[i].neighbors[3].y;
      p5.fill(field.particles[i].c);
      p5.stroke(field.particles[i].c);
      p5.quad(x0 + field.xOffset, y0 + field.yOffset, x1 + field.xOffset, y1 + field.yOffset, x2 + field.xOffset, y2 + field.yOffset, x3 + field.xOffset, y3 + field.yOffset);
    }
  }
  p5.mouseClicked = function(){
    p = loaded[img];
    img = (img+1) % loaded.length;
  };
}
