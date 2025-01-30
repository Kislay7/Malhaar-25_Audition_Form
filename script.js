const html = document.documentElement;
const canvas = document.querySelector('.airpods-scrolling');
const context = canvas.getContext('2d');

// Loading screen element
const loadingScreen = document.createElement('div');
loadingScreen.className = 'loading-screen';
loadingScreen.innerHTML = `
    <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading Animation... <span id="progress">0%</span></div>
    </div>
`;
document.body.appendChild(loadingScreen);

// Create image cache
const frameCount = 168;
const images = [];
let loadedImages = 0;

// Preload all images
function preloadImages() {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        
        img.onload = () => {
            loadedImages++;
            // Update loading progress
            const progress = Math.floor((loadedImages / frameCount) * 100);
            document.getElementById('progress').textContent = `${progress}%`;
            
            // When all images are loaded, remove loading screen and start animation
            if (loadedImages === frameCount) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                    startAnimation();
                }, 500);
            }
        };

        img.src = `img (${i}).jpg`;
        images[i] = img;
    }
}

function isMobile() {
    return window.innerWidth <= 768;
}

function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    if (isMobile() && windowHeight > windowWidth) {
        canvas.width = windowWidth;
        canvas.height = windowHeight;
    } else {
        canvas.width = 1920;
        canvas.height = 1080;
    }
}

function drawImage(image) {
    if (!image) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    if (isMobile() && windowHeight > windowWidth) {
        const scaleFactor = Math.max(canvas.width / image.width, canvas.height / image.height);
        const newWidth = image.width * scaleFactor;
        const newHeight = image.height * scaleFactor;
        
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.drawImage(
            image,
            -newWidth * 0.33,
            (canvas.height - newHeight) / 2,
            newWidth,
            newHeight
        );
    } else {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
}

let currentFrame = 1;
let animationFrameId = null;

function startAnimation() {
    window.addEventListener('scroll', () => {
        const scrollTop = html.scrollTop;
        const maxScrollTop = html.scrollHeight - window.innerHeight;
        const scrollFraction = scrollTop / maxScrollTop;
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );
        
        if (frameIndex < frameCount) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            
            animationFrameId = requestAnimationFrame(() => {
                drawImage(images[frameIndex + 1]);
            });
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvas();
    drawImage(images[currentFrame]);
});

// Initialize
resizeCanvas();
preloadImages();
