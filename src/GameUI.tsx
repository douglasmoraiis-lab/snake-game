import React from "react";

interface GameUIProps {
  score: number;
  gameOver: boolean;
  isGameStarted: boolean;
  isGamePaused: boolean;
  onReset: () => void;
  onStart: () => void;
  onTogglePause: () => void;
  setDirection: (direction: string) => void;
  direction: string;
}

const GameUI: React.FC<GameUIProps> = ({
  score,
  gameOver,
  isGameStarted,
  isGamePaused,
  onReset,
  onStart,
  onTogglePause,
  setDirection,
  direction,
}) => {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-emerald-400 drop-shadow-md">
        Snake Game
      </h1>
      <div className="flex items-center justify-between w-full max-w-lg mb-4 text-xl">
        <span className="bg-gray-700 px-4 py-2 rounded-full shadow-lg">
          Pontuação: {score}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={onTogglePause}
            className={`bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 ${
              !isGameStarted || gameOver ? 'hidden' : ''
            }`}
          >
            {isGamePaused ? 'Retomar' : 'Pausar'}
          </button>
          <button
            onClick={isGameStarted ? onReset : onStart}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            {gameOver || !isGameStarted ? 'Novo Jogo' : 'Reiniciar'}
          </button>
        </div>
      </div>

      <div className="md:hidden mt-8 w-full max-w-sm flex flex-col items-center">
        <button
          onClick={() => { if (direction !== 'DOWN') setDirection('UP'); }}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-full mb-2 transition-transform transform hover:scale-105"
        >
          ▲
        </button>
        <div className="flex justify-center w-full">
          <button
            onClick={() => { if (direction !== 'RIGHT') setDirection('LEFT'); }}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-full mr-2 transition-transform transform hover:scale-105"
          >
            ◀
          </button>
          <button
            onClick={() => { if (direction !== 'LEFT') setDirection('RIGHT'); }}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-full ml-2 transition-transform transform hover:scale-105"
          >
            ▶
          </button>
        </div>
        <button
          onClick={() => { if (direction !== 'UP') setDirection('DOWN'); }}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-full mt-2 transition-transform transform hover:scale-105"
        >
          ▼
        </button>
      </div>
    </>
  );
};

export default GameUI;
