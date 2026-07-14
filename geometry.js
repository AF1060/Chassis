// 2D Geometry primitives

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    toSVGPoints() {
        return [
            { x: this.x, y: this.y },
            { x: this.x + this.w, y: this.y },
            { x: this.x + this.w, y: this.y + this.h },
            { x: this.x, y: this.y + this.h }
        ];
    }

    area() { return this.w * this.h; }
}

class Circle {
    constructor(cx, cy, r) {
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    area() { return Math.PI * this.r * this.r; }
}

class Polygon {
    constructor(points) {
        this.points = points || [];
    }

    area() {
        let a = 0;
        const n = this.points.length;
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            a += this.points[i].x * this.points[j].y;
            a -= this.points[j].x * this.points[i].y;
        }
        return Math.abs(a / 2);
    }
}

// Utility: distance between two points
function dist(p1, p2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

// Utility: point on line segment at parameter t (0..1)
function lerp(p1, p2, t) {
    return { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
}
