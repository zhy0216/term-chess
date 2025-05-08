import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { BoardComponent } from './Board.js';
import { Game, GameStatus } from '../models/Game.js';
import { ChessAI } from '../models/AI.js';
import { PieceColor } from '../models/Piece.js';

export const App: React.FC = () => {
  const [game, setGame] = useState<Game>(new Game());
  const [, setRender] = useState<number>(0);
  const [ai] = useState<ChessAI>(new ChessAI(game));
  
  // Force render update
  const forceUpdate = () => setRender(prev => prev + 1);
  
  // Handle keyboard input
  useInput((input: string, key: { upArrow?: boolean; downArrow?: boolean; leftArrow?: boolean; rightArrow?: boolean }) => {
    if (game.status !== GameStatus.ONGOING) {
      // Only allow reset if game is over
      if (input === 'r') {
        game.reset();
        forceUpdate();
      }
      return;
    }
    
    // Movement controls
    if (key.upArrow) {
      game.moveCursor('up');
      forceUpdate();
    } else if (key.downArrow) {
      game.moveCursor('down');
      forceUpdate();
    } else if (key.leftArrow) {
      game.moveCursor('left');
      forceUpdate();
    } else if (key.rightArrow) {
      game.moveCursor('right');
      forceUpdate();
    }
    
    // Selection/movement
    if (input === ' ') {
      if (game.selectedPiece) {
        // If a piece is already selected, try to move it
        if (game.moveSelectedPieceToCursor()) {
          forceUpdate();
          
          // If it's AI's turn, let AI make a move
          if (game.currentPlayer === PieceColor.BLACK && game.status === GameStatus.ONGOING) {
            setTimeout(() => {
              ai.makeMove();
              forceUpdate();
            }, 500);
          }
        } else {
          // Try to select a new piece if move is invalid
          game.selectPieceAtCursor();
          forceUpdate();
        }
      } else {
        // Try to select a piece
        game.selectPieceAtCursor();
        forceUpdate();
      }
    }
    
    // Reset game
    if (input === 'r') {
      game.reset();
      forceUpdate();
    }
    
    // Quit game
    if (input === 'q') {
      process.exit(0);
    }
  });
  
  return (
    <Box flexDirection="column" alignItems="center">
      <Text bold color="yellow">Chinese Chess (象棋)</Text>
      
      <BoardComponent
        board={game.board}
        cursorPosition={game.cursorPosition}
        selectedPiece={game.selectedPiece ? game.selectedPiece.position : null}
        validMoves={game.getValidMovesForSelectedPiece()}
        currentPlayer={game.currentPlayer}
      />
      
      {game.status !== GameStatus.ONGOING && (
        <Box marginTop={1}>
          <Text bold color="green">
            {game.status === GameStatus.RED_WIN 
              ? '🔴 Red wins!' 
              : game.status === GameStatus.BLACK_WIN 
                ? '⚫ Black wins!' 
                : 'Game ended in a draw!'
            }
            {' Press "r" to restart.'}
          </Text>
        </Box>
      )}
    </Box>
  );
};
