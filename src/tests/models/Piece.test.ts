import { Piece, PieceType, PieceColor, Position } from '../../models/Piece.js';

describe('Piece', () => {
  let redGeneral: Piece;
  let blackSoldier: Piece;
  const initialPosition: Position = { x: 4, y: 9 };

  beforeEach(() => {
    redGeneral = new Piece('red-general', PieceType.GENERAL, PieceColor.RED, initialPosition);
    blackSoldier = new Piece('black-soldier', PieceType.SOLDIER, PieceColor.BLACK, { x: 4, y: 3 });
  });

  test('should create a piece with correct properties', () => {
    expect(redGeneral.id).toBe('red-general');
    expect(redGeneral.type).toBe(PieceType.GENERAL);
    expect(redGeneral.color).toBe(PieceColor.RED);
    expect(redGeneral.position).toEqual(initialPosition);
    expect(redGeneral.symbol).toBe('帅');
  });

  test('should correctly clone a piece', () => {
    const clonedPiece = redGeneral.clone();
    
    expect(clonedPiece).not.toBe(redGeneral); // Different object reference
    expect(clonedPiece.id).toBe(redGeneral.id);
    expect(clonedPiece.type).toBe(redGeneral.type);
    expect(clonedPiece.color).toBe(redGeneral.color);
    expect(clonedPiece.position).toEqual(redGeneral.position);
    expect(clonedPiece.position).not.toBe(redGeneral.position); // Different position object
  });

  test('should move piece to new position', () => {
    const newPosition: Position = { x: 4, y: 8 };
    redGeneral.moveTo(newPosition);
    
    expect(redGeneral.position).toEqual(newPosition);
    expect(redGeneral.position).not.toBe(newPosition); // Should be a different object (cloned)
  });

  test('should calculate distance to another position', () => {
    const targetPosition: Position = { x: 6, y: 7 };
    const distance = redGeneral.distanceTo(targetPosition);
    
    expect(distance).toEqual({ dx: 2, dy: 2 });
  });

  test('should determine if can capture another piece', () => {
    const redChariot = new Piece('red-chariot', PieceType.CHARIOT, PieceColor.RED, { x: 0, y: 9 });
    
    expect(redGeneral.canCapture(blackSoldier)).toBe(true); // Can capture opponent's piece
    expect(redGeneral.canCapture(redChariot)).toBe(false);  // Cannot capture own color
  });

  test('should get correct display name', () => {
    expect(redGeneral.getDisplayName()).toBe('Red General (帅)');
    expect(blackSoldier.getDisplayName()).toBe('Black Soldier (卒)');
  });

  test('should get correct piece name', () => {
    const redAdvisor = new Piece('red-advisor', PieceType.ADVISOR, PieceColor.RED, { x: 3, y: 9 });
    const blackElephant = new Piece('black-elephant', PieceType.ELEPHANT, PieceColor.BLACK, { x: 2, y: 0 });
    const redHorse = new Piece('red-horse', PieceType.HORSE, PieceColor.RED, { x: 1, y: 9 });
    const blackChariot = new Piece('black-chariot', PieceType.CHARIOT, PieceColor.BLACK, { x: 0, y: 0 });
    const redCannon = new Piece('red-cannon', PieceType.CANNON, PieceColor.RED, { x: 1, y: 7 });
    
    expect(redGeneral.getPieceName()).toBe('General (帅)');
    expect(blackSoldier.getPieceName()).toBe('Soldier (卒)');
    expect(redAdvisor.getPieceName()).toBe('Advisor (仕)');
    expect(blackElephant.getPieceName()).toBe('Elephant (象)');
    expect(redHorse.getPieceName()).toBe('Horse (马)');
    expect(blackChariot.getPieceName()).toBe('Chariot (车)');
    expect(redCannon.getPieceName()).toBe('Cannon (炮)');
  });

  test('should handle invalid piece type', () => {
    // @ts-ignore - Testing invalid piece type
    const invalidPiece = new Piece('invalid', 'INVALID', PieceColor.RED, initialPosition);
    expect(invalidPiece.getPieceName()).toBe('Unknown Piece');
  });
});
