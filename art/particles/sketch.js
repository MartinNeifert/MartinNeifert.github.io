const s1 = ( sketch ) => {
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

    var divWidth;
    var divHeight;

    function init() {
        particles.length = 0;
        colors.length = 0;

        let b = document.getElementById("sketch");
        divWidth = b.clientWidth;
        divHeight = b.clientHeight;
        for(let i = 0; i < settings.numberColors; i++) {
            colors.push(sketch.color(sketch.random(255), sketch.random(255), sketch.random(255)));
        }

        for(let i = 0; i < settings.numberParticles; i++) {
            particles.push(new Particle(sketch.random(divWidth), sketch.random(divHeight), colors[sketch.floor(sketch.random() * colors.length)]));
        }
    }

    function randomPositions() {
        sketch.background(255);
        particles.length = 0;
        for(let i = 0; i < settings.numberParticles; i++) {
            particles.push(new Particle(sketch.random(divWidth), sketch.random(divHeight), colors[sketch.floor(sketch.random() * colors.length)]));
        }
    }

    function randomColors() {
        colors.length = 0;

        for(let i = 0; i < settings.numberColors; i++) {
            colors.push(sketch.color(sketch.random(255), sketch.random(255), sketch.random(255)));
        }

        for(let i = 0; i < settings.numberParticles; i++) {
            particles[i].color = colors[sketch.floor(sketch.random() * colors.length)];
        }
    }

    sketch.setup = () => {
        
        init();
        var canvas = sketch.createCanvas(divWidth, divHeight);
        canvas.parent('sketch');
        sketch.background(255);

        let numParticles = document.getElementsByName("numberParticles")[0];
        settings.numberParticles = numParticles ? +numParticles.content : settings.numberParticles;

        let numColors = document.getElementsByName("numberColors")[0];
        settings.numberColors = numColors ? +numColors.content : settings.numberColors;

        let fadeFactor = document.getElementsByName("fadeFactor")[0];
        settings.fadeFactor = fadeFactor ? +fadeFactor.content : settings.fadeFactor;

        let particleSize = document.getElementsByName("particleSize")[0];
        settings.particleSize = particleSize ? +particleSize.content : settings.particleSize;
        
        let velocity = document.getElementsByName("velocity")[0];
        settings.velocity = velocity ? +velocity.content : settings.velocity;

        let followFactor = document.getElementsByName("followFactor")[0];
        settings.followFactor = followFactor ? +followFactor.content : settings.followFactor;

        let gui = new dat.GUI();
        gui.add(settings, 'numberParticles', 0, 10000);
        gui.add(settings, 'numberColors', 1, 100).step(1);
        gui.add(settings, 'fadeFactor', 1, 100).step(1);
        gui.add(settings, 'particleSize', 1, 1000).step(1);
        gui.add(settings, 'velocity', 0, 10);
        gui.add(settings, 'followFactor', 0, 10);

        var randPositions = { randomPositions:function(){ randomPositions() }};
        var randColors = { randomColors:function(){ randomColors() }};
        gui.add(randPositions,'randomPositions');
        gui.add(randColors,'randomColors');

        let showDatGui = document.getElementsByName("showDatGui")[0];
        if(showDatGui && showDatGui.content == "false") {
            gui.hide();
        } else {
            gui.show();
        }
    }

    sketch.draw = () => {

        if(particles.length < settings.numberParticles) {
            for(let i = 0; i < settings.numberParticles - particles.length; i++) {
                particles.push(new Particle(sketch.random(divWidth), sketch.random(divHeight), colors[sketch.floor(sketch.random() * colors.length)]));
            }
        }
        if(particles.length > settings.numberParticles) {
            particles.splice(settings.numberParticles, particles.length - settings.numberParticles);
        }

        if(colors.length != settings.numberColors) {
            init();
        }

        sketch.noStroke();
        sketch.background(255,settings.fadeFactor);

        previousPixels = sketch.get();
        previousPixels.loadPixels();
        runParticles(particles);
    };

    function runParticles(particles) {
        for(let i = 0; i < particles.length; i++) {
            sketch.fill(particles[i].color);
            currentVector = sketch.createVector(particles[i].color[0], particles[i].color[1], particles[i].color[2]);

            // draw circle
            sketch.ellipse(particles[i].pos.x, particles[i].pos.y, settings.particleSize, settings.particleSize);
            const colorA = previousPixels.get(
                particles[i].vel.x * lookAheadPixels + particles[i].pos.x, 
                particles[i].vel.y * lookAheadPixels + particles[i].pos.y);
            const vectorA = sketch.createVector(colorA[0], colorA[1], colorA[2]);
            const distanceA = (colorA[0] > 225 && colorA[1] > 220 && colorA[2] > 220) ? 0 : currentVector.dist(vectorA);

            //rotate the angle vector by 5 degrees
            particles[i].vel.rotate(viewAngle);
            const colorB = previousPixels.get(
                particles[i].vel.x * lookAheadPixels + particles[i].pos.x, 
                particles[i].vel.y * lookAheadPixels + particles[i].pos.y);
            const vectorB = sketch.createVector(colorB[0], colorB[1], colorB[2]);
            const distanceB = (colorB[0] > 225 && colorB[1] > 220 && colorB[2] > 220) ? 0 : currentVector.dist(vectorB);

            particles[i].vel.rotate(-1 * viewAngle * 2);
            const colorC = previousPixels.get(
                particles[i].vel.x * lookAheadPixels + particles[i].pos.x, 
                particles[i].vel.y * lookAheadPixels + particles[i].pos.y);
            const vectorC = sketch.createVector(colorC[0], colorC[1], colorC[2]);
            const distanceC = (colorC[0] > 225 && colorC[1] > 220 && colorC[2] > 220) ? 0 : currentVector.dist(vectorC);

            particles[i].vel.rotate(viewAngle);

            if(distanceB > distanceA && distanceB > distanceC) {
                particles[i].vel.rotate(1 * viewAngle);
                particles[i].vel.rotate(sketch.random(-.08, .08));
            }
            else if(distanceC > distanceA && distanceC > distanceB){
                particles[i].vel.rotate(-1 * viewAngle);
                particles[i].vel.rotate(sketch.random(-.08, .08));
            } else if(distanceA > distanceB && distanceA > distanceC) {
                particles[i].vel.rotate(sketch.random(-.08 * settings.followFactor, .08 * settings.followFactor));
            } else {
                particles[i].vel.rotate(sketch.random(-.3, .3));
            }

            particles[i].pos.x += settings.velocity * particles[i].vel.x;
            if(particles[i].pos.x > sketch.width || particles[i].pos.x < 0) {
                particles[i].vel.x = -particles[i].vel.x;
            }

            particles[i].pos.y += settings.velocity * particles[i].vel.y;
            if(particles[i].pos.y > sketch.height || particles[i].pos.y < 0) {
                particles[i].vel.y = -particles[i].vel.y;
            }
        }
    }

    //adjust canvas size on window resize
    sketch.windowResized = () => {
        let b = document.getElementById("sketch");
        divWidth = b.clientWidth;
        divHeight = b.clientHeight;
        sketch.resizeCanvas(divWidth, divHeight);
    }
};

let sketch = new p5(s1, document.getElementById('sketch'));