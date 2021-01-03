class State {
    constructor(pos, angle) {
        this.pos = pos;
        this.angle = angle;
    }
}

let branchLength = 65;

class LTreeGenerator {
    vertices = [];

    getVertices() {
        return this.vertices;
    }

    constructor(axiom, rule, time) {
        this.sentence = axiom;
        this.time = time;
        this.rule = rule;
    }

    generate() {
        for (let t = 0; t < this.time; t++) {
            branchLength *= 0.6;
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

    makeTree(angle) {
        let currentPos = createVector(0, 0);
        let branchAngle = 0;

        let newX = 0;
        let newY = 0;

        function updateCoords() {
            newX = currentPos.x + sin(branchAngle) * -branchLength;
            newY = currentPos.y + cos(branchAngle) * -branchLength;
        }

        stroke(0);
        strokeWeight(2);
        noFill();

        this.vertices.push([]);

        let j = 0;
        let states = [];
        for (let i = 0; i < this.sentence.length; i++) {
            const current = this.sentence.charAt(i);
            if (current === 'F') {
                this.vertices[j].push({ x: currentPos.x, y: currentPos.y });
                updateCoords();
                currentPos.x = newX;
                currentPos.y = newY;
            } else if (current === '+') {
                branchAngle -= radians(angle);
                updateCoords();
            } else if (current === '-') {
                branchAngle += radians(angle);
                updateCoords();
            } else if (current === '[') {
                states.push(new State(
                    createVector(currentPos.x, currentPos.y),
                    branchAngle));
            } else { // if (current === ']')
                if (this.vertices.length > 0) {
                   let s = states[states.length - 1];
                   currentPos = createVector(s.pos.x, s.pos.y);
                   branchAngle = s.angle;
                   this.vertices.push([]);
                   j++;
                   this.vertices[j].push({ x: currentPos.x, y: currentPos.y});
                   states.pop();
                }
            }
        }
        // console.log(this.vertices);
        return this.vertices;
    }


}
