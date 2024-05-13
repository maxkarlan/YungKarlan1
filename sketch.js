let streams = [];
let circleRadiusOptions = [];
let mainShapes = [];
let randomMovement = true;
let obstacles = [];
let pressCount = 0;
let bgWhite;
const numOfObstacles = 20;  // Or any other number you like
const numOfMainShapes = 3;  // Adjust the number of main shapes you want

function setup() {
    let canvasSize = min(windowWidth, windowHeight);
    createCanvas(canvasSize, canvasSize);
    circleRadiusOptions = [3, 6, 9, 12];

    let shapeTypeOptions = ['circle', 'square', 'triangle'];
    let densityStreams = [300, 750, 1200];
    let numOfStreams = hl.randomElement(densityStreams);
    console.log("density:", numOfStreams);

    let colorGroupFunctions = [redGroup, blueGroup, greenGroup, whiteGroup, purpleGroup, peachGroup, cottonCandyGroup, morningStarGroup];
    let selectedFunction = hl.randomElement(colorGroupFunctions);
    bgWhite = hl.randomBool(0.5);
    console.log("color:", selectedFunction);

    // Generate a random number of main shapes between 1 and 6
    let numOfMainShapes = hl.randomInt(1, 7);

    for (let i = 0; i < numOfMainShapes; i++) {
        let shapeType = hl.randomElement(shapeTypeOptions);
        let circleRadius = width / hl.randomElement(circleRadiusOptions);
        let position = createVector(hl.randomInt(width * .05, width * .95), hl.randomInt(height * .05, height * .95));
        mainShapes.push({ type: shapeType, radius: circleRadius, position: position });
    }

    for (let i = 0; i < numOfStreams; i++) {
        let col = selectedFunction();
        streams.push(new Stream(col));
    }

    for (let i = 0; i < numOfObstacles; i++) {
        obstacles.push(new Obstacle());
    }
}

function redGroup() {
    return color(hl.randomInt(100, 255), 0, hl.randomInt(0, 155));
}

function blueGroup() {
    return color(0, hl.randomInt(0, 155), hl.randomInt(100, 255));
}

function greenGroup() {
    return color(hl.randomInt(0, 155), hl.randomInt(100, 255), 0);
}

function whiteGroup() {
    colorMode(HSB);
    return color(0, 0, hl.randomInt(35, 100));
}

function purpleGroup() {
    return color(220, hl.randomInt(0, 155), hl.randomInt(200, 255));
}

function peachGroup() {
    return color(255, hl.randomInt(75, 155), hl.randomInt(0, 125));
}

function cottonCandyGroup() {
    return color(hl.randomInt(150, 255), hl.randomInt(100, 200), 255);
}

function morningStarGroup() {
    let mainColor = hl.randomBool(0.85);
    if (mainColor) {
        return color(hl.randomInt(0, 255), 0, 0);
    } else {
        return color(255, hl.randomInt(215, 255), 255, 155);
    }
}

function draw() {
    if (bgWhite) {
        background(255);
        fill(0); // color for the frame
    } else {
        background(0);
        fill(255);
    }

    // Draw the frame
    let frameSize = width * 0.05;

    noStroke();
    rectMode(CORNER);
    rect(0, 0, frameSize, height); // left vertical frame
    rect(width - frameSize, 0, width, height); // right vertical frame
    rect(0, 0, width, frameSize); //top horitzontal frame
    rect(0, height - frameSize, width, height); // bottom horizontal frame

    // Draw the main shapes
    for (let shape of mainShapes) {
        noFill();
        noStroke();
        if (shape.type === 'circle') {
            ellipse(shape.position.x, shape.position.y, 2 * shape.radius);
        } else if (shape.type === 'square') {
            rectMode(CENTER);
            rect(shape.position.x, shape.position.y, shape.radius * 2, shape.radius * 2);
        } else if (shape.type === 'triangle') {
            let x1 = shape.position.x, y1 = shape.position.y - shape.radius / sqrt(3);
            let x2 = shape.position.x - shape.radius / 2, y2 = shape.position.y + shape.radius / (2 * sqrt(3));
            let x3 = shape.position.x + shape.radius / 2, y3 = y2;
            triangle(x1, y1, x2, y2, x3, y3);
        }
    }

    for (let s of streams) {
        s.update();
        s.display();
    }
}

function mousePressed() {
    pressCount++;

    if (pressCount % 2 === 0) {
        obstacles = [];  // Clear existing obstacles
        for (let i = 0; i < numOfObstacles; i++) {
            obstacles.push(new Obstacle());
        }
    }

    randomMovement = !randomMovement;
    for (let s of streams) {
        s.changeMovement(randomMovement);
    }

    return false; // This prevents any default behavior
}

class Obstacle {
    constructor() {
        this.position = createVector(hl.randomInt(width), hl.randomInt(height));
        this.radius = hl.randomInt(20, 160);
        while (this.overlapsWithMainShape()) {
            this.position = createVector(hl.randomInt(width), hl.randomInt(height));
        }
    }

    overlapsWithMainShape() {
        for (let shape of mainShapes) {
            if (shape.type === 'circle') {
                if (dist(this.position.x, this.position.y, shape.position.x, shape.position.y) < (shape.radius + this.radius)) {
                    return true;
                }
            } else if (shape.type === 'square') {
                if (this.position.x > shape.position.x - (shape.radius / 2) - this.radius && this.position.x < shape.position.x + (shape.radius / 2) + this.radius &&
                    this.position.y > shape.position.y - (shape.radius / 2) - this.radius && this.position.y < shape.position.y + (shape.radius / 2) + this.radius) {
                    return true;
                }
            } else {
                let x1 = shape.position.x, y1 = shape.position.y - shape.radius / sqrt(3);
                let x2 = shape.position.x - shape.radius / 2, y2 = shape.position.y + shape.radius / (2 * sqrt(3));
                let x3 = shape.position.x + shape.radius / 2, y3 = y2;

                if (pointInTriangle(this.position.x, this.position.y, x1, y1, x2, y2, x3, y3)) {
                    return true;
                }

                if (dist(this.position.x, this.position.y, x1, y1) < this.radius ||
                    dist(this.position.x, this.position.y, x2, y2) < this.radius ||
                    dist(this.position.x, this.position.y, x3, y3) < this.radius) {
                    return true;
                }

                if (circleLineIntersect(this.position.x, this.position.y, this.radius, x1, y1, x2, y2) ||
                    circleLineIntersect(this.position.x, this.position.y, this.radius, x2, y2, x3, y3) ||
                    circleLineIntersect(this.position.x, this.position.y, this.radius, x3, y3, x1, y1)) {
                    return true;
                }
            }
        }

        return false;

        function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
            let v0 = [cx - ax, cy - ay];
            let v1 = [bx - ax, by - ay];
            let v2 = [px - ax, py - ay];

            let dot00 = v0[0] * v0[0] + v0[1] * v0[1];
            let dot01 = v0[0] * v1[0] + v0[1] * v1[1];
            let dot02 = v0[0] * v2[0] + v0[1] * v2[1];
            let dot11 = v1[0] * v1[0] + v1[1] * v1[1];
            let dot12 = v1[0] * v2[0] + v1[1] * v2[1];

            let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
            let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
            let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

            return (u >= 0) && (v >= 0) && (u + v < 1);
        }

        function circleLineIntersect(x0, y0, radius, x1, y1, x2, y2) {
            let dx = x2 - x1;
            let dy = y2 - y1;
            let a = dx * dx + dy * dy;
            let b = 2 * (dx * (x1 - x0) + dy * (y1 - y0));
            let c = x1 * x1 + y1 * y1;
            c += x0 * x0 + y0 * y0;
            c -= 2 * (x1 * x0 + y1 * y0);
            c -= radius * radius;
            let det = b * b - 4 * a * c;

            if (a <= 0.0000001 || det < 0) {
                return false;
            } else if (det === 0) {
                let t = -b / (2 * a);
                return t >= 0 && t <= 1;
            } else {
                let t1 = (-b + sqrt(det)) / (2 * a);
                let t2 = (-b - sqrt(det)) / (2 * a);
                return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
            }
        }
    }

    display() {
        fill(150);
        noStroke();
        ellipse(this.position.x, this.position.y, this.radius * 2);
    }
}

class Stream {
    constructor(color) {
        this.justBounced = false;
        this.color = color;
        this.points = [];
        this.noiseOffset = hl.randomInt(1000);
        this.currentAngle = hl.random(TWO_PI);
        this.initStream();
        this.randomMovement = true;
    }

    initStream() {
        let shape = hl.randomElement(mainShapes);
        let startX, startY;

        if (shape.type === 'circle' || shape.type === 'square') {
            startX = shape.position.x;
            startY = shape.position.y;
        } else if (shape.type === 'triangle') {
            let x1 = shape.position.x, y1 = shape.position.y - shape.radius / sqrt(3);
            let x2 = shape.position.x - shape.radius / 2, y2 = shape.position.y + shape.radius / (2 * sqrt(3));
            let x3 = shape.position.x + shape.radius / 2, y3 = y2;
            startX = (x1 + x2 + x3) / 3;
            startY = (y1 + y2 + y3) / 3;
        }

        this.points.push(createVector(startX, startY));
    }
    
    update() {
        let lastPoint = this.points[this.points.length - 1];

        if (this.insideMainShape || this.randomMovement) {
            let angleVariation = map(noise(this.noiseOffset), 0, 1, -PI / 4, PI / 4);
            this.currentAngle += angleVariation;
        } else {
            this.currentAngle = this.angleToMainShapeBorder(lastPoint);
        }

        if (this.justBounced) {
            this.framesAfterBounce = (this.framesAfterBounce || 0) + 1;
            if (this.framesAfterBounce > 5) {
                this.justBounced = false;
                this.framesAfterBounce = 0;
            }
        } else {
            this.noiseOffset += 0.05;
        }

        let len = 5;
        let newPoint = p5.Vector.fromAngle(this.currentAngle).mult(len).add(lastPoint);

        if (this.isInsideAnyMainShape(newPoint) && !this.insideMainShape && this.randomMovement) {
            let angleToCenter = this.angleToMainShapeBorder(newPoint);
            this.currentAngle = 2 * angleToCenter - PI - this.currentAngle;
            newPoint = p5.Vector.fromAngle(this.currentAngle).mult(len).add(lastPoint);
            this.justBounced = true;
        }

        if (this.isInsideAnyMainShape(newPoint)) {
            this.insideMainShape = true;
        } else {
            this.insideMainShape = false;
        }

        for (let obstacle of obstacles) {
            let distance = dist(lastPoint.x, lastPoint.y, obstacle.position.x, obstacle.position.y);
            if (distance < obstacle.radius) {
                let angleToObstacle = atan2(obstacle.position.x - lastPoint.x, obstacle.position.y - lastPoint.y);
                let deviationAngle = this.currentAngle - angleToObstacle;

                if (abs(deviationAngle) < PI / 2) {
                    this.currentAngle += map(distance, 0, obstacle.radius, -PI / 4, PI / 4);
                } else {
                    this.currentAngle -= map(distance, 0, obstacle.radius, -PI / 4, PI / 4);
                }

                newPoint = p5.Vector.fromAngle(this.currentAngle).mult(len).add(lastPoint);
            }
        }

        if (newPoint.x <= width * (1 / 20) || newPoint.x >= width * (19 / 20)) {
            this.currentAngle = PI - this.currentAngle;
            this.justBounced = true;
        }

        if (newPoint.y <= height * (1 / 20) || newPoint.y >= height * (19 / 20)) {
            this.currentAngle = -this.currentAngle;
            this.justBounced = true;
        }

        newPoint = p5.Vector.fromAngle(this.currentAngle).mult(len).add(lastPoint);

        this.points.push(newPoint);
        if (this.justBounced) {
        } else {
            this.noiseOffset += 0.05;
        }

        if (this.points.length > 100) {
            this.points.shift();
        }
    }

    angleToMainShapeBorder(point) {
        let closestAngle = 0;
        let closestDistance = Infinity;
        for (let shape of mainShapes) {
            let angleToCenter = atan2(shape.position.y - point.y, shape.position.x - point.x);
            let distance = dist(point.x, point.y, shape.position.x, shape.position.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestAngle = angleToCenter;
            }
        }
        return closestAngle;
    }

    changeMovement(randomMovement) {
        this.randomMovement = randomMovement;
        if (randomMovement) {
            this.insideMainShape = false;
        }
    }

    isInsideAnyMainShape(point) {
        for (let shape of mainShapes) {
            if (this.isPointInsideShape(point, shape)) {
                return true;
            }
        }
        return false;
    }

    isPointInsideShape(point, shape) {
        if (shape.type === 'circle') {
            return dist(point.x, point.y, shape.position.x, shape.position.y) < shape.radius;
        } else if (shape.type === 'square') {
            return point.x > shape.position.x - shape.radius / 2 &&
                   point.x < shape.position.x + shape.radius / 2 &&
                   point.y > shape.position.y - shape.radius / 2 &&
                   point.y < shape.position.y + shape.radius / 2;
        } else if (shape.type === 'triangle') {
            let x1 = shape.position.x - shape.radius / 2;
            let y1 = shape.position.y + shape.radius / 2;
            let x2 = shape.position.x + shape.radius / 2;
            let y2 = shape.position.y + shape.radius / 2;
            let x3 = shape.position.x;
            let y3 = shape.position.y - shape.radius / 2;
            return this.pointInTriangle(point.x, point.y, x1, y1, x2, y2, x3, y3);
        }
        return false;
    }

    pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
        let v0 = [cx - ax, cy - ay];
        let v1 = [bx - ax, by - ay];
        let v2 = [px - ax, py - ay];

        let dot00 = v0[0] * v0[0] + v0[1] * v0[1];
        let dot01 = v0[0] * v1[0] + v0[1] * v1[1];
        let dot02 = v0[0] * v2[0] + v0[1] * v2[1];
        let dot11 = v1[0] * v1[0] + v1[1] * v1[1];
        let dot12 = v1[0] * v2[0] + v1[1] * v2[1];

        let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return (u >= 0) && (v >= 0) && (u + v < 1);
    }

    display() {
        noFill();
        stroke(this.color);
        strokeWeight(1);
        beginShape();
        for (let pt of this.points) {
            vertex(pt.x, pt.y);
        }
        endShape();
    }
}



