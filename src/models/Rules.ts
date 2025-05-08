import { Piece, PieceType, PieceColor, Position } from './Piece.js';
import { Board, BOARD_WIDTH, BOARD_HEIGHT } from './Board.js';

// Chinese chess rules implementation
export class Rules {
  constructor(private board: Board) {}

  // Check if a move is valid based on piece type and game rules
  isValidMove(piece: Piece, targetPos: Position): boolean {
    // Basic validation - only checking if position is within board boundaries
    if (!this.board.isValidPosition(targetPos)) {
      return false;
    }

    // Cannot move to a position occupied by a piece of the same color
    const targetPiece = this.board.getPieceAt(targetPos);
    if (targetPiece && targetPiece.color === piece.color) {
      return false;
    }

    // Specific rules for each piece type
    switch (piece.type) {
      case PieceType.GENERAL:
        return this.isValidGeneralMove(piece, targetPos);
      case PieceType.ADVISOR:
        return this.isValidAdvisorMove(piece, targetPos);
      case PieceType.ELEPHANT:
        return this.isValidElephantMove(piece, targetPos);
      case PieceType.HORSE:
        return this.isValidHorseMove(piece, targetPos);
      case PieceType.CHARIOT:
        return this.isValidChariotMove(piece, targetPos);
      case PieceType.CANNON:
        return this.isValidCannonMove(piece, targetPos);
      case PieceType.SOLDIER:
        return this.isValidSoldierMove(piece, targetPos);
      default:
        return false;
    }
  }

  // Get all valid moves for a piece
  getValidMoves(piece: Piece): Position[] {
    const validMoves: Position[] = [];
    
    // Scan all positions on the board
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        const targetPos = { x, y };
        if (this.isValidMove(piece, targetPos)) {
          validMoves.push(targetPos);
        }
      }
    }
    
    return validMoves;
  }

  // General/King (将/帅) can only move one step horizontally or vertically and must stay in the palace (3x3 area)
  private isValidGeneralMove(piece: Piece, targetPos: Position): boolean {
    const dx = Math.abs(targetPos.x - piece.position.x);
    const dy = Math.abs(targetPos.y - piece.position.y);
    
    // Can only move one step horizontally or vertically
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      // Must stay in the palace
      return this.isInPalace(targetPos, piece.color);
    }
    
    // Special rule: flying general (将帅对面) - when the two generals face each other
    // with no pieces in between, it's an invalid move
    if (dx === 0 && 
        this.isFlyingGeneral(piece.position, targetPos)) {
      return false;
    }
    
    return false;
  }

  // Check if a position is in the palace area (3x3)
  private isInPalace(pos: Position, color: PieceColor): boolean {
    // Palace coordinates for each side
    const xValid = pos.x >= 3 && pos.x <= 5;
    const yValid = color === PieceColor.RED
      ? pos.y >= 7 && pos.y <= 9  // Red palace (bottom)
      : pos.y >= 0 && pos.y <= 2; // Black palace (top)
    
    return xValid && yValid;
  }

  // Check for flying general rule
  private isFlyingGeneral(pos1: Position, pos2: Position): boolean {
    if (pos1.x !== pos2.x) return false;
    
    const pieces = this.board.getAllPieces();
    const redGeneral = pieces.find(p => p.type === PieceType.GENERAL && p.color === PieceColor.RED);
    const blackGeneral = pieces.find(p => p.type === PieceType.GENERAL && p.color === PieceColor.BLACK);
    
    if (!redGeneral || !blackGeneral) return false;
    
    // Check if generals are on the same file
    if (redGeneral.position.x !== blackGeneral.position.x) return false;
    
    // Check if there are pieces between them
    const minY = Math.min(redGeneral.position.y, blackGeneral.position.y);
    const maxY = Math.max(redGeneral.position.y, blackGeneral.position.y);
    
    for (let y = minY + 1; y < maxY; y++) {
      if (this.board.getPieceAt({ x: redGeneral.position.x, y })) {
        return false; // There's a piece between generals
      }
    }
    
    return true; // Generals face each other with no pieces in between
  }

  // Advisor/Minister (士/仕) can only move one step diagonally and must stay in the palace
  private isValidAdvisorMove(piece: Piece, targetPos: Position): boolean {
    const dx = Math.abs(targetPos.x - piece.position.x);
    const dy = Math.abs(targetPos.y - piece.position.y);
    
    // Can only move one step diagonally
    return dx === 1 && dy === 1 && this.isInPalace(targetPos, piece.color);
  }

  // Elephant/Bishop (象/相) can only move exactly two steps diagonally and cannot cross the river
  private isValidElephantMove(piece: Piece, targetPos: Position): boolean {
    const dx = Math.abs(targetPos.x - piece.position.x);
    const dy = Math.abs(targetPos.y - piece.position.y);
    
    // Can only move exactly two steps diagonally
    if (dx !== 2 || dy !== 2) return false;
    
    // Cannot cross the river
    if (piece.color === PieceColor.RED && targetPos.y < 5) return false;
    if (piece.color === PieceColor.BLACK && targetPos.y > 4) return false;
    
    // Check if the path is blocked (elephant eye)
    const eyeX = (piece.position.x + targetPos.x) / 2;
    const eyeY = (piece.position.y + targetPos.y) / 2;
    return !this.board.getPieceAt({ x: eyeX, y: eyeY });
  }

  // Horse/Knight (马) moves in an L shape but can be blocked
  private isValidHorseMove(piece: Piece, targetPos: Position): boolean {
    const dx = Math.abs(targetPos.x - piece.position.x);
    const dy = Math.abs(targetPos.y - piece.position.y);
    
    // L shape movement (2-1 pattern)
    if (!((dx === 2 && dy === 1) || (dx === 1 && dy === 2))) return false;
    
    // Check for blocking piece (马腿)
    if (dx === 2) {
      // Moving horizontally then vertically
      const blockX = piece.position.x > targetPos.x ? piece.position.x - 1 : piece.position.x + 1;
      return !this.board.getPieceAt({ x: blockX, y: piece.position.y });
    } else {
      // Moving vertically then horizontally
      const blockY = piece.position.y > targetPos.y ? piece.position.y - 1 : piece.position.y + 1;
      return !this.board.getPieceAt({ x: piece.position.x, y: blockY });
    }
  }

  // Chariot/Rook (车) can move any number of steps horizontally or vertically if the path is clear
  private isValidChariotMove(piece: Piece, targetPos: Position): boolean {
    const dx = Math.abs(targetPos.x - piece.position.x);
    const dy = Math.abs(targetPos.y - piece.position.y);
    
    // Must move along a straight line (horizontally or vertically)
    if (dx > 0 && dy > 0) return false;
    if (dx === 0 && dy === 0) return false;
    
    // Check path clearance
    return this.isPathClear(piece.position, targetPos);
  }

  // Cannon (炮) moves like Chariot but must jump exactly one piece to capture
  private isValidCannonMove(piece: Piece, targetPos: Position): boolean {
    const dx = Math.abs(targetPos.x - piece.position.x);
    const dy = Math.abs(targetPos.y - piece.position.y);
    
    // Must move along a straight line (horizontally or vertically)
    if (dx > 0 && dy > 0) return false;
    if (dx === 0 && dy === 0) return false;
    
    const targetPiece = this.board.getPieceAt(targetPos);
    
    if (targetPiece) {
      // To capture, must jump exactly one piece
      return this.countPiecesInPath(piece.position, targetPos) === 1;
    } else {
      // To move without capturing, path must be clear
      return this.isPathClear(piece.position, targetPos);
    }
  }

  // Soldier/Pawn (兵/卒) can only move forward before crossing the river, 
  // after crossing can move horizontally
  private isValidSoldierMove(piece: Piece, targetPos: Position): boolean {
    const dx = Math.abs(targetPos.x - piece.position.x);
    const dy = targetPos.y - piece.position.y;
    
    // Can only move one step at a time
    if (dx + Math.abs(dy) !== 1) return false;
    
    // Direction depends on color
    const forward = piece.color === PieceColor.RED ? -1 : 1;
    
    // Since there's no river now, we'll set a boundary in the middle of the board (row 4)
    const hasPassedMidpoint = piece.color === PieceColor.RED 
      ? piece.position.y < 5 
      : piece.position.y > 4;
    
    if (!hasPassedMidpoint) {
      // Before passing the middle, can only move forward
      return dx === 0 && dy === forward;
    } else {
      // After passing the middle, can move forward or horizontally
      return (dx === 0 && dy === forward) || (dx === 1 && dy === 0);
    }
  }

  // Check if the path between two positions is clear (for Chariot and non-capturing Cannon)
  private isPathClear(from: Position, to: Position): boolean {
    // If moving horizontally
    if (from.y === to.y) {
      const minX = Math.min(from.x, to.x);
      const maxX = Math.max(from.x, to.x);
      
      for (let x = minX + 1; x < maxX; x++) {
        if (this.board.getPieceAt({ x, y: from.y })) {
          return false;
        }
      }
      return true;
    }
    
    // If moving vertically
    if (from.x === to.x) {
      const minY = Math.min(from.y, to.y);
      const maxY = Math.max(from.y, to.y);
      
      for (let y = minY + 1; y < maxY; y++) {
        if (this.board.getPieceAt({ x: from.x, y })) {
          return false;
        }
      }
      return true;
    }
    
    return false;
  }

  // Count pieces in the path (for Cannon captures)
  private countPiecesInPath(from: Position, to: Position): number {
    let count = 0;
    
    // If moving horizontally
    if (from.y === to.y) {
      const minX = Math.min(from.x, to.x);
      const maxX = Math.max(from.x, to.x);
      
      for (let x = minX + 1; x < maxX; x++) {
        if (this.board.getPieceAt({ x, y: from.y })) {
          count++;
        }
      }
    }
    
    // If moving vertically
    if (from.x === to.x) {
      const minY = Math.min(from.y, to.y);
      const maxY = Math.max(from.y, to.y);
      
      for (let y = minY + 1; y < maxY; y++) {
        if (this.board.getPieceAt({ x: from.x, y })) {
          count++;
        }
      }
    }
    
    return count;
  }
}
