# Space Explorer Portfolio

![Portfolio Screenshot](https://via.placeholder.com/800x450/0f0c29/00f0ff?text=Cosmic+Portfolio+Screenshot)

A cosmic-themed portfolio website with animated elements and interactive project cards. This project showcases a unique space explorer theme with a floating helmet, twinkling stars, and responsive design.

## Features

- **Animated Cosmic Helmet**: Floating 3D helmet with glass effect
- **Twinkling Star Background**: Dynamic starfield with random twinkling
- **Interactive Project Cards**: Hover effects and animations
- **Responsive Design**: Adapts to mobile and desktop screens
- **Project Statistics**: Visually appealing facts section
- **Modern UI**: Glassmorphism and gradient effects

## Live Demo

[View Live Demo](https://your-portfolio-domain.com)

## Complete HTML Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Explorer Portfolio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            color: #e0e0ff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            width: 100%;
            background: rgba(10, 10, 26, 0.85);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(106, 0, 255, 0.3);
            overflow: hidden;
            padding: 30px;
            position: relative;
        }

        .about-container {
            display: flex;
            gap: 40px;
            align-items: center;
        }

        .about-graphic {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .cosmic-helmet {
            position: relative;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #6a00ff, #3700b3);
            box-shadow: 0 0 30px rgba(106, 0, 255, 0.5);
            animation: float 6s ease-in-out infinite;
        }

        .helmet-glass {
            position: absolute;
            width: 180px;
            height: 120px;
            background: rgba(0, 240, 255, 0.15);
            border-radius: 50%;
            top: 60px;
            left: 60px;
            border: 3px solid rgba(0, 240, 255, 0.3);
            backdrop-filter: blur(2px);
        }

        .helmet-details {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 5px solid transparent;
            border-top-color: rgba(0, 240, 255, 0.5);
            border-right-color: rgba(0, 240, 255, 0.3);
            transform: rotate(45deg);
        }

        .about-content {
            flex: 1;
        }

        .section-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 2.5rem;
            margin-bottom: 25px;
            color: #00f0ff;
            position: relative;
            text-shadow: 0 0 10px rgba(0, 240, 255, 0.7);
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, #6a00ff, #00f0ff);
            border-radius: 3px;
            box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
        }

        .about-content p {
            margin-bottom: 20px;
            line-height: 1.8;
            font-size: 1.1rem;
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .project-card {
            background: rgba(20, 20, 40, 0.6);
            border-radius: 15px;
            padding: 25px;
            border: 1px solid rgba(106, 0, 255, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
            display: block;
            text-decoration: none;
            color: inherit;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(106, 0, 255, 0.3);
            border-color: #00f0ff;
        }

        .project-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 20%),
                linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.05) 49%, rgba(255, 255, 255, 0.05) 51%, transparent 52%),
                linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, 0.05) 49%, rgba(255, 255, 255, 0.05) 51%, transparent 52%);
            background-size: 50px 50px;
            z-index: -1;
        }

        .project-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: #00f0ff;
            text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
        }

        .project-title {
            font-size: 1.4rem;
            margin-bottom: 10px;
            color: #00f0ff;
        }

        .project-description {
            font-size: 0.95rem;
            color: rgba(224, 224, 255, 0.8);
            margin-bottom: 15px;
        }

        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .tech-tag {
            background: rgba(106, 0, 255, 0.3);
            color: #bb86fc;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
        }

        .about-facts {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .fact {
            text-align: center;
            padding: 15px;
            border-radius: 10px;
            background: rgba(106, 0, 255, 0.2);
            min-width: 120px;
            transition: transform 0.3s ease;
        }

        .fact:hover {
            transform: scale(1.05);
            background: rgba(106, 0, 255, 0.3);
        }

        .fact-number {
            font-size: 2.2rem;
            font-weight: bold;
            color: #00f0ff;
            display: block;
            margin-bottom: 5px;
            text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
        }

        .fact-label {
            font-size: 0.95rem;
            color: rgba(224, 224, 255, 0.8);
        }

        .stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle var(--duration) infinite ease-in-out;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }

        @media (max-width: 900px) {
            .about-container {
                flex-direction: column;
            }
            
            .section-title {
                font-size: 2rem;
                text-align: center;
            }
            
            .section-title::after {
                left: 50%;
                transform: translateX(-50%);
            }
            
            .about-facts {
                flex-wrap: wrap;
                justify-content: center;
                gap: 15px;
            }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(20, 20, 40, 0.9);
            color: #00f0ff;
            padding: 15px 25px;
            border-radius: 10px;
            border: 1px solid #00f0ff;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transform: translateX(200%);
            transition: transform 0.5s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
    </style>
</head>
<body>
    <div class="notification" id="link-notification">
        <i class="fas fa-check-circle"></i> Project link added successfully!
    </div>
    
    <div class="container">
        <div class="stars" id="stars"></div>
        <div class="about-container">
            <div class="about-graphic">
                <div class="cosmic-helmet">
                    <div class="helmet-glass"></div>
                    <div class="helmet-details"></div>
                </div>
            </div>
            <div class="about-content">
                <h2 class="section-title">About This Space Explorer</h2>
                <p>I'm a frontend developer with a passion for creating immersive digital experiences. My journey began when I first discovered web development while researching space exploration technologies.</p>
                <p>Below are some of my featured projects that showcase my skills in creating interactive web experiences:</p>
                
                <div class="projects-grid">
                    <a href="/my work/music player/music player.html" class="project-card">
                        <div class="project-icon">
                            <i class="fas fa-music"></i>
                        </div>
                        <h3 class="project-title">Cosmic Music Player</h3>
                        <p class="project-description">An interactive 3D solar system visualization built with Three.js that doubles as a music player.</p>
                        <div class="tech-tags">
                            <span class="tech-tag">JavaScript</span>
                            <span class="tech-tag">CSS</span>
                            <span class="tech-tag">WebGL</span>
                        </div>
                    </a>
                    
                    <a href="/my work/weather simulator/weather emulator.html" class="project-card">
                        <div class="project-icon">
                            <i class="fas fa-cloud-sun"></i>
                        </div>
                        <h3 class="project-title">Weather Simulator</h3>
                        <p class="project-description">A dynamic weather visualization with realistic houses, people, and changing weather conditions.</p>
                        <div class="tech-tags">
                            <span class="tech-tag">HTML5</span>
                            <span class="tech-tag">CSS3</span>
                            <span class="tech-tag">Canvas API</span>
                        </div>
                    </a>
                    
                    <a href="/my work/aquarium/aquarium.html" class="project-card">
                        <div class="project-icon">
                            <i class="fas fa-fish"></i>
                        </div>
                        <h3 class="project-title">Interactive Aquarium</h3>
                        <p class="project-description">A fish ecosystem with hunger mechanics where you need to feed fish to keep them alive.</p>
                        <div class="tech-tags">
                            <span class="tech-tag">JavaScript</span>
                            <span class="tech-tag">CSS Animations</span>
                            <span class="tech-tag">Game Design</span>
                        </div>
                    </a>
                </div>
                
                <div class="about-facts">
                    <div class="fact">
                        <span class="fact-number">3</span>
                        <span class="fact-label">Projects Completed</span>
                    </div>
                    <div class="fact">
                        <span class="fact-number">1</span>
                        <span class="fact-label">Years Experience</span>
                    </div>
                    <div class="fact">
                        <span class="fact-number">∞</span>
                        <span class="fact-label">Ideas to Explore</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Create starfield
        document.addEventListener('DOMContentLoaded', function() {
            const starsContainer = document.getElementById('stars');
            const starsCount = 200;
            
            for (let i = 0; i < starsCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // Random position
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                
                // Random size
                const size = Math.random() * 3;
                
                // Random opacity
                const opacity = Math.random();
                
                // Random animation duration
                const duration = 5 + Math.random() * 10;
                
                star.style.left = `${x}%`;
                star.style.top = `${y}%`;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.opacity = opacity;
                star.style.setProperty('--duration', `${duration}s`);
                
                starsContainer.appendChild(star);
            }
            
            // Show notification that links have been added
            const notification = document.getElementById('link-notification');
            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }, 1000);
        });
    </script>
</body>
</html>
