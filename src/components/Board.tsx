import React from 'react';
import { Box, Text } from 'ink';
import { Board as BoardModel } from '../models/Board.js';
import { Position, PieceColor, Piece } from '../models/Piece.js';

// Unicode box drawing characters for board lines
const HORIZONTAL = '─';
const VERTICAL = '│';
const CROSS = '┼';
const TOP_RIGHT = '┐';
const TOP_LEFT = '┌';
const BOTTOM_RIGHT = '┘';
const BOTTOM_LEFT = '└';
const T_DOWN = '┬';
const T_UP = '┴';
const T_RIGHT = '├';
const T_LEFT = '┤';

// Board grid elements
const GRID_HORIZONTAL = '───'; // Three horizontal lines for consistent spacing
const SPACE = ' ';
const EMPTY_POSITION = '·';  // Full-width dot for empty positions

interface BoardProps {
  board: BoardModel;
  cursorPosition: Position;
  selectedPiece: Piece | null;
  validMoves: Position[];
  currentPlayer: PieceColor;
}

// Board UI component
export const BoardComponent: React.FC<BoardProps> = ({
  board,
  cursorPosition,
  selectedPiece,
  validMoves,
  currentPlayer
}) => {
  // Initialize the board grid
  const grid: string[][] = Array(10).fill(0).map(() => Array(9).fill(' '));
  
  // Fill in pieces
  const pieces = board.getAllPieces();
  pieces.forEach(piece => {
    grid[piece.position.y][piece.position.x] = piece.symbol;
  });
  
  // Convert position to string coordinates for display
  const posToCoord = (pos: Position): string => {
    return `${pos.x},${pos.y}`;
  };
  
  // Check if a position is valid for the selected piece
  const isValidMove = (pos: Position): boolean => {
    return validMoves.some(move => move.x === pos.x && move.y === pos.y);
  };
  
  // Helper function to render board with intersections
  const renderBoard = () => {
    // Board size constants
    const ROWS = 10;
    const COLS = 9;
    
    // Create the outer border with horizontal lines
    const createHorizontalBorder = (isTop = true) => {
      const startChar = isTop ? TOP_LEFT : BOTTOM_LEFT;
      const endChar = isTop ? TOP_RIGHT : BOTTOM_RIGHT;
      const middleChar = isTop ? T_DOWN : T_UP;
      
      return (
        <Box marginLeft={2}>
          <Text>{startChar}</Text>
          {Array(COLS * 2 - 1).fill(0).map((_, i) => 
            <Text key={`h-border-${i}`}>{HORIZONTAL}</Text>
          )}
          <Text>{endChar}</Text>
        </Box>
      );
    };
    
    // Create vertical border lines
    const createVerticalBorders = () => {
      return Array(ROWS).fill(0).map((_, y) => {
        const isRiver = y === 4 || y === 5;
        
        return (
          <Box key={`v-border-${y}`} marginLeft={2}>
            <Text>{VERTICAL}</Text>
            {Array(COLS * 2 - 1).fill(0).map((_, x) => {
              // Only show horizontal lines between intersections
              if (x % 2 === 0) {
                return <Text key={`v-space-${x}`}>{SPACE}</Text>;
              } else {
                return <Text key={`v-line-${x}`}>{isRiver ? SPACE : HORIZONTAL}</Text>;
              }
            })}
            <Text>{VERTICAL}</Text>
          </Box>
        );
      });
    };
    
    // Create the actual game board with pieces
    const createGameBoard = () => {
      const rows = [];
      
      // For each row
      for (let y = 0; y < ROWS; y++) {
        const isRiver = y === 4 || y === 5;
        
        // Create a row with pieces at intersections
        const row = (
          <Box key={`row-${y}`} marginLeft={2}>
            <Text>{VERTICAL}</Text>
            {Array(COLS).fill(0).map((_, x) => {
              const pos = { x, y };
              const piece = grid[y][x];
              const isAtCursor = x === cursorPosition.x && y === cursorPosition.y;
              const isSelected = selectedPiece && x === selectedPiece.position.x && y === selectedPiece.position.y;
              const isHighlighted = isValidMove(pos);
              
              // Check for special board areas
              const isInRedPalace = x >= 3 && x <= 5 && y >= 7 && y <= 9;
              const isInBlackPalace = x >= 3 && x <= 5 && y >= 0 && y <= 2;
              
              // Check for palace diagonals
              const isRedPalaceDiagonal = isInRedPalace && (
                (x === 3 && y === 7 && piece === ' ') || 
                (x === 4 && y === 8 && piece === ' ') || 
                (x === 5 && y === 7 && piece === ' ') ||
                (x === 3 && y === 9 && piece === ' ') ||
                (x === 5 && y === 9 && piece === ' ')
              );
              
              const isBlackPalaceDiagonal = isInBlackPalace && (
                (x === 3 && y === 0 && piece === ' ') || 
                (x === 4 && y === 1 && piece === ' ') || 
                (x === 5 && y === 0 && piece === ' ') ||
                (x === 3 && y === 2 && piece === ' ') ||
                (x === 5 && y === 2 && piece === ' ')
              );
              
              // Styling
              let bgColor = '';
              let color = '';
              
              if (isAtCursor) {
                bgColor = 'blue';
                color = 'white';
              } else if (isSelected) {
                bgColor = 'cyan';
                color = 'black';
              } else if (isHighlighted) {
                bgColor = 'green';
                color = 'black';
              } else if (isRiver && piece === ' ') {
                bgColor = 'blueBright';
                color = 'white';
              }
              
              // Determine piece color
              if (!isAtCursor && !isSelected && !isHighlighted) {
                const existingPiece = board.getPieceAt(pos);
                if (existingPiece) {
                  color = existingPiece.color === PieceColor.RED ? 'red' : 'black';
                }
              }
              
              // Determine what to display at intersection
              let cellContent = piece;
              if (piece === ' ') {
                // No more diagonal lines in palaces, use uniform dots
                if (isRedPalaceDiagonal || isBlackPalaceDiagonal) {
                  cellContent = EMPTY_POSITION;
                } else if (isRiver) {
                  // River labels
                  if (x === 1 && y === 4) cellContent = '楚';
                  else if (x === 2 && y === 4) cellContent = '河';
                  else if (x === 6 && y === 4) cellContent = '汉';
                  else if (x === 7 && y === 4) cellContent = '界';
                  else cellContent = EMPTY_POSITION;
                } else {
                  // Use full-width dots to represent positions
                  cellContent = EMPTY_POSITION;
                }
              }
              
              // Render piece with spacing for better alignment
              return (
                <React.Fragment key={`cell-${x}-${y}`}>
                  <Text backgroundColor={bgColor} color={color} bold={true}>
                    {cellContent}
                  </Text>
                  {/* No horizontal lines between positions, just spacing */}
                  {x < COLS - 1 && <Text>{' '}</Text>}
                </React.Fragment>
              );
            })}
            <Text>{VERTICAL}</Text>
          </Box>
        );
        
        rows.push(row);
        
        // No horizontal lines between rows, simple cleaner layout
      }
      
      return rows;
    };
    
    // Assemble all board elements
    const boardElements = [];
    
    // Add top border
    boardElements.push(createHorizontalBorder(true));
    
    // Add game board
    boardElements.push(...createGameBoard());
    
    // Add bottom border
    boardElements.push(createHorizontalBorder(false));
    
    return boardElements;
  };

  return (
    <Box flexDirection="column" borderStyle="round" padding={1}>
      <Text>Current Player: {currentPlayer === PieceColor.RED ? '🔴 Red' : '⚫ Black'}</Text>
      {selectedPiece && (
        <Text color={selectedPiece.color === PieceColor.RED ? 'red' : 'black'}>
          Selected: {selectedPiece.getDisplayName()} at ({selectedPiece.position.x}, {selectedPiece.position.y})
        </Text>
      )}
      
      {/* Main board container */}
      <Box flexDirection="column" marginY={1}>
        {renderBoard()}
      </Box>
      
      <Text>Use arrow keys to move cursor. Press Space to select/place a piece.</Text>
      <Text>Press 'q' to quit, 'r' to reset the game.</Text>
    </Box>
  );
};
