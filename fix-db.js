import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const dbId = firebaseConfig.firestoreDatabaseId || "ai-studio-sammyarafati-f35faabc-034e-404c-bd43-51fe29b539e9";
const db = getFirestore(app, dbId);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'projects'));
  for (const document of querySnapshot.docs) {
    const data = document.data();
    if (data.type === 'websites') {
      console.log('Fixing', document.id, 'to website');
      await updateDoc(doc(db, 'projects', document.id), { type: 'website' });
    } else if (data.type === 'apps') {
      console.log('Fixing', document.id, 'to app');
      await updateDoc(doc(db, 'projects', document.id), { type: 'app' });
    }
  }
  console.log("Done");
}
run().catch(console.error);
