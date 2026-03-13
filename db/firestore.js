import firebase, { initializeApp } from 'firebase/app';

import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;