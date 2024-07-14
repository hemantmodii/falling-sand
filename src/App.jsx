// src/App.jsx
import React from 'react';
import P5Wrapper from './P5Wrapper';
import './index.css';

const sketch = (p) => {
  function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  }

  let grid;
  let w = 2;
  let cols, rows;
  let hueValue = 1;

  function withinCols(i) {
    return i >= 0 && i < cols;
  }
  function withinRows(i) {
    return i >= 0 && i < rows;
  }

  p.setup = function () {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
    canvas.canvas.style.cursor = 'cell';
    p.colorMode(p.HSB, 360, 255, 255);
    cols = Math.floor(p.width / w);
    rows = Math.floor(p.height / w);
    
    console.log(`Canvas width: ${p.width}, height: ${p.height}`);
    console.log(`Cols: ${cols}, Rows: ${rows}`);
    
    grid = make2DArray(cols, rows);
  };

  p.windowResized = function () {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    cols = Math.floor(p.width / w);
    rows = Math.floor(p.height / w);

    console.log(`Canvas resized to width: ${p.width}, height: ${p.height}`);
    console.log(`Cols: ${cols}, Rows: ${rows}`);

    grid = make2DArray(cols, rows);
  };

  p.mouseDragged = function () {
    let mouseCol = p.floor(p.mouseX / w);
    let mouseRow = p.floor(p.mouseY / w);

    let matrix = 5;
    let extent = p.floor(matrix / 2);
    for (let i = -extent; i <= extent; i++) {
      for (let j = -extent; j <= extent; j++) {
        if (p.random(1) < 0.5) {
          let col = mouseCol + i;
          let row = mouseRow + j;
          if (withinCols(col) && withinRows(row)) grid[col][row] = hueValue;
        }
      }
    }
    hueValue += 0.5;
    if (hueValue > 360) {
      hueValue = 1;
    }
  };

  p.draw = function () {
    p.background(0, 0, 0, 1);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        p.noStroke();
        if (grid[i][j] > 1) {
          p.fill(grid[i][j], 255, 255);
          let x = i * w;
          let y = j * w;
          p.square(x, y, w);
        }
      }
    }

    let nextGrid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        if (state > 0) {
          let below = grid[i][j + 1];
          let dir = 1;
          if (p.random(1) < 0.5) {
            dir *= -1;
          }

          let belowA = -1,
            belowB = -1;
          if (withinCols(i + dir)) {
            belowA = grid[i + dir][j + 1];
          }
          if (withinCols(i - dir)) {
            belowB = grid[i - dir][j + 1];
          }
          if (below === 0) {
            nextGrid[i][j + 1] = state;
          } else if (belowA === 0) {
            nextGrid[i + dir][j + 1] = state;
          } else if (belowB === 0) {
            nextGrid[i - dir][j + 1] = state;
          } else {
            nextGrid[i][j] = state;
          }
        }
      }
    }
    grid = nextGrid;
  };
};

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
      
      <div className='fixed top-5 text-center w-full z-10'>
      <h1 className=' text-5xl font-bold text-transparent bg-gradient-multi pb-4'>FALLING SAND</h1>
      <h2 className='text-md text-white'>Hold and Drag your mouse...</h2>
      </div>
      <div className='flex-1 flex justify-center items-center w-full'>
      <P5Wrapper sketch={sketch} />

      </div>
    </div>
  );
};

export default App;
