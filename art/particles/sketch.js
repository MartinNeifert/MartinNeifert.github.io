const viewAngle = 0.1
const lookAheadPixels = 50;

const settings = {
    numberParticles: 200,
    numberColors: 1,
    fadeFactor: 20,
    particleSize: 10,
    velocity: 2,
    followFactor: 1,
};

function Particle(x, y, color) {
	this.pos = new p5.Vector(x, y);
	this.vel = p5.Vector.random2D()
    this.color = color;
	
	this.move = function() {
		this.pos.add(this.vel);
	}
}

const colors = [];
const particles = [];
let previousPixels;

function init() {
    particles.length = 0;
    colors.length = 0;

    for(let i = 0; i < settings.numberColors; i++) {
        colors.push(color(random(255), random(255), random(255)));
    }

    for(let i = 0; i < settings.numberParticles; i++) {
        particles.push(new Particle(random(windowWidth), random(windowHeight), colors[Math.floor(Math.random() * colors.length)]));
    }
}

function randomPositions() {
    background(0);
    particles.length = 0;
    for(let i = 0; i < settings.numberParticles; i++) {
        particles.push(new Particle(random(windowWidth), random(windowHeight), colors[Math.floor(Math.random() * colors.length)]));
    }
}

function randomColors() {
    colors.length = 0;

    for(let i = 0; i < settings.numberColors; i++) {
        colors.push(color(random(255), random(255), random(255)));
    }

    for(let i = 0; i < settings.numberParticles; i++) {
        particles[i].color = colors[Math.floor(Math.random() * colors.length)];
    }
}

function setup() {
    
    init();
    createCanvas(windowWidth, windowHeight);
    background(0);

    let gui_col = new dat.GUI();
    gui_col.add(settings, 'numberParticles', 0, 2000);
    gui_col.add(settings, 'numberColors', 1, 100).step(1);
    gui_col.add(settings, 'fadeFactor', 1, 100).step(1);
    gui_col.add(settings, 'particleSize', 1, 1000).step(1);
    gui_col.add(settings, 'velocity', 0, 10);
    gui_col.add(settings, 'followFactor', 0, 10);

    var randPositions = { randomPositions:function(){ randomPositions() }};
    var randColors = { randomColors:function(){ randomColors() }};
    gui_col.add(randPositions,'randomPositions');
    gui_col.add(randColors,'randomColors');
}

function draw() {

    if(particles.length < settings.numberParticles) {
        for(let i = 0; i < settings.numberParticles - particles.length; i++) {
            particles.push(new Particle(random(windowWidth), random(windowHeight), colors[Math.floor(Math.random() * colors.length)]));
        }
    }
    if(particles.length > settings.numberParticles) {
        particles.splice(settings.numberParticles, particles.length - settings.numberParticles);
    }

    if(colors.length != settings.numberColors) {
        init();
    }

	noStroke();
    background(0,settings.fadeFactor);

    previousPixels = get();
    previousPixels.loadPixels();
    runParticles(particles);
};

function runParticles(particles) {
    for(let i = 0; i < particles.length; i++) {
        fill(particles[i].color);
        currentVector = createVector(particles[i].color[0], particles[i].color[1], particles[i].color[2]);

        // draw circle
        ellipse(particles[i].pos.x, particles[i].pos.y, settings.particleSize, settings.particleSize);
        const colorA = previousPixels.get(
            particles[i].vel.x * lookAheadPixels + particles[i].pos.x, 
            particles[i].vel.y * lookAheadPixels + particles[i].pos.y);
        const vectorA = createVector(colorA[0], colorA[1], colorA[2]);
        const distanceA = currentVector.dist(vectorA);

        //rotate the angle vector by 5 degrees
        particles[i].vel.rotate(viewAngle);
        const colorB = previousPixels.get(
            particles[i].vel.x * lookAheadPixels + particles[i].pos.x, 
            particles[i].vel.y * lookAheadPixels + particles[i].pos.y);
        const vectorB = createVector(colorB[0], colorB[1], colorB[2]);
        const distanceB = currentVector.dist(vectorB);

        particles[i].vel.rotate(-1 * viewAngle * 2);
        const colorC = previousPixels.get(
            particles[i].vel.x * lookAheadPixels + particles[i].pos.x, 
            particles[i].vel.y * lookAheadPixels + particles[i].pos.y);
        const vectorC = createVector(colorC[0], colorC[1], colorC[2]);
        const distanceC = currentVector.dist(vectorC);

        particles[i].vel.rotate(viewAngle);

        if(distanceB > distanceA && distanceB > distanceC) {
            particles[i].vel.rotate(1 * viewAngle);
            particles[i].vel.rotate(random(-.08, .08));
        }
        else if(distanceC > distanceA && distanceC > distanceB){
            particles[i].vel.rotate(-1 * viewAngle);
            particles[i].vel.rotate(random(-.08, .08));
        } else if(distanceA > distanceB && distanceA > distanceC) {
            particles[i].vel.rotate(random(-.08 * settings.followFactor, .08 * settings.followFactor));
        } else {
            particles[i].vel.rotate(random(-.3, .3));
        }

        particles[i].pos.x += settings.velocity * particles[i].vel.x;
        if(particles[i].pos.x > width || particles[i].pos.x < 0) {
            particles[i].vel.x = -particles[i].vel.x;
        }

        particles[i].pos.y += settings.velocity * particles[i].vel.y;
        if(particles[i].pos.y > height || particles[i].pos.y < 0) {
            particles[i].vel.y = -particles[i].vel.y;
        }

    }
}

//adjust canvas size on window resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}