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
    // GANTI DENGAN URL WORKER ANDA
    const WORKER_URL = "https://asna-notifier.totiardiansyah871.workers.dev/"; // URL ini didapat dari dashboard Cloudflare setelah deploy

    const counterRef = doc(db, "counters", "asna_viewers");
    const countSpan = document.getElementById('visitor-count');
    
    if (!countSpan) return;

    try {
        let newCount = 0;

        // Cek sessionStorage untuk memastikan counter hanya bertambah sekali per sesi
        if (!sessionStorage.getItem('asnaVisited')) {
            await updateDoc(counterRef, { count: increment(1) });
            sessionStorage.setItem('asnaVisited', 'true');
        }

        // Ambil data terbaru untuk ditampilkan
        const docSnap = await getDoc(counterRef);

        if (docSnap.exists()) {
            newCount = docSnap.data().count;
            countSpan.textContent = newCount.toLocaleString('id-ID');
            
            // --- BAGIAN BARU: Panggil Cloudflare Worker ---
            // Hanya panggil jika ini adalah kunjungan pertama dalam sesi
            if (sessionStorage.getItem('asnaVisited') === 'true') {
                // Kirim permintaan ke Worker di latar belakang
                fetch(WORKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ count: newCount })
                })
                .then(response => response.json())
                .then(data => console.log('Notifikasi dipicu:', data.status))
                .catch(error => console.error('Gagal memicu notifikasi:', error));
                
                // Tandai sudah dikirim agar tidak dikirim lagi saat refresh
                sessionStorage.setItem('asnaVisited', 'sent');
            }
            // ---------------------------------------------

        } else {
            await setDoc(counterRef, { count: 1 });
            countSpan.textContent = '1';
        }
    } catch (error) {
        console.error("Error updating or fetching visitor count: ", error);
        countSpan.textContent = 'N/A';
    }
}

// Panggil fungsi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", updateAndDisplayVisitorCount);
