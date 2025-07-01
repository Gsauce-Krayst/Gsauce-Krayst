// JavaScript Logic
document.addEventListener('DOMContentLoaded', () => {
    const aquarium = document.getElementById('aquarium');
    let movementEnabled = true;
    let fishCount = 0;
    let autoFeedEnabled = false;
    let autoFeedInterval;
    const maxFish = 15;
    
    // Fish types with emojis
    const fishTypes = [
        { id: 'clownfish', name: 'Clownfish', emoji: '🐠' },
        { id: 'angelfish', name: 'Angelfish', emoji: '🐟' },
        { id: 'goldfish', name: 'Goldfish', emoji: '🐡' }
    ];
    
    // Add fish event listeners
    document.getElementById('addClownfish').addEventListener('click', () => addFish('clownfish'));
    document.getElementById('addAngelfish').addEventListener('click', () => addFish('angelfish'));
    document.getElementById('addGoldfish').addEventListener('click', () => addFish('goldfish'));
    
    // Environment controls
    document.getElementById('add-plant').addEventListener('click', addPlant);
    document.getElementById('add-rock').addEventListener('click', addRock);
    document.getElementById('clear-aquarium').addEventListener('click', clearAquarium);
    
    // Behavior controls
    document.getElementById('feed-fish').addEventListener('click', feedFish);
    document.getElementById('toggle-movement').addEventListener('click', toggleMovement);
    document.getElementById('heal-fish').addEventListener('click', healFish);
    document.getElementById('auto-feed').addEventListener('click', toggleAutoFeed);
    
    // Bubble density slider
    const bubbleSlider = document.getElementById('bubble-density');
    const bubbleValue = document.getElementById('bubble-value');
    bubbleSlider.addEventListener('input', () => {
        bubbleValue.textContent = bubbleSlider.value;
        createBubbles(bubbleSlider.value);
    });
    
    // Fish speed slider
    const speedSlider = document.getElementById('fish-speed');
    const speedValue = document.getElementById('speed-value');
    speedSlider.addEventListener('input', () => {
        speedValue.textContent = speedSlider.value;
        updateFishSpeeds();
    });
    
    // Add fish to aquarium
    function addFish(type) {
        if (fishCount >= maxFish) {
            alert("Your aquarium is full! Maximum 15 fish allowed.");
            return;
        }
        
        const fish = document.createElement('div');
        fish.className = `fish ${type}`;
        fish.dataset.type = type;
        fish.dataset.hunger = "85"; // Initial hunger level
        
        const fishEmoji = document.createElement('div');
        fishEmoji.className = 'fish-emoji';
        fishEmoji.textContent = getFishEmoji(type);
        
        const hungerBarContainer = document.createElement('div');
        hungerBarContainer.className = 'hunger-bar';
        
        const hungerLevel = document.createElement('div');
        hungerLevel.className = 'hunger-level';
        hungerLevel.style.width = '85%';
        hungerBarContainer.appendChild(hungerLevel);
        
        fish.appendChild(fishEmoji);
        fish.appendChild(hungerBarContainer);
        
        // Random position
        const x = Math.random() * 80 + 10;
        const y = Math.random() * 60 + 20;
        
        fish.style.left = `${x}%`;
        fish.style.top = `${y}%`;
        
        // Random size
        const size = Math.random() * 30 + 40;
        fish.style.fontSize = `${size}px`;
        
        aquarium.appendChild(fish);
        fishCount++;
        updateStatusPanel();
        
        if (movementEnabled) {
            moveFish(fish);
        }
        
        // Click to remove fish
        fish.addEventListener('click', (e) => {
            e.stopPropagation();
            fish.remove();
            fishCount--;
            updateStatusPanel();
        });
    }
    
    // Get fish emoji based on type
    function getFishEmoji(type) {
        return fishTypes.find(fish => fish.id === type)?.emoji || '🐠';
    }
    
    // Move fish randomly
    function moveFish(fish) {
        const interval = setInterval(() => {
            if (!document.body.contains(fish) || fish.classList.contains('dead')) {
                clearInterval(interval);
                return;
            }
            
            const x = Math.random() * 80 + 10;
            const y = Math.random() * 60 + 20;
            
            fish.style.transition = `left ${3 - (speedSlider.value * 0.25)}s ease, top ${3 - (speedSlider.value * 0.25)}s ease`;
            fish.style.left = `${x}%`;
            fish.style.top = `${y}%`;
            
            // Store interval ID for later clearing
            if (!fish.dataset.intervals) {
                fish.dataset.intervals = interval;
            } else {
                fish.dataset.intervals += `,${interval}`;
            }
        }, 3000);
    }
    
    // Update speeds of all fish
    function updateFishSpeeds() {
        if (!movementEnabled) return;
        
        document.querySelectorAll('.fish').forEach(fish => {
            // Clear existing intervals
            const intervals = fish.dataset.intervals;
            if (intervals) {
                intervals.split(',').forEach(id => clearInterval(parseInt(id)));
            }
            
            // Start new movement
            moveFish(fish);
        });
    }
    
    // Create bubbles
    function createBubbles(density) {
        // Clear existing bubbles
        document.querySelectorAll('.bubble').forEach(bubble => bubble.remove());
        
        // Create new bubbles based on density
        for (let i = 0; i < density; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                
                // Random size
                const size = Math.random() * 20 + 5;
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                
                // Random horizontal position
                const left = Math.random() * 100;
                bubble.style.left = `${left}%`;
                
                // Start at bottom
                bubble.style.bottom = '0px';
                
                aquarium.appendChild(bubble);
                
                // Remove bubble after animation
                setTimeout(() => {
                    bubble.remove();
                }, 4000);
            }, i * 500);
        }
    }
    
    // Add plant decoration
    function addPlant() {
        const plant = document.createElement('div');
        plant.className = 'plant';
        plant.innerHTML = '🌿';
        
        // Random position at bottom
        const left = Math.random() * 90 + 5;
        plant.style.left = `${left}%`;
        plant.style.fontSize = `${Math.random() * 30 + 40}px`;
        
        aquarium.appendChild(plant);
        
        // Click to remove
        plant.addEventListener('click', (e) => {
            e.stopPropagation();
            plant.remove();
        });
    }
    
    // Add rock decoration
    function addRock() {
        const rock = document.createElement('div');
        rock.className = 'rock';
        rock.innerHTML = '🪨';
        
        // Random position at bottom
        const left = Math.random() * 90 + 5;
        rock.style.left = `${left}%`;
        rock.style.fontSize = `${Math.random() * 30 + 40}px`;
        
        aquarium.appendChild(rock);
        
        // Click to remove
        rock.addEventListener('click', (e) => {
            e.stopPropagation();
            rock.remove();
        });
    }
    
    // Clear aquarium
    function clearAquarium() {
        if (confirm("Are you sure you want to clear the entire aquarium?")) {
            aquarium.innerHTML = '';
            fishCount = 0;
            createBubbles(bubbleSlider.value);
            updateStatusPanel();
            
            // Add status panel back
            const statusPanel = document.createElement('div');
            statusPanel.className = 'status-panel';
            statusPanel.innerHTML = `
                <h3><i class="fas fa-chart-bar"></i> Aquarium Status</h3>
                <div class="status-item">
                    <span class="status-label">Fish Count:</span>
                    <span class="status-value" id="fish-count">0</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Hungry Fish:</span>
                    <span class="status-value" id="hungry-count">0</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Starving Fish:</span>
                    <span class="status-value" id="starving-count">0</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Food Level:</span>
                    <span class="status-value" id="food-level">100%</span>
                </div>
            `;
            aquarium.appendChild(statusPanel);
        }
    }
    
    // Feed fish - make them swim to food
    function feedFish() {
        const foodX = 50;
        const foodY = 70;
        
        // Create food particles
        for (let i = 0; i < 5; i++) {
            createFoodParticle();
        }
        
        // Move fish to food
        document.querySelectorAll('.fish').forEach(fish => {
            if (fish.classList.contains('dead')) return;
            
            fish.style.transition = `all ${1.5 - (speedSlider.value * 0.1)}s ease`;
            fish.style.left = `${foodX + (Math.random() * 20 - 10)}%`;
            fish.style.top = `${foodY + (Math.random() * 10 - 5)}%`;
            
            // Update hunger level
            let hunger = parseInt(fish.dataset.hunger);
            hunger = Math.min(100, hunger + 30);
            fish.dataset.hunger = hunger;
            
            const hungerLevel = fish.querySelector('.hunger-level');
            hungerLevel.style.width = `${hunger}%`;
            
            // Update hunger color
            hungerLevel.parentElement.className = 'hunger-bar';
            if (hunger < 30) hungerLevel.parentElement.classList.add('hunger-critical');
            else if (hunger < 60) hungerLevel.parentElement.classList.add('hunger-low');
            
            setTimeout(() => {
                fish.style.transition = '';
                if (movementEnabled) {
                    moveFish(fish);
                }
            }, 1500);
        });
        
        updateStatusPanel();
    }
    
    // Create food particle
    function createFoodParticle() {
        const food = document.createElement('div');
        food.className = 'food';
        food.innerHTML = '🍤';
        
        const foodX = 50 + (Math.random() * 20 - 10);
        const foodY = 70 + (Math.random() * 10 - 5);
        
        food.style.left = `${foodX}%`;
        food.style.top = `${foodY}%`;
        
        aquarium.appendChild(food);
        
        // Remove food after animation
        setTimeout(() => {
            food.remove();
        }, 1500);
    }
    
    // Toggle fish movement
    function toggleMovement() {
        movementEnabled = !movementEnabled;
        
        if (movementEnabled) {
            document.querySelectorAll('.fish').forEach(fish => {
                if (!fish.classList.contains('dead')) {
                    moveFish(fish);
                }
            });
            document.getElementById('toggle-movement').innerHTML = '<i class="fas fa-pause"></i> Pause Movement';
        } else {
            document.querySelectorAll('.fish').forEach(fish => {
                const intervals = fish.dataset.intervals;
                if (intervals) {
                    intervals.split(',').forEach(id => clearInterval(parseInt(id)));
                }
                fish.dataset.intervals = '';
            });
            document.getElementById('toggle-movement').innerHTML = '<i class="fas fa-play"></i> Resume Movement';
        }
    }
    
    // Heal all fish
    function healFish() {
        document.querySelectorAll('.fish').forEach(fish => {
            if (fish.classList.contains('dead')) {
                fish.remove();
                fishCount--;
            } else {
                fish.dataset.hunger = "100";
                const hungerLevel = fish.querySelector('.hunger-level');
                hungerLevel.style.width = '100%';
                
                // Reset hunger color
                hungerLevel.parentElement.className = 'hunger-bar';
            }
        });
        updateStatusPanel();
    }
    
    // Toggle auto feed
    function toggleAutoFeed() {
        autoFeedEnabled = !autoFeedEnabled;
        
        if (autoFeedEnabled) {
            autoFeedInterval = setInterval(feedFish, 20000);
            document.getElementById('auto-feed').innerHTML = '<i class="fas fa-robot"></i> Auto Feed: ON';
            document.getElementById('auto-feed').disabled = false;
        } else {
            clearInterval(autoFeedInterval);
            document.getElementById('auto-feed').innerHTML = '<i class="fas fa-robot"></i> Auto Feed: OFF';
        }
    }
    
    // Update hunger levels
    function updateHunger() {
        document.querySelectorAll('.fish').forEach(fish => {
            if (fish.classList.contains('dead')) return;
            
            let hunger = parseInt(fish.dataset.hunger);
            hunger = Math.max(0, hunger - 5);
            fish.dataset.hunger = hunger;
            
            const hungerLevel = fish.querySelector('.hunger-level');
            hungerLevel.style.width = `${hunger}%`;
            
            // Update hunger color
            hungerLevel.parentElement.className = 'hunger-bar';
            if (hunger < 30) hungerLevel.parentElement.classList.add('hunger-critical');
            else if (hunger < 60) hungerLevel.parentElement.classList.add('hunger-low');
            
            // Fish dies if hunger reaches 0
            if (hunger === 0) {
                fish.classList.add('dead');
                fish.style.animation = 'dead 2s forwards';
                setTimeout(() => {
                    if (fish.parentNode) {
                        fish.remove();
                        fishCount--;
                        updateStatusPanel();
                    }
                }, 2000);
            }
        });
        
        updateStatusPanel();
    }
    
    // Update status panel
    function updateStatusPanel() {
        const liveFish = document.querySelectorAll('.fish:not(.dead)');
        const deadFish = document.querySelectorAll('.fish.dead');
        
        document.getElementById('fish-count').textContent = liveFish.length;
        
        let hungryCount = 0;
        let starvingCount = 0;
        
        liveFish.forEach(fish => {
            const hunger = parseInt(fish.dataset.hunger);
            if (hunger < 30) starvingCount++;
            else if (hunger < 60) hungryCount++;
        });
        
        document.getElementById('hungry-count').textContent = hungryCount;
        document.getElementById('starving-count').textContent = starvingCount;
        
        // Calculate average food level
        let totalHunger = 0;
        if (liveFish.length > 0) {
            liveFish.forEach(fish => {
                totalHunger += parseInt(fish.dataset.hunger);
            });
            const avgHunger = Math.round(totalHunger / liveFish.length);
            document.getElementById('food-level').textContent = `${avgHunger}%`;
        } else {
            document.getElementById('food-level').textContent = '100%';
        }
        
        // Update hunger rate display
        document.getElementById('hunger-rate').textContent = 
            bubbleSlider.value > 10 ? 'High' : 
            bubbleSlider.value < 5 ? 'Low' : 'Medium';
    }
    
    // Initialize bubbles
    createBubbles(bubbleSlider.value);
    
    // Add some initial fish and decorations
    setTimeout(() => {
        addFish('clownfish');
        addFish('angelfish');
        addFish('goldfish');
        addPlant();
        addRock();
    }, 500);
    
    // Hunger update interval
    setInterval(updateHunger, 5000);
    
    // Copy button functionality
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.parentElement.nextElementSibling;
            const text = codeBlock.textContent;
            
            navigator.clipboard.writeText(text)
                .then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                });
        });
    });
});