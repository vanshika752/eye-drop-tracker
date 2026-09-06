// Paste the values from Firebase Console -> Project Settings -> General ->
// "Your apps" -> Web app -> SDK setup and configuration -> Config.
//
// These values are not secret (they identify your project, they don't grant
// access on their own) - access is controlled by the Security Rules you
// deploy in database.rules.json, not by hiding this file.
//
// IMPORTANT: databaseURL must point at a Realtime Database, e.g.
// "https://YOUR-PROJECT-default-rtdb.<region>.firebasedatabase.app"
// (Firestore-style config objects don't include this field - Realtime
// Database always does. If yours is missing it, open Realtime Database in
// the console and copy the URL shown at the top of the Data tab.)

export const firebaseConfig = {
  apiKey: 'AIzaSyAqwUE3cpg_j-45qsMtw1uA5BVH9MiR12M',
  authDomain: 'eyedrop-001.firebaseapp.com',
  databaseURL: 'https://eyedrop-001-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'eyedrop-001',
  storageBucket: 'eyedrop-001.appspot.com',
  messagingSenderId: '506541388014',
  appId: '1:506541388014:web:fb463bae2a6eedf103c3ff'
}
