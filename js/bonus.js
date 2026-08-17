export class BonusManager {
  constructor() {
    this.freeSpinsRemaining = 0;
    this.bonusTotalWin = 0;
    this.isActive = false;
  }

  trigger() {
    this.freeSpinsRemaining = 5;
    this.bonusTotalWin = 0;
    this.isActive = true;
  }

  consumeSpin() {
    if (this.freeSpinsRemaining > 0) {
      this.freeSpinsRemaining--;
      if (this.freeSpinsRemaining === 0) {
        this.isActive = false;
      }
      return true;
    }
    return false;
  }

  addWin(amount) {
    this.bonusTotalWin += amount;
  }
}
