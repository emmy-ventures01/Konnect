// =================== FIREBASE CONFIG ===================
const firebaseConfig = {
  apiKey: "AIzaSyAPvMmKigTlnSgi3qu7jwtRiFMAXJtxpHg",
  authDomain: "konnect-38667.firebaseapp.com",
  projectId: "konnect-38667",
  storageBucket: "konnect-38667.firebasestorage.app",
  messagingSenderId: "687825094848",
  appId: "1:687825094848:web:7af16061a55d118a3f8525"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// =================== SCREEN ELEMENTS ===================
const welcomeScreen = document.getElementById("welcome-screen");
const onboardingScreen = document.getElementById("onboarding-screen");
const phoneScreen = document.getElementById("phone-screen");
const profileScreen = document.getElementById("profile-screen");
const otpSection = document.getElementById("otp-section");

const continueBtn = document.getElementById("continue-to-phone");
const phoneInput = document.getElementById("phone-number");
const sendOtpBtn = document.getElementById("send-otp");
const otpInput = document.getElementById("otp-code");
const verifyOtpBtn = document.getElementById("verify-otp");

const usernameInput = document.getElementById("username");
const profilePicInput = document.getElementById("profile-pic");
const saveProfileBtn = document.getElementById("save-profile");

// =================== SCREEN FLOW ===================

// 1️⃣ Welcome screen → 2 seconds → onboarding
setTimeout(() => {
  welcomeScreen.classList.remove("active");
  onboardingScreen.classList.add("active");
}, 2000);

// 2️⃣ Onboarding → Continue button → phone screen
continueBtn.addEventListener("click", () => {
  onboardingScreen.classList.remove("active");
  phoneScreen.classList.add("active");
});

// 3️⃣ Persistent login check
auth.onAuthStateChanged((user) => {
  if (user) {
    // User already logged in, check if profile exists
    db.collection("users").doc(user.uid).get().then((doc) => {
      if (doc.exists) {
        alert(`Welcome back, ${doc.data().username}!`);
        // Redirect to main chat screen here
      } else {
        // Show profile setup if not done yet
        phoneScreen.classList.remove("active");
        profileScreen.classList.add("active");
      }
    });
  }
});

// =================== PHONE AUTH ===================
let confirmationResult;

sendOtpBtn.addEventListener("click", () => {
  const phoneNumber = phoneInput.value;
  if (!phoneNumber) return alert("Enter your phone number");

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(sendOtpBtn, {
    size: 'invisible'
  });

  auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("OTP sent!");
      otpSection.classList.remove("hidden");
    })
    .catch((error) => {
      console.error(error);
      alert("Error sending OTP: " + error.message);
    });
});

// Verify OTP
verifyOtpBtn.addEventListener("click", () => {
  const code = otpInput.value;
  if (!code) return alert("Enter OTP");

  confirmationResult.confirm(code)
    .then((result) => {
      const user = result.user;
      alert("Phone verified!");
      phoneScreen.classList.remove("active");
      profileScreen.classList.add("active");
    })
    .catch((error) => {
      console.error(error);
      alert("Invalid OTP");
    });
});

// =================== PROFILE SETUP ===================
saveProfileBtn.addEventListener("click", async () => {
  const username = usernameInput.value;
  const file = profilePicInput.files[0];
  if (!username || !file) return alert("Enter username and select a profile picture");

  // Convert image to Base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result;

    const user = auth.currentUser;
    if (!user) return alert("User not logged in");

    // Save to Firestore
    await db.collection("users").doc(user.uid).set({
      username: username,
      phone: user.phoneNumber,
      profilePic: base64Image
    });

    alert("Profile saved! 🎉");
    // Redirect to main chat screen here in next phase
  };
  reader.readAsDataURL(file);
});
