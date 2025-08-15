import { useCallback, useEffect, useState } from "react";
import type { Coords } from "./types";
import GameBoard from "./GameBoard";
import GameUI from "./GameUI";

const BOARD_SIZE = 20;
const INITIAL_SPEED = 100;

const App: React.FC = () => {
  const [snake, setSnake] = useState<Coords[]>([[10, 10]]);
  const [food, setFood] = useState<Coords>([5, 5]);
  const [direction, setDirection] = useState<string>("RIGHT");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);

  // Controle: keyboard | mouse | touch
  const [controlMode, setControlMode] = useState<"keyboard" | "mouse" | "touch">("keyboard");

  const generateFood = useCallback((): Coords => {
    let newFood: Coords;
    do {
      newFood = [
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ];
    } while (snake.some(([x, y]) => x === newFood[0] && y === newFood[1]));
    return newFood;
  }, [snake]);

  const handleReset = useCallback(() => {
    setSnake([[10, 10]]);
    setFood(generateFood());
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameStarted(true);
    setIsGamePaused(false);
  }, [generateFood]);

  const handleStartGame = useCallback(() => {
    setIsGameStarted(true);
    if (gameOver) handleReset();
  }, [gameOver, handleReset]);

  const togglePause = useCallback(() => {
    if (isGameStarted && !gameOver) setIsGamePaused(prev => !prev);
  }, [isGameStarted, gameOver]);

  // Loop do jogo
  useEffect(() => {
    if (gameOver || !isGameStarted || isGamePaused) return;

    const gameLoop = setTimeout(() => {
      const newSnake = [...snake];
      const head = newSnake[0];
      let newHead: Coords;

      switch (direction) {
        case "UP": newHead = [head[0] - 1, head[1]]; break;
        case "DOWN": newHead = [head[0] + 1, head[1]]; break;
        case "LEFT": newHead = [head[0], head[1] - 1]; break;
        case "RIGHT": newHead = [head[0], head[1] + 1]; break;
        default: return;
      }

      // Colisão com paredes
      if (
        newHead[0] < 0 || newHead[0] >= BOARD_SIZE ||
        newHead[1] < 0 || newHead[1] >= BOARD_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Colisão com o próprio corpo
      if (newSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
        setGameOver(true);
        return;
      }

      newSnake.unshift(newHead);

      // Comer comida
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setScore(prev => prev + 1);
        setFood(generateFood());
        setSpeed(prev => Math.max(prev - 2, 40));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    }, speed);

    return () => clearTimeout(gameLoop);
  }, [snake, direction, gameOver, isGameStarted, isGamePaused, food, speed, generateFood]);

  // Teclado (Arrow + WASD)
  useEffect(() => {
    if (controlMode !== "keyboard") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case " ":
          e.preventDefault();
          if (isGameStarted) togglePause();
          else handleStartGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isGameStarted, togglePause, handleStartGame, controlMode]);

  // Mouse
  useEffect(() => {
    if (controlMode !== "mouse" || gameOver || !isGameStarted || isGamePaused) return;

    const handleMouseMove = (e: MouseEvent) => {
      const board = document.getElementById("game-board");
      if (!board) return;
      const rect = board.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== "LEFT") setDirection("RIGHT");
        else if (deltaX < 0 && direction !== "RIGHT") setDirection("LEFT");
      } else {
        if (deltaY > 0 && direction !== "UP") setDirection("DOWN");
        else if (deltaY < 0 && direction !== "DOWN") setDirection("UP");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [controlMode, direction, gameOver, isGameStarted, isGamePaused]);

  // Touch / Swipe
  useEffect(() => {
    if (controlMode !== "touch" || gameOver || !isGameStarted || isGamePaused) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== "LEFT") setDirection("RIGHT");
        else if (deltaX < 0 && direction !== "RIGHT") setDirection("LEFT");
      } else {
        if (deltaY > 0 && direction !== "UP") setDirection("DOWN");
        else if (deltaY < 0 && direction !== "DOWN") setDirection("UP");
      }

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [controlMode, direction, gameOver, isGameStarted, isGamePaused]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="flex flex-col items-center">
        <GameUI
          score={score}
          gameOver={gameOver}
          isGameStarted={isGameStarted}
          isGamePaused={isGamePaused}
          onReset={handleReset}
          onStart={handleStartGame}
          onTogglePause={togglePause}
          setDirection={setDirection}
          direction={direction}
          setControlMode={setControlMode}
          controlMode={controlMode}
        />
        <GameBoard
          id="game-board"
          snake={snake}
          food={food}
          gameOver={gameOver}
          isGameStarted={isGameStarted}
          boardSize={BOARD_SIZE}
          score={score}
          isGamePaused={isGamePaused}
        />
      </div>
    </div>
  );
};

export default App;
