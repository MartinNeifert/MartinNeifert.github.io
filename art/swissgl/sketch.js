(function() {
const canvas = document.getElementById('sketch3');
const glsl = SwissGL(canvas);

const numberColors = 10;
const worldExtent = 70.0;
const seed = 123;

const settings = {
    repulsion: 20,
    inertia: 1,
    dt: 0.04,
}

const gui = new dat.GUI();

gui.add(settings, 'repulsion', .1, 100).step(.1);
gui.add(settings, 'inertia', .1, 10).step(.01);
gui.add(settings, 'dt', .001, 1).step(.001);

let showDatGui = document.getElementsByName("showDatGui")[0];
if(showDatGui && showDatGui.content == "false") {
    gui.hide();
} else {
    gui.show();
}

const F = glsl(
    {
        numberColors, 
        FP:`float(I.x==I.y) + 0.3*float(I.x==(I.y+1)%int(numberColors))`
    },
    {size:[numberColors,numberColors], format:'r16f', tag:'F'});

const points = glsl({}, {size:[50,100], story:100,
                        format:'rgba32f', tag:'points'});

glsl({numberColors, seed, FP:`
    vec2 pos = (hash(ivec3(I, seed)).xy-0.5)*10.0;
    float color = floor(UV.x*numberColors);
    FOut = vec4(pos, 0.0, color);`},
    points);

function step() {
    for (let i=0; i<1; ++i)
    glsl({F, worldExtent, repulsion: settings.repulsion/10, inertia: settings.inertia / 10, dt: settings.dt, past: points[1], 
    FP:`
    vec3 wrap(vec3 p) {
        return (fract(p/worldExtent+0.5)-0.5)*worldExtent;
    }
    void fragment() {
        FOut = Src(I);
        vec3 force=vec3(0);
        for (int y=0; y<ViewSize.y; ++y)
        for (int x=0; x<ViewSize.x; ++x) {
            vec4 data1 = Src(ivec2(x,y));
            vec3 dpos = wrap(data1.xyz-FOut.xyz);
            float r = length(dpos);
            if (r>3.0) continue;
            dpos /= r+1e-8;
            float rep = max(1.0-r, 0.0)*repulsion;
            float f = F(ivec2(FOut.w, data1.w)).x;
            float att = f*max(1.0-abs(r-2.0), 0.0);
            force += dpos*(att-rep);
        }
        vec3 vel = wrap(FOut.xyz-past(I).xyz)*pow(inertia, dt);
        FOut.xyz = wrap(FOut.xyz+vel+0.5*force*(dt*dt));
    }
    `}, points);
}

function draw() {
    step();
    glsl({numberColors, worldExtent, points: points[0], Grid: points[0].size,
            Aspect:'cover', Blend: 'd*(1-sa)+s*sa', Inc:`
        varying vec3 color;`, 
        VP:`
        vec4 d = points(ID.xy);
        color = cos((d.w/numberColors+vec3(0,0.33,0.66))*TAU)*0.5+0.5;
        VPos.xy = 2.0*(d.xy+XY/8.0)/worldExtent;`, 
        FP:`color, smoothstep(1.0, 0.5, length(XY))`});
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
})();