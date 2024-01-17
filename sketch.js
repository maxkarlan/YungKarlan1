let streams = [];
let circleRadiusOptions = [];
let circleRadius;
let shapeType;
let randomMovement = true;
let obstacles = [];
let pressCount = 0;
let bgWhite;
const numOfObstacles = 20;  // Or any other number you like


function setup() {
    let canvasSize = min(windowWidth, windowHeight);
    createCanvas(canvasSize, canvasSize);
    circleRadiusOptions = [3, 6, 12];
    circleRadius = width / hl.randomElement(circleRadiusOptions);

    let shapeTypeOptions = ['circle', 'square', 'triangle'];
    shapeType = hl.randomElement(shapeTypeOptions);
    console.log("radius:", circleRadius);
    let densityStreams = [150, 450, 750];
    let numOfStreams = hl.randomElement(densityStreams);
    console.log("density:", numOfStreams);
    let colorGroupFunctions = [redGroup, blueGroup, greenGroup, whiteGroup, purpleGroup, peachGroup, cottonCandyGroup, morningStarGroup];
    let selectedFunction = hl.randomElement(colorGroupFunctions);
    bgWhite = hl.randomBool(0.5);
    console.log("color:", selectedFunction);
    // console.log(selectedFunction, "color");
    for (let i = 0; i < numOfStreams; i++) {
        let col = selectedFunction();
        streams.push(new Stream(col));
    }
    for (let i = 0; i < numOfObstacles; i++) {
        obstacles.push(new Obstacle());
    }
}

function redGroup () {
    return col = color(hl.randomInt(100, 255), 0, hl.randomInt(0,155));
}

function blueGroup () {
    return col = color(0, hl.randomInt(0, 155), hl.randomInt(100, 255));
}

function greenGroup () {
    return col = color(hl.randomInt(0, 155), hl.randomInt(100, 255), 0);
}

function whiteGroup () {
    colorMode(HSB);
    return col = color(0, 0, hl.randomInt(35,100));
}

function purpleGroup() {
    return col = color(220, hl.randomInt(0, 155), hl.randomInt(200, 255));
}

function peachGroup() {
    return col = color(255, hl.randomInt(75, 155), hl.randomInt(0, 125));
}

function cottonCandyGroup() {
    return col = color(hl.randomInt(150, 255), hl.randomInt(100, 200), 255);
}

function morningStarGroup() {
    let mainColor = hl.randomBool(0.85);
    if (mainColor) {
        return col = color(hl.randomInt(0, 255), 0, 0);
    } else {
        return col = color(255, hl.randomInt(215, 255), 255, 155);
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
    let frameSize = width * (1/20);

    noStroke();
    rect(frameSize * (3/4), frameSize * (3/4), frameSize/4, height - frameSize * (3/2));
    rect(width - (frameSize), frameSize * (3/4), frameSize/4, height - frameSize * (3/2));
    rect(frameSize * (3/4), frameSize * (3/4), width - frameSize * (3/2), frameSize/4);
    rect(frameSize * (3/4), height - (frameSize), width - frameSize * (3/2), frameSize/4);

            // Draw the circle in the center of the window
            noFill();
            noStroke();
            ellipse(width / 2, height / 2, 2 * circleRadius);

            for (let s of streams) {
                s.update();
                s.display();
            }
        }

function mousePressed() {
    pressCount++;

    if (pressCount % 2 === 0) {
        // Every other time starting from the second time
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
        if (shapeType === 'circle') {
            return dist(this.position.x, this.position.y, width / 2, height / 2) < (circleRadius + this.radius);
        } else if (shapeType === 'square') {
            // Can rename variable later, but let's say that `circleRadius` is the side length of the square
            return this.position.x > (width / 2) - (circleRadius / 2) - this.radius && this.position.x < (width / 2) + (circleRadius / 2) + this.radius && this.position.y > (height / 2) - (circleRadius / 2) - this.radius && this.position.y < (height / 2) + (circleRadius / 2) + this.radius;
        } else {
            // Can rename variable later, but `circleRadius` is the side length of the triangle
            // Define the vertices of the triangle
            let x1 = width / 2, y1 = height / 2 - circleRadius / sqrt(3);
            let x2 = width / 2 - circleRadius / 2, y2 = height / 2 + circleRadius / (2 * sqrt(3));
            let x3 = width / 2 + circleRadius / 2, y3 = y2;

            // Check if the circle's center is inside the triangle
            if (pointInTriangle(this.position.x, this.position.y, x1, y1, x2, y2, x3, y3)) {
                return true;
            }

            // Check if any of the triangle's vertices are inside the circle
            if (dist(this.position.x, this.position.y, x1, y1) < this.radius ||
                dist(this.position.x, this.position.y, x2, y2) < this.radius ||
                dist(this.position.x, this.position.y, x3, y3) < this.radius) {
                return true;
            }

            // Check if the circle intersects with any of the triangle's edges
            return circleLineIntersect(this.position.x, this.position.y, this.radius, x1, y1, x2, y2) ||
                circleLineIntersect(this.position.x, this.position.y, this.radius, x2, y2, x3, y3) ||
                circleLineIntersect(this.position.x, this.position.y, this.radius, x3, y3, x1, y1);
        }

                // Function to check if a point is inside a triangle
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

        // Function to check if a line segment intersects a circle
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
                // No real solutions.
                return false;
            } else if (det == 0) {
                // One solution.
                let t = -b / (2 * a);
                return t >= 0 && t <= 1;
            } else {
                // Two solutions.
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
    let startX, startY;
    do {
        startX = hl.random(width);
        startY = hl.random(height);
    } while (!this.isInsideShape(createVector(startX, startY))); // changed this condition

    this.points.push(createVector(startX, startY));
}

            update() {
                let lastPoint = this.points[this.points.length - 1];

    if (this.insideCircle) {
        // Random movement inside the circle
        let angleVariation = map(noise(this.noiseOffset), 0, 1, -PI / 4, PI / 4);
        this.currentAngle += angleVariation;
    } else if (this.randomMovement) {
        // Scatter movement
        let angleVariation = map(noise(this.noiseOffset), 0, 1, -PI / 4, PI / 4);
        this.currentAngle += angleVariation;
    } else {
        // Magnetized movement towards the circle
        this.currentAngle = this.angleToCircleBorder(lastPoint);
    }

    if (this.justBounced) {
        // Disable noise influence for some frames after bouncing
        // You can adjust the number of frames as needed
        this.framesAfterBounce = (this.framesAfterBounce || 0) + 1;
        if (this.framesAfterBounce > 5) {  // Example: 10 frames
            this.justBounced = false;
            this.framesAfterBounce = 0;
        }
    } else {
        this.noiseOffset += 0.05;  // Update noise offset if not recently bounced
    }
              

    let len = 5;
    let newPoint = p5.Vector.fromAngle(this.currentAngle).mult(len).add(lastPoint);

              
              
    if (this.isInsideShape(newPoint) && !this.insideCircle && this.randomMovement) {
        // If the stream is about to enter the circle and is not allowed to, bounce it away
        let angleToCenter = this.angleToCircleBorder(newPoint);
        this.currentAngle = 2 * angleToCenter - PI - this.currentAngle;
        newPoint = p5.Vector.fromAngle(this.currentAngle).mult(len).add(lastPoint);
        this.justBounced = true;
    }

    if (this.isInsideShape(newPoint)) {
        this.insideCircle = true;
    } else {
        this.insideCircle = false;
    }
if (!this.isInsideShape(newPoint)) {
    for (let obstacle of obstacles) {
        let distance = dist(lastPoint.x, lastPoint.y, obstacle.position.x, obstacle.position.y);
        if (distance < obstacle.radius) {
            // Repulsion effect
            let angleToObstacle = atan2(obstacle.position.x - lastPoint.x, obstacle.position.y - lastPoint.y);
            let deviationAngle = this.currentAngle - angleToObstacle;

            if (abs(deviationAngle) < PI / 2) {
                this.currentAngle += map(distance, 0, obstacle.radius, -PI / 4, PI / 4);
            } else {
                this.currentAngle -= map(distance, 0, obstacle.radius, -PI / 4, PI / 4);
            }

            // Update newPoint after obstacle interaction
            newPoint = p5.Vector.fromAngle(this.currentAngle).mult(len).add(lastPoint);

        }
    }
}

          
                // Bounce off the canvas boundaries
                if (newPoint.x <= width * (1/20) || newPoint.x >= width * (19/20)) {
                    this.currentAngle = PI - this.currentAngle;
                    this.justBounced = true;
                }
                if (newPoint.y <= height * (1/20) || newPoint.y >= height * (19/20)) {
                    this.currentAngle = - this.currentAngle;
                    this.justBounced = true;
                }
              
                newPoint = p5.Vector.fromAngle(this.currentAngle).mult(len).add(lastPoint);

                // Check again if new point is outside the boundary, and adjust if necessary
                if (newPoint.x <= width * (1/20) || newPoint.x >= width * (19/20) || newPoint.y <= height * (1/20) || newPoint.y >= height * (19/20)) {
                    newPoint = p5.Vector.fromAngle(this.currentAngle).mult(len).add(lastPoint);
                }

                this.points.push(newPoint);
                if (this.justBounced) {

                } else {
                this.noiseOffset += 0.05;
                }

                if (this.points.length > 100) {
                    this.points.shift();
                }
            }
          
            angleToCircleBorder(point) {
                return atan2(height / 2 - point.y, width / 2 - point.x);
            }
          
            changeMovement(randomMovement) {
                this.randomMovement = randomMovement;
                if (randomMovement) {
                    this.insideCircle = false; // Ensure stream is set as outside the circle
                }
            }
          
            isInsideShape(point) {
                if (shapeType === 'circle') {
                    return dist(point.x, point.y, width / 2, height / 2) < circleRadius;
                } else if (shapeType === 'square') {
                    // Can rename variable later, but let's say that `circleRadius` is the side length of the square
                    return point.x > width / 2 - circleRadius / 2 && point.x < width / 2 + circleRadius / 2 && point.y > height / 2 - circleRadius / 2 && point.y < height / 2 + circleRadius / 2;
                } else if (shapeType === 'triangle') {
                    // Can rename variable later, but `circleRadius` is the side length of the triangle
                    // See if point is within the triangle
                    let x1 = width / 2 - circleRadius / 2;
                    let y1 = height / 2 + circleRadius / 2;
                    let x2 = width / 2 + circleRadius / 2;
                    let y2 = height / 2 + circleRadius / 2;
                    let x3 = width / 2;
                    let y3 = height / 2 - circleRadius / 2;
                    let denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
                    let a = ((y2 - y3) * (point.x - x3) + (x3 - x2) * (point.y - y3)) / denominator;
                    let b = ((y3 - y1) * (point.x - x3) + (x1 - x3) * (point.y - y3)) / denominator;
                    let c = 1 - a - b;
                    return 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1;
                }
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