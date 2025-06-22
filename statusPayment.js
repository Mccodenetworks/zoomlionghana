// check-payment-status.js

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB-abKSZQDEAU9efocGRPVYueR9JSnYNAo",
  authDomain: "wast-management-app.firebaseapp.com",
  projectId: "wast-management-app",
  storageBucket: "wast-management-app.appspot.com",
  messagingSenderId: "790691411249",
  appId: "1:790691411249:web:faabfc9b498a447bf9ac10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to check if user has paid this month
async function checkMonthlyPaymentStatus(userID) {
  const statusText = document.getElementById('payment-text-status');
  if (!statusText) return;

  statusText.textContent = "Checking payment status...";

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  try {
    const q = query(
      collection(db, "payment"),
      where("userID", "==", userID),
      where("serviceType", "==", "waste_collection")
    );

    const snapshot = await getDocs(q);
    let isPaidThisMonth = false;

    snapshot.forEach(doc => {
      const data = doc.data();
      const payDate = data.timestamp?.toDate?.();

      if (payDate >= firstDayOfMonth && payDate <= lastDayOfMonth) {
        isPaidThisMonth = true;
      }
    });

    if (isPaidThisMonth) {
      statusText.textContent = " Payment is up to date.";
      statusText.style.color = "green";
    } else {
      statusText.textContent = " Payment is not up to date.";
      statusText.style.color = "red";
    }
  } catch (err) {
    console.error("Error checking payment status:", err);
    statusText.textContent = "Error checking payment status.";
    statusText.style.color = "orange";
  }
}

// Wait for Firebase Auth user to be ready
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userID = user.uid;
    checkMonthlyPaymentStatus(userID);
  } else {
    const statusText = document.getElementById('payment-text-status');
    if (statusText) {
      statusText.textContent = "User not logged in.";
      statusText.style.color = "gray";
    }
  }
});


// dashboard request
async function showCurrentRequestStatus(userId) {
  const requestEl = document.getElementById("current-request");
  if (!requestEl) return;

  const requestRef = collection(db, "newBin"); // Or "services" depending on your app
  const q = query(
    requestRef,
    where("uid", "==", userId),
    orderBy("requestedAt", "desc"),
    limit(1)
  );

  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      requestEl.innerHTML = `<span class="status-label">No request found</span>`;
      return;
    }

    const data = snapshot.docs[0].data();
    const status = (data.status || "pending").toLowerCase();

    requestEl.innerHTML = `
      <span class="status-label ${status}">${status}</span>
    `;
  } catch (err) {
    console.error("Error fetching request status:", err);
    requestEl.innerText = "Unable to load request status.";
  }
}
