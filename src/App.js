import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const GRID_WIDTH = 15;
const GRID_HEIGHT = 20;

const App = () => {
  const [grid, setGrid] = useState([]);
  const [manPosition, setManPosition] = useState(Math.floor(GRID_WIDTH / 2));
  const [gameOver, setGameOver] = useState(false);

  const initializeGrid = useCallback(() => {
    const newGrid = Array(GRID_HEIGHT)
      .fill(null)
      .map(() => Array(GRID_WIDTH).fill(null));
    setGrid(newGrid);
  }, []);

  const updateGrid = useCallback(() => {
    setGrid((prevGrid) => {
      const newGrid = Array(GRID_HEIGHT)
        .fill(null)
        .map(() => Array(GRID_WIDTH).fill(null));

      // Move drops down one row
      for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
        for (let col = 0; col < GRID_WIDTH; col++) {
          if (prevGrid[row][col] === "drop") {
            if (row === GRID_HEIGHT - 1) {
              // Check for collision with the man
              if (col === manPosition) {
                setGameOver(true);
              }
            } else {
              newGrid[row + 1][col] = "drop";
            }
          }
        }
      }

      // Add new drops at the top row
      const topRow = Array(GRID_WIDTH)
        .fill(null)
        .map(() => (Math.random() > 0.8 ? "drop" : null));
      newGrid[0] = topRow;

      return newGrid;
    });
  }, [manPosition]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "ArrowLeft" && manPosition > 0) {
        setManPosition(manPosition - 1);
      } else if (event.key === "ArrowRight" && manPosition < GRID_WIDTH - 1) {
        setManPosition(manPosition + 1);
      }
    },
    [manPosition]
  );

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        updateGrid();
      }
    }, 300); // Adjust speed of drops
    return () => clearInterval(interval);
  }, [updateGrid, gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="game-container">
      {gameOver ? (
        <h1>Game Over!</h1>
      ) : (
        grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, cellIndex) => {
              let className = "cell";
              if (cell === "drop") className += " drop";
              if (
                rowIndex === GRID_HEIGHT - 1 &&
                cellIndex === manPosition &&
                !gameOver
              ) {
                className += " man";
              }
              return <div className={className} key={cellIndex}></div>;
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default App;
