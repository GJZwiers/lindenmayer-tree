let distantFlakes = [];
let nearFlakes = [];
let slider;

function setup() {
    const axiom = 'F';
    const treerule = new Rule(axiom, "FF+[+F-F-F]-[-F+F+F]");
    const branchLength = 65;
    const cycles = 4;
    const treeMaker = new LTreeGenerator(axiom, treerule, cycles, branchLength);

    const snowrule = new Rule(axiom, "F+F--F+F");
    const flakeMaker = new SnowFlakeMaker("F--F--F", snowrule, cycles);

    createCanvas(640, 640);

    tree = createShape();

    treeMaker.generate();
    let verts = treeMaker.make(random(16, 32));

    for (let i = 0; i < verts.length; i++) {
        tree.beginShape();
        for (let j = 0; j < verts[i].length; j++) {
            tree.vertex(verts[i][j].x, verts[i][j].y);
        }
        tree.endShape();
    }

    flake = createGraphics(150, 150);
    flake.translate(width/3, height);

    flakeMaker.generate();
    let snowVerts = flakeMaker.make(1.2);
    
    flake.beginShape();
    flake.fill(color(255, 195));
    flake.noStroke();
    for (let i = 0; i < snowVerts.length; i++) {
        flake.vertex(snowVerts[i].x, snowVerts[i].y);
    }
    flake.endShape();
    
    for (let i = 0; i < 1000; i++) {
        let fl = new FractalSnowFlake(flake);
        if (fl.r >= 6) {
            nearFlakes.push(fl);
        } else {
            distantFlakes.push(fl);
        }
    }

    gravity = createVector(0, 0.2);
    wind = createVector(0.2, 0);

    slider = createSlider(1, 1000, 150);
}

function createShape(options) {
    let shape = createGraphics(640, 640);
    shape.noFill();
    shape.stroke(166, 42, 42);
    shape.strokeWeight(2);
    shape.translate(width/3, height);
    
    return shape;
}

function draw() {
    background(0);
    let val = slider.value();
    let max = (val > distantFlakes.length) ? distantFlakes.length : val;
    let max2 = (val > nearFlakes.length) ? nearFlakes.length : val;

    for (let i = 0; i < max; i++) {
        distantFlakes[i].applyForce(gravity);
        distantFlakes[i].applyForce(wind);
        distantFlakes[i].update();
        distantFlakes[i].show();
    }
    
    fill(255, 255, 255);
    rect(0, height - 5, 640, 6);
    image(tree, 0, 0);
    
    for (let i = 0; i < max2; i++) {
        nearFlakes[i].applyForce(gravity);
        nearFlakes[i].applyForce(wind);
        nearFlakes[i].update();
        nearFlakes[i].show();
    }
}


