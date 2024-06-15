import InvaderProjectile from "./invaderprojectile";

class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }

        this.position = {
            x: 0,
            y: 0
        }

        this.speed = 0


        const image = new Image();
        image.src = "/assets/invader.png";
        this.image = image;
        this.width = 0;
        this.height = 0;

        image.onload = () => {
            const scale = 0.6;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;

            this.position = {
                x: position.x ,
                y: position.y 
            }
        }
    }


    draw(ctx) {
        ctx.save();
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        ctx.restore();
    }

    update(ctx, {velocity}) {
        if (this.image) {
            this.draw(ctx);
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

    shoot(invaderProjectile) {
        this.speed =+ 0.1
        invaderProjectile.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 0.5
            }
        }))
    }
}


export default Invader;