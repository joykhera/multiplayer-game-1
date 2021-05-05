export default function bounce(circles) {
    for (const circle1 of circles) {
        for (const circle2 of circles) {
            if (circle1 !== circle2) {
                if ((circle1.x - circle2.x) * (circle1.x - circle2.x) + (circle1.y - circle2.y) * (circle1.y - circle2.y) <= (circle1.size + circle2.size) * (circle1.size + circle2.size)) {
                    const vCollision = { x: circle2.x - circle1.x, y: circle2.y - circle1.y }
                    const distance = Math.sqrt((circle2.x - circle1.x) * (circle2.x - circle1.x) + (circle2.y - circle1.y) * (circle2.y - circle1.y))
                    const vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance }
                    const vRelativeVelocity = { x: circle1.velX - circle2.velX, y: circle1.velY - circle2.velY };
                    const speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                    const impulse = 2 * speed / (circle1.size + circle2.size);

                    if (speed < 0) {
                        break;
                    }

                    circle1.velX -= (impulse * circle2.size * vCollisionNorm.x);
                    circle1.velY -= (impulse * circle2.size * vCollisionNorm.y);
                    circle2.velX += (impulse * circle1.size * vCollisionNorm.x);
                    circle2.velY += (impulse * circle1.size * vCollisionNorm.y);
                }
            }
        }
    }
}