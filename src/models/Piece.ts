// Chess piece types and positions
export enum PieceType {
  GENERAL = 'GENERAL', // 将/帅
  ADVISOR = 'ADVISOR', // 士/仕
  ELEPHANT = 'ELEPHANT', // 象/相
  HORSE = 'HORSE', // 马
  CHARIOT = 'CHARIOT', // 车
  CANNON = 'CANNON', // 炮
  SOLDIER = 'SOLDIER' // 兵/卒
}

export enum PieceColor {
  RED = 'RED',
  BLACK = 'BLACK'
}

export interface Position {
  x: number;
  y: number;
}

// Chess piece class
export class Piece {
  private static readonly SYMBOLS = {
    [PieceColor.RED]: {
      [PieceType.GENERAL]: '帅',
      [PieceType.ADVISOR]: '仕',
      [PieceType.ELEPHANT]: '相',
      [PieceType.HORSE]: '马',
      [PieceType.CHARIOT]: '车',
      [PieceType.CANNON]: '炮',
      [PieceType.SOLDIER]: '兵',
    },
    [PieceColor.BLACK]: {
      [PieceType.GENERAL]: '将',
      [PieceType.ADVISOR]: '士',
      [PieceType.ELEPHANT]: '象',
      [PieceType.HORSE]: '马',
      [PieceType.CHARIOT]: '车',
      [PieceType.CANNON]: '炮',
      [PieceType.SOLDIER]: '卒',
    }
  };

  // Properties
  public readonly id: string;
  public readonly type: PieceType;
  public readonly color: PieceColor;
  public position: Position;
  public readonly symbol: string;

  constructor(id: string, type: PieceType, color: PieceColor, position: Position) {
    this.id = id;
    this.type = type;
    this.color = color;
    this.position = { ...position };

    // Set symbol based on piece type and color (using Chinese characters)
    this.symbol = Piece.SYMBOLS[color][type];
  }

  // Clone this piece
  clone(): Piece {
    return new Piece(this.id, this.type, this.color, { ...this.position });
  }

  // Move the piece to a new position
  moveTo(position: Position): void {
    this.position = { ...position };
  }

  // Calculate distance to another position
  distanceTo(position: Position): { dx: number, dy: number } {
    return {
      dx: Math.abs(this.position.x - position.x),
      dy: Math.abs(this.position.y - position.y)
    };
  }

  // Check if this piece can capture another piece
  canCapture(otherPiece: Piece): boolean {
    return this.color !== otherPiece.color;
  }

  // Get piece display name (for UI or logs)
  getDisplayName(): string {
    return `${this.color === PieceColor.RED ? 'Red' : 'Black'} ${this.getPieceName()}`;
  }

  // Get the name of the piece type
  getPieceName(): string {
    switch (this.type) {
      case PieceType.GENERAL: return this.color === PieceColor.RED ? 'General (帅)' : 'General (将)';
      case PieceType.ADVISOR: return this.color === PieceColor.RED ? 'Advisor (仕)' : 'Advisor (士)';
      case PieceType.ELEPHANT: return this.color === PieceColor.RED ? 'Elephant (相)' : 'Elephant (象)';
      case PieceType.HORSE: return 'Horse (马)';
      case PieceType.CHARIOT: return 'Chariot (车)';
      case PieceType.CANNON: return 'Cannon (炮)';
      case PieceType.SOLDIER: return this.color === PieceColor.RED ? 'Soldier (兵)' : 'Soldier (卒)';
      default: return 'Unknown Piece';
    }
  }
}
