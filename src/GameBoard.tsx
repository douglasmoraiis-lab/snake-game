import React from "react";
import type { Coords } from "./types";

interface GameBoardProps {
  snake: Coords[];
  food: Coords;
  gameOver: boolean;
  isGameStarted: boolean;
  boardSize: number;
  score: number;
  isGamePaused: boolean; 
}

const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  food,
  gameOver,
  isGameStarted,
  boardSize,
  score, 
  isGamePaused,
}) => {
  return (
    <div
      className="relative grid grid-cols-20 grid-rows-20 border-4 border-emerald-500 bg-gray-800 shadow-2xl rounded-lg"
      style={{
        width: `min(80vw, 500px)`,
        height: `min(80vw, 500px)`,
      }}
    >
      {snake.map(([x, y], index) => (
        <div
          key={index}
          className={`absolute rounded-full transition-all duration-100 ${
            index === 0 ? 'bg-emerald-400 shadow-xl' : 'bg-emerald-500'
          }`}
          style={{
            left: `${y * (100 / boardSize)}%`,
            top: `${x * (100 / boardSize)}%`,
            width: `${100 / boardSize}%`,
            height: `${100 / boardSize}%`,
          }}
        ></div>
      ))}
      <div
        className="absolute bg-red-500 rounded-full shadow-lg animate-pulse"
        style={{
          left: `${food[1] * (100 / boardSize)}%`,
          top: `${food[0] * (100 / boardSize)}%`,
          width: `${100 / boardSize}%`,
          height: `${100 / boardSize}%`,
        }}
      ></div>
      {!isGameStarted && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
          <span className="text-3xl font-bold text-white mb-4 animate-bounce">
            Pressione Espaço para começar
          </span>
        </div>
      )}
      {gameOver && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
          <span className="text-5xl font-extrabold text-red-500 mb-2 animate-pulse">
            Game Over!
          </span>
          <span className="text-xl font-semibold text-white">
            Sua pontuação final: {score}
          </span>
        </div>
      )}
      {isGamePaused && !gameOver && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
          <span className="text-5xl font-extrabold text-blue-400 animate-pulse">
            PAUSADO
          </span>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
