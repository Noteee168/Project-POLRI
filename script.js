// script.js
// Interaksi untuk Portal Layanan POLRI
// Fitur: Navigasi aktif, smooth scroll, tombol interaktif, notifikasi, dan efek kartu

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================
    // 1. NAVIGASI AKTIF & SMOOTH SCROLL
    // ========================
    const navLinks = document.querySelectorAll('.main-nav .nav-list li a, .hero-buttons .btn-primary, .hero-buttons .btn-outline, .footer-col ul li a');
    const allSections = document.querySelectorAll('section');
    
    // Fungsi untuk smooth scroll ke section berdasarkan teks atau id
    function smoothScrollToSection(targetId) {
        // jika target adalah beranda, pastikan tampil paling atas
        if (targetId === 'beranda') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return true;
        }
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            return true;
        }
        return false;
    }
    
    // Menambahkan event listener untuk navigasi utama dan tombol
    const navAndButtons = document.querySelectorAll('.main-nav .nav-list li a:not(.lapor-btn), .hero-buttons a, .lapor-btn');
    navAndButtons.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                // Jika href adalah anchor internal
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    if (smoothScrollToSection(targetId)) {
                        // Update URL tanpa reload
                        history.pushState(null, null, href);
                        // Update active class
                        updateActiveNav(href);
                    }
                }
            } else if (href === '#') {
                e.preventDefault();
                // Demo interaksi: alert untuk demonstrasi
                const buttonText = this.innerText.trim();
                showNotification(`Anda mengklik "${buttonText}" (demo interaksi)`, 'info');
            }
        });
    });
    
    // Update navigasi aktif berdasarkan scroll
    function updateActiveNav(currentHash) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    }
    
    // Observasi scroll untuk menandai section aktif
    const sections = document.querySelectorAll('section, .hero');
    const navItems = document.querySelectorAll('.main-nav .nav-list li a');
    
    function setActiveFromScroll() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && href.substring(1) === current) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveFromScroll);
    
    // Memberikan ID pada section jika belum ada
    const heroSection = document.querySelector('.hero');
    if (heroSection && !heroSection.id) heroSection.id = 'beranda';
    const layananSection = document.querySelector('.layanan-kendali');
    if (layananSection && !layananSection.id) layananSection.id = 'layanan';
    const statistikSection = document.querySelector('.performance-stats');
    if (statistikSection && !statistikSection.id) statistikSection.id = 'statistik';
    const beritaSection = document.querySelector('.berita-terkini');
    if (beritaSection && !beritaSection.id) beritaSection.id = 'berita';
    const kontakSection = document.querySelector('.kontak-help');
    if (kontakSection && !kontakSection.id) kontakSection.id = 'kontak';

    // HAPUS TANDA/NOTIFIKASI DI KANAN BAWAH SAAT USER BERINTERAKSI
    function hideBottomNotifications() {
        const toasts = document.querySelectorAll('.toast-notification');
        toasts.forEach(t => t.remove());
    }

    // Hapus notifikasi saat user melakukan interaksi yang wajar
    ['click', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
        window.addEventListener(evt, () => {
            hideBottomNotifications();
        }, { passive: true });
    });
    
    // ========================
    // 2. TOMBOL JELAJAHI LAYANAN & HUBUNGI KAMI
    // ========================
    const jelajahiBtn = document.querySelector('.hero-buttons .btn-primary');
    const hubungiBtn = document.querySelector('.hero-buttons .btn-outline');
    
    if (jelajahiBtn) {
        jelajahiBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const layananSectionElem = document.getElementById('layanan');
            if (layananSectionElem) {
                layananSectionElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                showNotification('Menuju ke halaman layanan...', 'success');
                // Update active nav
                updateActiveNav('#layanan');
            } else {
                showNotification('Section layanan ditemukan, scroll otomatis', 'info');
                window.scrollTo({ top: 800, behavior: 'smooth' });
            }
        });
    }
    
    if (hubungiBtn) {
        hubungiBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const kontakSectionElem = document.getElementById('kontak');
            if (kontakSectionElem) {
                kontakSectionElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                showNotification('Form bantuan & kontak siap melayani Anda 24/7', 'info');
                updateActiveNav('#kontak');
            } else {
                showNotification('Hubungi kami: email@polri.go.id atau call 110', 'warning');
            }
        });
    }
    
    // ========================
    // 3. TOMBOL LAPOR SEKARANG (HEADER) DENGAN MODAL NOTIFIKASI
    // ========================
    
    
    // ========================
    // 4. NOTIFIKASI TOAST (Styling interaktif)
    // ========================
    function showNotification(message, type = 'info') {
        // Hapus notifikasi lama jika terlalu banyak
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                  type === 'error' ? '<i class="fas fa-exclamation-triangle"></i>' : 
                  '<i class="fas fa-info-circle"></i>'}
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        document.body.appendChild(toast);
        
        // Animasi masuk
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto close setelah 3 detik
        const timer = setTimeout(() => {
            if (toast) toast.remove();
        }, 3500);
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timer);
            toast.remove();
        });
    }
    
    // ========================
    // 5. INTERAKSI KARTU LAYANAN (KLIK UNTUK DEMO)
    // ========================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // Mencegah jika klik di link di dalam card (tetap bisa)
            if (e.target.closest('.card-link')) return;
            const title = this.querySelector('h3')?.innerText || 'Layanan';
            showNotification(`Mengakses: ${title} (demo layanan terintegrasi)`, 'info');
        });
        
        // Link di dalam card
        const cardLink = card.querySelector('.card-link');
        if (cardLink) {
            cardLink.addEventListener('click', function(e) {
                e.stopPropagation();
                const serviceName = card.querySelector('h3')?.innerText || 'Layanan';
                showNotification(`Membuka dashboard ${serviceName} — segera terintegrasi`, 'success');
            });
        }
    });
    
    // ========================
    // 6. FORM KIRIM PESAN (KONTAK)
    // ========================
    const contactForm = document.querySelector('.contact-card-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nameInput = this.querySelector('input[placeholder="Nama lengkap"]');
            const emailInput = this.querySelector('input[placeholder="Email / No. Telepon"]');
            const messageInput = this.querySelector('textarea');
            
            if (nameInput && emailInput && messageInput) {
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const msg = messageInput.value.trim();
                
                if (!name || !email || !msg) {
                    showNotification('Harap lengkapi semua field pesan', 'error');
                    return;
                }
                showNotification(`Terima kasih ${name}, pesan Anda sudah diterima petugas kami.`, 'success');
                this.reset();
            } else {
                showNotification('Demo: Form pesan akan terkirim secara resmi', 'info');
                this.reset();
            }
        });
    }
    
    // ========================
    // 7. TOMBOL BACA SELENGKAPNYA (BERITA)
    // ========================
    const readMoreBtns = document.querySelectorAll('.read-more');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const parentCard = this.closest('.berita-card');
            const title = parentCard?.querySelector('h3')?.innerText || 'Berita';
            showNotification(`Membaca selengkapnya: "${title}" — (demo konten berita)`, 'info');
        });
    });
    
    // ========================
    // 8. STATISTIK KINERJA MENAMPILKAN EFEK HOVER (Tambahan)
    // ========================
    const perfCards = document.querySelectorAll('.perf-card');
    perfCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.transition = '0.2s';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // ========================
    // 9. RESPONSIVE: MENUTUP MOBILE MENU SAAT KLIK LINK
    // ========================
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileToggle && navList) {
        mobileToggle.addEventListener('click', () => {
            navList.classList.toggle('show');
        });
        
        // Tutup menu ketika link diklik
        const allMobileLinks = document.querySelectorAll('.nav-list li a');
        allMobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('show');
            });
        });
    }
    
    // ========================
    // 10. TAMBAHKAN EFEK HALUS PADA TOMBOL KONTAK DARURAT (110)
    // ========================
    const emergencyBox = document.querySelector('.emergency-box');
    if (emergencyBox) {
        emergencyBox.addEventListener('click', () => {
            showNotification('Nomor darurat 110. Hubungi segera jika dalam keadaan membahayakan.', 'warning');
        });
        emergencyBox.style.cursor = 'pointer';
    }
    
    // Menampilkan selamat datang
    setTimeout(() => {
        showNotification('Selamat datang di Portal Layanan POLRI — Siap melayani 24 jam', 'success');
    }, 800);
});

// Tambahkan style untuk modal dan toast (dynamic)
const additionalStyles = `
    /* Modal interaktif */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.2s ease;
    }
    .modal-content {
        background: white;
        border-radius: 32px;
        max-width: 480px;
        width: 90%;
        box-shadow: 0 30px 40px rgba(0,0,0,0.2);
        overflow: hidden;
        animation: slideUp 0.25s ease;
    }
    .modal-header {
        padding: 1.2rem 1.5rem;
        background: #0a2b44;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .modal-header h3 {
        margin: 0;
        font-size: 1.2rem;
        display: flex;
        gap: 8px;
        align-items: center;
    }
    .modal-close {
        background: none;
        border: none;
        font-size: 1.8rem;
        color: white;
        cursor: pointer;
        line-height: 1;
    }
    .modal-body {
        padding: 1.8rem;
    }
    .modal-body input, .modal-body textarea {
        width: 100%;
        padding: 0.8rem;
        margin: 0.8rem 0;
        border: 1px solid #ddd;
        border-radius: 16px;
        font-family: inherit;
    }
    .modal-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 1rem;
    }
    .btn-secondary {
        background: #e2e8f0;
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 40px;
        font-weight: 600;
        cursor: pointer;
    }
    
    /* Toast Notification */
    .toast-notification {
        position: fixed;
        bottom: 30px;
        right: 20px;
        background: #1f2f3e;
        color: white;
        padding: 0.8rem 1.2rem;
        border-radius: 60px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 3000;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 340px;
        font-size: 0.85rem;
        font-weight: 500;
        backdrop-filter: blur(8px);
        background: #0a2b44e6;
    }
    .toast-notification.show {
        transform: translateX(0);
    }
    .toast-success {
        background: #1f7840e6;
    }
    .toast-error {
        background: #b33a2ce6;
    }
    .toast-warning {
        background: #b96f0ce6;
    }
    .toast-close {
        background: transparent;
        border: none;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        margin-left: 8px;
        opacity: 0.7;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);