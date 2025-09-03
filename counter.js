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

// Fungsi untuk mengupdate dan menampilkan jumlah pengunjung (versi final)
async function updateAndDisplayVisitorCount() {
    const WORKER_URL = "https://asna-notifier.totiardiansyah871.workers.dev/";

    const counterRef = doc(db, "counters", "asna_viewers");
    const countSpan = document.getElementById('visitor-count');
    
    if (!countSpan) return;

    try {
        const docSnap = await getDoc(counterRef);
        let currentCount = 0;

        if (docSnap.exists()) {
            currentCount = docSnap.data().count;
        } else {
            await setDoc(counterRef, { count: 0 });
        }

        // Cek sessionStorage untuk memastikan semua aksi hanya berjalan sekali per sesi
        if (!sessionStorage.getItem('asnaVisited')) {
            // Tandai sesi ini sudah dikunjungi agar tidak dihitung ulang saat refresh
            sessionStorage.setItem('asnaVisited', 'true');
            
            // 1. Update nilai counter di database
            await updateDoc(counterRef, { count: increment(1) });
            
            const newCount = currentCount + 1;
            
            // 2. Tampilkan nilai baru di halaman
            countSpan.textContent = newCount.toLocaleString('id-ID');
            
            // --- PERUBAHAN PENTING ---
            // 3. Ambil offset timezone dari browser dalam satuan menit
            const offsetMinutes = new Date().getTimezoneOffset();
            
            // 4. Kirim notifikasi ke Telegram dengan nilai baru DAN offset
            fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Tambahkan 'offset' ke dalam body
                body: JSON.stringify({ count: newCount, offset: offsetMinutes })
            })
            .then(response => response.json())
            .then(data => console.log('Notifikasi dipicu:', data.status))
            .catch(error => console.error('Gagal memicu notifikasi:', error));
            
        } else {
            // Jika ini bukan kunjungan pertama (misal, refresh), cukup tampilkan nilai yang ada
            countSpan.textContent = currentCount.toLocaleString('id-ID');
        }
        
    } catch (error) {
        console.error("Error updating or fetching visitor count: ", error);
        countSpan.textContent = 'N/A';
    }
}

// Panggil fungsi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", updateAndDisplayVisitorCount);
