import { BankRecord, BankFormData } from "../../shared-types/bank.types";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
  runTransaction,

} from 'firebase/firestore';
const BANK_COLLECTION = 'Bank_collection';
const BANK_ID_COLLECTION = 'BankID';

function getDb() {
  const firebaseConfig = {
    apiKey: "AIzaSyCWFmAsSwqxIcUQJiutkXiOg2BttW9eU9o",
    authDomain: "mtassist-5eafc.firebaseapp.com",
    projectId: "mtassist-5eafc",
    storageBucket: "mtassist-5eafc.firebasestorage.app",
    messagingSenderId: "995946073086",
    appId: "1:995946073086:web:3856983564555828104eaf",
    measurementId: "G-DE9JF0C5FT"
  };
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getFirestore(app);
}

export async function fetchBankAccounts(memberId: string): Promise<BankRecord[]> {
  const db = getDb();
  const q = query(
    collection(db, BANK_COLLECTION),
    where('Member_ID', '==', memberId),
    where('Status', '==', 'AA'),
  );
  const snapshot = await getDocs(q);
  const records = snapshot.docs.map((doc) => doc.data() as BankRecord);
  return records.sort((a, b) => {
    const aTime = a.Created_at ? new Date(a.Created_at).getTime() : 0;
    const bTime = b.Created_at ? new Date(b.Created_at).getTime() : 0;
    return bTime - aTime;
  });
}

async function getNextBankId(): Promise<string> {
  const db = getDb();
  const counterRef = doc(db, BANK_ID_COLLECTION, "lastId");
  const result = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let currentId = 0;
    if (counterDoc.exists()) {
      currentId = counterDoc.data().lastId || 0;
    }
    const nextId = currentId + 1;
    transaction.set(counterRef, { lastId: nextId }, { merge: true });
    return `B${nextId.toString().padStart(5, "0")}`;
  });
  return result;
}

export async function createBankAccount(
  data: BankFormData,
  memberId: string,
  financialYearId: string,
  userId: string,
): Promise<void> {
  const db = getDb();
  const bankId = await getNextBankId();
  const now = new Date().toISOString();
  const batch = writeBatch(db);
  if (data.Primary_Account) {
    const existingQ = query(
      collection(db, BANK_COLLECTION),
      where('Member_ID', '==', memberId),
      where('Status', '==', 'AA'),
      where('Primary_Account', '==', 'Primary'),
    );
    const existingSnapshot = await getDocs(existingQ);
    existingSnapshot.forEach((existingDoc) => {
      batch.update(existingDoc.ref, {
        Primary_Account: 'Secondary',
        Modified_By: userId,
        Modified_at: now,
      });
    });
  }
  const newDocRef = doc(collection(db, BANK_COLLECTION));
  batch.set(newDocRef, {
    Bank_ID: bankId,
    Bank_Name: data.Bank_Name,
    Account_Number: data.Account_Number,
    IFSC_Code: data.IFSC_Code,
    Account_Type: data.Account_Type,
    Primary_Account: data.Primary_Account ? 'Primary' : 'Secondary',
    Status: 'AA',
    Member_ID: memberId,
    Financial_Year_Master_ID: financialYearId,
    Created_By: userId,
    Created_at: now,
    Modified_By: userId,
    Modified_at: now,
  });
  await batch.commit();
}

export async function updateBankAccount(
  bankId: string,
  data: BankFormData,
  memberId: string,
  userId: string,
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  const batch = writeBatch(db);
  if (data.Primary_Account) {
    const existingQ = query(
      collection(db, BANK_COLLECTION),
      where('Member_ID', '==', memberId),
      where('Status', '==', 'AA'),
      where('Primary_Account', '==', 'Primary'),
    );
    const existingSnapshot = await getDocs(existingQ);
    existingSnapshot.forEach((existingDoc) => {
      const existingData = existingDoc.data() as BankRecord;
      if (existingData.Bank_ID !== bankId) {
        batch.update(existingDoc.ref, {
          Primary_Account: 'Secondary',
          Modified_By: userId,
          Modified_at: now,
        });
      }
    });
  }
  const bankQuery = query(
    collection(db, BANK_COLLECTION),
    where('Bank_ID', '==', bankId),
    where('Status', '==', 'AA'),
  );
  const snapshot = await getDocs(bankQuery);
  if (snapshot.empty) throw new Error('Bank record not found');
  batch.update(snapshot.docs[0].ref, {
    Bank_Name: data.Bank_Name,
    Account_Number: data.Account_Number,
    IFSC_Code: data.IFSC_Code,
    Account_Type: data.Account_Type,
    Primary_Account: data.Primary_Account ? 'Primary' : 'Secondary',
    Modified_By: userId,
    Modified_at: now,
  });
  await batch.commit();
}

export async function softDeleteBankAccount(bankId: string, userId: string): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  const bankQuery = query(
    collection(db, BANK_COLLECTION),
    where('Bank_ID', '==', bankId),
    where('Status', '==', 'AA'),
  );
  const snapshot = await getDocs(bankQuery);
  if (snapshot.empty) throw new Error('Bank record not found');
  const batch = writeBatch(db);
  batch.update(snapshot.docs[0].ref, { Status: 'IA', Modified_By: userId, Modified_at: now });
  await batch.commit();
}

