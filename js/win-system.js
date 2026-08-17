import { SYMBOLS } from './symbols.js';

export class WinSystem {
  // Paylines configuration: row indices for reels 0, 1, 2, 3, 4
  static PAYLINES = [
    [1, 1, 1, 1, 1], // Center line
    [0, 0, 0, 0, 0], // Top line
    [2, 2, 2, 2, 2], // Bottom line
    [0, 1, 2, 1, 0], // V-shape
    [2, 1, 0, 1, 2], // Inverted V
    [0, 0, 1, 2, 2], // Step Down
    [2, 2, 1, 0, 0]  // Step Up
  ];

  static evaluate(grid, bet) {
    // grid is an array of 5 columns, each having 3 rows: grid[col][row]
    let totalWin = 0;
    const winningLines = [];
    let bonusCount = 0;

    // Count bonus symbols (Golden Star)
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 3; r++) {
        if (grid[c][r] === 'GOLDEN_STAR') {
          bonusCount++;
        }
      }
    }

    // Evaluate standard paylines
    this.PAYLINES.forEach((line, lineIndex) => {
      const firstSym = grid[0][line[0]];
      let matchCount = 1;

      for (let col = 1; col < 5; col++) {
        if (grid[col][line[col]] === firstSym) {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount >= 3) {
        const symbolData = SYMBOLS[firstSym];
        let payoutFactor = 1;
        if (matchCount === 4) payoutFactor = 2.5;
        if (matchCount === 5) payoutFactor = 6.0;

        const lineWin = Math.round(bet * (symbolData.multiplier / 5) * payoutFactor);
        totalWin += lineWin;
        winningLines.push({
          lineIndex,
          symbol: firstSym,
          matchCount,
          win: lineWin,
          coordinates: line.slice(0, matchCount).map((row, col) => ({ col, row }))
        });
      }
    });

    return {
      totalWin,
      winningLines,
      triggerBonus: bonusCount >= 3,
      bonusCount
    };
  }
}
