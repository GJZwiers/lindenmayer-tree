let snowflakes = [];

class Rule {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

function createShape(options) {
    let shape = createGraphics(640, 640);
    shape.noFill();
    shape.stroke(166, 42, 42);
    shape.strokeWeight(2);
    shape.translate(width / 3, height);
    
    return shape;
}

function setup() {
    const treerule = new Rule('F', "FF+[+F-F-F]-[-F+F+F]");
    const snowrule = new Rule('F', "F+F--F+F");
    const maker = new LTreeGenerator('F', treerule, 4);
    const flakeMaker = new SnowFlakeMaker("F--F--F", snowrule, 4);

    createCanvas(640, 640);
    translate(width / 3, height);

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

    flake = createGraphics(150, 150);

    flakeMaker.generate();
    let snowVerts = flakeMaker.makeFlake(1.2);
    
    flake.beginShape();
    flake.fill(color(255, 195));    // noFill
    flake.noStroke();
    for (let i = 0; i < snowVerts.length; i++) {
        flake.vertex(snowVerts[i].x, snowVerts[i].y);
    }
    flake.endShape();
    
    for (let i = 0; i < 500; i++) {
        snowflakes.push(new FractalSnowFlake(flake));
    }

    gravity = createVector(0, 0.2);
    breeze = createVector(0.2, 0);
}

function draw() {
    background(0);
    image(tree, 0, 0);
    // image(flake, 50, 50);
    
    for (const flake of snowflakes) {
        flake.applyForce(gravity);
        flake.applyForce(breeze);
        flake.update();
        flake.show();
    }
}


