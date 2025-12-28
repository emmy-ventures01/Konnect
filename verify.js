// Firebase config (replace with yours)
const firebaseConfig = {
  apiKey: "AIzaSyAPvMmKigTlnSgi3qu7jwtRiFMAXJtxpHg",
  authDomain: "konnect-38667.firebaseapp.com",
  projectId: "konnect-38667",
  storageBucket: "konnect-38667.firebasestorage.app",
  messagingSenderId: "687825094848",
  appId: "1:687825094848:web:7af16061a55d118a3f8525"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const phoneInput = document.getElementById("phone-number");
const sendOtpBtn = document.getElementById("send-otp");
const otpInput = document.getElementById("otp-code");
const verifyOtpBtn = document.getElementById("verify-otp");
const otpSection = document.getElementById("otp-section");

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
    .catch((error) => alert("Error: " + error.message));
});

verifyOtpBtn.addEventListener("click", () => {
  const code = otpInput.value;
  if (!code) return alert("Enter OTP");

  confirmationResult.confirm(code)
    .then(() => {
      alert("Phone verified!");
      window.location.href = "profile.html";
    })
    .catch((error) => alert("Invalid OTP"));
});
