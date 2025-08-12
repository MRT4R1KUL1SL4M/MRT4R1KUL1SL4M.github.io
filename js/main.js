import * as THREE from 'three';

// --- THREE.js Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('canvas-container');
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);
camera.position.z = 5;

// --- Particles ---
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 20; 
    positions[i3 + 1] = (Math.random() - 0.5) * 12;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.025,
    color: 0x00BFFF, // Initial color: Blue
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8
});
const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSystem);

// --- Animation Loop ---
const clock = new THREE.Clock();
function animate() {
    const elapsedTime = clock.getElapsedTime();
    particleSystem.rotation.y = elapsedTime * 0.1;
    particleSystem.rotation.x = elapsedTime * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// --- Resize Handler ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- All Entrance and Scroll Animations ---
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar entrance animations
    gsap.from(".left-sidebar", { duration: 1.5, x: -350, ease: "power2.out", delay: 0.5 });
    gsap.from(".right-nav", { duration: 1.5, x: 100, ease: "power2.out", delay: 0.7 });

    const subtitle = document.getElementById('animated-subtitle');
    const originalText = subtitle.textContent;
    if (subtitle) {
        subtitle.innerHTML = originalText.split('').map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
    }

    const stats = { exp: 0, projects: 0, running: 0, completed: 0 };
    
    const tl = gsap.timeline({delay: 0.5});

    tl.from(".hero-title", { opacity: 0, y: 30, duration: 1})
      .to(".hero-subtitle .char", { opacity: 1, y: 0, stagger: 0.05, duration: 0.5 }, "-=0.5")
      .from(".hero-intro, .resume-button", { opacity: 0, y: 30, duration: 1, stagger: 0.2 }, "-=0.5")
      .from(".stat-item", { 
          opacity: 0, 
          y: 50, 
          stagger: 0.2, 
          duration: 1, 
          ease: 'power3.out', 
          clearProps: "transform"
      }, "-=0.8")
      .to(stats, { 
          duration: 2,
          exp: 3,
          projects: 100,
          running: 1,
          completed: 0,
          ease: "power2.out",
          onUpdate: () => {
              document.getElementById('exp-stat').textContent = `${Math.round(stats.exp)}+`;
              document.getElementById('projects-stat').textContent = `${Math.round(stats.projects)}+`;
              document.getElementById('running-research-stat').textContent = Math.round(stats.running);
              document.getElementById('completed-research-stat').textContent = Math.round(stats.completed);
          }
      }, "-=1.2");

    const sections = document.querySelectorAll(".section");
    const navIcons = document.querySelectorAll('.right-nav a.nav-icon');

    // Section content fade-in on scroll
    sections.forEach(section => {
        gsap.from(section.querySelector('.container'), {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
            },
            opacity: 0,
            y: 50,
            duration: 1,
        });
    });
    
    // Active nav icon on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navIcons.forEach(icon => {
            icon.classList.remove('active');
            if (icon.getAttribute('href').substring(1) === current) {
                icon.classList.add('active');
            }
        });
    });

    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Particle Color Change for Every Section ---
    const sectionColors = {
        "about": 0x48D1CC,
        "experience": 0xAF7AC5,
        "research": 0x5DADE2,
        "projects": 0x45B39D,
        "education": 0xAF7AC5,
        "certificates": 0x5DADE2,
        "skills": 0x1ABC9C,
        "learning": 0xF39C12,
        "contact": 0x00BFFF
    };

    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        const color = sectionColors[sectionId];

        if (color) {
            gsap.to(particlesMaterial.color, {
                scrollTrigger: {
                    trigger: section,
                    start: "top center",
                    end: "bottom center",
                    scrub: true,
                },
                r: (color >> 16) / 255,
                g: (color >> 8 & 0xFF) / 255,
                b: (color & 0xFF) / 255,
                ease: "none"
            });
        }
    });
});