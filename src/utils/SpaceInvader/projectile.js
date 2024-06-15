class Projectile {
  constructor({ position, velocity, fades = true, color = "red", radius = 2 }) {
      this.position = position;
      this.velocity = velocity;

      this.radius = radius;
      this.opacity = 1;
      this.fades = fades;
      this.color = color;
  }

  draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = this.opacity;
      ctx.arc(
          this.position.x,
          this.position.y,
          this.radius,
          0,
          Math.PI * 2
      );
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
      ctx.globalAlpha = 1;
      ctx.restore();
  }

  update(ctx) {
      this.draw(ctx);
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      if (this.fades) {
          this.opacity -= 1;
      }
  }
}

export default Projectile;