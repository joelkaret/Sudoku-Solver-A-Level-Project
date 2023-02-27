function SudokuBoard(props) {
  return (
    <table id='board'>
      <tbody>
        {props.grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cellValue, colIndex) => {
              const cellId = `cell-${rowIndex}-${colIndex}`;
              const classNames = ["sudoku-cell"];
              if (rowIndex % 3 === 0) {
                classNames.push("sudoku-box-edge-top");
              }
              if (colIndex % 3 === 0) {
                classNames.push("sudoku-box-edge-left");
              }
              if ((rowIndex + 1) % 3 === 0) {
                classNames.push("sudoku-box-edge-bottom");
              }
              if ((colIndex + 1) % 3 === 0) {
                classNames.push("sudoku-box-edge-right");
              }
              return (
                <td key={colIndex}>
                  <button
                    id={cellId}
                    type="button"
                    className={classNames.join(" ")}
                    onClick={() => props.onCellClick(rowIndex, colIndex)}
                  >
                    {cellValue}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SudokuBoard;
