// Create stars
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const starsCount = 200;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random size
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random twinkle duration
        const duration = 2 + Math.random() * 5;
        star.style.setProperty('--duration', `${duration}s`);
        
        starsContainer.appendChild(star);
    }
}

// Update screen size indicator
function updateScreenSize() {
    const screenSize = document.getElementById('screen-size');
    screenSize.textContent = `${window.innerWidth} × ${window.innerHeight}px`;
}

// Music player functionality
const musicPlayer = {
    currentSongIndex: 0,
    isPlaying: false,
    volume: 0.8, // Default volume (0.0 to 1.0)
    playlist: [
        { 
            title: "Stellar Echoes", 
            artist: "Nebula Orchestra", 
            duration: 215,
            audioElement: null,
            audioUrl: null
        }
    ],
    
    init: function() {
        this.renderPlaylist();
        this.loadSong(this.currentSongIndex);
        
        // Event listeners
        document.getElementById('play-btn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prev-btn').addEventListener('click', () => this.prevSong());
        document.getElementById('next-btn').addEventListener('click', () => this.nextSong());
        document.getElementById('volume-slider').addEventListener('input', (e) => this.setVolume(e.target.value));
        document.getElementById('progress-bar').parentElement.addEventListener('click', (e) => this.setProgress(e));
        
        // Add music modal
        document.getElementById('add-music-btn').addEventListener('click', () => this.showModal());
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('add-music-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSong();
        });
        
        // Initialize volume
        this.setVolume(80);
    },
    
    loadSong: function(index) {
        const song = this.playlist[index];
        document.querySelector('.song-title').textContent = song.title;
        document.querySelector('.song-artist').textContent = song.artist;
        document.getElementById('duration').textContent = this.formatTime(song.duration);
        
        // Create audio element if it doesn't exist
        if (!song.audioElement) {
            song.audioElement = new Audio(song.audioUrl);
            song.audioElement.volume = this.volume;
            
            // Setup event listeners
            song.audioElement.addEventListener('timeupdate', () => {
                if (!song.audioElement) return;
                
                const percent = (song.audioElement.currentTime / song.duration) * 100;
                document.getElementById('progress-bar').style.width = `${percent}%`;
                document.getElementById('current-time').textContent = 
                    this.formatTime(song.audioElement.currentTime);
            });
            
            song.audioElement.addEventListener('ended', () => {
                this.nextSong();
            });
        }
        
        this.currentAudio = song.audioElement;
        
        // Update active item in playlist
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach(item => item.classList.remove('active'));
        if (playlistItems[index]) {
            playlistItems[index].classList.add('active');
        }
        
        // Reset progress
        document.getElementById('current-time').textContent = '0:00';
        document.getElementById('progress-bar').style.width = '0%';
    },
    
    togglePlay: function() {
        if (!this.currentAudio && this.playlist.length > 0) {
            this.loadSong(this.currentSongIndex);
        }
        
        if (!this.currentAudio) return;
        
        this.isPlaying = !this.isPlaying;
        const playBtn = document.getElementById('play-btn');
        
        if (this.isPlaying) {
            this.currentAudio.play().catch(e => {
                console.error("Playback failed:", e);
                alert("Playback failed. Please interact with the page first.");
                this.isPlaying = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.style.background = 'linear-gradient(45deg, #3498db, #9b59b6)';
            });
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
        } else {
            this.currentAudio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playBtn.style.background = 'linear-gradient(45deg, #3498db, #9b59b6)';
        }
    },
    
    prevSong: function() {
        if (this.playlist.length === 0) return;
        
        this.currentSongIndex--;
        if (this.currentSongIndex < 0) {
            this.currentSongIndex = this.playlist.length - 1;
        }
        this.loadSong(this.currentSongIndex);
        
        if (this.isPlaying) {
            this.currentAudio.play();
        }
    },
    
    nextSong: function() {
        if (this.playlist.length === 0) return;
        
        this.currentSongIndex++;
        if (this.currentSongIndex >= this.playlist.length) {
            this.currentSongIndex = 0;
        }
        this.loadSong(this.currentSongIndex);
        
        if (this.isPlaying) {
            this.currentAudio.play();
        }
    },
    
    setVolume: function(value) {
        this.volume = value / 100;
        
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
        
        // Visual feedback
        const volumeIcon = document.querySelector('.fa-volume-up');
        if (value == 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (value < 50) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    },
    
    setProgress: function(e) {
        if (!this.currentAudio) return;
        
        const progressBar = document.getElementById('progress-bar');
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const song = this.playlist[this.currentSongIndex];
        const duration = song.duration;
        const percent = (clickX / width) * 100;
        
        progressBar.style.width = `${percent}%`;
        
        // Update current time
        const currentTime = (percent / 100) * duration;
        this.currentAudio.currentTime = currentTime;
        document.getElementById('current-time').textContent = this.formatTime(currentTime);
    },
    
    formatTime: function(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    },
    
    renderPlaylist: function() {
        const playlistEl = document.getElementById('playlist');
        playlistEl.innerHTML = '';
        
        this.playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.classList.add('playlist-item');
            if (index === this.currentSongIndex) {
                item.classList.add('active');
            }
            
            item.innerHTML = `
                <div class="playlist-item-icon">
                    <i class="fas fa-music"></i>
                </div>
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${song.title}</div>
                    <div class="playlist-item-artist">${song.artist}</div>
                </div>
                <div class="playlist-item-duration">${this.formatTime(song.duration)}</div>
            `;
            
            item.addEventListener('click', () => {
                this.currentSongIndex = index;
                this.loadSong(index);
                
                if (this.isPlaying) {
                    this.currentAudio.play();
                    document.getElementById('play-btn').innerHTML = '<i class="fas fa-pause"></i>';
                    document.getElementById('play-btn').style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
                }
            });
            
            playlistEl.appendChild(item);
        });
    },
    
    showModal: function() {
        document.getElementById('add-music-modal').style.display = 'flex';
    },
    
    closeModal: function() {
        document.getElementById('add-music-modal').style.display = 'none';
        // Clear form
        document.getElementById('song-title').value = '';
        document.getElementById('song-artist').value = '';
        document.getElementById('audio-file').value = '';
    },
    
    addSong: function() {
        const title = document.getElementById('song-title').value.trim();
        const artist = document.getElementById('song-artist').value.trim();
        const fileInput = document.getElementById('audio-file');
        const file = fileInput.files[0];
        
        if (!title || !artist || !file) {
            alert('Please fill in all fields and select an audio file');
            return;
        }
        
        if (!file.type.startsWith('audio/')) {
            alert('Please select a valid audio file (MP3, WAV, OGG, etc.)');
            return;
        }
        
        // Create blob URL for the file
        const blobURL = URL.createObjectURL(file);
        
        // Create temporary audio element to get duration
        const tempAudio = new Audio();
        tempAudio.src = blobURL;
        
        tempAudio.addEventListener('loadedmetadata', () => {
            const duration = tempAudio.duration;
            
            this.playlist.push({
                title,
                artist,
                duration,
                audioElement: null,
                audioUrl: blobURL
            });
            
            this.renderPlaylist();
            this.closeModal();
            
            // If it's the first song, load it
            if (this.playlist.length === 1) {
                this.loadSong(0);
            }
            
            // Show success message
            alert(`"${title}" by ${artist} has been added to your playlist!`);
        });
        
        tempAudio.addEventListener('error', () => {
            alert('Error loading audio file. Please try another file.');
            URL.revokeObjectURL(blobURL);
        });
    }
};

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    createStars();
    musicPlayer.init();
    updateScreenSize();
    
    // Update screen size on resize
    window.addEventListener('resize', updateScreenSize);
});