import Projectile from "./projectile";

class Particle extends Projectile {
    constructor({ position, velocity, fades, color, radius }) {
        super({ position, velocity, fades, color, radius });
    }
}

export default Particle;