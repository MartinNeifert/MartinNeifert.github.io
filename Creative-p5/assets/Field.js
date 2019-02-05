
class Field{

  constructor (xOffset, yOffset, xMax, yMax, sameDir, numNodes, numNeighbors){
    var self = this;
    this.speedDif = 30;
    this.speedScale = 7;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.xMax = xMax;
    this.yMax = yMax;
    this.sameDir = sameDir;
    this.numNodes = numNodes;
    this.particles = new Array(numNodes);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    var i;
    for(i = 0; i < numNodes; i ++){
      this.particles[i] = new Particle(xMax, yMax, this.speedDif, this.speedScale, numNeighbors, sameDir, numNodes, this.particles);
    }
  }
  
  drawTriangles(){
    var c;
    var x0, y0, x1, y1, x2, y2, x3, y3;
    var numNodes = this.numNodes;
    var particles = this.particles;
    var xOffset = this.xOffset;
    var yOffset = this.yOffset;
    var r = this.r;
    var g = this.g;
    var b = this.b;
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
      beginShape(TRIANGLE_FAN);
      vertex(particles[i].x + xOffset, particles[i].y + yOffset);
      c = color(r/(i+1), g/(i+1), b/(i+1));
      fill(c);
      vertex(x0 + xOffset, y0 + yOffset);
      vertex(x1 + xOffset, y1 + yOffset);
      c = color(.6*r/(i+1), .6*g/(i+1), .6*b/(i+1));
      fill(c);
      vertex(x2 + xOffset, y2 + yOffset);
      c = color(.25*r/(i+1), .25*g/(i+1), .25*b/(i+1));
      fill(c);
      vertex(x3 + xOffset, y3 + yOffset);
      c = color(.4*r/(i+1), .4*g/(i+1), .4*b/(i+1));
      fill(c);
      vertex(x0 + xOffset, y0 + yOffset);
      endShape();
    }
  }

  
  draw() {
    this.drawTriangles();
    //drawSquares();
  }
  
  step() {
    for(var i = 0; i < this.numNodes; i++){
      this.particles[i].applyMovement();
    }
    for(var i = 0; i < this.numNodes; i++){
      this.particles[i].getNeighbors();
    }
  }
}
