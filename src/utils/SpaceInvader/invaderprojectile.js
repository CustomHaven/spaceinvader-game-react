import Projectile from "./projectile";

class InvaderProjectile extends Projectile {
    constructor({ position, velocity, fades, color = "blue", radius }) {
        super({ position, velocity, fades, color, radius })
        this.width = 3;
        this.height = 10;
    }

}

export default InvaderProjectile;