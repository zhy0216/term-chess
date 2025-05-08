import { Board, BOARD_WIDTH, BOARD_HEIGHT } from '../../models/Board.js';
import { PieceType, PieceColor, Position } from '../../models/Piece.js';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  test('should initialize with correct dimensions', () => {
    expect(BOARD_WIDTH).toBe(9);
    expect(BOARD_HEIGHT).toBe(10);
  });

  test('should initialize with all pieces in standard positions', () => {
    const pieces = board.getAllPieces();
    
    // Should have 32 pieces total (16 per side)
    expect(pieces.length).toBe(32);

    // Check for specific pieces
    const redGeneral = pieces.find(p => p.type === PieceType.GENERAL && p.color === PieceColor.RED);
    const blackGeneral = pieces.find(p => p.type === PieceType.GENERAL && p.color === PieceColor.BLACK);
    
    expect(redGeneral).toBeDefined();
    expect(blackGeneral).toBeDefined();
    expect(redGeneral?.position).toEqual({ x: 4, y: 9 });
    expect(blackGeneral?.position).toEqual({ x: 4, y: 0 });
    
    // Count specific piece types for each color
    const redPieces = pieces.filter(p => p.color === PieceColor.RED);
    const blackPieces = pieces.filter(p => p.color === PieceColor.BLACK);
    
    expect(redPieces.length).toBe(16);
    expect(blackPieces.length).toBe(16);
  });

  test('should get piece at position', () => {
    // Position with piece
    const redGeneralPosition: Position = { x: 4, y: 9 };
    const piece = board.getPieceAt(redGeneralPosition);
    
    expect(piece).not.toBeNull();
    expect(piece?.type).toBe(PieceType.GENERAL);
    expect(piece?.color).toBe(PieceColor.RED);
    
    // Empty position
    const emptyPosition: Position = { x: 4, y: 5 }; // Middle of the board
    const emptyResult = board.getPieceAt(emptyPosition);
    
    expect(emptyResult).toBeNull();
  });

  test('should move piece to empty position', () => {
    const fromPos: Position = { x: 4, y: 9 }; // Red general
    const toPos: Position = { x: 4, y: 8 };   // Empty position
    
    const result = board.movePiece(fromPos, toPos);
    
    expect(result).toBe(true);
    expect(board.getPieceAt(fromPos)).toBeNull();
    expect(board.getPieceAt(toPos)?.type).toBe(PieceType.GENERAL);
  });

  test('should capture opponent piece', () => {
    // First move a black piece within capture range
    const blackPosition: Position = { x: 0, y: 0 }; // Black chariot
    const capturePosition: Position = { x: 0, y: 8 }; // Near red chariot
    
    // Move black chariot to position for capture
    board.movePiece(blackPosition, capturePosition);
    
    // Now capture with red chariot
    const redPosition: Position = { x: 0, y: 9 }; // Red chariot
    
    const result = board.movePiece(redPosition, capturePosition);
    
    expect(result).toBe(true);
    expect(board.getPieceAt(capturePosition)?.color).toBe(PieceColor.RED);
    
    // Black piece should be removed
    const blackPieces = board.getAllPieces().filter(p => p.color === PieceColor.BLACK);
    expect(blackPieces.length).toBe(15);
  });

  test('should not move to position with same color piece', () => {
    const redGeneralPos: Position = { x: 4, y: 9 };
    const redChariotPos: Position = { x: 0, y: 9 };
    
    const result = board.movePiece(redGeneralPos, redChariotPos);
    
    expect(result).toBe(false);
    expect(board.getPieceAt(redGeneralPos)?.type).toBe(PieceType.GENERAL);
    expect(board.getPieceAt(redChariotPos)?.type).toBe(PieceType.CHARIOT);
  });

  test('should remove piece from board', () => {
    const pieces = board.getAllPieces();
    const redGeneral = pieces.find(p => p.type === PieceType.GENERAL && p.color === PieceColor.RED);
    
    expect(redGeneral).toBeDefined();
    
    if (redGeneral) {
      board.removePiece(redGeneral.id);
      
      const updatedPieces = board.getAllPieces();
      const removedPiece = updatedPieces.find(p => p.id === redGeneral.id);
      
      expect(removedPiece).toBeUndefined();
      expect(updatedPieces.length).toBe(pieces.length - 1);
    }
  });

  test('should validate position within board boundaries', () => {
    const validPosition: Position = { x: 0, y: 0 };
    const invalidXPosition: Position = { x: -1, y: 5 };
    const invalidYPosition: Position = { x: 5, y: 10 };
    
    expect(board.isValidPosition(validPosition)).toBe(true);
    expect(board.isValidPosition(invalidXPosition)).toBe(false);
    expect(board.isValidPosition(invalidYPosition)).toBe(false);
  });

  test('should reset board to initial state', () => {
    // Move some pieces
    board.movePiece({ x: 0, y: 9 }, { x: 0, y: 8 });
    board.movePiece({ x: 0, y: 0 }, { x: 0, y: 1 });
    
    // Reset the board
    board.resetBoard();
    
    const pieces = board.getAllPieces();
    
    // Should have all 32 pieces back in initial positions
    expect(pieces.length).toBe(32);
    expect(board.getPieceAt({ x: 0, y: 9 })?.type).toBe(PieceType.CHARIOT);
    expect(board.getPieceAt({ x: 0, y: 0 })?.type).toBe(PieceType.CHARIOT);
    
    // Moved pieces should be back in original positions
    expect(board.getPieceAt({ x: 0, y: 8 })).toBeNull();
    expect(board.getPieceAt({ x: 0, y: 1 })).toBeNull();
  });
});
