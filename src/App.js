// Basically HTML - with react classes

// import logo from "./logo.svg";
import React, { useState } from "react";
import "./App.css";
import SudokuBoard from "./components/generateBoard";
// import solveSudoku from "./main/sudoku.js";

function App() {
  const [grid, setGrid] = useState(() => {
    const initialGrid = [];
    for (let i = 0; i < 9; i++) {
      initialGrid.push(Array(9).fill(0));
    }
    return initialGrid;
  });
  const [currentCell, setCurrentCell] = useState([0, 0]);
  const [speed, setSpeed] = useState(1);
  const [solving, setSolving] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const speedOptions = [
    { label: "1%", value: 1 },
    { label: "10%", value: 2 },
    { label: "25%", value: 3 },
    { label: "50%", value: 4 },
    { label: "75%", value: 5 },
    { label: "100%", value: 6 },
    { label: "150%", value: 7 },
    { label: "200%", value: 8 },
    { label: "250%", value: 9 },
    { label: "500%", value: 10 },
    { label: "1000%", value: 11 },
  ];


  const handleSliderSpeedChange = (event) => {
    const speedPercent = parseInt(speedOptions[event.target.value].label);
    setSpeed(speedPercent / 100);
  };

  const handleTextSpeedChange = (event) => {
    setSpeed(event.target.value);
  };

  function handleCellClick(row, col) {
    setCurrentCell([row, col]);
  }

  function setGrid2(grid) {
    // const [row, col] = currentCell;
    const newGrid = [...grid];
    // newGrid[row][col] = key;
    setGrid(newGrid);
  }

  function edit(event) {
    if (inputFocused) return; // do nothing if input field is in focus
    let key = event.key;
    if (["Delete", "Backspace", "0"].includes(key)) {
      key = 0;
    }
    key = parseInt(key);
    if (isNaN(key) || key > 9 || key < 0) {
      return;
    }
    const [row, col] = currentCell;
    const newGrid = [...grid];
    newGrid[row][col] = key;
    if (key == 0){
      event.target.classList.remove('userInput')
    } else {
      event.target.classList.add('userInput')
    }
    setGrid(newGrid);
  }

  const handleSolveClick = async () => {
    setSolving(true);
    const result = await solveGrid(grid, speed);
    setSolving(false);
  };

  // Main iterative function.
  async function solveGrid() {
    // Function to check if a given number is a valid solution for a given cell
    function isValid(grid, row, col, num) {
      // Check if 'num' is already used in the given row
      for (let i = 0; i < 9; i++) {
        if (grid[row][i] == num) {
          return false;
        }
      }

      // Check if 'num' is already used in the given column
      for (let i = 0; i < 9; i++) {
        if (grid[i][col] == num) {
          return false;
        }
      }

      // Check if 'num' is already used in the 3x3 block containing the given cell
      let blockRow = Math.floor(row / 3) * 3;
      let blockCol = Math.floor(col / 3) * 3;
      for (let i = blockRow; i < blockRow + 3; i++) {
        // Loops through the 3 rows in the block.
        for (let j = blockCol; j < blockCol + 3; j++) {
          // Loops through the 3 collumns in the block.
          if (grid[i][j] == num) {
            return false;
          }
        }
      }

      // If all checks pass, the number is valid for the given cell
      return true;
    }

    // Function to find next empty cell in grid.
    function findNextEmptyCell(grid) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] == 0) {
            return { row, col };
          }
        }
      }
      return null;
    }

    // Recursive function to solve the Sudoku puzzle
    async function solve(grid) {
      // Find the next empty cell in the grid
      let emptyCell = findNextEmptyCell(grid);

      // If there are no more empty cells, the puzzle has been solved
      if (emptyCell == null) {
        return true;
      }

      let { row, col } = emptyCell;

      // Try each number from 1 to 9 as a potential solution for the empty cell
      for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
          // If the number is valid, update the grid
          // and call the function recursively to try to solve the remaining cells
          grid[row][col] = num;
          setGrid2(grid);
          await new Promise((resolve) => setTimeout(resolve, 1000 / speed)); // Wait for 50ms before continuing
          if (await solve(grid)) {
            return true;
          }
          // If the recursive call returns false, it means that the current number
          // is not a valid solution for the empty cell, so reset the cell to 0
          // and try the next number
          grid[row][col] = 0;
          setGrid2(grid);
          await new Promise((resolve) => setTimeout(resolve, 1000 / speed)); // Wait for 50ms before continuing
        }
      }

      // If no valid number was found for the empty cell, return false to indicate
      // that the puzzle cannot be solved
      return false;
    }

    // Call the solve() function to start solving the puzzle
    return solve(grid);
  }

  return (
    <div className="App">
      <title>Sudoku Solver</title>
      {/* <script src="./main/generateBoard.js" defer></script> */}
      {/* <script src="./main/editSudoku.js" defer></script> */}
      {/* <script src="./main/sudoku.js" defer></script> */}
      <script type="text/babel" src="https://livejs.com/live.js"></script>
      <link rel="stylesheet" href="style.css"></link>
      <h1>Sudoku Solver</h1>
      <div id="sudoku-container" onKeyDown={edit}>
        <SudokuBoard grid={grid} onCellClick={handleCellClick} />
        <button
          title="Solve"
          id="solve-button"
          name="solve-button"
          onClick={handleSolveClick}
          disabled={solving}
        >
          {solving ? "Solving..." : "Solve"}
        </button>
        <div className="speed-control">
          <span>Speed:</span>
          <input
            type="range"
            id="speed"
            min="0"
            max={speedOptions.length - 1}
            value={speedOptions.findIndex(
              (option) => option.label === `${speed * 100}%`
            )}
            className="slider"
            onInput={handleSliderSpeedChange}
          />
          <input
            type="number"
            value={speed}
            min="0"
            max="10000000000"
            onChange={handleTextSpeedChange}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
        </div>
        {/* {solution && <MazeSolution solution={solution} />} */}
      </div>
    </div>
  );
}

export default App;
