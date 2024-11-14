import React, { useState, useEffect } from 'react';

const PLINKO_ROWS = 12;  // Number of rows in Plinko
const BALL_SPEED = 0.25;  // Speed at which the ball falls
const PEG_WIDTH = 12;  // Width for each peg (space between pegs)
const BALL_RADIUS = 8;  // Ball radius

const Plinko = () => {
  const [ballPosition, setBallPosition] = useState({ x: null, y: 0 });
  const [isBallFalling, setIsBallFalling] = useState(false);
  const [pegs, setPegs] = useState(generatePegs());

  // Function to generate the pegs dynamically
  function generatePegs() {
    const pegs = [];
    for (let row = 0; row < PLINKO_ROWS; row++) {
      const numPegs = row + 2; // Row 0 has 2 pegs, Row 1 has 3, etc.
      const rowPegs = new Array(numPegs).fill(true);  // Add peg in each slot
      pegs.push(rowPegs);
    }
    return pegs;
  }

  // Function to simulate ball dropping and bouncing off pegs
  const dropBall = () => {
    setIsBallFalling(true);
    let x = Math.floor(pegs[0].length / 2); // Start in the middle
    let y = 0;

    const ballFallInterval = setInterval(() => {
      if (y >= PLINKO_ROWS) {
        clearInterval(ballFallInterval);
        setIsBallFalling(false);
        return;
      }

      // Simulate bouncing: Random left or right based on the peg
      if (x > 0 && x < pegs[y].length - 1 && Math.random() > 0.5) {
        x += Math.random() > 0.5 ? 1 : -1;  // Randomly move left or right
      }

      y++;
      setBallPosition({ x, y });
    }, BALL_SPEED * 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="relative flex flex-col items-center bg-white border-2 border-gray-300 p-6 rounded-lg shadow-lg">
        <div className="relative w-96 h-96 bg-gray-100 rounded-lg overflow-hidden">
          {/* Draw pegs */}
          {pegs.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="absolute w-full top-0 left-0"
              style={{ top: `${rowIndex * 70 + 10}px` }}
            >
              {row.map((peg, colIndex) => (
                <div
                  key={colIndex}
                  className={`w-4 h-4 rounded-full bg-gray-800 absolute`}
                  style={{
                    left: `${(colIndex + 1) * PEG_WIDTH}px`, // Adjust horizontal placement of pegs
                    transform: `translateX(-50%)`
                  }}
                />
              ))}
            </div>
          ))}

          {/* Ball falling animation */}
          {isBallFalling && ballPosition.x !== null && (
            <div
              className="absolute bg-blue-500 rounded-full"
              style={{
                top: `${ballPosition.y * 70 + 30}px`,
                left: `${ballPosition.x * PEG_WIDTH + 12}px`,
                width: `${BALL_RADIUS * 2}px`,
                height: `${BALL_RADIUS * 2}px`,
                transition: 'top 0.25s, left 0.25s'
              }}
            ></div>
          )}
        </div>
        
        {/* Button to drop the ball */}
        <button
          onClick={dropBall}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Drop Ball
        </button>
      </div>
    </div>
  );
};

export default Plinko;
