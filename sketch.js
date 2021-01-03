
const snowAxiom = "F--F--F";
const snowSentence = snowAxiom;

const ltrees = [];
const snowlines = [];
const linesize = snowlines.length;

class Rule {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

const treerule = new Rule('F', "FF+[+F-F-F]-[-F+F+F]");
const snowrule = new Rule('F', "F+F--F+F");

const maker = new LTreeGenerator('F', treerule, 4);

function setup() {
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
}

function draw() {
    background(0);
    image(tree, 0, 0);
}


