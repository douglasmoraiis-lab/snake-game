import { useCallback, useEffect, useState } from "react";
import type { Coords } from "./types";
import GameBoard from "./GameBoard";
import GameUI from "./GameUI";

// Tamanho do tabuleiro (por exemplo, 20x20)
const BOARD_SIZE = 20;

// Velocidade inicial da cobra (em ms)
const INITIAL_SPEED = 100;

const App: React.FC = () => {
  // Estado do jogo
  const [snake, setSnake] = useState<Coords[]>([[10, 10]]);
  const [food, setFood] = useState<Coords>([5, 5]);
  const [direction, setDirection] = useState<string>("RIGHT");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);

  // Função para gerar nova comida em uma posição aleatória (envolvida em useCallback)
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

  // Função para reiniciar o jogo (envolvida em useCallback)
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

  // Funções envolvidas em useCallback para evitar que recriem em cada renderização
  const handleStartGame = useCallback(() => {
    setIsGameStarted(true);
    if (gameOver) {
      handleReset();
    }
  }, [gameOver, handleReset]);

  const togglePause = useCallback(() => {
    if (isGameStarted && !gameOver) {
      setIsGamePaused((prev) => !prev);
    }
  }, [isGameStarted, gameOver]);

  // Lógica principal do jogo (movimento da cobra)
  useEffect(() => {
    if (gameOver || !isGameStarted || isGamePaused) return;

    const gameLoop = setTimeout(() => {
      const newSnake = [...snake];
      const head = newSnake[0];

      let newHead: Coords;
      switch (direction) {
        case "UP":
          newHead = [head[0] - 1, head[1]];
          break;
        case "DOWN":
          newHead = [head[0] + 1, head[1]];
          break;
        case "LEFT":
          newHead = [head[0], head[1] - 1];
          break;
        case "RIGHT":
          newHead = [head[0], head[1] + 1];
          break;
        default:
          return;
      }

      // Checa colisão com as paredes
      if (
        newHead[0] < 0 ||
        newHead[0] >= BOARD_SIZE ||
        newHead[1] < 0 ||
        newHead[1] >= BOARD_SIZE
      ) {
        setGameOver(true);
        return;
      }
      
      // Checa colisão com o próprio corpo
      if (newSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
        setGameOver(true);
        return;
      }

      newSnake.unshift(newHead);

      // Checa se a cobra comeu a comida
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setScore((prevScore) => prevScore + 1);
        setFood(generateFood());
        // Aumenta a velocidade da cobra (diminui o tempo de intervalo) cada vez que ela come uma fruta
        setSpeed((prevSpeed) => Math.max(prevSpeed - 2, 40));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    }, speed);

    return () => clearTimeout(gameLoop);
  }, [
    snake,
    direction,
    gameOver,
    isGameStarted,
    isGamePaused,
    food,
    score,
    speed,
    generateFood,
  ]);

  // Captura de eventos do teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case " ":
          e.preventDefault();
          if (isGameStarted) {
            togglePause();
          } else {
            handleStartGame();
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isGameStarted, handleStartGame, togglePause]);

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
        />
        <GameBoard
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