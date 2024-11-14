const uploadButton = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("effect-slider");

let img = new Image();
let effectType = "";
let rotationAngle = 0;
let flipX = 1; // Horizontal flip factor
let flipY = 1; // Vertical flip factor

uploadButton.addEventListener("change", function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        img.onload = function() {
            // Set canvas dimensions to fit within 400px max while maintaining aspect ratio
            const scaleFactor = Math.min(400 / img.height, 400 / img.width, 1);
            canvas.width = img.width * scaleFactor;
            canvas.height = img.height * scaleFactor;

            resetEffects(); // Reset effects on new image load
            applyImageEffect();
        }
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function applyEffect(effect) {
    effectType = effect;
    slider.value = 100; // Reset slider to default (100)
    slider.style.display = (effect === 'rotate' || effect === 'flip') ? 'none' : 'block';
    
    if (effect === 'rotate') {
        rotationAngle = (rotationAngle + 90) % 360; // Rotate 90 degrees each time
    }
    if (effect === 'flip') {
        flipX *= -1; // Toggle horizontal flip
    }
    applyImageEffect();
}

slider.addEventListener("input", applyImageEffect);

function applyImageEffect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set filter based on effect type and slider value
    const effectValue = slider.value / 100;
    ctx.filter = getFilter(effectType, effectValue);

    // Apply transformations (rotation and flip)
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flipX, flipY);
    ctx.rotate((rotationAngle * Math.PI) / 180);
    
    // Draw image centered
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();
}

function getFilter(effectType, effectValue) {
    switch(effectType) {
        case 'brightness':
            return `brightness(${effectValue})`;
        case 'saturation':
            return `saturate(${effectValue})`;
        case 'greyscale':
            return `grayscale(${effectValue})`;
        case 'invert':
            return `invert(${effectValue})`;
        default:
            return "none";
    }
}

function resetEffects() {
    effectType = "";
    rotationAngle = 0;
    flipX = 1;
    flipY = 1;
    ctx.filter = "none";
}

// Download function
function downloadImage() {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
}
