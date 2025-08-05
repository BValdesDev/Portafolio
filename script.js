// Variables globales
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    initializeTypingEffect();
    initializeScrollEffects();
    initializeSmoothScroll();
});

// Funcionalidad del menú hamburguesa
function initializeMenu() {
    menuToggle.addEventListener('click', toggleMenu);
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenu();
            handleNavigation(e);
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
}

function toggleMenu() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMenu() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navegación suave y actualización de enlaces activos
function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    scrollToSection(targetId);
    updateActiveLink(e.target);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = 80;
        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function updateActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Efecto de escritura para el nombre
function initializeTypingEffect() {
    const typingElement = document.getElementById('typingName');
    const names = ['Desarrollador', 'Tu Nombre', 'Full Stack', 'Creativo'];
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;

    function typeEffect() {
        const currentName = names[currentIndex];
        
        if (isDeleting) {
            currentText = currentName.substring(0, currentText.length - 1);
        } else {
            currentText = currentName.substring(0, currentText.length + 1);
        }
        
        typingElement.textContent = currentText;
        
        let typeSpeed = isDeleting ? 100 : 150;
        
        if (!isDeleting && currentText === currentName) {
            typeSpeed = 2000; // Pausa al completar
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % names.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Iniciar el efecto después de 1 segundo
    setTimeout(typeEffect, 1000);
}

// Efectos de scroll
function initializeScrollEffects() {
    window.addEventListener('scroll', handleScroll);
}

function handleScroll() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    
    // Efecto de header al hacer scroll
    if (scrolled > 100) {
        header.style.background = 'rgba(15, 15, 15, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(15, 15, 15, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    // Parallax para formas flotantes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
    
    // Actualizar enlace activo basado en la sección visible
    updateActiveNavOnScroll();
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('.section, .hero');
    const scrollPos = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos <= bottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Scroll suave para todos los enlaces internos
function initializeSmoothScroll() {
    const buttons = document.querySelectorAll('button[onclick]');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const onclick = button.getAttribute('onclick');
            if (onclick && onclick.includes('scrollToSection')) {
                e.preventDefault();
                const sectionId = onclick.match(/'([^']+)'/)[1];
                scrollToSection(sectionId);
            }
        });
    });
}

// Efectos de hover para elementos interactivos
document.addEventListener('mousemove', (e) => {
    const terminal = document.querySelector('.code-terminal');
    if (terminal) {
        const rect = terminal.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            terminal.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            terminal.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }
    }
});

// Animaciones al hacer scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Función para redimensionar elementos responsivos
window.addEventListener('resize', () => {
    // Cerrar menú en cambio de tamaño
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

// Prevenir scroll cuando el menú está abierto en móvil
function preventScroll(e) {
    if (navMenu.classList.contains('active')) {
        e.preventDefault();
    }
}