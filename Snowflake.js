const snowAxiom = "F--F--F";
const snowSentence = snowAxiom;

class FractalSnowFlake {
    alpha = random(180, 240);
    pos = createVector(random(width), random(-11, 300));
    limitVel = random(0.5, 3.2);
    vel = createVector(0, limitVel);
    acc = createVector(0, 0);
    r = floor(random(6));
    index = int(map(velo.y, 0.5, 3.2, 0, 6));

    show() {
        push();
        translate(pos.x, pos.y);
        shape(snowshape);
        pop();
    }

    reset() {
        this.pos.y = random(-50, -1);
    }

    update() {
        this.vel.add(acc);
        this.vel.limit(limitVel);
        this.pos.add(vel);
        if (this.pos.x > width) {
            this.pos.x = random(-40, -10);
        }
        this.acc.mult(0);
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

    makeFlake(size) {
        let newX = 0;
        let newY = 0;
        let angle = 0;
        let currentPos = createVector(0, 0);
        let flakeSize = size;

        let vertices = [];
        flakeSize += 0.25;

        fill(color(255, 175));
        beginShape();
        stroke(color(255));
        strokeWeight(5);

        for (let j = 0; j < this.sentence.length; j++) {
            let current =  this.sentence.charAt(j);
            if (current == 'F') {
                newX = currentPos.x + (cos(angle) * 0 + sin(angle) * (currentPos.y-flakeSize-currentPos.y));
                newY = currentPos.y + (-sin(angle) * 0 + cos(angle) * (currentPos.y-flakeSize-currentPos.y));
                vertices.push({ x: newX, y: newY} );
                currentPos.x = newX;
                currentPos.y = newY;
            } else if (current == '+') {
                angle -= radians(60);
                newX = currentPos.x + (cos(angle) * 0 + sin(angle) * (currentPos.y-flakeSize -currentPos.y));
                newY = currentPos.y + (-sin(angle) * 0 + cos(angle) * (currentPos.y-flakeSize -currentPos.y));
            } else if (current == '-') {
                angle += radians(60);
                newX = currentPos.x + (cos(angle) * 0 + sin(angle) * (currentPos.y-flakeSize -currentPos.y));
                newY = currentPos.y + (-sin(angle) * 0 + cos(angle) * (currentPos.y-flakeSize -currentPos.y));
            }
        }
        
        return vertices;
    }
}
