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
  apiKey: 'PASTE_YOUR_API_KEY',
  authDomain: 'PASTE_YOUR_PROJECT.firebaseapp.com',
  databaseURL: 'https://PASTE_YOUR_PROJECT-default-rtdb.firebaseio.com',
  projectId: 'PASTE_YOUR_PROJECT',
  storageBucket: 'PASTE_YOUR_PROJECT.appspot.com',
  messagingSenderId: 'PASTE_YOUR_SENDER_ID',
  appId: 'PASTE_YOUR_APP_ID'
}
