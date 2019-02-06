 
function TriangleTexture( p5 ) {
  var rows = 5;
  var cols = 5;
  var fields = new Array(rows * cols);
  var fieldSize = 70;
  var xOff = 50;
  var yOff = 50;

  p5.setup = function() {
    p5.createCanvas(500, 500);
    var n = 0;
    for(var i = 0; i < rows; i++){
      for(var j = 0; j < cols; j++){
        fields[n] = new Field(j*fieldSize, i*fieldSize, fieldSize, fieldSize, 2, 4, p5);
        n++;
      }
    }
  };

  p5.draw = function(){
    p5.translate(p5.mouseX/15 + xOff, p5.mouseY/15 + yOff);
    p5.clear();
    for(var i = 0; i < fields.length; i++){
      fields[i].step();
    }
    for(var i = 0; i < fields.length; i++){
      drawTriangleTexture(fields[i]);
    }
  };

  p5.mouseClicked = function(){
    p5.setup();
  };

  function drawTriangleTexture(field){
    var c;
    var x0, y0, x1, y1, x2, y2, x3, y3;
    var numNodes = field.numNodes;
    var particles = field.particles;
    var xOffset = field.xOffset;
    var yOffset = field.yOffset;
    var r = field.r;
    var g = field.g;
    var b = field.b;
    for(var i = 0; i < numNodes; i++){
      x0 = particles[i].neighbors[0].x;
      x1 = particles[i].neighbors[1].x;
      x2 = particles[i].neighbors[2].x;
      x3 = particles[i].neighbors[3].x;
      y0 = particles[i].neighbors[0].y;
      y1 = particles[i].neighbors[1].y;
      y2 = particles[i].neighbors[2].y;
      y3 = particles[i].neighbors[3].y;

      //stroke(c);
      p5.beginShape(p5.TRIANGLE_FAN);
      p5.vertex(particles[i].x + xOffset, particles[i].y + yOffset);
      c = p5.color(r/(i+1), g/(i+1), b/(i+1));
      p5.fill(c);
      p5.vertex(x0 + xOffset, y0 + yOffset);
      p5.vertex(x1 + xOffset, y1 + yOffset);
      c = p5.color(.6*r/(i+1), .6*g/(i+1), .6*b/(i+1));
      p5.fill(c);
      p5.vertex(x2 + xOffset, y2 + yOffset);
      c = p5.color(.25*r/(i+1), .25*g/(i+1), .25*b/(i+1));
      p5.fill(c);
      p5.vertex(x3 + xOffset, y3 + yOffset);
      c = p5.color(.4*r/(i+1), .4*g/(i+1), .4*b/(i+1));
      p5.fill(c);
      p5.vertex(x0 + xOffset, y0 + yOffset);
      p5.endShape();
    }
  };
};
