// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const nav = document.querySelector('nav');
    const navList = document.querySelector('nav ul');
    const menuBtn = document.createElement('button');
    
    menuBtn.innerHTML = '☰';
    menuBtn.classList.add('menu-toggle');
    nav.insertBefore(menuBtn, navList);

    // Toggle mobile menu
    menuBtn.addEventListener('click', () => {
        navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && window.innerWidth <= 768) {
            navList.style.display = 'none';
        }
    });

    // Update active navigation link
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Image Handling
    const handleImageError = (img) => {
        img.src = 'placeholder.jpg'; // Add a placeholder image
        img.alt = 'Image not available';
        img.style.opacity = '0.5';
    };

    // Lazy Load Images with Intersection Observer
    const lazyLoadImages = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    };

    const observer = new IntersectionObserver(lazyLoadImages, {
        rootMargin: '100px',
        threshold: 0.1
    });

    // Initialize image handling
    document.querySelectorAll('img').forEach(img => {
        // Add lazy loading
        if (!img.src) {
            img.dataset.src = img.src;
            img.removeAttribute('src');
            observer.observe(img);
        }

        // Add error handling
        img.onerror = () => handleImageError(img);
    });

    // Card Click Effects
    document.querySelectorAll('.wife-card, .child-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            card.classList.toggle('active-card');
        });
    });

    // Window Resize Handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);

        // Reset mobile menu on larger screens
        if (window.innerWidth > 768) {
            navList.style.display = 'flex';
        } else {
            navList.style.display = 'none';
        }
    });
});
// Tribute Form Handling
document.getElementById('tributeForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Basic validation
    if (!form.name.value || !form.relationship.value || !form.message.value) {
        errorMessage.textContent = 'Please fill in all required fields';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        // Replace with your actual form submission endpoint
        const response = await fetch('https://formspree.io/f/your-form-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: form.name.value,
                relationship: form.relationship.value,
                message: form.message.value,
                email: form.email.value
            })
        });

        if (response.ok) {
            successMessage.textContent = 'Thank you for your tribute! It has been submitted successfully.';
            successMessage.style.display = 'block';
            form.reset();
            errorMessage.style.display = 'none';
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        errorMessage.textContent = 'There was an error submitting your tribute. Please try again later.';
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }
});