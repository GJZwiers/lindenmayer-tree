let snowflakes = [];
let distantFlakes = [];
let nearFlakes = [];
let slider;

class Rule {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

function setup() {
    const treerule = new Rule('F', "FF+[+F-F-F]-[-F+F+F]");
    const snowrule = new Rule('F', "F+F--F+F");
    const branchLength = 65;
    const maker = new LTreeGenerator('F', treerule, 4, branchLength);
    const flakeMaker = new SnowFlakeMaker("F--F--F", snowrule, 4);

    createCanvas(640, 640);
    //translate(width/3, height);

    tree = createShape();

    maker.generate();
    let verts = maker.makeTree(random(16, 32));

    for (let i = 0; i < verts.length; i++) {
        tree.beginShape();
        for (let j = 0; j < verts[i].length; j++) {
            tree.vertex(verts[i][j].x, verts[i][j].y);
        }
        tree.endShape();
    }

    flake = createGraphics(640, 640);
    flake.translate(width/3, height);

    flakeMaker.generate();
    let snowVerts = flakeMaker.makeFlake(1.2);
    
    flake.beginShape();
    flake.fill(color(255, 195));    // noFill
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
        //snowflakes.push();
    }

    gravity = createVector(0, 0.2);
    breeze = createVector(0.2, 0);

    slider = createSlider(1, 1000, 150);

    console.log(nearFlakes.length);
    console.log(distantFlakes.length);
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
    //let max = map(val, 1, val / 2, 1, distantFlakes.length);    // 500, 1, 250, 1, 709
    //console.log(max);
    for (let i = 0; i < max; i++) {
        distantFlakes[i].applyForce(gravity);
        distantFlakes[i].applyForce(breeze);
        distantFlakes[i].update();
        distantFlakes[i].show();
    }
    fill(255, 255, 255);
    rect(0, height - 5, 640, 6);
    image(tree, 0, 0);
    
    for (let i = 0; i < max2; i++) {
        nearFlakes[i].applyForce(gravity);
        nearFlakes[i].applyForce(breeze);
        nearFlakes[i].update();
        nearFlakes[i].show();
    }

}


