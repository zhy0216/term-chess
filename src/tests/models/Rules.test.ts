import { Rules } from '../../models/Rules.js';
import { Board } from '../../models/Board.js';
import { Piece, PieceType, PieceColor, Position } from '../../models/Piece.js';

describe('Rules', () => {
  let board: Board;
  let rules: Rules;

  beforeEach(() => {
    board = new Board();
    rules = new Rules(board);
  });

  describe('Basic movement validation', () => {
    test('should validate board boundaries and same color captures', () => {
      const redGeneral = board.getPieceAt({ x: 4, y: 9 });
      expect(redGeneral).not.toBeNull();
      
      // Out of board bounds
      expect(rules.isValidMove(redGeneral!, { x: -1, y: 9 })).toBe(false);
      expect(rules.isValidMove(redGeneral!, { x: 9, y: 9 })).toBe(false);
      
      // Cannot capture same color
      const redAdvisor = board.getPieceAt({ x: 3, y: 9 });
      expect(rules.isValidMove(redGeneral!, redAdvisor!.position)).toBe(false);
    });
  });

  describe('Piece specific movements', () => {
    test('should validate general movements', () => {
      const redGeneral = board.getPieceAt({ x: 4, y: 9 });
      
      // Valid moves - one step orthogonally within palace
      expect(rules.isValidMove(redGeneral!, { x: 4, y: 8 })).toBe(true);
      
      // Invalid moves - outside palace or diagonal
      expect(rules.isValidMove(redGeneral!, { x: 4, y: 6 })).toBe(false);
      expect(rules.isValidMove(redGeneral!, { x: 5, y: 8 })).toBe(false);
    });

    test('should validate advisor movements', () => {
      const redAdvisor = board.getPieceAt({ x: 3, y: 9 });
      
      // Valid moves - one step diagonally within palace
      expect(rules.isValidMove(redAdvisor!, { x: 4, y: 8 })).toBe(true);
      
      // Invalid moves - outside palace or orthogonal
      expect(rules.isValidMove(redAdvisor!, { x: 2, y: 7 })).toBe(false);
      expect(rules.isValidMove(redAdvisor!, { x: 3, y: 8 })).toBe(false);
    });

    test('should validate elephant movements', () => {
      const redElephant = board.getPieceAt({ x: 2, y: 9 });
      
      // Valid moves - exactly two steps diagonally
      expect(rules.isValidMove(redElephant!, { x: 0, y: 7 })).toBe(true);
      expect(rules.isValidMove(redElephant!, { x: 4, y: 7 })).toBe(true);
      
      // Invalid moves - other patterns
      expect(rules.isValidMove(redElephant!, { x: 2, y: 7 })).toBe(false);
    });

    test('should validate horse movements', () => {
      const redHorse = board.getPieceAt({ x: 1, y: 9 });
      
      // Valid moves - L shape
      expect(rules.isValidMove(redHorse!, { x: 0, y: 7 })).toBe(true);
      expect(rules.isValidMove(redHorse!, { x: 2, y: 7 })).toBe(true);
      // There are pieces in the way of the horse at starting position, so this move isn't valid
      // Moving to 3,8 would require moving through the advisor at 2,9
    });

    test('should validate chariot movements', () => {
      // Moving red chariot to a clear position for testing
      board.movePiece({ x: 0, y: 9 }, { x: 0, y: 7 });
      const redChariot = board.getPieceAt({ x: 0, y: 7 });
      
      // We need to clear the path for proper testing
      // Find the soldier at position 0,6 and remove it
      const blockingPiece = board.getPieceAt({ x: 0, y: 6 });
      if (blockingPiece) {
        board.removePiece(blockingPiece.id);
      }
      
      // Now the path should be clear
      expect(rules.isValidMove(redChariot!, { x: 0, y: 3 })).toBe(true);
    });

    test('should validate soldier movements', () => {
      const redSoldier = board.getPieceAt({ x: 0, y: 6 });
      
      // Valid moves - forward only before crossing river
      expect(rules.isValidMove(redSoldier!, { x: 0, y: 5 })).toBe(true);
      
      // Invalid moves - backwards or sideways before crossing
      expect(rules.isValidMove(redSoldier!, { x: 0, y: 7 })).toBe(false);
      expect(rules.isValidMove(redSoldier!, { x: 1, y: 6 })).toBe(false);
    });
  });

  test('should get all valid moves for a piece', () => {
    const redGeneral = board.getPieceAt({ x: 4, y: 9 });
    const validMoves = rules.getValidMoves(redGeneral!);
    
    // General should have valid moves
    expect(validMoves.length).toBeGreaterThan(0);
    
    // Each move should be valid
    for (const move of validMoves) {
      expect(rules.isValidMove(redGeneral!, move)).toBe(true);
    }
  });
});
