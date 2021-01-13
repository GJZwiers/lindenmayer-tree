let distantFlakes = [];
let nearFlakes = [];
let slider;

class Rule {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

class LTreeGenerator {
    vertices = [];
    branchLength;

    getVertices() {
        return this.vertices;
    }

    constructor(axiom, rule, time, branchlength) {
        this.sentence = axiom;
        this.rule = rule;
        this.time = time;
        this.branchLength = branchlength;
    }

    generate() {
        for (let t = 0; t < this.time; t++) {
            this.branchLength *= 0.6;
            this.sentence = this.evolveSentence();
        }
    }

    evolveSentence() {
        let nextSentence = "";
        for (let i = 0; i < this.sentence.length; i++) {
            const current = this.sentence.charAt(i);
            if (current === this.rule.a) {
                nextSentence += this.rule.b;
            } else {
                nextSentence += current;
            }
        }
        return nextSentence;
    }

    make(angle) {
        angle = radians(angle);
        this.vertices.push([]);
        let currentPos = createVector(0, 0);
        let states = [];
        let branchAngle = 0;
        let j = 0;

        for (let i = 0; i < this.sentence.length; i++) {
            const current = this.sentence.charAt(i);
            if (current === 'F') {
                this.vertices[j].push({ x: currentPos.x, y: currentPos.y });
                currentPos.x += sin(branchAngle) * -this.branchLength;
                currentPos.y += cos(branchAngle) * -this.branchLength;
            } else if (current === '+') {
                branchAngle -= angle;
            } else if (current === '-') {
                branchAngle += angle;
            } else if (current === '[') {
                states.push({
                    pos: createVector(currentPos.x, currentPos.y),
                    angle: branchAngle });
            } else { // if (current === ']')
                const s = states[states.length-1];
                currentPos = createVector(s.pos.x, s.pos.y);
                branchAngle = s.angle;
                this.vertices.push([]);
                j++;
                this.vertices[j].push({ x: currentPos.x, y: currentPos.y});
                states.pop();
            }
        }

        return this.vertices;
    }
}


class FractalSnowFlake {
    constructor(image) {
        this.image = image;
        this.limitVel = random(0.9, 1.6);
        this.alpha = random(180, 240);
        this.r = floor(random(2, 8));
        this.pos = createVector(random(width), random(-50, 640));
        this.vel = createVector(0, this.limitVel);
        this.acc = createVector(0, 0);
        this.index = int(map(this.vel.y, 0.5, 3.2, 0, 6));
    }

    show() {
        push();
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
        pop();
    }

    reset() {
        this.pos.y = random(-50, -1);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.limitVel);
        this.pos.add(this.vel);
        this.acc.mult(0);

        if (this.pos.x > width) {
            this.pos.x = random(-40, -10);
        }
        if (this.pos.y > height) {
            this.pos.y = random(0, 1);
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }
}

class SnowFlakeMaker {
    constructor(axiom, rule, time) {
        this.sentence = axiom;
        this.rule = rule;
        this.time = time;
    }

    generate() {
        for (let t = 0; t < this.time; t++) {
            this.sentence = this.evolveSentence();
        }
    }

    evolveSentence() {
        let nextSentence = "";
        for (let i = 0; i < this.sentence.length; i++) {
            const current = this.sentence.charAt(i);
            if (current === this.rule.a) {
                nextSentence += this.rule.b;
            } else {
                nextSentence += current;
            }
        }
        return nextSentence;
    }

    make(size) {
        let currentPos = createVector(0, 0);
        let angle = 0;
        let newX = 0;
        let newY = 0;
        let len = size;

        let vertices = [];
        len += 0.25;

        for (let j = 0; j < this.sentence.length; j++) {
            let current =  this.sentence.charAt(j);
            if (current == 'F') {
                newX = currentPos.x + sin(angle) * len;
                newY = currentPos.y + cos(angle) * len;
                vertices.push({ x: currentPos.x, y: currentPos.y });
                currentPos.x = newX;
                currentPos.y = newY;
            } else if (current == '+') {
                angle -= radians(60);
            } else if (current == '-') {
                angle += radians(60);
            }
        }
        
        return vertices;
    }
}



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


