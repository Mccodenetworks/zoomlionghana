// ✅ Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB-abKSZQDEAU9efocGRPVYueR9JSnYNAo",
  authDomain: "wast-management-app.firebaseapp.com",
  projectId: "wast-management-app",
  storageBucket: "wast-management-app.appspot.com",
  messagingSenderId: "790691411249",
  appId: "1:790691411249:web:faabfc9b498a447bf9ac10"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Handle Amount Updates
const form = document.getElementById('payment-form');
const serviceSelect = document.getElementById('payment-service-type');
const amountInput = document.getElementById('payment-amount');

serviceSelect.addEventListener('change', () => {
  const serviceValue = serviceSelect.value;
  let amount = 0;

  switch (serviceValue) {
    case 'waste_collection': amount = 50; break;
    case 'bin_rental': amount = 25; break;
    case 'special_collection': amount = 75; break;
    case 'recycling_service': amount = 40; break;
    case 'emergency_collection': amount = 100; break;
  }

  amountInput.value = amount;
  document.getElementById('summary-amount').innerText = `GHS ${amount}.00`;
  document.getElementById('summary-total').innerText = `GHS ${amount}.00`;
  document.getElementById('summary-service').innerText = serviceSelect.options[serviceSelect.selectedIndex].text;
});

// ✅ Update Selected Provider
const providerRadios = document.querySelectorAll('input[name="mobile_provider"]');
providerRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const label = radio.closest('label') || radio.nextElementSibling;
    document.getElementById('summary-provider').innerText = label ? label.innerText : radio.value;
  });
});

// ✅ Payment Data Modal
let paymentData = {};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('payment-customer-name').value.trim();
  const userID = document.getElementById('payment-customer-UserID').value.trim();
  const phone = document.getElementById('payment-customer-phone').value.trim();
  const address = document.getElementById('payment-customer-address')?.value || '';
  const email = document.getElementById('payment-customer-email')?.value || `${userID}@example.com`;
  const serviceType = serviceSelect.value;
  const amount = parseFloat(amountInput.value);
  const providerInput = document.querySelector('input[name="mobile_provider"]:checked');

  if (!providerInput) {
    alert("Please select a mobile money provider.");
    return;
  }

  const provider = providerInput.value;

  paymentData = { fullName, userID, phone, address, email, serviceType, provider, amount };

  document.getElementById('confirm-service').innerText = serviceSelect.options[serviceSelect.selectedIndex].text;
  document.getElementById('confirm-amount').innerText = `GHS ${amount}.00`;
  document.getElementById('confirm-provider').innerText = provider.toUpperCase();
  document.getElementById('confirm-userid').innerText = userID;
  document.getElementById('confirm-phone').innerText = phone;

  document.getElementById('confirmation-modal').style.display = 'block';
});

// ✅ Paystack Payment Start
function startPaystackPayment({ fullName, email, phone, amount }) {
  const handler = PaystackPop.setup({
    key: 'pk_test_bd621b37bc675829ce647a3e7939b223bec9b085',
    email,
    amount: amount * 100,
    currency: 'GHS',
    ref: '' + Math.floor(Math.random() * 1000000000 + 1),
    metadata: {
      custom_fields: [{
        display_name: fullName,
        variable_name: phone,
        value: phone
      }]
    },
    callback: function (response) {
      document.getElementById('success-reference').innerText = response.reference;
      document.getElementById('success-modal').style.display = 'block';
    },
    onClose: function () {
      alert('Transaction was not completed.');
    }
  });
  handler.openIframe();
}

document.getElementById('confirm-pay-btn').addEventListener('click', async () => {
  document.getElementById('confirmation-modal').style.display = 'none';

  try {
    const docRef = await addDoc(collection(db, "payment"), {
      ...paymentData,
      timestamp: serverTimestamp()
    });

    console.log("Payment info saved in Firestore. Doc ID:", docRef.id);

    startPaystackPayment({
      fullName: paymentData.fullName,
      email: paymentData.email,
      phone: paymentData.phone,
      amount: paymentData.amount
    });

  } catch (err) {
    alert("Error saving payment to Firestore.");
    console.error("Firestore Error:", err);
  }
});

// ✅ Close Modals
document.getElementById('cancel-pay-btn').addEventListener('click', () => {
  document.getElementById('confirmation-modal').style.display = 'none';
});

document.getElementById('close-success-btn').addEventListener('click', () => {
  document.getElementById('success-modal').style.display = 'none';
});

// ✅ Payment History Renderer
function renderPaymentHistory(userID) {
  const cardList = document.getElementById("payment-card-list");
  if (!cardList) return;

  const paymentRef = collection(db, "payment");
  const q = query(paymentRef, where("userID", "==", userID), orderBy("timestamp", "desc"));

  getDocs(q)
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        cardList.innerHTML = '<p class="sm-sm-text">No payment history found.</p>';
        return;
      }

      cardList.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement("div");
        card.className = "payment-card";
        card.innerHTML = `
          <h3>${data.serviceType || "Service"}</h3>
          <p><strong>Amount:</strong> GHS ${data.amount}</p>
          <p><strong>Date:</strong> ${data.timestamp?.seconds ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : "N/A"}</p>
        `;
        cardList.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error fetching payment history:", error);
      cardList.innerHTML = "<p>Error loading payment history.</p>";
    });
}

// ✅ Auth Listener to Load Payment History
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderPaymentHistory(user.uid);
  } else {
    console.warn("No user logged in");
  }
});
