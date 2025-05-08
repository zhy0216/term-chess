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

export interface Piece {
  id: string;
  type: PieceType;
  color: PieceColor;
  position: Position;
  symbol: string;
}

// Get UTF-8 symbol for each piece
export function getPieceSymbol(type: PieceType, color: PieceColor): string {
  if (color === PieceColor.RED) {
    switch (type) {
      case PieceType.GENERAL: return '帅';
      case PieceType.ADVISOR: return '仕';
      case PieceType.ELEPHANT: return '相';
      case PieceType.HORSE: return '马';
      case PieceType.CHARIOT: return '车';
      case PieceType.CANNON: return '炮';
      case PieceType.SOLDIER: return '兵';
    }
  } else {
    switch (type) {
      case PieceType.GENERAL: return '将';
      case PieceType.ADVISOR: return '士';
      case PieceType.ELEPHANT: return '象';
      case PieceType.HORSE: return '马';
      case PieceType.CHARIOT: return '车';
      case PieceType.CANNON: return '炮';
      case PieceType.SOLDIER: return '卒';
    }
  }
}
