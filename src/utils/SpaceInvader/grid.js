import Invader from "./invader";

class Grid {
    constructor(coordinates) {
        this.position = {
            x: 0, //0,//canva.width / 2, 240
            y: 0, //0,//20, 88
        }
        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = [];

        this.width = 240 + 15;
        // this.height 

        coordinates.forEach(coordinate => {
            this.invaders.push(new Invader({
                position: {
                    x: coordinate.x,
                    y: coordinate.y - 20
                }
            }));
        });
    }

    draw() {
        
    }

    update(canvas) {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width ||
            this.position.x <= -42) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 3;
        }
    }
}

export default Grid;