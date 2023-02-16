// Function to handle button click events
function editCell(cell, num, grid) {
  const row = cell[0]
  const col = cell[1]
  let button = document.getElementById(`cell-${row}-${col}`);

  grid[row][col] = parseInt(num);
}


