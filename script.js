lucide.createIcons();

document.addEventListener("DOMContentLoaded", function () {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });

    // Dropdown menu toggle on click
    const dropdownButton = document.getElementById("dropdown-button");
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownButton.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdownMenu.classList.toggle("hidden");
    });

    // Close dropdown when clicking outside
    window.addEventListener("click", (event) => {
        if (
            !dropdownMenu.classList.contains("hidden") &&
            !dropdownButton.contains(event.target)
        ) {
            dropdownMenu.classList.add("hidden");
        }
    });

    // Animation on scroll
    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    // Kita tunggu durasi animasi selesai (600ms) sebelum menghapus properti delay.
                    setTimeout(() => {
                        entry.target.style.transitionDelay = null;
                    }, 600);

                    // Tetap optimasi dengan berhenti mengamati elemen setelah terlihat
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
        }
    );
    const elementsToAnimate = document.querySelectorAll(".fade-in-up");
    elementsToAnimate.forEach((el) => observer.observe(el));

    // Navbar active link on scroll
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const activateNavLink = (id) => {
        navLinks.forEach((link) => {
            link.classList.remove("nav-link-active");
            if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("nav-link-active");
            }
        });
    };

    const scrollObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activateNavLink(entry.target.id);
                }
            });
        },
        { rootMargin: "-30% 0px -70% 0px" }
    ); // Adjust rootMargin to activate when section is in the middle of the screen

    sections.forEach((section) => {
        scrollObserver.observe(section);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // 1. Cek dan hapus hash dari URL (menggunakan metode yang lebih robust)
    if (window.location.hash) {
        history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
        );
    }

    // 2. Paksa scroll ke atas untuk melawan perilaku default browser
    // Ini adalah bagian penting dari kode yang Anda temukan
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);

    // --- MULAI KODE UNTUK MODAL/LIGHTBOX ---

    // 1. Ambil semua elemen yang diperlukan dari HTML
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");
    const closeModalButton = document.getElementById("close-modal");
    const clickableImages = document.querySelectorAll(".clickable-img");

    // 2. Tambahkan event listener untuk setiap gambar yang bisa diklik
    clickableImages.forEach((img) => {
        img.addEventListener("click", () => {
            // Saat gambar diklik, ambil URL-nya (src)
            const imgSrc = img.getAttribute("src");

            // Set URL gambar di dalam modal
            modalImage.setAttribute("src", imgSrc);

            // Tampilkan modal
            modal.classList.remove("hidden");
            // Panggil lucide lagi untuk merender ikon X jika belum
            lucide.createIcons();
        });
    });

    // 3. Fungsi untuk menutup modal
    const closeModal = () => {
        modal.classList.add("hidden");
        // Kosongkan src agar tidak memuat gambar di background
        modalImage.setAttribute("src", "");
    };

    // 4. Tambahkan event listener untuk tombol close dan background overlay
    closeModalButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        // Hanya tutup jika yang diklik adalah background (modal), bukan gambar (modalImage)
        if (e.target === modal) {
            closeModal();
        }
    });

    // (Opsional) Tutup modal dengan tombol Escape di keyboard
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeModal();
        }
    });

    // --- AKHIR KODE UNTUK MODAL/LIGHTBOX ---
});
