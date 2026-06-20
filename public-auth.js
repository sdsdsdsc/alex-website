import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDr8hSSoad4Ut1v5J1r2f0eSau0msrB6V4",
  authDomain: "alexs-community-efcd8.firebaseapp.com",
  projectId: "alexs-community-efcd8",
  storageBucket: "alexs-community-efcd8.firebasestorage.app",
  messagingSenderId: "214395622099",
  appId: "1:214395622099:web:44f99a181741caf3117a26"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

function getNextPath() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");
  if (!next) return "";

  try {
    const target = new URL(next, window.location.href);
    if (target.origin === window.location.origin) {
      return `${target.pathname}${target.search}${target.hash}`;
    }
  } catch (error) {
    console.warn("Invalid public auth next URL ignored:", next);
  }

  return "";
}

function redirectToNextPathIfPresent() {
  const nextPath = getNextPath();
  if (nextPath) {
    window.location.href = nextPath;
    return true;
  }
  return false;
}

function updateNextLinks() {
  const nextPath = getNextPath();
  if (!nextPath) return;

  document.querySelectorAll("[data-next-link]").forEach((link) => {
    link.setAttribute("href", nextPath);
  });
}

function buildMyNominationsPath() {
  return "my-nominations.html";
}

function setStatus(message, type = "") {
  const status = document.getElementById("publicAuthStatus");
  if (!status) return;
  status.textContent = message;
  status.className = type === "error"
    ? "admin-error"
    : type === "success"
      ? "admin-success"
      : "admin-status";
}

function getFriendlyAuthMessage(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/missing-password":
      return "Enter your password.";
    case "auth/weak-password":
      return "Choose a stronger password with at least six characters.";
    case "auth/email-already-in-use":
      return "An account already exists for that email address. Try signing in instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password was not recognised. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts were made. Please wait a moment and try again.";
    default:
      return "Sorry, that request could not be completed right now. Please try again.";
  }
}

function setSignedInState(user) {
  const signedOut = document.getElementById("publicAuthSignedOut");
  const signedIn = document.getElementById("publicAuthSignedIn");
  const email = document.getElementById("publicAuthCurrentEmail");
  const displayNameRow = document.getElementById("publicAuthDisplayNameRow");
  const displayName = document.getElementById("publicAuthCurrentDisplayName");

  if (signedOut) signedOut.hidden = Boolean(user);
  if (signedIn) signedIn.hidden = !user;
  if (email) email.textContent = user?.email || "";
  if (displayName) displayName.textContent = user?.displayName || "";
  if (displayNameRow) displayNameRow.hidden = !user?.displayName;

  const myNominationsLink = document.querySelector('#publicAuthSignedIn a[href="my-nominations.html"]');
  if (myNominationsLink) {
    myNominationsLink.setAttribute("href", buildMyNominationsPath());
  }
}

function validateRegistrationForm(form) {
  const password = form.querySelector('[name="registerPassword"]')?.value || "";
  const confirmPassword = form.querySelector('[name="registerConfirmPassword"]')?.value || "";
  const consentAccepted = form.querySelector('[name="registerConsent"]')?.checked === true;

  if (password !== confirmPassword) {
    return "Passwords do not match. Please enter the same password twice.";
  }

  if (!consentAccepted) {
    return "Please confirm that you understand public accounts are separate from admin access and that nominations are reviewed.";
  }

  return "";
}

async function handleRegister(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const email = form.querySelector('[name="registerEmail"]')?.value.trim() || "";
  const displayName = form.querySelector('[name="registerDisplayName"]')?.value.trim() || "";
  const password = form.querySelector('[name="registerPassword"]')?.value || "";
  const button = form.querySelector('button[type="submit"]');

  setStatus("");
  const validationError = validateRegistrationForm(form);
  if (validationError) {
    setStatus(validationError, "error");
    return;
  }
  if (button) button.disabled = true;

  try {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(credentials.user, {
        displayName
      });
    }
    if (redirectToNextPathIfPresent()) return;
    setStatus("Account created successfully. You are now signed in.", "success");
    form.reset();
  } catch (error) {
    console.error("Public registration failed:", error);
    setStatus(getFriendlyAuthMessage(error), "error");
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleSignIn(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const email = form.querySelector('[name="loginEmail"]')?.value.trim() || "";
  const password = form.querySelector('[name="loginPassword"]')?.value || "";
  const button = form.querySelector('button[type="submit"]');

  setStatus("");
  if (button) button.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    if (redirectToNextPathIfPresent()) return;
    setStatus("Sign-in successful.", "success");
    form.reset();
  } catch (error) {
    console.error("Public sign-in failed:", error);
    setStatus(getFriendlyAuthMessage(error), "error");
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleSignOut() {
  const button = document.getElementById("publicAuthSignOutButton");
  setStatus("");
  if (button) button.disabled = true;

  try {
    await signOut(auth);
    setStatus("You have been signed out.", "success");
  } catch (error) {
    console.error("Public sign-out failed:", error);
    setStatus("Could not sign out right now. Please try again.", "error");
  } finally {
    if (button) button.disabled = false;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  updateNextLinks();
  document.getElementById("publicRegisterForm")?.addEventListener("submit", handleRegister);
  document.getElementById("publicLoginForm")?.addEventListener("submit", handleSignIn);
  document.getElementById("publicAuthSignOutButton")?.addEventListener("click", handleSignOut);

  onAuthStateChanged(auth, (user) => {
    setSignedInState(user);
    if (!user) {
      if (!document.getElementById("publicAuthStatus")?.textContent.trim()) {
        setStatus("You need to sign in before submitting a place nomination.");
      }
      return;
    }
    if (!document.getElementById("publicAuthStatus")?.textContent.trim()) {
      setStatus("Signed in. Your nomination will be linked privately to your account.", "success");
    }
  });
});
