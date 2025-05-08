import React from 'react';
import { Box, Text } from 'ink';
import { Board as BoardModel } from '../models/Board.js';
import { Position, PieceColor } from '../models/Piece.js';

interface BoardProps {
  board: BoardModel;
  cursorPosition: Position;
  selectedPiece: Position | null;
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
  
  return (
    <Box flexDirection="column" borderStyle="round" padding={1}>
      <Text>Current Player: {currentPlayer === PieceColor.RED ? '🔴 Red' : '⚫ Black'}</Text>
      
      {/* Board rows */}
      {Array(10).fill(0).map((_, y) => (
        <Box key={y}>
          {Array(9).fill(0).map((_, x) => {
            const pos = { x, y };
            const isAtCursor = x === cursorPosition.x && y === cursorPosition.y;
            const isSelected = selectedPiece && x === selectedPiece.x && y === selectedPiece.y;
            const isHighlighted = isValidMove(pos);
            const piece = grid[y][x];
            
            // Determine background color based on position state
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
            }
            
            // Determine piece color
            if (!isAtCursor && !isSelected && !isHighlighted) {
              const existingPiece = board.getPieceAt(pos);
              if (existingPiece) {
                color = existingPiece.color === PieceColor.RED ? 'red' : 'black';
              }
            }
            
            return (
              <Box key={`${x}-${y}`} width={3} justifyContent="center" alignItems="center">
                <Text backgroundColor={bgColor} color={color}>
                  {piece === ' ' ? (bgColor ? ' ' : '·') : piece}
                </Text>
              </Box>
            );
          })}
        </Box>
      ))}
      
      <Text>Use arrow keys to move cursor. Press Space to select/place a piece.</Text>
      <Text>Press 'q' to quit, 'r' to reset the game.</Text>
    </Box>
  );
};
