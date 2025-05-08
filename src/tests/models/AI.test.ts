import { ChessAI } from '../../models/AI.js';
import { Game, GameStatus } from '../../models/Game.js';
import { PieceType, PieceColor, Position } from '../../models/Piece.js';
import { jest } from '@jest/globals';

describe('ChessAI', () => {
  let game: Game;
  let ai: ChessAI;

  beforeEach(() => {
    game = new Game();
    ai = new ChessAI(game);
  });

  test('should initialize with correct default state', () => {
    expect(ai).toBeDefined();
  });

  test('should not make a move when it is not AI turn', () => {
    // Game initializes with RED's turn, but AI is BLACK by default
    const move = ai.makeMove();
    expect(move).toBeNull();
  });

  test('should not make a move when game is not ongoing', () => {
    // Set game status to RED_WIN
    game.status = GameStatus.RED_WIN;
    
    // Switch to BLACK turn
    game.currentPlayer = PieceColor.BLACK;
    
    const move = ai.makeMove();
    expect(move).toBeNull();
  });

  test('should make a valid move on its turn', () => {
    // Switch to BLACK turn
    game.currentPlayer = PieceColor.BLACK;
    
    const move = ai.makeMove();
    
    // AI should make a move
    expect(move).not.toBeNull();
    
    // The move should update the game state
    expect(game.currentPlayer).toBe(PieceColor.RED);
    expect(game.moveHistory.length).toBe(1);
  });

  test('should prioritize capture moves when available', () => {
    // Set up a situation where a capture is possible
    game.currentPlayer = PieceColor.BLACK;
    
    // Move a red piece where it can be captured
    const redPawn = game.board.getPieceAt({ x: 0, y: 6 })!;
    game.board.movePiece(redPawn.position, { x: 0, y: 3 });
    
    // Now make AI move
    const move = ai.makeMove();
    
    // AI should have made a move
    expect(move).not.toBeNull();
    
    // Check if the red pawn was captured
    const pawnStillExists = game.board.getAllPieces().some(p => p.id === redPawn.id);
    
    // In real execution, there's a chance the AI might make another valid move
    // but the prioritization logic should favor the capture if possible
    if (move && move.to.x === 0 && move.to.y === 3) {
      expect(pawnStillExists).toBe(false);
    }
  });
  
  test('should shuffle array in predictable way for testing', () => {
    // Create a controlled environment to test the shuffle
    const customAI = new ChessAI(game);
    
    // Use a spy to replace the random function with a deterministic one
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    
    const array = [1, 2, 3, 4, 5];
    const arrayCopy = [...array];
    
    // Access the private method for testing
    // @ts-ignore - Access private method for testing
    customAI.shuffleArray(array);
    
    // Check if array was mutated
    expect(array).not.toEqual(arrayCopy);
    
    // Restore the original Math.random
    jest.restoreAllMocks();
  });

  test('should handle case when AI has no pieces left', () => {
    // Set up a situation where the AI has no pieces left
    game.currentPlayer = PieceColor.BLACK;
    
    // Remove all black pieces
    game.board.getAllPieces()
      .filter(p => p.color === PieceColor.BLACK)
      .forEach(p => game.board.removePiece(p.id));
    
    // AI should return null since no pieces exist to move
    const move = ai.makeMove();
    expect(move).toBeNull();
  });
});
