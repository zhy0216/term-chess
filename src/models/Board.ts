import { Piece, PieceType, PieceColor, Position } from './Piece.js';

// Chinese chess board is 9x10
export const BOARD_WIDTH = 9;
export const BOARD_HEIGHT = 10;

export class Board {
  private pieces: Piece[] = [];
  
  constructor() {
    this.resetBoard();
  }

  // Initialize the board with standard piece arrangement
  resetBoard() {
    this.pieces = [];
    
    // Initialize red pieces (bottom)
    // Back row: Chariot, Horse, Elephant, Advisor, General, Advisor, Elephant, Horse, Chariot
    this.addPiece(PieceType.CHARIOT, PieceColor.RED, { x: 0, y: 9 });
    this.addPiece(PieceType.HORSE, PieceColor.RED, { x: 1, y: 9 });
    this.addPiece(PieceType.ELEPHANT, PieceColor.RED, { x: 2, y: 9 });
    this.addPiece(PieceType.ADVISOR, PieceColor.RED, { x: 3, y: 9 });
    this.addPiece(PieceType.GENERAL, PieceColor.RED, { x: 4, y: 9 });
    this.addPiece(PieceType.ADVISOR, PieceColor.RED, { x: 5, y: 9 });
    this.addPiece(PieceType.ELEPHANT, PieceColor.RED, { x: 6, y: 9 });
    this.addPiece(PieceType.HORSE, PieceColor.RED, { x: 7, y: 9 });
    this.addPiece(PieceType.CHARIOT, PieceColor.RED, { x: 8, y: 9 });
    
    // Cannons positioned at ranks 2 from each side
    this.addPiece(PieceType.CANNON, PieceColor.RED, { x: 1, y: 7 });
    this.addPiece(PieceType.CANNON, PieceColor.RED, { x: 7, y: 7 });
    
    // Soldiers at front line before the river
    this.addPiece(PieceType.SOLDIER, PieceColor.RED, { x: 0, y: 6 });
    this.addPiece(PieceType.SOLDIER, PieceColor.RED, { x: 2, y: 6 });
    this.addPiece(PieceType.SOLDIER, PieceColor.RED, { x: 4, y: 6 });
    this.addPiece(PieceType.SOLDIER, PieceColor.RED, { x: 6, y: 6 });
    this.addPiece(PieceType.SOLDIER, PieceColor.RED, { x: 8, y: 6 });
    
    // Initialize black pieces (top) - perfectly mirrored from red side
    // Back row: Chariot, Horse, Elephant, Advisor, General, Advisor, Elephant, Horse, Chariot
    this.addPiece(PieceType.CHARIOT, PieceColor.BLACK, { x: 0, y: 0 });
    this.addPiece(PieceType.HORSE, PieceColor.BLACK, { x: 1, y: 0 });
    this.addPiece(PieceType.ELEPHANT, PieceColor.BLACK, { x: 2, y: 0 });
    this.addPiece(PieceType.ADVISOR, PieceColor.BLACK, { x: 3, y: 0 });
    this.addPiece(PieceType.GENERAL, PieceColor.BLACK, { x: 4, y: 0 });
    this.addPiece(PieceType.ADVISOR, PieceColor.BLACK, { x: 5, y: 0 });
    this.addPiece(PieceType.ELEPHANT, PieceColor.BLACK, { x: 6, y: 0 });
    this.addPiece(PieceType.HORSE, PieceColor.BLACK, { x: 7, y: 0 });
    this.addPiece(PieceType.CHARIOT, PieceColor.BLACK, { x: 8, y: 0 });
    
    // Cannons positioned at ranks 2 from each side
    this.addPiece(PieceType.CANNON, PieceColor.BLACK, { x: 1, y: 2 });
    this.addPiece(PieceType.CANNON, PieceColor.BLACK, { x: 7, y: 2 });
    
    // Soldiers at front line (moved to row 3 now that the river is gone)
    this.addPiece(PieceType.SOLDIER, PieceColor.BLACK, { x: 0, y: 3 });
    this.addPiece(PieceType.SOLDIER, PieceColor.BLACK, { x: 2, y: 3 });
    this.addPiece(PieceType.SOLDIER, PieceColor.BLACK, { x: 4, y: 3 });
    this.addPiece(PieceType.SOLDIER, PieceColor.BLACK, { x: 6, y: 3 });
    this.addPiece(PieceType.SOLDIER, PieceColor.BLACK, { x: 8, y: 3 });
  }

  private addPiece(type: PieceType, color: PieceColor, position: Position) {
    const id = `${color}-${type}-${this.pieces.length}`;
    const piece = new Piece(id, type, color, position);
    this.pieces.push(piece);
  }

  // Get piece at a specific position
  getPieceAt(position: Position): Piece | null {
    return this.pieces.find(
      piece => piece.position.x === position.x && piece.position.y === position.y
    ) || null;
  }

  // Get all pieces
  getAllPieces(): Piece[] {
    return [...this.pieces];
  }

  // Move a piece to a new position
  movePiece(fromPos: Position, toPos: Position): boolean {
    const piece = this.getPieceAt(fromPos);
    if (!piece) return false;

    // Check if there's a piece at the target position
    const targetPiece = this.getPieceAt(toPos);
    if (targetPiece) {
      // Cannot capture your own pieces
      if (targetPiece.color === piece.color) return false;
      
      // Remove captured piece
      this.removePiece(targetPiece.id);
    }

    // Update piece position using the Piece class's moveTo method
    piece.moveTo(toPos);
    return true;
  }

  // Remove a piece from the board
  removePiece(pieceId: string) {
    this.pieces = this.pieces.filter(piece => piece.id !== pieceId);
  }

  // Check if a position is within the board boundaries
  isValidPosition(position: Position): boolean {
    // Only check board boundaries now (no river)
    return position.x >= 0 && position.x < BOARD_WIDTH &&
           position.y >= 0 && position.y < BOARD_HEIGHT;
  }
}
