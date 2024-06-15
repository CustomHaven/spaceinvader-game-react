class Player {
  constructor(canvas) {
      this.velocity = {
              x: 0,
              y: 0
      };
      this.ctx = canvas.getContext("2d");
      this.rotation = 0;
      this.opacity = 1;
      this.position = {
          x: 0,
          y: 0
      }

      const image = new Image();
      image.src = "/assets/spaceship.png";
      this.image = image;
      this.width = 0;
      this.height = 0;


      image.onload = () => {
          const scale = 15; // keep it at this scale for now!
          // this.image = this.image;
          this.width = image.width / scale;
          this.height = image.height / scale;

          this.position = {
              x: (canvas.width / 2) - (this.width / 2),
              y: canvas.height - this.height - 5
          }
      }
  }

  draw(alpha) {
      this.opacity = alpha;
      this.ctx.save();
      this.ctx.globalAlpha = this.opacity;

      this.ctx.translate(
          this.position.x + this.width / 2,
          this.position.y + this.height / 2
      );

      this.ctx.rotate(this.rotation);
      this.ctx.translate(
          -this.position.x - this.width / 2,
          -this.position.y - this.height / 2
      );

      this.ctx.drawImage(
          this.image,
          this.position.x,
          this.position.y,
          this.width,
          this.height
      );
      this.ctx.restore();
  }

  update(alpha) {
      if (this.image) {
          this.position.x += this.velocity.x;
          this.draw(alpha);
      }
  }
}

export default Player;