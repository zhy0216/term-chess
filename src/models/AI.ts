import { Game } from './Game.js';
import { Piece, PieceColor, Position } from './Piece.js';

// Simple AI implementation for Chinese chess
export class ChessAI {
  private game: Game;
  private aiColor: PieceColor;
  
  constructor(game: Game, aiColor: PieceColor = PieceColor.BLACK) {
    this.game = game;
    this.aiColor = aiColor;
  }
  
  // Make a move for the AI
  makeMove(): { from: Position, to: Position } | null {
    if (this.game.currentPlayer !== this.aiColor || this.game.status !== 'ONGOING') {
      return null;
    }
    
    // Get all pieces of the AI's color
    const allPieces = this.game.board.getAllPieces().filter(
      piece => piece.color === this.aiColor
    );
    
    // If no pieces left, return null
    if (allPieces.length === 0) {
      return null;
    }
    
    // Randomize the order of pieces to add variety
    this.shuffleArray(allPieces);
    
    // Try to find a valid move for any piece
    for (const piece of allPieces) {
      const validMoves = this.game.rules.getValidMoves(piece);
      
      if (validMoves.length > 0) {
        // Simple AI: prioritize captures
        const captureMove = validMoves.find(
          move => this.game.board.getPieceAt(move) !== null
        );
        
        // If there's a capture move, take it
        if (captureMove) {
          // Execute the move
          const fromPos = { ...piece.position };
          this.game.board.movePiece(fromPos, captureMove);
          
          // Update game state
          this.game.moveHistory.push({ from: fromPos, to: captureMove });
          this.game.updateGameStatus();
          this.game.currentPlayer = this.game.currentPlayer === PieceColor.RED 
            ? PieceColor.BLACK 
            : PieceColor.RED;
            
          return { from: fromPos, to: captureMove };
        }
        
        // Otherwise, take a random valid move
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        const randomMove = validMoves[randomIndex];
        
        // Execute the move
        const fromPos = { ...piece.position };
        this.game.board.movePiece(fromPos, randomMove);
        
        // Update game state
        this.game.moveHistory.push({ from: fromPos, to: randomMove });
        this.game.updateGameStatus();
        this.game.currentPlayer = this.game.currentPlayer === PieceColor.RED 
          ? PieceColor.BLACK 
          : PieceColor.RED;
          
        return { from: fromPos, to: randomMove };
      }
    }
    
    return null;
  }
  
  // Helper method to shuffle an array
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
