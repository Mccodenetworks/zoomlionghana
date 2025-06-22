// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
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

// new user registration
document.getElementById("registerAccount").addEventListener("click", async (event) => {
  event.preventDefault();

  const firstName = document.getElementById("register-firstname").value.trim();
  const lastName = document.getElementById("register-lastname").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const phone = document.getElementById("register-phone").value.trim();
  const address = document.getElementById("register-address").value.trim();
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("register-confirm-password").value;
  const agree = document.getElementById("agree-terms").checked;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (!agree) {
    alert("You must agree to the terms and conditions.");
    return;
  }

  try {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("User already exists with this email.");
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await addDoc(usersRef, {
      uid: user.uid,
      firstName,
      lastName,
      email,
      phone,
      address,
      createdAt: serverTimestamp()
    });

    // Show success message
    const successfully = document.getElementById("successfully");
    if (successfully) {
      successfully.classList.add("showLoginMessages");
      setTimeout(() => {
        successfully.classList.remove("showLoginMessages");
        window.location.href = "home.html";
      }, 3000);
    } else {
      window.location.href = "home.html"; // fallback redirect
    }

  } catch (error) {
    console.error("Registration Error:", error);
    alert("Error: " + error.message);
  }
});

// login user function
document.getElementById("loginBtn").addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const successShow = document.getElementById("successShow");
    if (successShow) {
      successShow.classList.add("showLoginSuccess");
      setTimeout(() => {
        successShow.classList.remove("showLoginSuccess");
        window.location.href = "home.html";
      }, 3000);
    } else {
      window.location.href = "home.html";
    }

  } catch (error) {
    console.error("Login Error:", error);

    const errorLogin = document.getElementById("errorLogin");
    if (errorLogin) {
      errorLogin.classList.add("showLoginMessages");
      setTimeout(() => {
        errorLogin.classList.remove("showLoginMessages");
      }, 3000);
    } else {
      alert("Login failed: " + error.message);
    }
  }
});
