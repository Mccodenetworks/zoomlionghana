import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import {
    getFirestore,
    collection,
    query,
    where,
     orderBy,
    getDocs
  } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
  

  import {
    getAuth,
    onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

  // Firebase configuration
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

  // Wait for user to be authenticated
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;

      // Query Firestore for user data
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        // Populate the DOM
        document.getElementById("display-name").textContent = `${userData.firstName} ${userData.lastName}`;
        document.getElementById("display-email").textContent = userData.email || "No email";
        document.getElementById("display-phone").textContent = userData.phone || "No phone";
        document.getElementById("display-address").textContent = userData.address || "No address";
      } else {
        console.warn("User data not found in Firestore.");
      }

    } else {
      console.log("No user is logged in.");
       window.location.href = "auth.html";
    }
  });

function renderReportHistory(userID) {
  const cardList = document.getElementById("report-card-list"); // or "report-history-list" if you want a separate container
  if (!cardList) return;

  const reportRef = collection(db, "reports");
  const q = query(reportRef, where("uid", "==", userID), orderBy("reportedServiceAt", "desc"));

  getDocs(q)
    .then((snapshot) => {
      if (snapshot.empty) {
        cardList.innerHTML = "<p>No reports found.</p>";
        return;
      }

      cardList.innerHTML = ""; // Clear previous

      snapshot.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement("div");
        card.className = "report-card";
        card.innerHTML = `
  <h3>${data.reportLocation || "Unknown Location"}</h3>
  <p><strong>Location:</strong> ${data.reportLocation}</p>
  <p><strong>Address:</strong> ${data.reportAddress}</p>
  <p><strong>Date:</strong> ${data.reportedServiceAt?.seconds ? new Date(data.reportedServiceAt.seconds * 1000).toLocaleDateString() : "N/A"}</p>
  <p><strong>Status:</strong> <span class="status-label ${data.status?.toLowerCase()}">${data.status || "pending"}</span></p>
`;

        cardList.appendChild(card); // ✅ FIXED
      });
    })
    .catch((error) => {
      console.error("Error loading report history:", error);
      cardList.innerHTML = "<p>Error loading reports.</p>";
    });
}

// Auto-run for current user
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderReportHistory(user.uid);
  }
});


// request
function renderRequestHistory(userID) {
  const cardList = document.getElementById("request-card-list"); // or "report-history-list" if you want a separate container
  if (!cardList) return;

  const reportRef = collection(db, "services");
  const q = query(reportRef, where("uid", "==", userID), orderBy("requestedServiceAt", "desc"));

  getDocs(q)
    .then((snapshot) => {
      if (snapshot.empty) {
        cardList.innerHTML = "<p>No reports found.</p>";
        return;
      }

      cardList.innerHTML = ""; // Clear previous

      snapshot.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement("div");
        card.className = "report-card";
        card.innerHTML = `
          <h3>${data.reportLocation || "Unknown Location"}</h3>
          <p class=""><strong>Request Type:</strong> ${data.requestType}</p>
          <p><strong>Address:</strong> ${data.requestHouse}</p>
          <p><strong>Date:</strong> ${
            data.reportedServiceAt?.seconds
              ? new Date(data.reportedServiceAt.seconds * 1000).toLocaleDateString()
              : "N/A"
          }</p>
        `;
        cardList.appendChild(card); // ✅ FIXED
      });
    })
    .catch((error) => {
      console.error("Error loading report history:", error);
      cardList.innerHTML = "<p>Error loading reports.</p>";
    });
}

// Auto-run for current user
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderRequestHistory(user.uid);
  }
});

