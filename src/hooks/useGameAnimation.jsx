import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Player from "../utils/SpaceInvader/player";
import { classToObject, createStarParticles, createParticles, shootFunc, getXY, collusionDetection, invaderDestroyed, gridInvaders } from "../utils/SpaceInvader/spaceinvaderhelpers";
import { selectGameActive, selectGameLives, playGame, hitpoints, modalOptions } from "../feature/spaceInvaderSlice";

const useGameAnimation = (canvaRef, status, resetValues) => {
    const [resetAll, setResetAll] = useState(typeof resetValues === "boolean" ? resetValues : false);
    const resetAllRef = useRef(resetAll);
    const gameActive = useSelector(selectGameActive);
    const gameLives = useSelector(selectGameLives);
    const dispatch = useDispatch();
    const [resetAnimation, setResetAnimation] = useState(0);

    const gameActiveRef = useRef(gameActive);
    const gameLivesRef = useRef(gameLives);

    // ref is important to make the requestAnimationFrame (rAF) work with react. 
    // it is used as the ID for the rAF then removeAnimationFrame is called with the ref as the ID
    const requestRef = useRef();
    // as the canva is a HTML document we keep a copy ref to work with it, ctx is the context 2d in this case
    const canva = useRef(null);
    const [ctx, setCtx] = useState();

    // background stars
    const [starParticles, setStarParticles] = useState([]);
    const stars = useRef(starParticles);

    // player states
    const [playerState, setPlayer] = useState(null);
    const player = useRef(playerState);

    // grid for the enemy invaders
    const [grids, setGrids] = useState([]);
    const invadersGrid = useRef(grids);

    // All helper variables
    let visibleArray = [];
    let shoot = true; // ?

    // booleans for movement and player shoot
    let right = false, left = false, attack = false;

    // all other helper variables
    let playerCopy, starParticleInit, copyVisible, trackVisibleHitFrame = 0, frames = 0, playerHit = false, playerBlink = 0, score = 0;
    let playerShoots = [], invadersShoots = [], playerHitParticle = [], invaderHitParticle = [];
    let randomInterval = Math.floor(Math.random() * 150 + 100);
    let playerInit, invadersInGrid;

    // initiliazing everything or restarting everything
    const init = () => {
        if (canvaRef.current !== null && canvaRef.current !== undefined) {
            dispatch(playGame(true));
            dispatch(hitpoints(3));

            const canvaInit = canvaRef.current;
            const ctxInit = canvaInit.getContext("2d", { willReadFrequently: true });
            canva.current = canvaInit;
            setCtx(ctxInit);
            invadersInGrid = gridInvaders(setGrids, status);
            invadersGrid.current = invadersInGrid;
            playerInit = new Player(canvaInit);
            const playerConverted = classToObject(playerInit);
            setPlayer(playerConverted);
            player.current = playerConverted;
            starParticleInit = createStarParticles(canvaInit);
            const starsObject = starParticleInit.map(star => classToObject(star));
            setStarParticles(starsObject);
            stars.current = starsObject;

            // restart values
            playerShoots = [];
            invadersShoots = []; 
            playerHitParticle = [];
            invaderHitParticle = [];
            visibleArray = [];
            frames = 0;
            shoot = true;
            playerHit = false;
            playerBlink = 0;
            score = 0;
            setResetAll(false);
            resetAllRef.current = false;
        }
    }

    // the main animation game function
    const animate = () => {
        // if NOT Game Over continue game in forever loop!
        if (gameActiveRef.current) {
            requestRef.current = requestAnimationFrame(animate);
        }

        // Start GAME run only once the initiation function
        if (!canva.current || !gameActiveRef.current) {
            init();
        }

        if (resetAllRef.current === true) {
            init();
        }

        if (invadersGrid.current[0].invaders.length === 0) {
            invadersInGrid = gridInvaders(setGrids, status);
            invadersGrid.current = invadersInGrid;
            dispatch(hitpoints(gameLivesRef.current + 1));
        }

        // only run when the main values has been initiated!
        if (canva.current !== null && canva.current !== undefined && ctx !== undefined) {
            // save starts new frame 
            ctx.save();
            // clear old canva completely, then re-paint the whole canva as black
            ctx.clearRect(0, 0, canva.current.width, canva.current.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canva.current.width, canva.current.height);

            // display 404 background text and lower it's opacity
            ctx.font = "bold 140px serif";
            ctx.fillStyle = "rgb(100, 181, 160)";
            ctx.strokeStyle = "rgb(100, 181, 160)";
            ctx.globalAlpha = 0.2;
            ctx.fillText("404", 45, 100);

            // display controlls for mobile/cellphone players while lowering the text's opacity
            ctx.font = "bold 24px serif";
            ctx.strokeText("<", 0, canva.current.height);
            ctx.strokeText(">", canva.current.width - ctx.measureText(">").width, canva.current.height);
            ctx.strokeText("|", canva.current.width / 4, canva.current.height);
            ctx.strokeText("|", canva.current.width / 1.38, canva.current.height);
            ctx.fillText("ATTACK", canva.current.width / 3, canva.current.height);

            ctx.beginPath();
            ctx.moveTo(0, canva.current.height - 7);
            ctx.lineTo(canva.current.width / 4, canva.current.height - 7);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(canva.current.width, canva.current.height - 7);
            ctx.lineTo(canva.current.width / 1.35, canva.current.height - 7);
            ctx.stroke();
            ctx.closePath();

            // Display the current score value
            ctx.font = "bold 10px serif";
            const scoreLength = ctx.measureText("score: ").width;
            const scoreheight = ctx.measureText("score: ").fontBoundingBoxAscent;
            ctx.fillText("score: ", 0, scoreheight);
            ctx.fillText(score, scoreLength, scoreheight);
            ctx.globalAlpha = 1;

            // show stars as a background
            if (stars.current) {
                stars.current.forEach(particle => {
                    if (particle.position.y - particle.radius >= canva.current.height) {

                        setTimeout(() => {
                            particle.position.x = Math.random() * canva.current.width;
                            particle.position.y = -particle.radius;             
                        }, 0);
                    } else {
                        particle.update(ctx);  
                    }
                });
            }

            // move all enemies in the grid in same motion, and stack up their fire projectiles
            if (invadersGrid.current) {
                invadersGrid.current.forEach(grid => {
                    if (frames % 100 === 0 && grid.invaders.length > 0) {
                        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invadersShoots);
                    }
                    if (frames % randomInterval === 0) {
                        setTimeout(() => {
                            grid.update(canva.current);
                        }, 0);
                    }
                    grid.invaders.forEach(invader => {
                        if (frames % randomInterval === 0) {
                            setTimeout(() => {
                                invader.update(ctx, { velocity: grid.velocity });
                                randomInterval = Math.floor(Math.random() * 150 + 100);
                            }, 0);
                        } else {
                            invader.update(ctx, { velocity: { x: 0, y: 0 } });
                        }
                        // when invader goes off the bottom y-axis GAME OVER
                        if (invader.position.y + invader.height >= canva.current.height) {
                            dispatch(playGame(false));
                            dispatch(modalOptions(true));
                        }
                        // when invader touches player GAME OVER
                        if (invader.position.y + invader.height !== 0 && player.current.position.y !== 0 && collusionDetection(invader, player.current)) {
                            dispatch(playGame(false));
                            dispatch(modalOptions(true));
                        }

                    })
                })
            }

            // show enemy fire projectile animation
            if (invadersShoots.length > 0) {
                invadersShoots.forEach((invaderProjectile, indexInvader) => {
                    if (invaderProjectile.position.y + invaderProjectile.radius >= canva.current.height) {
                        setTimeout(() => {
                            invadersShoots.splice(indexInvader, 1);
                        }, 0);
                    } else {
                        invaderProjectile.update(ctx);
                    }

                    // player hit
                    if (collusionDetection(invaderProjectile, player.current) && playerHit === false) {
                        if (frames > 60) {
                            shoot = false;
                            playerHitParticle = createParticles(player.current, "orange");
                            playerHit = true;
                            invadersShoots.splice(indexInvader, 1);
                            dispatch(hitpoints(gameLivesRef.current - 1));
                            trackVisibleHitFrame = frames + 180;
                            copyVisible = new Array(121).fill().map((arr, index) => trackVisibleHitFrame + index);
                            visibleArray = copyVisible;
                        }
                    }
                })
            }

            // enemy hit spread the enemy damaged particles
            if (invaderHitParticle.length > 0) {
                invaderHitParticle.forEach((hit) => {
                    hit.update(ctx);
                });
            }

            // making player move
            if (right === true && player.current.position.x < canva.current.width - player.current.width) {
                player.current.velocity.x = 1.5;
                player.current.rotation = 0.15;
                playerCopy = player.current;
                setPlayer(playerCopy);
            } else if (left && player.current.position.x >= 0) {
                player.current.velocity.x = -1.5;
                player.current.rotation = -0.15;
                playerCopy = player.current;
                setPlayer(playerCopy);
            } else {
                player.current.velocity.x = 0;
                player.current.rotation = 0;
                playerCopy = player.current;
                setPlayer(playerCopy);
            }

            // Printing the player last so player has the best priority in the game
            // While also checking if player has been hit or not causing a blink animation effect if player was hit
            if (playerHit) {
                visibleArray.forEach((v) => {
                    if (frames === v) {
                        player.current.update(playerBlink === 2 ? 0.7 : 0.3); // different shades of opacity
                        if (v === visibleArray[visibleArray.length -1]) {
                            playerBlink++;
                            trackVisibleHitFrame = frames + 180;
                            copyVisible = new Array(121).fill().map((arr, index) => trackVisibleHitFrame + index);
                        }
                    }
                });
                if (playerBlink === 3) {
                    playerHit = false;
                    playerBlink = 0;
                    shoot = true;
                } else {
                    visibleArray = copyVisible;
                }
            } else {
                player.current.update(1); // opacity back to 1
            }

            // if player hit spread the damaged player's particles
            if (playerHitParticle.length > 0) {
                    playerHitParticle.forEach((hit) => {
                        hit.update(ctx);
                    });
            }

            // show player fire projectile animation
            if (playerShoots && playerHit === false && shoot === true) {
                playerShoots.forEach((playerProjectile, index) => {
                    if (playerProjectile.position.y + playerProjectile.radius <= 0) {
                        setTimeout(() => {
                            playerShoots.splice(index, 1);
                        }, 0);
                    } else {
                        playerProjectile.update(ctx);
                    }

                    // enemy was hit! remove the enemy from game!
                    invadersGrid.current.forEach(grid => {
                        grid.invaders.forEach((invader, indexInvader) => {
                            if (invaderDestroyed(playerProjectile, invader)) {
                                // make enemy damage particles
                                invaderHitParticle = createParticles(invader, "#BAA0DE");
                                // add score
                                score += 100;
                                // clean up remove the enemy and the shot
                                setTimeout(() => {
                                    grid.invaders.splice(indexInvader, 1);
                                    playerShoots.splice(index, 1);
                                }, 0);
                            }
                        })
                    });
                });
            }

            // check if game can continue if not set GAME OVER!
            if (gameLivesRef.current === 0 && frames % 100 === 0) {
                dispatch(playGame(false));
                dispatch(modalOptions(true));
            }

            // count the frames
            frames++;
            // restore discards old frame and uses this saved frame
            ctx.restore();
        } 
    }

    // movements for a mobile/cellphone player who does not have keyboards
    const mobileMovement = (e, bool) => {
        const { clickX } = getXY(e, canva.current);
        if (clickX < canva.current.clientWidth / 4) {
            left = bool;
        } else if (clickX > canva.current.clientWidth / 1.38) {
            right = bool;
        } else {
            attack = true;
            if (canvaRef.current !== null && canvaRef.current !== undefined && shoot === true) {
                playerShoots = playerShoots.concat(shootFunc([], player.current));
            }
        }
    }

    // movement for a player who has keyboards
    const movements = (e, bool) => {
        switch (e.key) {
            case "ArrowRight":
                right = bool;
                break;
            case "d":
                right = bool;
                break;
            case "ArrowLeft":
                left = bool;
                break;
            case "a":
                left = bool;
                break;
            case "ArrowUp":
                attack = bool;
                if (canvaRef.current !== null && canvaRef.current !== undefined && shoot === true) {
                    playerShoots = playerShoots.concat(shootFunc([], player.current));
                }
                break;
            case " ":
                attack = bool;
                if (canvaRef.current !== null && canvaRef.current !== undefined && shoot === true) {
                    playerShoots = playerShoots.concat(shootFunc([], player.current));
                }
                break;
            case "w":
                attack = bool;
                if (canvaRef.current !== null && canvaRef.current !== undefined && shoot === true) {
                    playerShoots = playerShoots.concat(shootFunc([], player.current));
                }
                break;
        }
    }

    const eventListeners = (addOrRemove) => {
        if (addOrRemove === "add") {
            addEventListener("keydown", (e) => movements(e, true));
            addEventListener("keyup", (e) => movements(e, false));
            addEventListener("mousedown", (e) => mobileMovement(e, true));
            addEventListener("mouseup", (e) => mobileMovement(e, false));
        } else {
            cancelAnimationFrame(requestRef.current);
            removeEventListener("keydown", (e) => movements(e, true));
            removeEventListener("keyup", (e) => movements(e, false));
            removeEventListener("mousedown", (e) => mobileMovement(e, true));
            removeEventListener("mouseup", (e) => mobileMovement(e, false));
        }
    }

    // the useEffect hook where the looping animation placed into the DOM and also eventListeners are done here
    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        if (canva.current) {
            eventListeners("add");
        }

        return () => {
            cancelAnimationFrame(requestRef.current);
            eventListeners("remove")
        }
    }, [canva.current, ctx, requestRef]);

    // 2nd useEffect to reset the ref values when the game is restarted
    useEffect(() => {
        gameLivesRef.current = gameLives;
        gameActiveRef.current = gameActive;
        player.current = playerState;
        stars.current = starParticles;
        invadersGrid.current = grids;
        resetAllRef.current = resetAll;
    }, [gameActive, gameLives]);

    // 3rd useEffect to reset the animation based on user clicking restart game from the component restart button
    useEffect(() => {
        if (resetAnimation !== 0) {
            requestRef.current = requestAnimationFrame(animate);
        }
        if (canva.current) {
            eventListeners("add");
        }

        return () => {
            cancelAnimationFrame(requestRef.current);
            eventListeners("remove");
        }
    }, [resetAnimation]);

    return [ requestRef, resetAnimation, setResetAnimation ]
}

export default useGameAnimation;