import * as THREE from 'three';

// SCENE SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('canvas-container');
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);
camera.position.z = 5;

// PARTICLES
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00BFFF,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8
});
const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSystem);

// MOUSE INTERACTION
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    let mainContent = document.querySelector('.main-content');
    if (mainContent) {
         mouse.x = (event.clientX - mainContent.getBoundingClientRect().left) / mainContent.offsetWidth * 2 - 1;
         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
});

// ANIMATION LOOP
const clock = new THREE.Clock();
function animate() {
    const elapsedTime = clock.getElapsedTime();
    particleSystem.rotation.y = elapsedTime * 0.1;
    
    let targetX = (window.scrollY > 0) ? 0 : mouse.x * 0.5;
    let targetY = (window.scrollY > 0) ? 0 : -mouse.y * 0.5;

    gsap.to(camera.position, {
        x: targetX,
        y: targetY,
        duration: 2,
        ease: 'power2.out'
    });
    
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// RESIZE HANDLER
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GSAP SCROLL ANIMATIONS
document.addEventListener('DOMContentLoaded', () => {
    // HERO SECTION ANIMATIONS
    const subtitle = document.getElementById('animated-subtitle');
    const originalText = subtitle.textContent;
    subtitle.innerHTML = originalText.split('').map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('');

    gsap.from(".hero-title", { opacity: 0, y: 30, duration: 1, delay: 0.5 });
    gsap.to(".hero-subtitle .char", {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.5,
        delay: 1
    });
    gsap.from(".hero-intro, .resume-button", { opacity: 0, y: 30, duration: 1, stagger: 0.2, delay: 1.5 });
    
    // Animated stats
    const stats = {
        exp: 0,
        projects: 0,
        runningResearch: 0,
        completedResearch: 0
    };

    gsap.to(stats, {
        duration: 2,
        exp: 8,
        projects: 100,
        runningResearch: 1,
        completedResearch: 0,
        ease: "power2.out",
        onUpdate: () => {
            document.getElementById('exp-stat').textContent = Math.round(stats.exp) + '+';
            document.getElementById('projects-stat').textContent = Math.round(stats.projects) + '+';
            document.getElementById('running-research-stat').textContent = Math.round(stats.runningResearch);
            document.getElementById('completed-research-stat').textContent = Math.round(stats.completedResearch);
        },
        delay: 2
    });

    gsap.from(".hero-stats .stat-item", { opacity: 0, y: 30, stagger: 0.2, duration: 1, delay: 2 });
    
    const sections = document.querySelectorAll(".section");
    const navIcons = document.querySelectorAll('.right-nav a.nav-icon');

    // Section content fade-in animation
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
    
    // Active nav icon switching
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
});