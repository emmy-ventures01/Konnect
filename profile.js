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
const db = firebase.firestore();

const usernameInput = document.getElementById("username");
const profilePicInput = document.getElementById("profile-pic");
const saveProfileBtn = document.getElementById("save-profile");

saveProfileBtn.addEventListener("click", async () => {
  const username = usernameInput.value;
  const file = profilePicInput.files[0];
  if (!username || !file) return alert("Enter username and select a profile picture");

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result;
    const user = auth.currentUser;
    if (!user) return alert("User not logged in");

    await db.collection("users").doc(user.uid).set({
      username: username,
      phone: user.phoneNumber,
      profilePic: base64Image
    });

    alert("Profile saved! 🎉");
    // Next: redirect to main chat screen when implemented
  };
  reader.readAsDataURL(file);
});
