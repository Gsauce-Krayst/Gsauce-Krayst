// script.js
// Set up canvas and context
const canvas = document.getElementById('weatherCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const playPauseBtn = document.getElementById('playPause');
const changeWeatherBtn = document.getElementById('changeWeather');
const changeSeasonBtn = document.getElementById('changeSeason');
const timeSpeedSlider = document.getElementById('timeSpeed');
const cloudSpeedSlider = document.getElementById('cloudSpeed');
const canvasSizeSlider = document.getElementById('canvasSize');
const brightnessSlider = document.getElementById('brightness');
const timeDisplay = document.getElementById('timeDisplay');
const weatherDisplay = document.getElementById('weatherDisplay');
const temperatureDisplay = document.getElementById('temperatureDisplay');
const seasonDisplay = document.getElementById('seasonDisplay');

// Layout controls
const defaultLayoutBtn = document.getElementById('defaultLayout');
const focusCanvasBtn = document.getElementById('focusCanvas');
const verticalLayoutBtn = document.getElementById('verticalLayout');
const canvasContainer = document.querySelector('.canvas-container');
const controlsPanel = document.querySelector('.controls-panel');
const simulationContainer = document.querySelector('.simulation-container');

// Simulation parameters
let isPlaying = true;
let time = 6 * 60; // 6:00 AM in minutes
let weatherType = 'clear'; // 'clear', 'partly_cloudy', 'overcast', 'rain', 'snow'
let temperature = 22;
let clouds = [];
let stars = [];
let rainDrops = [];
let snowFlakes = [];
let houses = [];
let people = [];
let season = 'summer'; // 'summer', 'winter'
let timeSpeed = 0.3;
let cloudSpeed = 1;
let lightningTimer = 0;
let lightningActive = false;
let lightningAlpha = 0;

// Set canvas size
function resizeCanvas() {
    const sizeValue = parseFloat(canvasSizeSlider.value);
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight * sizeValue;
    initWeatherElements();
    initHouses();
    initPeople();
}

// Layout management
function setLayout(layout) {
    // Reset all layouts
    canvasContainer.style.flex = '1';
    controlsPanel.style.flex = '0 0 300px';
    canvasContainer.style.order = '0';
    controlsPanel.style.order = '0';
    simulationContainer.style.flexDirection = 'row';
    canvasContainer.style.height = '500px';
    
    switch(layout) {
        case 'default':
            // Default layout - side by side
            break;
        case 'focus':
            // Focus on canvas
            canvasContainer.style.flex = '3';
            controlsPanel.style.flex = '1';
            break;
        case 'vertical':
            // Vertical layout
            simulationContainer.style.flexDirection = 'column';
            canvasContainer.style.order = '0';
            controlsPanel.style.order = '1';
            canvasContainer.style.height = '550px';
            break;
    }
    
    // Update active button
    document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Resize canvas after layout change
    setTimeout(resizeCanvas, 50);
}

// Initialize houses
function initHouses() {
    houses = [];
    const houseCount = 5 + Math.floor(Math.random() * 3);
    const horizonY = canvas.height * 0.7;
    
    for (let i = 0; i < houseCount; i++) {
        const x = 50 + i * (canvas.width - 100) / (houseCount - 1);
        const width = 40 + Math.random() * 60;
        const height = 60 + Math.random() * 40;
        
        houses.push({
            x: x - width/2,
            y: horizonY - height,
            width: width,
            height: height,
            color: `hsl(${Math.random() * 30 + 10}, 50%, 50%)`,
            roofColor: `hsl(${Math.random() * 30 + 10}, 70%, 40%)`,
            chimney: Math.random() > 0.7,
            windows: Math.floor(1 + Math.random() * 4)
        });
    }
}

// Initialize people
function initPeople() {
    people = [];
    const peopleCount = 3 + Math.floor(Math.random() * 3);
    const horizonY = canvas.height * 0.7;
    
    for (let i = 0; i < peopleCount; i++) {
        const x = 50 + i * (canvas.width - 100) / (peopleCount - 1);
        
        people.push({
            x: x,
            y: horizonY - 30,
            height: 30 + Math.random() * 20,
            speed: 0.5 + Math.random() * 0.5,
            direction: Math.random() > 0.5 ? 1 : -1,
            umbrella: false,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
    }
}

// Initialize elements based on weather
function initWeatherElements() {
    // Clouds
    clouds = [];
    let cloudCount;
    switch(weatherType) {
        case 'clear': cloudCount = 5; break;
        case 'partly_cloudy': cloudCount = 10; break;
        case 'overcast': 
        case 'rain': 
        case 'snow': 
            cloudCount = 20; break;
        default: cloudCount = 8;
    }
    
    for (let i = 0; i < cloudCount; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.5,
            width: 60 + Math.random() * 100,
            height: 30 + Math.random() * 50,
            speed: (0.1 + Math.random() * 0.3) * cloudSpeed,
            opacity: (weatherType === 'overcast' || weatherType === 'rain' || weatherType === 'snow') ? 
                0.8 : 0.4 + Math.random() * 0.4,
            dark: weatherType === 'rain' || weatherType === 'snow',
            depth: Math.random() * 0.5 + 0.5 // For parallax effect
        });
    }
    
    // Stars
    stars = [];
    if (weatherType !== 'overcast' && weatherType !== 'rain' && weatherType !== 'snow') {
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.6,
                size: 0.5 + Math.random() * 2,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.01,
                brightness: Math.random() * 0.7 + 0.3
            });
        }
    }
    
    // Rain
    rainDrops = [];
    if (weatherType === 'rain') {
        for (let i = 0; i < 250; i++) {
            rainDrops.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: 10 + Math.random() * 15,
                speed: (2 + Math.random() * 3) * timeSpeed,
                opacity: 0.3 + Math.random() * 0.7,
                size: 1 + Math.random() * 2
            });
        }
    }
    
    // Snow
    snowFlakes = [];
    if (weatherType === 'snow') {
        for (let i = 0; i < 150; i++) {
            snowFlakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 1 + Math.random() * 4,
                speed: (0.5 + Math.random() * 1.5) * timeSpeed,
                sway: Math.random() * 2 - 1,
                opacity: 0.5 + Math.random() * 0.5,
                swaySpeed: 0.005 + Math.random() * 0.03,
                rotation: Math.random() * Math.PI * 2
            });
        }
    }
    
    // Initialize lightning timer for storm
    if (weatherType === 'rain') {
        lightningTimer = Math.random() * 400 + 200;
    }
}

// Calculate sun/moon position along a realistic arc
function calculateCelestialPosition() {
    const hour = time / 60;
    const isDay = hour >= 6 && hour < 18;
    const celestialProgress = ((time - 360) % 1440) / 1440; // 0 to 1 for full day cycle
    
    // More realistic path - higher in summer, lower in winter
    const seasonFactor = season === 'summer' ? 0.7 : 0.5;
    const centerX = canvas.width / 2;
    const centerY = canvas.height * (isDay ? seasonFactor : 0.6);
    const radiusX = canvas.width * 0.45;
    const radiusY = canvas.height * (isDay ? 0.5 : 0.4);
    
    // Adjust angle for more realistic movement (faster at horizon, slower at zenith)
    let angle;
    if (celestialProgress < 0.25) {
        angle = celestialProgress * Math.PI * 0.9; // Morning rise
    } else if (celestialProgress < 0.75) {
        angle = Math.PI * 0.25 + (celestialProgress - 0.25) * Math.PI * 0.6; // Midday
    } else {
        angle = Math.PI * 0.55 + (celestialProgress - 0.75) * Math.PI * 0.9; // Evening set
    }
    
    return {
        x: centerX + radiusX * Math.cos(angle),
        y: centerY - radiusY * Math.sin(angle),
        isDay,
        angle: angle
    };
}

// Draw landscape (sky and ground) with more realistic gradients
function drawLandscape() {
    const hour = time / 60;
    const isDay = hour >= 6 && hour < 18;
    const celestial = calculateCelestialPosition();
    
    // Apply brightness adjustment
    const brightness = parseFloat(brightnessSlider.value);
    ctx.globalAlpha = brightness;
    
    // Sky gradient based on time of day
    let skyGradient;
    if (isDay) {
        // Day gradient with horizon effect
        skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        
        // Adjust colors based on sun position
        if (celestial.angle > Math.PI * 0.4 && celestial.angle < Math.PI * 0.6) {
            // Midday
            if (weatherType === 'clear') {
                skyGradient.addColorStop(0, '#64b5f6');
                skyGradient.addColorStop(0.6, '#4fc3f7');
                skyGradient.addColorStop(1, '#bbdefb');
            } else {
                skyGradient.addColorStop(0, '#78909c');
                skyGradient.addColorStop(1, '#546e7a');
            }
        } else if (celestial.angle > Math.PI * 0.25 && celestial.angle < Math.PI * 0.75) {
            // Daytime but not midday
            if (weatherType === 'clear') {
                skyGradient.addColorStop(0, '#42a5f5');
                skyGradient.addColorStop(0.7, '#90caf9');
                skyGradient.addColorStop(1, '#e3f2fd');
            } else {
                skyGradient.addColorStop(0, '#607d8b');
                skyGradient.addColorStop(1, '#455a64');
            }
        } else {
            // Sunrise/sunset
            if (weatherType === 'clear') {
                skyGradient.addColorStop(0, '#ff7043');
                skyGradient.addColorStop(0.3, '#ffab91');
                skyGradient.addColorStop(0.6, '#bbdefb');
                skyGradient.addColorStop(1, '#e3f2fd');
            } else {
                skyGradient.addColorStop(0, '#ff8a65');
                skyGradient.addColorStop(1, '#78909c');
            }
        }
    } else {
        // Night gradient
        skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, '#0d47a1');
        skyGradient.addColorStop(0.6, '#1a237e');
        skyGradient.addColorStop(1, '#000000');
    }
    
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw horizon glow for sunset/sunrise
    if ((celestial.angle < Math.PI * 0.25 || celestial.angle > Math.PI * 0.75) && isDay && weatherType !== 'rain' && weatherType !== 'snow') {
        const horizonY = canvas.height * 0.7;
        const horizonGlow = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY + 50);
        horizonGlow.addColorStop(0, 'rgba(255, 152, 0, 0.6)');
        horizonGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = horizonGlow;
        ctx.fillRect(0, horizonY - 50, canvas.width, 100);
    }
    
    // Ground
    const horizonY = canvas.height * 0.7;
    if (weatherType === 'snow') {
        ctx.fillStyle = '#F5F5F5';
    } else {
        ctx.fillStyle = isDay ? (season === 'summer' ? '#388E3C' : '#5D4037') : '#263238';
    }
    ctx.fillRect(0, horizonY, canvas.width, canvas.height - horizonY);
    
    // Terrain with more detail
    ctx.fillStyle = weatherType === 'snow' ? '#F0F8FF' : 
           isDay ? (season === 'summer' ? '#4CAF50' : '#8D6E63') : '#37474F';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    
    // Create more natural-looking hills
    for (let x = 0; x < canvas.width; x += 20) {
        const noise = Math.sin(x * 0.02) * 30;
        const y = horizonY - 30 - Math.random() * 20 - noise;
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(canvas.width, horizonY);
    ctx.closePath();
    ctx.fill();
    
    // Add some trees in the distance
    if (season === 'summer' && isDay) {
        ctx.fillStyle = weatherType === 'snow' ? '#F0F8FF' : '#2E7D32';
        for (let i = 0; i < 8; i++) {
            const x = canvas.width * 0.1 + i * 90;
            const treeHeight = 50 + Math.random() * 30;
            const treeWidth = 20 + Math.random() * 10;
            
            // Tree trunk
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(x - 3, horizonY - treeHeight + 40, 6, treeHeight - 40);
            
            // Tree top
            ctx.fillStyle = weatherType === 'snow' ? '#F0F8FF' : '#2E7D32';
            ctx.beginPath();
            ctx.moveTo(x, horizonY - treeHeight);
            ctx.lineTo(x - treeWidth/2, horizonY - treeHeight/2);
            ctx.lineTo(x - treeWidth, horizonY - treeHeight/3);
            ctx.lineTo(x - treeWidth*0.7, horizonY - treeHeight/4);
            ctx.lineTo(x - treeWidth*1.2, horizonY);
            ctx.lineTo(x + treeWidth*1.2, horizonY);
            ctx.lineTo(x + treeWidth*0.7, horizonY - treeHeight/4);
            ctx.lineTo(x + treeWidth, horizonY - treeHeight/3);
            ctx.lineTo(x + treeWidth/2, horizonY - treeHeight/2);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    // Reset global alpha
    ctx.globalAlpha = 1.0;
}

// Draw houses
function drawHouses() {
    const horizonY = canvas.height * 0.7;
    
    houses.forEach(house => {
        // House body
        ctx.fillStyle = house.color;
        ctx.fillRect(house.x, house.y, house.width, house.height);
        
        // Roof
        ctx.fillStyle = house.roofColor;
        ctx.beginPath();
        ctx.moveTo(house.x - 5, house.y);
        ctx.lineTo(house.x + house.width/2, house.y - 30);
        ctx.lineTo(house.x + house.width + 5, house.y);
        ctx.closePath();
        ctx.fill();
        
        // Snow on roof in winter
        if (season === 'winter') {
            ctx.fillStyle = '#F5F5F5';
            ctx.beginPath();
            ctx.moveTo(house.x - 3, house.y - 5);
            ctx.lineTo(house.x + house.width/2 - 5, house.y - 25);
            ctx.lineTo(house.x + house.width/2 + 5, house.y - 25);
            ctx.lineTo(house.x + house.width + 3, house.y - 5);
            ctx.closePath();
            ctx.fill();
        }
        
        // Chimney
        if (house.chimney) {
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(house.x + house.width - 15, house.y - 40, 10, 25);
            
            // Smoke
            if (temperature < 15 && Math.random() > 0.7) {
                ctx.fillStyle = `rgba(200, 200, 200, ${0.5 + Math.random() * 0.3})`;
                ctx.beginPath();
                ctx.arc(house.x + house.width - 10, house.y - 45, 5 + Math.random() * 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(house.x + house.width - 15, house.y - 55, 7 + Math.random() * 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Windows
        ctx.fillStyle = '#FFD700';
        const windowSize = 8;
        const spacing = 12;
        
        for (let i = 0; i < house.windows; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const x = house.x + 10 + col * spacing;
            const y = house.y + 10 + row * spacing;
            
            ctx.fillRect(x, y, windowSize, windowSize);
        }
        
        // Door
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(house.x + house.width/2 - 8, house.y + house.height - 25, 16, 25);
        
        // Door knob
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(house.x + house.width/2 + 5, house.y + house.height - 12, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw people
function drawPeople() {
    const hour = time / 60;
    const isDay = hour >= 6 && hour < 18;
    
    // Only show people during the day and in appropriate weather
    if (!isDay || weatherType === 'rain' || weatherType === 'snow') return;
    
    people.forEach(person => {
        // Update position
        person.x += person.speed * person.direction * timeSpeed;
        
        // Reverse direction at edges
        if (person.x < 30) {
            person.direction = 1;
            person.x = 30;
        } else if (person.x > canvas.width - 30) {
            person.direction = -1;
            person.x = canvas.width - 30;
        }
        
        // Draw person
        ctx.strokeStyle = person.color;
        ctx.lineWidth = 2;
        
        // Head
        ctx.beginPath();
        ctx.arc(person.x, person.y - person.height, 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(person.x, person.y - person.height + 5);
        ctx.lineTo(person.x, person.y - 10);
        ctx.stroke();
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(person.x, person.y - 10);
        ctx.lineTo(person.x - 8, person.y);
        ctx.moveTo(person.x, person.y - 10);
        ctx.lineTo(person.x + 8, person.y);
        ctx.stroke();
        
        // Arms
        ctx.beginPath();
        ctx.moveTo(person.x, person.y - person.height + 15);
        ctx.lineTo(person.x - 10, person.y - person.height + 25);
        ctx.moveTo(person.x, person.y - person.height + 15);
        ctx.lineTo(person.x + 10, person.y - person.height + 25);
        ctx.stroke();
        
        // Draw umbrella if raining
        if (weatherType === 'rain' && person.umbrella) {
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(person.x, person.y - person.height - 5, 12, Math.PI, 0, false);
            ctx.fill();
            
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(person.x - 1, person.y - person.height - 5, 2, 15);
        }
    });
}

// Draw sun with more realistic lighting and glow
function drawSun(x, y) {
    // Sun glow with more vibrant colors
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 70);
    gradient.addColorStop(0, '#FFEB3B');
    gradient.addColorStop(0.4, '#FFC107');
    gradient.addColorStop(0.7, '#FF9800');
    gradient.addColorStop(1, 'rgba(255, 152, 0, 0)');
    
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(x, y, 70, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun core
    ctx.beginPath();
    ctx.fillStyle = '#FFEB3B';
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun rays (only visible when not overcast)
    if (weatherType !== 'overcast' && weatherType !== 'rain' && weatherType !== 'snow') {
        ctx.save();
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 24; i++) {
            const rayAngle = (i / 24) * Math.PI * 2;
            const rayLength = 80 + Math.random() * 20;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                x + Math.cos(rayAngle) * rayLength,
                y + Math.sin(rayAngle) * rayLength
            );
            ctx.lineWidth = 4 + Math.random() * 3;
            ctx.strokeStyle = '#FFC107';
            ctx.stroke();
        }
        ctx.restore();
    }
}

// Draw moon with more detailed phases and craters
function drawMoon(x, y) {
    // Calculate moon phase based on day of year
    const dayOfYear = Math.floor((time / 1440) % 365);
    const phase = (dayOfYear / 29.53) % 1; // 29.53-day lunar cycle
    
    ctx.save();
    
    // Moon glow
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 50);
    glow.addColorStop(0, 'rgba(230, 230, 250, 0.8)');
    glow.addColorStop(1, 'rgba(230, 230, 250, 0)');
    
    ctx.beginPath();
    ctx.fillStyle = glow;
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Moon disc
    ctx.beginPath();
    ctx.fillStyle = '#E6E6FA';
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();
    
    // Moon phase (shadow)
    ctx.beginPath();
    ctx.fillStyle = '#000033';
    
    if (phase < 0.5) {
        // Waning moon
        ctx.arc(x, y, 35, Math.PI * (0.5 - phase * 2), Math.PI * (1.5 - phase * 2), true);
    } else {
        // Waxing moon
        ctx.arc(x, y, 35, Math.PI * (0.5 - (phase - 0.5) * 2), Math.PI * (1.5 - (phase - 0.5) * 2));
    }
    
    ctx.lineTo(x, y);
    ctx.fill();
    
    // Moon craters with more detail
    ctx.fillStyle = '#C0C0C0';
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 25;
        const craterX = x + Math.cos(angle) * distance;
        const craterY = y + Math.sin(angle) * distance;
        const size = 2 + Math.random() * 5;
        
        ctx.beginPath();
        ctx.arc(craterX, craterY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Crater shadow
        ctx.beginPath();
        ctx.fillStyle = '#A0A0A0';
        ctx.arc(craterX - size/3, craterY - size/3, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Crater highlight
        ctx.beginPath();
        ctx.fillStyle = '#E0E0E0';
        ctx.arc(craterX + size/4, craterY + size/4, size/3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

// Draw more realistic clouds with depth
function drawClouds() {
    clouds.forEach(cloud => {
        // Update cloud position with parallax effect
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + cloud.width) {
            cloud.x = -cloud.width;
            cloud.y = Math.random() * canvas.height * 0.5;
        }
        
        // Draw cloud with more natural shape
        ctx.save();
        ctx.globalAlpha = cloud.opacity;
        ctx.fillStyle = cloud.dark ? '#707070' : '#FFFFFF';
        
        ctx.beginPath();
        // Main cloud body
        ctx.arc(cloud.x, cloud.y, cloud.height * 0.5, 0, Math.PI * 2);
        
        // Cloud extensions
        for (let i = 0; i < 4; i++) {
            const offsetX = (Math.random() - 0.5) * cloud.width * 0.6;
            const offsetY = (Math.random() - 0.5) * cloud.height * 0.4;
            const size = cloud.height * (0.4 + Math.random() * 0.3);
            ctx.moveTo(cloud.x + offsetX + size, cloud.y + offsetY);
            ctx.arc(cloud.x + offsetX, cloud.y + offsetY, size, 0, Math.PI * 2);
        }
        
        ctx.fill();
        ctx.restore();
    });
}

// Draw stars with twinkling effect
function drawStars() {
    const hour = time / 60;
    const isDay = hour >= 6 && hour < 18;
    
    if (isDay || weatherType === 'overcast' || weatherType === 'rain' || weatherType === 'snow') return;
    
    stars.forEach(star => {
        // Twinkle effect
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0.2) {
            star.twinkleSpeed = -star.twinkleSpeed;
        }
        
        // Draw star with glow effect
        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Star glow
        const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fill();
        ctx.restore();
    });
}

// Draw more realistic rain
function drawRain() {
    ctx.strokeStyle = 'rgba(174, 194, 224, 0.8)';
    ctx.lineWidth = 1.5;
    
    rainDrops.forEach(drop => {
        // Update position
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * canvas.width;
        }
        
        // Draw raindrop with slight curve
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length/4, drop.y + drop.length);
        ctx.stroke();
        
        // Draw splash when raindrop hits the ground
        if (drop.y > canvas.height * 0.95) {
            const splashSize = Math.random() * 3;
            ctx.beginPath();
            ctx.arc(drop.x, canvas.height, splashSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 220, 255, ${0.5 * (1 - (drop.y - canvas.height * 0.95)/(canvas.height * 0.05))})`;
            ctx.fill();
        }
    });
}

// Draw more detailed snowflakes
function drawSnow() {
    snowFlakes.forEach(flake => {
        // Update position with swaying motion
        flake.y += flake.speed;
        flake.x += flake.sway;
        flake.sway = Math.sin(Date.now() * 0.001 * flake.swaySpeed) * 1.5;
        flake.rotation += 0.01;
        
        if (flake.y > canvas.height) {
            flake.y = -flake.size;
            flake.x = Math.random() * canvas.width;
        }
        if (flake.x < 0) flake.x = canvas.width;
        if (flake.x > canvas.width) flake.x = 0;
        
        // Draw snowflake
        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.rotation);
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.lineWidth = 1;
        
        // More complex snowflake shape
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * flake.size * 1.5, Math.sin(angle) * flake.size * 1.5);
            
            // Add secondary branches
            const branchAngle1 = angle + Math.PI/12;
            const branchAngle2 = angle - Math.PI/12;
            ctx.moveTo(Math.cos(angle) * flake.size, Math.sin(angle) * flake.size);
            ctx.lineTo(Math.cos(branchAngle1) * flake.size * 0.7, Math.sin(branchAngle1) * flake.size * 0.7);
            ctx.moveTo(Math.cos(angle) * flake.size, Math.sin(angle) * flake.size);
            ctx.lineTo(Math.cos(branchAngle2) * flake.size * 0.7, Math.sin(branchAngle2) * flake.size * 0.7);
        }
        
        ctx.stroke();
        
        // Snowflake center
        ctx.beginPath();
        ctx.arc(0, 0, flake.size/3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();
        ctx.restore();
    });
}

// Draw lightning effect during storms
function drawLightning() {
    if (weatherType !== 'rain' || !lightningActive) return;
    
    ctx.save();
    ctx.globalAlpha = lightningAlpha;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw lightning bolt
    const startX = Math.random() * canvas.width * 0.5 + canvas.width * 0.25;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    
    // Create jagged lightning path
    let currentX = startX;
    let currentY = 0;
    const segments = 10;
    const segmentHeight = canvas.height / segments;
    
    for (let i = 0; i < segments; i++) {
        const nextX = currentX + (Math.random() - 0.5) * 80;
        const nextY = currentY + segmentHeight;
        
        ctx.lineTo(nextX, nextY);
        
        // Add a branch occasionally
        if (i > 2 && i < segments - 2 && Math.random() > 0.7) {
            const branchX = nextX + (Math.random() - 0.5) * 50;
            const branchY = nextY + segmentHeight * 0.5;
            ctx.lineTo(branchX, branchY);
            ctx.lineTo(nextX, nextY);
        }
        
        currentX = nextX;
        currentY = nextY;
    }
    
    ctx.strokeStyle = '#4FC3F7';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
}

// Update temperature based on time and weather
function updateTemperature() {
    const hour = time / 60;
    
    // Base temperature based on time of day
    let baseTemp;
    if (hour >= 5 && hour < 9) { // Early morning
        baseTemp = 15;
    } else if (hour >= 9 && hour < 17) { // Daytime
        baseTemp = 22;
    } else if (hour >= 17 && hour < 21) { // Evening
        baseTemp = 18;
    } else { // Night
        baseTemp = 12;
    }
    
    // Adjust for weather
    switch(weatherType) {
        case 'clear': 
            temperature = baseTemp + (season === 'summer' ? 5 : -2);
            break;
        case 'partly_cloudy':
            temperature = baseTemp + (season === 'summer' ? 3 : -1);
            break;
        case 'overcast':
            temperature = baseTemp + (season === 'summer' ? 1 : 1);
            break;
        case 'rain':
            temperature = baseTemp - (season === 'summer' ? 3 : 4);
            break;
        case 'snow':
            temperature = baseTemp - 6;
            break;
    }
    
    // Add some random variation
    temperature += Math.random() * 2 - 1;
    temperature = Math.round(temperature * 10) / 10;
    
    temperatureDisplay.textContent = `${temperature}°C`;
}

// Update time display
function updateDisplay() {
    const hour = Math.floor(time / 60) % 24;
    const minute = time % 60;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    timeDisplay.textContent = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
    
    let weatherText;
    switch(weatherType) {
        case 'clear': weatherText = 'Clear'; break;
        case 'partly_cloudy': weatherText = 'Partly Cloudy'; break;
        case 'overcast': weatherText = 'Overcast'; break;
        case 'rain': weatherText = 'Rain'; break;
        case 'snow': weatherText = 'Snow'; break;
    }
    weatherDisplay.textContent = weatherText;
    
    seasonDisplay.textContent = season.charAt(0).toUpperCase() + season.slice(1);
}

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawLandscape();
    drawStars();
    
    const celestial = calculateCelestialPosition();
    if (celestial.isDay) {
        drawSun(celestial.x, celestial.y);
    } else {
        drawMoon(celestial.x, celestial.y);
    }
    
    drawClouds();
    drawHouses();
    drawPeople();
    
    if (weatherType === 'rain') drawRain();
    if (weatherType === 'snow') drawSnow();
    
    // Handle lightning effects
    if (weatherType === 'rain') {
        lightningTimer--;
        if (lightningTimer <= 0) {
            lightningActive = true;
            lightningTimer = Math.random() * 400 + 200;
            lightningAlpha = 0.8;
        }
        
        if (lightningActive) {
            drawLightning();
            lightningAlpha -= 0.05;
            if (lightningAlpha <= 0) {
                lightningActive = false;
            }
        }
    }
    
    if (isPlaying) {
        time = (time + 0.25 * timeSpeed) % 1440; // 1440 minutes in a day
        updateDisplay();
        updateTemperature();
    }
    
    requestAnimationFrame(animate);
}

// Initialize the simulation
function initSimulation() {
    // Set initial canvas size
    resizeCanvas();
    
    // Set up event listeners
    window.addEventListener('resize', resizeCanvas);
    canvasSizeSlider.addEventListener('input', resizeCanvas);
    
    // Layout controls
    defaultLayoutBtn.addEventListener('click', () => setLayout('default'));
    focusCanvasBtn.addEventListener('click', () => setLayout('focus'));
    verticalLayoutBtn.addEventListener('click', () => setLayout('vertical'));
    
    // Simulation controls
    playPauseBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        playPauseBtn.innerHTML = isPlaying ? 
            '<i class="fas fa-pause"></i> Pause' : 
            '<i class="fas fa-play"></i> Play';
    });
    
    changeWeatherBtn.addEventListener('click', function() {
        const weatherTypes = ['clear', 'partly_cloudy', 'overcast', 'rain', 'snow'];
        const currentIndex = weatherTypes.indexOf(weatherType);
        weatherType = weatherTypes[(currentIndex + 1) % weatherTypes.length];
        initWeatherElements();
        
        // Give people umbrellas when it rains
        if (weatherType === 'rain') {
            people.forEach(person => {
                person.umbrella = Math.random() > 0.3;
            });
        }
        
        updateDisplay();
        updateTemperature();
    });
    
    changeSeasonBtn.addEventListener('click', function() {
        season = season === 'summer' ? 'winter' : 'summer';
        changeSeasonBtn.innerHTML = season === 'summer' ? 
            '<i class="fas fa-snowflake"></i> Change Season' : 
            '<i class="fas fa-sun"></i> Change Season';
        initWeatherElements();
        initHouses();
        updateDisplay();
        updateTemperature();
    });
    
    timeSpeedSlider.addEventListener('input', function() {
        timeSpeed = parseFloat(this.value);
        // Update rain and snow speed based on time speed
        rainDrops.forEach(drop => {
            drop.speed = (2 + Math.random() * 3) * timeSpeed;
        });
        snowFlakes.forEach(flake => {
            flake.speed = (0.5 + Math.random() * 1.5) * timeSpeed;
        });
    });
    
    cloudSpeedSlider.addEventListener('input', function() {
        cloudSpeed = parseFloat(this.value);
        clouds.forEach(cloud => {
            cloud.speed = (0.1 + Math.random() * 0.3) * cloudSpeed;
        });
    });
    
    // Initialize weather elements
    initWeatherElements();
    initHouses();
    initPeople();
    updateDisplay();
    updateTemperature();
    
    // Start animation
    animate();
}

// Start the simulation when the page loads
document.addEventListener('DOMContentLoaded', initSimulation);