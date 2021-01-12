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


