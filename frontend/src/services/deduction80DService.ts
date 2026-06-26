import { Deduction80DRecord, Deduction80DFormData } from "../../shared-types/deduction80D.types";
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
  setDoc,
} from "firebase/firestore";
const COLLECTION = "Deduction_80D_Collection";
const ID_COLLECTION = "Deduction80DID";

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

export async function fetch80DDeductions(memberId: string): Promise<Deduction80DRecord[]> {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    where("Member_ID", "==", memberId),
    where("Status", "==", "AA"),
  );
  const snapshot = await getDocs(q);
  const records = snapshot.docs.map((doc) => ({ __id__: doc.id, ...doc.data() } as Deduction80DRecord));
  return records.sort((a, b) => {
    const aTime = a.Created_at ? new Date(a.Created_at).getTime() : 0;
    const bTime = b.Created_at ? new Date(b.Created_at).getTime() : 0;
    return bTime - aTime;
  });
}

async function getNextDeductionId(): Promise<string> {
  const db = getDb();
  const counterRef = doc(db, ID_COLLECTION, "lastId");
  const result = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let currentId = 0;
    if (counterDoc.exists()) {
      currentId = counterDoc.data().lastId || 0;
    }
    const nextId = currentId + 1;
    transaction.set(counterRef, { lastId: nextId }, { merge: true });
    return nextId;
  });
  return `D80D${result.toString().padStart(5, "0")}`;
}

export async function create80DDeduction(
  data: Deduction80DFormData,
  memberId: string,
  financialYearId: string,
  userId: string,
): Promise<void> {
  const db = getDb();
  const deductionId = await getNextDeductionId();
  const now = new Date().toISOString();
  const isMediclaim = data.Kind_of_payment === "Mediclaim premium";
  const newDocRef = doc(collection(db, COLLECTION));
  await setDoc(newDocRef, {
    __id__: deductionId,
    Member_ID: memberId,
    Financial_Year_Master_ID: financialYearId,
    In_respect_of: data.In_respect_of,
    Age_Group: data.Age_Group,
    Kind_of_payment: data.Kind_of_payment,
    type_of_policy: data.type_of_policy,
    Name_of_Insurance_company: isMediclaim ? data.Name_of_Insurance_company : "",
    Policy_number: isMediclaim ? data.Policy_number : "",
    Premium_Amount: isMediclaim ? Number(data.Premium_Amount) : 0,
    Amount: isMediclaim ? 0 : Number(data.Amount),
    Deduction_Note: data.Deduction_Note || "",
    Deduction_80D_Files_Name: data.Deduction_80D_Files?.map((f) => f.name) || [],
    Deduction_80D_Files_URL: [],
    Status: "AA",
    Created_By: userId,
    Created_at: now,
    Modified_By: userId,
    Modified_at: now,
  });
}

export async function update80DDeduction(
  __id__: string,
  data: Deduction80DFormData,
  userId: string,
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  const q = query(
    collection(db, COLLECTION),
    where("__id__", "==", __id__),
    where("Status", "==", "AA"),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("80D deduction record not found");
  const isMediclaim = data.Kind_of_payment === "Mediclaim premium";
  const batch = writeBatch(db);
  batch.update(snapshot.docs[0].ref, {
    In_respect_of: data.In_respect_of,
    Age_Group: data.Age_Group,
    Kind_of_payment: data.Kind_of_payment,
    type_of_policy: data.type_of_policy,
    Name_of_Insurance_company: isMediclaim ? data.Name_of_Insurance_company : "",
    Policy_number: isMediclaim ? data.Policy_number : "",
    Premium_Amount: isMediclaim ? Number(data.Premium_Amount) : 0,
    Amount: isMediclaim ? 0 : Number(data.Amount),
    Deduction_Note: data.Deduction_Note || "",
    Modified_By: userId,
    Modified_at: now,
  });
  await batch.commit();
}

export async function softDelete80DDeduction(__id__: string, userId: string): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  const q = query(
    collection(db, COLLECTION),
    where("__id__", "==", __id__),
    where("Status", "==", "AA"),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("80D deduction record not found");
  const batch = writeBatch(db);
  batch.update(snapshot.docs[0].ref, {
    Status: "IA",
    Modified_By: userId,
    Modified_at: now,
  });
  await batch.commit();
}

