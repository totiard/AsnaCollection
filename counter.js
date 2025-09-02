// Import fungsi yang dibutuhkan dari Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// Import fungsi Firestore
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    increment,
    setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Konfigurasi Firebase Anda (tetap sama)
const firebaseConfig = {
    apiKey: "AIzaSyDc_mN_58bHPn2HVSmfe6elJJqPfBUwgGw",
    authDomain: "viewer-counter-871.firebaseapp.com",
    projectId: "viewer-counter-871",
    storageBucket: "viewer-counter-871.appspot.com",
    messagingSenderId: "71094703778",
    appId: "1:71094703778:web:72f1f4ccc302e136a269fb",
    measurementId: "G-WCY40T8QGR",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
// Inisialisasi Firestore
const db = getFirestore(app);

// Fungsi untuk mengupdate dan menampilkan jumlah pengunjung
async function updateAndDisplayVisitorCount() {
    const counterRef = doc(db, "counters", "asna_viewers");
    const countSpan = document.getElementById("visitor-count");

    if (!countSpan) return; // Keluar jika elemen tidak ditemukan

    try {
        // Cek sessionStorage untuk memastikan counter hanya bertambah sekali per sesi browser
        if (!sessionStorage.getItem("asnaVisited")) {
            // Jika belum pernah visit di sesi ini, update counter
            await updateDoc(counterRef, {
                count: increment(1),
            });
            sessionStorage.setItem("asnaVisited", "true");
        }

        // Ambil data terbaru untuk ditampilkan
        const docSnap = await getDoc(counterRef);

        if (docSnap.exists()) {
            // Tampilkan jumlah pengunjung dengan format angka (misal: 1.234)
            countSpan.textContent = docSnap.data().count.toLocaleString("id-ID");
        } else {
            // Jika dokumen belum ada, buat dokumen baru dengan nilai awal 1
            await setDoc(counterRef, { count: 1 });
            countSpan.textContent = "1";
            console.log("Document created!");
        }
    } catch (error) {
        console.error("Error updating or fetching visitor count: ", error);
        countSpan.textContent = "N/A"; // Tampilkan N/A jika ada error
    }
}

// Panggil fungsi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", updateAndDisplayVisitorCount);
