
class Field{

  constructor (xOffset, yOffset, xMax, yMax, numNodes, numNeighbors, p5){
    this.p5 = p5;
    var self = this;
    this.speedDif = 30;
    this.speedScale = 3;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.xMax = xMax;
    this.yMax = yMax;
    this.numNodes = numNodes;
    this.particles = new Array(numNodes);
    this.numNeighbors = numNeighbors;
    this.r = p5.random(255);
    this.g = p5.random(255);
    this.b = p5.random(255);
    var i;
    for(i = 0; i < numNodes; i ++){
      var p = new Object();
      p.x = p5.random(xMax);
      p.y = p5.random(yMax);
      p.speed = p5.random(this.maxSpeed) / this.speedScale;
      p.xDir = p5.random(2) - 1;
      p.yDir = p5.random(2) - 1;
      this.particles[i] = p;
    }
  }
  
  

  applyMovement(p){ 
    var xMax = this.xMax;
    var yMax = this.yMax;

    p.x = (p.x + (p.speed * p.xDir));
    p.y = (p.y + (p.speed * p.yDir));
    if(p.x < 0){
      p.x = 0;
      p.xDir = -p.xDir;
    }
    if(p.y < 0){
      p.y = 0;
      p.yDir = -p.yDir;
    }
    if(p.x > xMax){
      p.x = xMax;
      p.xDir = -p.xDir;
    }
    if(p.y > yMax){
      p.y = yMax;
      p.yDir = -p.yDir;
    }
  }

  getNeighbors(p){
    var neighbors = new Array(this.numNeighbors);
    var currDist = new Array(this.numNeighbors);
    var tmp;
    var xMax = this.xMax;
    var yMax = this.yMax;
    var numNodes = this.numNodes;
    for(var i = 0; i < currDist.length; i++){
      currDist[i] = 9999999;
    }
    for(var i = 0; i < neighbors.length; i++){
      neighbors[i] = null;
    }
    
    for(var i = 0; i < numNodes; i++){
      if(this.particles[i] != p){
        tmp = Math.sqrt(Math.pow((p.x - this.particles[i].x), 2) + Math.pow((p.y - this.particles[i].y), 2));

        if(this.particles[i].x <= p.x && this.particles[i].y <= p.y && tmp < currDist[0]){
          currDist[0] = tmp;
          neighbors[0] = this.particles[i];
        }
        else if(this.particles[i].x >= p.x && this.particles[i].y <= p.y && tmp < currDist[1]){
          currDist[1] = tmp;
          neighbors[1] = this.particles[i];
        }
        else if(this.particles[i].x >= p.x && this.particles[i].y >= p.y && tmp < currDist[2]){
          currDist[2] = tmp;
          neighbors[2] = this.particles[i];
        }
        else if(this.particles[i].x <= p.x && this.particles[i].y >= p.y && tmp < currDist[3]){
          currDist[3] = tmp;
          neighbors[3] = this.particles[i];
        }
      }
    }
    for(var i = 0; i < neighbors.length; i++){
      if(neighbors[i] == null){
         var t = new Object();
        switch(i){
          case 0:
            neighbors[i] = t;
            t.x = 0;
            t.y = 0;
            break;
          case 1:
            neighbors[i] = t;
            t.x = xMax;
            t.y = 0;
            break;
          case 2:
            neighbors[i] = t;
            t.x = xMax;
            t.y = yMax;
            break;
          case 3:
            neighbors[i] = t;
            t.x = 0;
            t.y = yMax;
            break;
        }
      }
    }
    p.neighbors = neighbors;
  }
  
  maxArrayVal(arr){
    var val = arr[0];
    for(var i = 1; i < arr.length; i++){
      if(arr[i] > val) val = arr[i];
    }
    return val;
  }
  
  step() {
    for(var i = 0; i < this.numNodes; i++){
      this.applyMovement(this.particles[i]);
      
    }
    for(var i = 0; i < this.numNodes; i++){
      this.getNeighbors(this.particles[i]);
    }
  }
}
