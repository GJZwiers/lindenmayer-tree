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
