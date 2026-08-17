export const SYMBOLS = {
  ACE_CROWN: {
    id: 'ACE_CROWN',
    name: 'Ace Crown',
    multiplier: 100,
    color: '#ffcc00',
    svg: `<svg viewBox="0 0 100 100" class="sym-svg"><circle cx="50" cy="50" r="45" fill="url(#goldGrad)"/><polygon points="50,15 62,38 88,38 67,54 75,78 50,62 25,78 33,54 12,38 38,38" fill="#fff" stroke="#ffaa00" stroke-width="2"/><text x="50" y="60" text-anchor="middle" font-size="28" font-weight="900" fill="#7a0000">A</text><defs><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff099"/><stop offset="50%" stop-color="#d4af37"/><stop offset="100%" stop-color="#8a6e14"/></linearGradient></defs></svg>`
  },
  GOLDEN_COIN: {
    id: 'GOLDEN_COIN',
    name: 'Golden Coin',
    multiplier: 50,
    color: '#f5b041',
    svg: `<svg viewBox="0 0 100 100" class="sym-svg"><circle cx="50" cy="50" r="42" fill="#d4af37" stroke="#fff" stroke-width="3"/><circle cx="50" cy="50" r="34" fill="#f39c12" stroke="#8a6e14" stroke-width="2" stroke-dasharray="4,4"/><text x="50" y="62" text-anchor="middle" font-size="34" font-weight="bold" fill="#fff">★</text></svg>`
  },
  GOLDEN_STAR: {
    id: 'GOLDEN_STAR',
    name: 'Golden Star',
    multiplier: 30,
    isBonus: true,
    color: '#f1c40f',
    svg: `<svg viewBox="0 0 100 100" class="sym-svg"><polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#f1c40f" stroke="#b7950b" stroke-width="3"/><circle cx="50" cy="50" r="12" fill="#fff"/></svg>`
  },
  RUBY: {
    id: 'RUBY',
    name: 'Ruby Gem',
    multiplier: 20,
    color: '#e74c3c',
    svg: `<svg viewBox="0 0 100 100" class="sym-svg"><polygon points="30,15 70,15 90,40 50,90 10,40" fill="#e74c3c" stroke="#fff" stroke-width="2"/><polygon points="30,15 70,15 60,40 40,40" fill="#ff7675"/><polygon points="40,40 60,40 50,90" fill="#c0392b"/></svg>`
  },
  ACE: {
    id: 'ACE',
    name: 'Ace',
    multiplier: 12,
    color: '#9b59b6',
    svg: `<svg viewBox="0 0 100 100" class="sym-svg"><rect x="15" y="15" width="70" height="70" rx="14" fill="#8e44ad" stroke="#d2b4de" stroke-width="3"/><text x="50" y="67" text-anchor="middle" font-size="48" font-family="Impact, sans-serif" fill="#ffffff">A</text></svg>`
  },
  KING: {
    id: 'KING',
    name: 'King',
    multiplier: 8,
    color: '#3498db',
    svg: `<svg viewBox="0 0 100 100" class="sym-svg"><rect x="15" y="15" width="70" height="70" rx="14" fill="#2980b9" stroke="#aed6f1" stroke-width="3"/><text x="50" y="67" text-anchor="middle" font-size="48" font-family="Impact, sans-serif" fill="#ffffff">K</text></svg>`
  },
  QUEEN: {
    id: 'QUEEN',
    name: 'Queen',
    multiplier: 5,
    color: '#1abc9c',
    svg: `<svg viewBox="0 0 100 100" class="sym-svg"><rect x="15" y="15" width="70" height="70" rx="14" fill="#16a085" stroke="#a3e4d7" stroke-width="3"/><text x="50" y="67" text-anchor="middle" font-size="48" font-family="Impact, sans-serif" fill="#ffffff">Q</text></svg>`
  },
  JACK: {
    id: 'JACK',
    name: 'Jack',
    multiplier: 4,
    color: '#e67e22',
    svg: `<svg viewBox="0 0 100 100" class="sym-svg"><rect x="15" y="15" width="70" height="70" rx="14" fill="#d35400" stroke="#f5cba7" stroke-width="3"/><text x="50" y="67" text-anchor="middle" font-size="48" font-family="Impact, sans-serif" fill="#ffffff">J</text></svg>`
  },
  TEN: {
    id: 'TEN',
    name: 'Ten',
    multiplier: 2,
    color: '#95a5a6',
    svg: `<svg viewBox="0 0 100 100" class="sym-svg"><rect x="15" y="15" width="70" height="70" rx="14" fill="#7f8c8d" stroke="#eaeded" stroke-width="3"/><text x="50" y="67" text-anchor="middle" font-size="42" font-family="Impact, sans-serif" fill="#ffffff">10</text></svg>`
  }
};

export const SYMBOL_KEYS = Object.keys(SYMBOLS);
