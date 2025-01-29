const html = document.documentElement;
const canvas = document.querySelector('.airpods-scrolling');
const context = canvas.getContext('2d');

// Function to check if device is mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Function to handle canvas resize and image positioning
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    if (isMobile() && windowHeight > windowWidth) {
        // Mobile portrait mode
        canvas.width = windowWidth;
        canvas.height = windowHeight;
       
        
    } else {
        // Laptop/Desktop mode - maintain original dimensions
        canvas.width = 1920;
        canvas.height = 1080;
    }
}

// Call resize on load and window resize
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const currentFrame = index => (
    `E:/Website Works/Malhaar 2025/images/img (${index.toString()}).jpg`
)

const frameCount = 168;
const img = new Image();

// Function to draw image with proper scaling
function drawImage(image) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    if (isMobile() && windowHeight > windowWidth) {
        // Mobile portrait mode: crop and center the image
        const scaleFactor = Math.max(canvas.width / image.width, canvas.height / image.height);
        const newWidth = image.width * scaleFactor;
        const newHeight = image.height * scaleFactor;
        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;
        
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.drawImage(
            image,
            x,
            y,
            newWidth,
            newHeight
        );
    } else {
        // Laptop/Desktop mode: draw at original size
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
}

img.onload = function() {
    drawImage(img);
}

const updateImage = index => {
    img.src = currentFrame(index);
    img.onload = function() {
        drawImage(img);
    };
}

window.addEventListener('scroll', () => {
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));

    if (frameIndex < frameCount) {
        requestAnimationFrame(() => updateImage(frameIndex + 1));
    }
});

// Load first frame
img.src = currentFrame(1);