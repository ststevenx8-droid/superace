import { SYMBOLS, SYMBOL_KEYS } from './symbols.js';
import { WinSystem } from './win-system.js';
import { BonusManager } from './bonus.js';
import { AuthController } from './auth.js';
import { sound } from './sound.js';

class SlotGame {
  constructor() {
    this.balance = 10000;
    this.bet = 10;
    this.isSpinning = false;
    this.bonus = new BonusManager();
    this.reels = [];
    this.grid = [[], [], [], [], []];

    this.dom = {
      balanceDisplay: document.getElementById('balance-display'),
      betDisplay: document.getElementById('bet-display'),
      lastWinDisplay: document.getElementById('last-win-display'),
      freeSpinsBadge: document.getElementById('freespins-badge'),
      spinBtn: document.getElementById('spin-btn'),
      betMinusBtn: document.getElementById('bet-minus'),
      betPlusBtn: document.getElementById('bet-plus'),
      maxBetBtn: document.getElementById('bet-max'),
      reelsContainer: document.getElementById('reels-container'),
      winModal: document.getElementById('win-modal'),
      winAmountText: document.getElementById('win-amount-text'),
      winTitleText: document.getElementById('win-title-text'),
      cabinet: document.getElementById('game-cabinet')
    };

    this.init();
  }

  init() {
    this.buildReelsDOM();
    this.bindEvents();
    
    // Auth Listener
    AuthController.init((profile) => {
      if (profile) {
        this.balance = profile.virtualBalance;
      } else {
        const stored = localStorage.getItem('guestBalance');
        this.balance = stored ? parseInt(stored, 10) : 10000;
      }
      this.updateUI();
    });
  }

  buildReelsDOM() {
    this.dom.reelsContainer.innerHTML = '';
    this.reels = [];

    for (let c = 0; c < 5; c++) {
      const reelCol = document.createElement('div');
      reelCol.className = 'reel-column';
      const reelStrip = document.createElement('div');
      reelStrip.className = 'reel-strip';

      // Fill strip with random symbols
      for (let i = 0; i < 20; i++) {
        const randKey = SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
        const cell = document.createElement('div');
        cell.className = 'symbol-cell';
        cell.innerHTML = SYMBOLS[randKey].svg;
        cell.dataset.symbol = randKey;
        reelStrip.appendChild(cell);
      }

      reelCol.appendChild(reelStrip);
      this.dom.reelsContainer.appendChild(reelCol);
      this.reels.push({ column: reelCol, strip: reelStrip, position: 0 });
    }
  }

  bindEvents() {
    this.dom.spinBtn.addEventListener('click', () => this.spin());
    this.dom.betMinusBtn.addEventListener('click', () => this.adjustBet(-10));
    this.dom.betPlusBtn.addEventListener('click', () => this.adjustBet(10));
    this.dom.maxBetBtn.addEventListener('click', () => {
      sound.playClick();
      this.bet = 500;
      this.updateUI();
    });
  }

  adjustBet(delta) {
    sound.playClick();
    const newBet = this.bet + delta;
    if (newBet >= 10 && newBet <= 500) {
      this.bet = newBet;
      this.updateUI();
    }
  }

  updateUI() {
    if (this.dom.balanceDisplay) this.dom.balanceDisplay.textContent = this.balance.toLocaleString();
    if (this.dom.betDisplay) this.dom.betDisplay.textContent = this.bet.toLocaleString();
    if (this.bonus.isActive) {
      this.dom.freeSpinsBadge.style.display = 'block';
      this.dom.freeSpinsBadge.textContent = `FREE SPINS: ${this.bonus.freeSpinsRemaining}`;
    } else {
      this.dom.freeSpinsBadge.style.display = 'none';
    }
  }

  async spin() {
    if (this.isSpinning) return;

    // Check balance if not in free spin mode
    if (!this.bonus.isActive) {
      if (this.balance < this.bet) {
        alert('Insufficient Virtual Credits! Request more in Demo Wallet.');
        return;
      }
      this.balance -= this.bet;
      await AuthController.updateBalance(this.balance);
    } else {
      this.bonus.consumeSpin();
    }

    this.isSpinning = true;
    this.dom.spinBtn.disabled = true;
    this.dom.winModal.classList.remove('active');
    this.updateUI();
    sound.playSpin();

    // Determine 5x3 Outcome
    for (let c = 0; c < 5; c++) {
      this.grid[c] = [];
      for (let r = 0; r < 3; r++) {
        const randKey = SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
        this.grid[c].push(randKey);
      }
    }

    // Animate Reels Staggered
    const reelPromises = this.reels.map((reel, idx) => {
      return new Promise((resolve) => {
        reel.strip.style.transition = 'transform 0.1s linear';
        reel.strip.classList.add('blur-motion');

        let offset = 0;
        const spinInterval = setInterval(() => {
          offset -= 120;
          reel.strip.style.transform = `translateY(${offset % 600}px)`;
        }, 30);

        setTimeout(() => {
          clearInterval(spinInterval);
          reel.strip.classList.remove('blur-motion');
          reel.strip.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          
          // Inject actual target 3 visible symbols into the top 3 cells
          for (let r = 0; r < 3; r++) {
            const sym = this.grid[idx][r];
            reel.strip.children[r].innerHTML = SYMBOLS[sym].svg;
            reel.strip.children[r].dataset.symbol = sym;
          }
          reel.strip.style.transform = `translateY(0px)`;
          sound.playReelStop();
          resolve();
        }, 800 + idx * 250);
      });
    });

    await Promise.all(reelPromises);

    // Evaluate Win
    const result = WinSystem.evaluate(this.grid, this.bet);
    if (result.totalWin > 0) {
      this.balance += result.totalWin;
      await AuthController.updateBalance(this.balance);
      if (this.bonus.isActive) {
        this.bonus.addWin(result.totalWin);
      }
      this.dom.lastWinDisplay.textContent = result.totalWin.toLocaleString();
      this.showWinAnimation(result.totalWin);
    } else {
      this.dom.lastWinDisplay.textContent = '0';
    }

    // Trigger Bonus Round if applicable
    if (result.triggerBonus && !this.bonus.isActive) {
      sound.playBonus();
      this.bonus.trigger();
      this.showBonusModal();
    }

    // Save Game Spin History
    await AuthController.recordGameHistory({
      bet: this.bonus.isActive ? 0 : this.bet,
      win: result.totalWin,
      balance: this.balance,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    });

    this.isSpinning = false;
    this.dom.spinBtn.disabled = false;
    this.updateUI();
  }

  showWinAnimation(winAmount) {
    if (winAmount >= this.bet * 10) {
      sound.playBigWin();
      this.dom.winTitleText.textContent = 'MEGA BIG WIN!';
      this.dom.winTitleText.className = 'win-title mega';
    } else {
      sound.playWin();
      this.dom.winTitleText.textContent = 'WIN!';
      this.dom.winTitleText.className = 'win-title';
    }

    this.dom.winAmountText.textContent = `+${winAmount.toLocaleString()} COINS`;
    this.dom.winModal.classList.add('active');

    // Shake cabinet
    this.dom.cabinet.classList.add('shake');
    setTimeout(() => this.dom.cabinet.classList.remove('shake'), 600);

    setTimeout(() => {
      this.dom.winModal.classList.remove('active');
    }, 2500);
  }

  showBonusModal() {
    this.dom.winTitleText.textContent = 'BONUS ROUND!';
    this.dom.winTitleText.className = 'win-title bonus';
    this.dom.winAmountText.textContent = '5 FREE DEMO SPINS AWARDED';
    this.dom.winModal.classList.add('active');
    setTimeout(() => {
      this.dom.winModal.classList.remove('active');
    }, 3000);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new SlotGame();
});
