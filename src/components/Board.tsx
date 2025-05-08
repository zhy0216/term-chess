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
const DIAGONAL_SLASH = '╱';  // Diagonal for palace - forward slash
const DIAGONAL_BACKSLASH = '╲'; // Diagonal for palace - back slash

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
  
  // Helper function to render board grid lines
  const renderBoardGrid = () => {
    // Create top border
    const topBorder = [
      <Box key="top-border" marginLeft={2}>
        <Text>{TOP_LEFT}{GRID_HORIZONTAL}</Text>
        {Array(8).fill(0).map((_, i) => (
          <Text key={`top-t-${i}`}>{T_DOWN}{GRID_HORIZONTAL}</Text>
        ))}
        <Text>{TOP_RIGHT}</Text>
      </Box>
    ];
    
    // Create rows with pieces and vertical lines
    const rows = Array(10).fill(0).map((_, y) => {
      return (
        <Box key={`row-${y}`} marginLeft={2}>
          {/* Row label */}
          <Box marginRight={1} width={1}>
            <Text>{y}</Text>
          </Box>
          
          {/* Piece row with vertical separators */}
          {Array(9).fill(0).map((_, x) => {
            const pos = { x, y };
            const piece = grid[y][x];
            const isAtCursor = x === cursorPosition.x && y === cursorPosition.y;
            const isSelected = selectedPiece && x === selectedPiece.position.x && y === selectedPiece.position.y;
            const isHighlighted = isValidMove(pos);
            
            // Check for special board areas
            const isInRedPalace = x >= 3 && x <= 5 && y >= 7 && y <= 9;
            const isInBlackPalace = x >= 3 && x <= 5 && y >= 0 && y <= 2;
            const isRiver = y === 4 || y === 5;
            
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
              // Light blue background for the river
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
            
            // Determine what to display in the cell
            let cellContent = piece;
            if (piece === ' ') {
              if (isRedPalaceDiagonal) {
                cellContent = ((x === 3 && y === 7) || (x === 3 && y === 9) || (x === 5 && y === 7) || (x === 5 && y === 9)) 
                  ? DIAGONAL_SLASH 
                  : DIAGONAL_BACKSLASH;
              } else if (isBlackPalaceDiagonal) {
                cellContent = ((x === 3 && y === 0) || (x === 3 && y === 2) || (x === 5 && y === 0) || (x === 5 && y === 2)) 
                  ? DIAGONAL_SLASH 
                  : DIAGONAL_BACKSLASH;
              } else {
                cellContent = SPACE;
              }
            }
            
            // River label
            if (isRiver && x === 0 && piece === ' ') {
              cellContent = y === 4 ? '楚' : '河';
            } else if (isRiver && x === 8 && piece === ' ') {
              cellContent = y === 4 ? '河' : '汉';
            }
            
            return (
              <React.Fragment key={`cell-${x}-${y}`}>
                <Text>{VERTICAL}</Text>
                <Text backgroundColor={bgColor} color={color} bold={true}>
                  {cellContent}
                </Text>
              </React.Fragment>
            );
          })}
          <Text>{VERTICAL}</Text>
        </Box>
      );
    });
    
    // Create horizontal grid lines between rows
    const horizontalGridLines = Array(9).fill(0).map((_, i) => (
      <Box key={`grid-${i}`} marginLeft={2}>
        <Text>{T_RIGHT}{GRID_HORIZONTAL}</Text>
        {Array(8).fill(0).map((_, j) => (
          <Text key={`cross-${i}-${j}`}>{CROSS}{GRID_HORIZONTAL}</Text>
        ))}
        <Text>{T_LEFT}</Text>
      </Box>
    ));
    
    // Create bottom border
    const bottomBorder = [
      <Box key="bottom-border" marginLeft={2}>
        <Text>{BOTTOM_LEFT}{GRID_HORIZONTAL}</Text>
        {Array(8).fill(0).map((_, i) => (
          <Text key={`bottom-t-${i}`}>{T_UP}{GRID_HORIZONTAL}</Text>
        ))}
        <Text>{BOTTOM_RIGHT}</Text>
      </Box>
    ];
    
    // Interleave rows and grid lines
    const gridElements = [];
    
    // Add column headers
    gridElements.push(
      <Box key="col-headers" marginLeft={6}>
        {Array(9).fill(0).map((_, x) => (
          <Text key={`col-${x}`}>{` ${x} `}</Text>
        ))}
      </Box>
    );
    
    // Add top border
    gridElements.push(topBorder);
    
    // Add rows and horizontal lines
    rows.forEach((row, i) => {
      gridElements.push(row);
      if (i < rows.length - 1) {
        gridElements.push(horizontalGridLines[i]);
      }
    });
    
    // Add bottom border
    gridElements.push(bottomBorder);
    
    return gridElements;
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
        {renderBoardGrid()}
      </Box>
      
      <Text>Use arrow keys to move cursor. Press Space to select/place a piece.</Text>
      <Text>Press 'q' to quit, 'r' to reset the game.</Text>
    </Box>
  );
};
