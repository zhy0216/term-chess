import { Game, GameStatus } from '../../models/Game.js';
import { PieceType, PieceColor, Position } from '../../models/Piece.js';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  test('should initialize with correct default state', () => {
    expect(game.board).toBeDefined();
    expect(game.rules).toBeDefined();
    expect(game.currentPlayer).toBe(PieceColor.RED);
    expect(game.status).toBe(GameStatus.ONGOING);
    expect(game.selectedPiece).toBeNull();
    expect(game.cursorPosition).toEqual({ x: 4, y: 4 });
    expect(game.moveHistory).toEqual([]);
  });

  describe('cursor movement', () => {
    test('should move cursor in valid directions', () => {
      // Starting at {x: 4, y: 4}
      expect(game.moveCursor('up')).toBe(true);
      expect(game.cursorPosition).toEqual({ x: 4, y: 3 });
      
      expect(game.moveCursor('left')).toBe(true);
      expect(game.cursorPosition).toEqual({ x: 3, y: 3 });
      
      expect(game.moveCursor('down')).toBe(true);
      expect(game.cursorPosition).toEqual({ x: 3, y: 4 });
      
      expect(game.moveCursor('right')).toBe(true);
      expect(game.cursorPosition).toEqual({ x: 4, y: 4 });
    });

    test('should not move cursor outside board boundaries', () => {
      // Move to edge
      for (let i = 0; i < 10; i++) {
        game.moveCursor('up');
      }
      expect(game.cursorPosition.y).toBe(0);
      
      // Should not move beyond edge
      expect(game.moveCursor('up')).toBe(false);
      expect(game.cursorPosition.y).toBe(0);
      
      // Test other boundaries too
      for (let i = 0; i < 10; i++) {
        game.moveCursor('left');
      }
      expect(game.cursorPosition.x).toBe(0);
      expect(game.moveCursor('left')).toBe(false);
    });
  });

  describe('piece selection and movement', () => {
    test('should select a piece of current player color', () => {
      // Move cursor to a red piece
      game.cursorPosition = { x: 4, y: 9 }; // Red general
      
      expect(game.selectPieceAtCursor()).toBe(true);
      expect(game.selectedPiece).not.toBeNull();
      expect(game.selectedPiece!.type).toBe(PieceType.GENERAL);
      expect(game.selectedPiece!.color).toBe(PieceColor.RED);
    });

    test('should not select a piece of opponent color', () => {
      // Move cursor to a black piece
      game.cursorPosition = { x: 4, y: 0 }; // Black general
      
      expect(game.selectPieceAtCursor()).toBe(false);
      expect(game.selectedPiece).toBeNull();
    });

    test('should not select an empty position', () => {
      // Move cursor to empty position
      game.cursorPosition = { x: 4, y: 5 }; // Empty position
      
      expect(game.selectPieceAtCursor()).toBe(false);
      expect(game.selectedPiece).toBeNull();
    });

    test('should move selected piece to valid position', () => {
      // Select red general
      game.cursorPosition = { x: 4, y: 9 }; // Red general
      game.selectPieceAtCursor();
      
      // Move cursor to a valid position for general
      game.cursorPosition = { x: 4, y: 8 };
      
      const result = game.moveSelectedPieceToCursor();
      
      expect(result).toBe(true);
      expect(game.selectedPiece).toBeNull(); // Selection should be cleared
      expect(game.currentPlayer).toBe(PieceColor.BLACK); // Turn should switch
      expect(game.moveHistory.length).toBe(1);
      expect(game.board.getPieceAt({ x: 4, y: 8 })?.type).toBe(PieceType.GENERAL);
    });

    test('should not move selected piece to invalid position', () => {
      // Select red general
      game.cursorPosition = { x: 4, y: 9 }; // Red general
      game.selectPieceAtCursor();
      
      // Move cursor to an invalid position for general (outside palace)
      game.cursorPosition = { x: 4, y: 6 };
      
      const result = game.moveSelectedPieceToCursor();
      
      expect(result).toBe(false);
      expect(game.selectedPiece).not.toBeNull(); // Selection should remain
      expect(game.currentPlayer).toBe(PieceColor.RED); // Turn should not switch
      expect(game.moveHistory.length).toBe(0);
    });

    test('should not move if no piece is selected', () => {
      game.cursorPosition = { x: 4, y: 8 };
      
      const result = game.moveSelectedPieceToCursor();
      
      expect(result).toBe(false);
      expect(game.moveHistory.length).toBe(0);
    });
  });

  describe('game status updates', () => {
    test('should update game status when general is captured', () => {
      // Manually set up a situation where red general is captured
      const blackGeneral = game.board.getAllPieces().find(
        p => p.type === PieceType.GENERAL && p.color === PieceColor.BLACK
      );
      
      expect(blackGeneral).toBeDefined();
      
      // Remove the red general
      const redGeneral = game.board.getAllPieces().find(
        p => p.type === PieceType.GENERAL && p.color === PieceColor.RED
      );
      
      if (redGeneral) {
        game.board.removePiece(redGeneral.id);
      }
      
      // Update game status
      game.updateGameStatus();
      
      expect(game.status).toBe(GameStatus.BLACK_WIN);
    });
  });

  describe('valid move fetching', () => {
    test('should get valid moves for selected piece', () => {
      // Select red general
      game.cursorPosition = { x: 4, y: 9 }; // Red general
      game.selectPieceAtCursor();
      
      const validMoves = game.getValidMovesForSelectedPiece();
      
      expect(validMoves.length).toBeGreaterThan(0);
      expect(validMoves).toContainEqual({ x: 4, y: 8 });
    });

    test('should return empty array if no piece is selected', () => {
      const validMoves = game.getValidMovesForSelectedPiece();
      
      expect(validMoves).toEqual([]);
    });
  });

  test('should reset game state', () => {
    // Make some moves first
    game.cursorPosition = { x: 4, y: 9 }; // Red general
    game.selectPieceAtCursor();
    game.cursorPosition = { x: 4, y: 8 };
    game.moveSelectedPieceToCursor();
    
    // Reset the game
    game.reset();
    
    // Verify everything is back to initial state
    expect(game.currentPlayer).toBe(PieceColor.RED);
    expect(game.status).toBe(GameStatus.ONGOING);
    expect(game.selectedPiece).toBeNull();
    expect(game.cursorPosition).toEqual({ x: 4, y: 4 });
    expect(game.moveHistory).toEqual([]);
    
    // Check that pieces are back in initial positions
    expect(game.board.getPieceAt({ x: 4, y: 9 })?.type).toBe(PieceType.GENERAL);
    expect(game.board.getPieceAt({ x: 4, y: 8 })).toBeNull();
  });
});
