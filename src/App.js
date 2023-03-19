import React, { useState, useEffect } from "react";
import "./App.css";
import SudokuBoard from "./components/generateBoard";

function App() {
	const emptyGrid = () => {
		const initialGrid = [];
		for (let i = 0; i < 9; i++) {
			initialGrid.push(Array(9).fill(0));
		}
		return initialGrid;
	};
	let [grid, setGrid] = useState(emptyGrid);
	let [speed, setSpeed] = useState(1);
	let [solving, setSolving] = useState(false);
	let [inputFocused, setInputFocused] = useState(false);
	let [currentCell, setCurrentCell] = useState([0, 0]);
	let [timerId, setTimerId] = useState(null);
	let speedOptions = [
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

	function HandleReset() {
		setSolving(false);
		setGrid(emptyGrid);
		setSpeed(1);
		setTimerId(null);
	}

	const HandleSliderSpeedChange = (event) => {
		const speedPercent = parseInt(speedOptions[event.target.value].label);
		setSpeed(speedPercent / 100);
		setTimerId(1000 / speed);
	};

	const HandleTextSpeedChange = (event) => {
		setSpeed(event.target.value);
		setTimerId(1000 / speed);
	};

	function HandleCellClick(row, col) {
		setCurrentCell([row, col]);
	}

	function setGridCopy(grid) {
		const newGrid = [...grid]; // ... is used for a shallow copy
		setGrid(newGrid);
	}

	function edit(event) {
		// do nothing if input field is in focus
		if (inputFocused) return;
		const deleteKeys = ["Delete", "Backspace", "0"];
		const key = event.key;
		let intKey = parseInt(key);
		// do nothing if we are not interested in the key.
		if (
			!(
				(!deleteKeys.includes(key) && intKey == isNaN(intKey)) ||
				(intKey <= 9 && intKey >= 1)
			)
		)
			return;
		event.target.classList.add("userInput");
		if (deleteKeys.includes(key)) {
			intKey = 0;
			event.target.classList.remove("userInput");
		}
		const [row, col] = currentCell;
		const newGrid = [...grid];
		newGrid[row][col] = intKey;
		setGrid(newGrid);
	}

	const HandleSolveClick = async () => {
		setTimerId(1000 / speed);
		setSolving(true);
	};
	useEffect(() => {
		if (solving) {
			SolveGrid();
		}
	}, [solving]);

	// Function to check if a given number is a valid solution for a given cell
	function isValid(grid, row, col, num) {
		if (isInRow(grid, row, num)) return false;
		if (isInCol(grid, col, num)) return false;
		if (isInBox(grid, row, col, num)) return false;

		// If all checks pass, the number is valid for the given cell
		return true;
	}

	// Check if 'num' is already used in the given row
	function isInRow(grid, row, num) {
		for (let i = 0; i < 9; i++) {
			if (grid[row][i] == num) {
				return true;
			}
		}
	}

	// Check if 'num' is already used in the given column
	function isInCol(grid, col, num) {
		for (let i = 0; i < 9; i++) {
			if (grid[i][col] == num) {
				return true;
			}
		}
	}

	// Check if 'num' is already used in the 3x3 block containing the given cell
	function isInBox(grid, row, col, num) {
		let blockRow = Math.floor(row / 3) * 3;
		let blockCol = Math.floor(col / 3) * 3;
		// Loops through the 3 rows in the block.
		for (let i = blockRow; i < blockRow + 3; i++) {
			// Loops through the 3 collumns in the block.
			for (let j = blockCol; j < blockCol + 3; j++) {
				if (grid[i][j] == num) {
					return true;
				}
			}
		}
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

	// Main iterative function.
	async function SolveGrid() {
		// Recursive function to solve the Sudoku puzzle
		async function solve(grid, isSolving, currentTimerId) {
			if (!isSolving) return false; // added check for solving state
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
					setGridCopy(grid);
					await new Promise((resolve) =>
						setTimeout(resolve, currentTimerId)
					); // Wait for Xms before continuing
					if (!isSolving) return false; // added check for solving state
					if (await solve(grid, solving, timerId)) {
						return true;
					}
					// If the recursive call returns false, it means that the current number
					// is not a valid solution for the empty cell, so reset the cell to 0
					// and try the next number
					grid[row][col] = 0;
					setGridCopy(grid);
					await new Promise((resolve) =>
						setTimeout(resolve, currentTimerId)
					); // Wait for Xms before continuing
					if (!isSolving) return false; // added check for solving state
				}
			}

			// If no valid number was found for the empty cell, return false to indicate
			// that the puzzle cannot be solved
			return false;
		}
		return solve(grid, solving, timerId);
	}

	return (
		<div className="App">
			<title>Sudoku Solver</title>
			<script type="text/babel" src="https://livejs.com/live.js"></script>
			<link rel="stylesheet" href="style.css"></link>
			<h1>Sudoku Solver</h1>
			<div id="sudoku-container" onKeyDown={edit}>
				<SudokuBoard grid={grid} onCellClick={HandleCellClick} />
			</div>
			<button
				title="Solve"
				id="solve-button"
				name="solve-button"
				disabled={solving}
        onClick={HandleSolveClick}
			>
				{solving ? "Solving..." : "Solve"}
			</button>
			<button onClick={HandleReset}>Reset</button>
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
					onInput={HandleSliderSpeedChange}
				/>
				<input
					type="number"
					value={speed}
					min="0"
					max="10000000000"
					onChange={HandleTextSpeedChange}
					onFocus={() => setInputFocused(true)}
					onBlur={() => setInputFocused(false)}
				/>

				{/* {solution && <MazeSolution solution={solution} />} */}
			</div>
		</div>
	);
}

export default App;
