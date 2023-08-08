const s2 = ( sketch ) => {

    var divWidth;
    var divHeight;
    var sentence;
    var len;
    var angle;

    function init() {
        let b = document.getElementById("sketch2");
        divWidth = b.clientWidth;
        divHeight = b.clientHeight;
    }

    sketch.setup = () => {
        init();
        var canvas = sketch.createCanvas(divWidth, divHeight);
        canvas.parent('sketch2');
        sketch.background(255);

        // setup l system
        let axiom = "X";
        let rules = [];
        rules[0] = {
            a: "F",
            b: "FF"
        };
        rules[1] = {
            a: "X",
            b: "F-[[X]+X]+F[+FX]-X"
        };

        len = 5;
        angle = sketch.radians(25);
        sentence = axiom;
        for(let i = 0; i < 4; i++) {
            let nextSentence = "";
            for(let j = 0; j < sentence.length; j++) {
                let current = sentence.charAt(j);
                let found = false;
                for(let k = 0; k < rules.length; k++) {
                    if(current == rules[k].a) {
                        found = true;
                        nextSentence += rules[k].b;
                        break;
                    }
                }
                if(!found) {
                    nextSentence += current;
                }
            }
            sentence = nextSentence;
        }
    }

    sketch.draw = () => {
        //draw sentence

        // rotate angle based on time
        let time = sketch.millis();
        angle = sketch.radians(30 + sketch.sin(time / 100) * .2 );
        sketch.background(255);
        sketch.resetMatrix();
        sketch.translate(sketch.width / 2, sketch.height);
        sketch.stroke(0);
        for(let i = 0; i < sentence.length; i++) {
            let current = sentence.charAt(i);
            if(current == "F") {
                sketch.rotate(sketch.radians(sketch.sin(time / 1000) * .5 ));
                sketch.line(0, 0, 0, -len);
                sketch.translate(0, -len);
            } else if(current == "+") {
                sketch.rotate(angle);
            } else if(current == "-") {
                sketch.rotate(-angle);
            } else if(current == "[") {
                sketch.push();
            } else if(current == "]") {
                sketch.pop();
            }
        }
    };
};

let sketch2 = new p5(s2, document.getElementById('sketch2'));