const ltrees = [];
const snowlines = [];
const linesize = snowlines.length;

class Rule {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

function setup() {
    const treerule = new Rule('F', "FF+[+F-F-F]-[-F+F+F]");
    const snowrule = new Rule('F', "F+F--F+F");
    const maker = new LTreeGenerator('F', treerule, 4);
    const flakeMaker = new SnowFlakeMaker("F--F--F", snowrule, 2);

    createCanvas(640, 640);
    translate(width / 3, height);

    tree = createGraphics(640, 640);
    tree.noFill();
    tree.stroke(166, 42, 42);
    tree.strokeWeight(2);
    tree.translate(width / 3, height);

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
    flake.fill(color(255, 195));
    flake.stroke(color(255));
    flake.strokeWeight(1);
    flake.translate(width / 3, height / 2);

    flakeMaker.generate();
    //for (let i = 0; i < 6; i++) {
        let snowVerts = flakeMaker.makeFlake(1.2);
        flake.beginShape();
        console.log(snowVerts);
        for (let i = 0; i < snowVerts.length; i++) {
            flake.vertex(snowVerts[i].x, snowVerts[i].y);
        }
        flake.endShape();
    //}

}

function draw() {
    background(0);
    image(tree, 0, 0);
    image(flake, 0, 0);
}


