# Terminal Chinese Chess (象棋)

A terminal-based Chinese chess game built with TypeScript and Ink.

## Features

- Play Chinese chess in your terminal with Unicode characters
- Navigate using arrow keys
- Simple AI opponent
- Proper move validation for all Chinese chess pieces

## Installation

Make sure you have Node.js installed, then:

```bash
# Install dependencies
npm install

# Start the game
npm start
```

## How to Play

1. Use arrow keys to move the cursor
2. Press Space to select a piece
3. Move the cursor to a valid position (highlighted in green)
4. Press Space again to place the piece
5. The computer will automatically make its move

### Controls

- **Arrow keys**: Move cursor
- **Space**: Select/place a piece
- **r**: Reset the game
- **q**: Quit the game

## Game Rules

This game follows standard Chinese Chess (Xiangqi) rules:

- The board is 9x10
- Each player has 16 pieces: 1 General, 2 Advisors, 2 Elephants, 2 Horses, 2 Chariots, 2 Cannons, and 5 Soldiers
- Each piece type has specific movement rules
- The goal is to checkmate the opponent's General

## Development

The project is organized as follows:

- `src/models/`: Game logic and models
- `src/components/`: UI components
- `src/index.tsx`: Entry point
