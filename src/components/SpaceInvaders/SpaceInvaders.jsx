import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { RiArrowGoBackLine } from "react-icons/ri";
import { VscDebugRestart } from "react-icons/vsc";
import useGameAnimation from "../../hooks/useGameAnimation";
import { selectGameActive, selectModal, playGame, modalOptions, hitpoints, /*restartGame*/ } from "../../feature/spaceInvaderSlice";
import "./SpaceInvaders.css";


const SpaceInvaders = ({status, resetValues}) => {
//   const router = useRouter();
  const canvasRef = useRef(null);
  const gameActive = useSelector(selectGameActive);
  const modal = useSelector(selectModal);
  const dispatch = useDispatch();
  const [requestRef, resetAnimation, setResetAnimation] = useGameAnimation(canvasRef, 404, resetValues);

//   const handleHome = () => {
//       console.log("router", router);
//       router.push("/");
//   }

  const handleRestart = () => {
      dispatch(modalOptions(false));
      dispatch(hitpoints(3));
      dispatch(playGame(true));
      // dispatch(restartGame(true));
      setResetAnimation(requestRef.current + 1);
      requestRef.current = resetAnimation;
  }


  return (
      <>
          <section data-white>
              {
                  !gameActive &&
                  <div className={"spaceModal"}>
                      <div>
                          {/* <button onClick={handleHome}>Home <RiArrowGoBackLine /></button> */}
                          <button onClick={handleRestart}>Restart <VscDebugRestart /></button>
                      </div>
                  </div>
              }
              <canvas ref={canvasRef} className={"canvaError"} />
          </section>
      </>
  )
}

export default SpaceInvaders;