<script type="module" src="script.js"></script>

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDkPXa1KLcSAIQLEvkzB1Er42FcIx4avb8",
  authDomain: "accident-cloud-system.firebaseapp.com",
  projectId: "accident-cloud-system",
  storageBucket: "accident-cloud-system.firebasestorage.app",
  messagingSenderId: "920705962433",
  appId: "1:920705962433:web:71704885b94cbbe9141f40",
  measurementId: "G-P139ELGBDQ"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
  then(() => {
    alert("login successful");
    window.location = "dashboard.html";
  })
    .catch((error) = alert("error: " + error.message));
}

window.addAccident = async function () {
  let location = document.getElementById("location").value;
  let type = document.getElementById("type").value;

  try {
    await addDoc(collection(db, "accidents"), {
      location: location,
      type: type,
      time: new Date()
    })
    alert("The incident was successfully added");
    loadData();
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}


window.loadData = async function () {
  const dataContainer = document.getElementById("data");
  dataContainer.innerHTML = "loading..";

  try {
    const querySnapshot = await getDocs(collection(db, "accidents"));
    dataContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      let accident = doc.data();
      dataContainer.innerHTML += `
          <div style="border:1px solid #ccc; margin:10px; padding:10px;">
            <p><b>Location:</b> ${accident.location}</p>
            <p><b>Type:</b> ${accident.type}</p>
            <button onclick="deleteData('${doc.id}')">Delete</button>
          </div>
      `;
    });
  } catch (error) {
    console.error("Error: ", error);
    dataContainer.innerHTML = "Error loading data.";
  }
}


window.deleteData = async function (id) {
  if (confirm("Are you sure about deleting it?")) {
    try {
      await deleteDoc(doc(db, "accidents", id));
      alert("successfully deleted");
      loadData();
    } catch (error) {
      alert("Error during the event: " + error.message);
    }
  }
}
// تحميل البيانات عند فتح الصفحة تلقائياً (اختياري)
// window.onload = loadData;
