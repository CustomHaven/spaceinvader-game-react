import Particle from "./particle";
import Projectile from "./projectile";
import Grid from "./grid";
import { coordinates404 } from "./coordinates404";

export const classToObject = theClass => {
    const originalClass = theClass || {}
    const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(originalClass))
    keys.reduce((classAsObj, key) => {
        classAsObj[key] = originalClass[key]
        return classAsObj
    }, {})

    return originalClass;
}

export const createStarParticles = (canva) => {
    if (canva !== undefined) {
        let starParticles = []
        for (let i = 0; i < 100; i++) {
            starParticles.push(new Particle({
                position: {
                    x: Math.random() * canva.width,
                    y: Math.random() * canva.height
                },
                velocity: {
                    x: 0,
                    y: 0.3,
                },
                fades: false,
                color: "white",
                radius: Math.random() * 2,
            }));
        }
        return starParticles;
    }
}

export const createParticles = (object, color) => {
    let particles = [];
    for (let m = 0; m < 15; m++) {
        // { position, velocity, fades, color, radius }
        particles = particles.concat(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            fades: true,
            color: color,
            radius: Math.random() * 3,
        }));
    }
    return particles;
}

// TODO: status is the statusCode based on the status send relevant coords back as invader Grid!
export const gridInvaders = (setGrid, status) => {
    let statusCode;
    switch (status) {
        case 500:
            statusCode = 500; // TODO: fix the coords!
            break;
        case 409:
            statusCode = 409; // TODO: fix the coords!
            break;
        case 403:
            statusCode = 403; // TODO: fix the coords!
            break;
        case 401:
            statusCode = 401; // TODO: fix the coords!
            break;
        case 400:
            statusCode = 400; // TODO: fix the coords!
            break;
        default:
            statusCode = coordinates404;
            break;
    }
    const gridInit = [].concat(new Grid(statusCode));
    setGrid(gridInit);
    return gridInit;
}

export const shootFunc = (arrayShoot, object) => {
    arrayShoot.push(
        new Projectile({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y
            },
            velocity: {
                x: 0,
                y: -3
            }
        })
    );
    return arrayShoot;
}

export const getXY = (event, canvas) =>  {
    const rect = canvas.getBoundingClientRect();
    return {
        clickX: event.clientX - rect.left,
        clickY: event.clientY - rect.top
    }
}

export const collusionDetection = (invader, player) => invader.position.y + invader.height >= player.position.y &&
invader.position.x + invader.width >= player.position.x &&
player.position.x + player.width >= invader.position.x &&
player.position.y + player.height >= invader.position.y;

export const invaderDestroyed = (playerProjectile, invader) => playerProjectile.position.y - playerProjectile.radius <= 
invader.position.y + invader.height &&
playerProjectile.position.x + playerProjectile.radius >=
invader.position.x && 
playerProjectile.position.x - playerProjectile.radius <= 
invader.position.x + invader.width &&
playerProjectile.position.y + playerProjectile.radius >=
invader.position.y;