// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

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
const storage = getStorage(app);

// new bin function
document.getElementById("NewBinBtn").addEventListener("click", async (event) => {
  event.preventDefault();

  const binName = document.getElementById("binFullName").value.trim();
  const binPhone = document.getElementById("binPhone").value.trim();
  const binType = document.getElementById("binType").value.trim();
  const binQuantity = document.getElementById("binQuantity").value.trim();
  const binAddress = document.getElementById("binAddress").value.trim();

  if (!binName || !binPhone || !binType || !binQuantity || !binAddress) {
    showAlert("alertError");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to request a bin.");
    return;
  }

  try {
    await addDoc(collection(db, "newBin"), {
      uid: user.uid,
      binName,
      binPhone,
      binType,
      binQuantity,
      binAddress,
      requestedAt: serverTimestamp()
    });

    showAlert("alertSuccess");
    clearFields(["binFullName", "binPhone", "binType", "binQuantity", "binAddress"]);
  } catch (error) {
    console.error("Error submitting bin request:", error);
    alert("An error occurred. Please try again.");
  }
});

// service request
document.getElementById("btn-service-request").addEventListener("click", async (event) => {
  event.preventDefault();

  const requestType = document.getElementById("request-type").value.trim();
  const requestFullName = document.getElementById("request-fullName").value.trim();
  const requestHouse = document.getElementById("request-House").value.trim();
  const requestPhone = document.getElementById("request-phone").value.trim();
  const requestQuantity = document.getElementById("request-quantity").value.trim();
  const requestPriority = document.getElementById("request-priority").value.trim();

  if (!requestType || !requestFullName || !requestHouse || !requestPhone || !requestQuantity || !requestPriority) {
    showAlert("alertError");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to request a service.");
    return;
  }

  try {
    await addDoc(collection(db, "services"), {
      uid: user.uid,
      requestType,
      requestFullName,
      requestHouse,
      requestPhone,
      requestQuantity,
      requestPriority,
      status: "pending",
      requestedServiceAt: serverTimestamp()
    });

    showAlert("alertSuccess");
    clearFields([
      "request-type", "request-fullName", "request-House",
      "request-phone", "request-quantity", "request-priority"
    ]);
  } catch (error) {
    console.error("Error submitting service request:", error);
    alert("An error occurred. Please try again.");
  }
});

// reports function
document.getElementById("report-btn").addEventListener("click", async (event) => {
  event.preventDefault();

  const reportLocation = document.getElementById("location").value.trim();
  const reportPhone = document.getElementById("phone").value.trim();
  const reportAddress = document.getElementById("address").value.trim();

  if (!reportLocation || !reportPhone || !reportAddress) {
    alert("Please fill all required fields.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to submit a report.");
    return;
  }

  try {
    await addDoc(collection(db, "reports"), {
      uid: user.uid,
      reportAddress,
      reportLocation,
      reportPhone,
      reportedServiceAt: serverTimestamp(),
      status: "pending"
    });

    showAlert("alertSuccess");
    clearFields(["location", "phone", "address"]);
  } catch (error) {
    console.error("Error submitting report:", error);
    alert("An error occurred. Please try again.");
  }
});

// help function
function showAlert(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "flex";
    setTimeout(() => {
      el.style.display = "none";
    }, 2000);
  }
}

function clearFields(ids) {
  ids.forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });
}

document.getElementById("feedbackBnt").addEventListener('click', async (event) => {
  event.preventDefault();

  const experience = document.querySelector('input[name="experience"]:checked');
  const refer = document.querySelector('input[name="refer"]:checked');

  if (!experience || !refer) {
    alert("Please answer all questions.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to send feedback.");
    return;
  }

  try {
    await addDoc(collection(db, "feedback"), {
      uid: user.uid,
      experience: experience.value,
      refer: refer.value,
      submittedAt: serverTimestamp()
    });

    setTimeout(() => {
      const alertFeedback = document.getElementById("alert-feedback");
      alertFeedback.style.display = "flex";

      setTimeout(() => {
        alertFeedback.style.display = "none";
      }, 2000);
    }, 3000);

    document.getElementById("user-feedback-form").reset();
  } catch (error) {
    console.error("Error submitting feedback:", error);
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const requestRef = collection(db, "services");
    const q = query(
      requestRef,
      where("uid", "==", user.uid),
      orderBy("requestedServiceAt", "desc"),
      limit(1)
    );

    try {
      const snapshot = await getDocs(q);
      const currentRequestDiv = document.getElementById("current-request-status");

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        const status = data.status || "pending";

        currentRequestDiv.innerHTML = `
          <div class="status-box">
            <p><strong>Service:</strong> ${data.requestType}</p>
            <p><strong>Status:</strong> <span class="status-label ${status.toLowerCase()}">${status}</span></p>
          
          </div>
        `;
      } else {
        currentRequestDiv.innerHTML = '<p class="sm-sm-text">No request .</p>';

      }

      const countQuery = query(requestRef, where("uid", "==", user.uid));
      const allRequests = await getDocs(countQuery);
      const total = allRequests.size;

      const countEl = document.getElementById("total-request-count");
      if (countEl) countEl.textContent = `Total Requests: ${total}`;
    } catch (error) {
      console.error("Error fetching data:", error);
      document.getElementById("current-request-status").innerHTML = "<p>Error loading request.</p>";
    }
  }
});
