import { Board } from './Board.js';
import { Rules } from './Rules.js';
import { Piece, PieceColor, Position } from './Piece.js';

export enum GameStatus {
  ONGOING = 'ONGOING',
  RED_WIN = 'RED_WIN',
  BLACK_WIN = 'BLACK_WIN',
  DRAW = 'DRAW'
}

export class Game {
  public board: Board;
  public rules: Rules;
  public currentPlayer: PieceColor;
  public status: GameStatus;
  public selectedPiece: Piece | null = null;
  public cursorPosition: Position = { x: 4, y: 4 };
  public moveHistory: { from: Position, to: Position }[] = [];
  
  constructor() {
    this.board = new Board();
    this.rules = new Rules(this.board);
    this.currentPlayer = PieceColor.RED; // Red goes first
    this.status = GameStatus.ONGOING;
  }
  
  // Select a piece at the current cursor position
  selectPieceAtCursor(): boolean {
    const piece = this.board.getPieceAt(this.cursorPosition);
    
    // Can only select a piece of the current player's color
    if (piece && piece.color === this.currentPlayer) {
      this.selectedPiece = piece;
      return true;
    }
    
    return false;
  }
  
  // Move the selected piece to the current cursor position
  moveSelectedPieceToCursor(): boolean {
    if (!this.selectedPiece) return false;
    
    // Check if the move is valid
    if (this.rules.isValidMove(this.selectedPiece, this.cursorPosition)) {
      const fromPos = { ...this.selectedPiece.position };
      const result = this.board.movePiece(fromPos, this.cursorPosition);
      
      if (result) {
        // Record the move
        this.moveHistory.push({ from: fromPos, to: { ...this.cursorPosition } });
        
        // Update game status
        this.updateGameStatus();
        
        // Switch players
        this.currentPlayer = this.currentPlayer === PieceColor.RED 
          ? PieceColor.BLACK 
          : PieceColor.RED;
          
        this.selectedPiece = null;
        
        return true;
      }
    }
    
    return false;
  }
  
  // Move cursor
  moveCursor(direction: 'up' | 'down' | 'left' | 'right'): boolean {
    const newPosition = { ...this.cursorPosition };
    
    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, newPosition.y - 1);
        break;
      case 'down':
        newPosition.y = Math.min(9, newPosition.y + 1);
        break;
      case 'left':
        newPosition.x = Math.max(0, newPosition.x - 1);
        break;
      case 'right':
        newPosition.x = Math.min(8, newPosition.x + 1);
        break;
    }
    
    if (newPosition.x !== this.cursorPosition.x || newPosition.y !== this.cursorPosition.y) {
      this.cursorPosition = newPosition;
      return true;
    }
    
    return false;
  }
  
  // Update game status after a move
  public updateGameStatus() {
    const pieces = this.board.getAllPieces();
    const redGeneral = pieces.find(p => p.type === 'GENERAL' && p.color === PieceColor.RED);
    const blackGeneral = pieces.find(p => p.type === 'GENERAL' && p.color === PieceColor.BLACK);
    
    if (!redGeneral) {
      this.status = GameStatus.BLACK_WIN;
    } else if (!blackGeneral) {
      this.status = GameStatus.RED_WIN;
    } else {
      this.status = GameStatus.ONGOING;
    }
  }
  
  // Reset the game
  reset() {
    this.board.resetBoard();
    this.currentPlayer = PieceColor.RED;
    this.status = GameStatus.ONGOING;
    this.selectedPiece = null;
    this.cursorPosition = { x: 4, y: 4 };
    this.moveHistory = [];
  }
  
  // Get valid moves for the selected piece
  getValidMovesForSelectedPiece(): Position[] {
    if (!this.selectedPiece) return [];
    
    return this.rules.getValidMoves(this.selectedPiece);
  }
}
