import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  ref, 
  set, 
  get, 
  update, 
  push,
  serverTimestamp 
} from './firebase.js';

export class AuthController {
  static currentUser = null;
  static userProfile = null;

  static init(onUserChange) {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          this.userProfile = snapshot.val();
        } else {
          // Initialize new user with default 10,000 virtual balance
          this.userProfile = {
            uid: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            virtualBalance: 10000,
            role: 'user',
            createdAt: Date.now()
          };
          await set(userRef, this.userProfile);
        }
      } else {
        this.userProfile = null;
      }
      if (onUserChange) onUserChange(this.userProfile);
    });
  }

  static async register(name, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    const initialData = {
      uid: user.uid,
      name: name,
      email: email,
      virtualBalance: 10000,
      role: 'user',
      createdAt: Date.now()
    };
    await set(ref(db, `users/${user.uid}`), initialData);
    this.userProfile = initialData;
    return user;
  }

  static async login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  static async logout() {
    await signOut(auth);
  }

  static async updateBalance(newBalance) {
    if (!this.currentUser) {
      // Local fallback for guest
      localStorage.setItem('guestBalance', newBalance);
      return;
    }
    this.userProfile.virtualBalance = newBalance;
    await update(ref(db, `users/${this.currentUser.uid}`), {
      virtualBalance: newBalance
    });
  }

  static async recordGameHistory(entry) {
    if (!this.currentUser) {
      let localHistory = JSON.parse(localStorage.getItem('guestHistory') || '[]');
      localHistory.unshift(entry);
      localStorage.setItem('guestHistory', JSON.stringify(localHistory.slice(0, 50)));
      return;
    }
    const historyRef = ref(db, `gameHistory/${this.currentUser.uid}`);
    await push(historyRef, {
      ...entry,
      createdAt: serverTimestamp()
    });
  }

  static async requestVirtualCredits(amount, reason) {
    if (!this.currentUser) throw new Error('Please login to request credits.');
    const reqRef = ref(db, 'demoCreditRequests');
    return await push(reqRef, {
      uid: this.currentUser.uid,
      userEmail: this.currentUser.email,
      userName: this.userProfile.name,
      amount: parseInt(amount, 10),
      reason: reason,
      status: 'PENDING',
      createdAt: Date.now()
    });
  }
}
