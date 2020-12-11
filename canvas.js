const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.backgroundColor = 'lightblue';

window.addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

const colors = ['#468966', '#FFF0A5', '#FFB03B', '#B64926', '#8E2800'];

function distance(x1, y1, x2, y2) {
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;
  const squareSum = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);
  const distance = Math.sqrt(squareSum);

  return distance;
}

function Particle(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.mass = 1;
  this.velocity = {
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
  };
  this.color = colors[Math.floor(Math.random() * colors.length)];

  this.draw = () => {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.strokeStyle = 'blue';
    ctx.fillStyle = this.color;
    ctx.fill();
    // ctx.stroke();
  };

  this.update = (particles) => {
    this.draw();

    for (let i = 0; i < particles.length; i++) {
      const nearParticle = particles[i];

      if (this.x === nearParticle.x) continue;

      if (
        distance(this.x, this.y, nearParticle.x, nearParticle.y) -
          this.radius -
          nearParticle.radius <=
        0
      ) {
        // console.log('collided');
        const res = {
          x: this.velocity.x - nearParticle.velocity.x,
          y: this.velocity.y - nearParticle.velocity.y,
        };

        if (
          res.x * (nearParticle.x - this.x) +
            res.y * (nearParticle.y - this.y) >=
          0
        ) {
          const { x, y } = this.velocity;
          this.velocity.x = nearParticle.velocity.x;
          this.velocity.y = nearParticle.velocity.y;
          nearParticle.velocity.x = x;
          nearParticle.velocity.y = y;
        }
      }
    }

    if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
      this.velocity.y = -this.velocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };
}

let particles = [];
function init() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    const radius = Math.random() * 15 + 5;
    let x = Math.random() * (canvas.width - 2 * radius) + radius;
    let y = Math.random() * (canvas.height - 2 * radius) + radius;
    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (
          distance(x, y, particles[j].x, particles[j].y) -
            radius -
            particles[j].radius <
          0
        ) {
          x = Math.random() * (canvas.width - 2 * radius) + radius;
          y = Math.random() * (canvas.height - 2 * radius) + radius;

          j = -1;
        }
      }
    }
    particles.push(new Particle(x, y, radius));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);

  particles.forEach((particle) => {
    particle.update(particles);
  });
}

init();
animate();
