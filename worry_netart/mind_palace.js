// Worry Jar - Interactive Worry Container
class WorryJar {
    constructor() {
        this.worries = [];
        this.jarContent = document.getElementById('jar-content');
        this.selectedWorry = null;
        
        // Category colors
        this.categoryColors = {
            work: '#ff6b6b',
            school: '#ffa726',
            relationships: '#4ecdc4',
            health: '#45b7d1',
            future: '#f9ca24',
            general: '#6c5ce7'
        };
        
        this.initializeEventListeners();
        this.loadWorriesFromStorage();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }
    
    initializeEventListeners() {
        // Back to desktop button
        document.getElementById('back-to-desktop').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Reset mind button
        document.getElementById('reset-mind').addEventListener('click', () => {
            if (confirm('Are you sure you want to empty your worry jar? This will clear all worries.')) {
                this.resetJar();
            }
        });
        
        // Add worry button
        document.getElementById('add-worry-btn').addEventListener('click', () => {
            this.addWorry();
        });
        
        // Jar action buttons
        document.getElementById('shake-jar').addEventListener('click', () => {
            this.shakeJar();
        });
        
        document.getElementById('empty-jar').addEventListener('click', () => {
            if (confirm('Empty the entire jar? All worries will be removed.')) {
                this.emptyJar();
            }
        });
        
        document.getElementById('pour-worries').addEventListener('click', () => {
            this.pourWorries();
        });
        
        // Export control
        document.getElementById('export-mind').addEventListener('click', () => {
            this.exportWorries();
        });
        
        // Modal interactions
        const modal = document.getElementById('worry-modal');
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Modal action buttons
        document.getElementById('edit-worry').addEventListener('click', () => {
            this.editSelectedWorry();
        });
        
        document.getElementById('delete-worry').addEventListener('click', () => {
            this.deleteSelectedWorry();
        });
        
        document.getElementById('find-similar').addEventListener('click', () => {
            this.findSimilarWorries();
        });
    }
    
    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = timeString;
        }
    }
    
    loadWorriesFromStorage() {
        // Load existing worries from the main page or create some defaults
        const defaultWorries = [
            { text: "What if I'm not good enough?", category: "general", intensity: 8, id: Date.now() - 5 },
            { text: "Did I forget to turn off the stove?", category: "general", intensity: 6, id: Date.now() - 4 },
            { text: "Everyone is probably judging me", category: "relationships", intensity: 9, id: Date.now() - 3 },
            { text: "What if I'm not prepared for tomorrow?", category: "work", intensity: 7, id: Date.now() - 2 },
            { text: "What if I'm wasting my time?", category: "future", intensity: 5, id: Date.now() - 1 },
            { text: "Did I lock the door?", category: "general", intensity: 4, id: Date.now() }
        ];
        
        const savedWorries = localStorage.getItem('worryJarWorries');
        if (savedWorries) {
            this.worries = JSON.parse(savedWorries);
        } else {
            this.worries = defaultWorries;
        }
        
        this.renderWorries();
        this.updateStats();
    }
    
    saveWorriesToStorage() {
        localStorage.setItem('worryJarWorries', JSON.stringify(this.worries));
    }
    
    addWorry() {
        const input = document.getElementById('new-worry-input');
        const category = document.getElementById('worry-category').value;
        const text = input.value.trim();
        
        if (!text) {
            alert('Please enter a worry first!');
            return;
        }
        
        const newWorry = {
            id: Date.now(),
            text: text,
            category: category,
            intensity: Math.floor(Math.random() * 5) + 5, // 5-10
            createdAt: new Date().toISOString()
        };
        
        this.worries.push(newWorry);
        this.createWorryBead(newWorry);
        this.updateStats();
        this.saveWorriesToStorage();
        
        input.value = '';
    }
    
    createWorryBead(worry) {
        const bead = document.createElement('div');
        bead.className = `worry-bead ${worry.category} bead-fall`;
        bead.id = `bead-${worry.id}`;
        
        // Add first letter of category as visual indicator
        const categoryLetter = worry.category.charAt(0).toUpperCase();
        bead.textContent = categoryLetter;
        bead.title = worry.text;
        
        // Random position within jar (avoiding edges and accounting for curved bottom)
        const jarWidth = 250;
        const jarHeight = 350;
        const beadSize = 20;
        const borderWidth = 3; // Account for jar border
        const bottomCurve = 50; // Account for curved bottom
        
        const x = Math.random() * (jarWidth - beadSize * 2 - borderWidth * 2) + beadSize + borderWidth;
        const y = Math.random() * (jarHeight - beadSize * 2 - borderWidth - bottomCurve) + beadSize + borderWidth;
        
        bead.style.left = `${x}px`;
        bead.style.top = `${y}px`;
        
        // Add click event
        bead.addEventListener('click', () => {
            this.selectedWorry = worry;
            this.showWorryModal(worry);
        });
        
        this.jarContent.appendChild(bead);
        
        // Remove fall animation class after animation completes
        setTimeout(() => {
            bead.classList.remove('bead-fall');
        }, 800);
    }
    
    renderWorries() {
        // Clear existing beads
        this.jarContent.innerHTML = '';
        
        // Create beads for all worries
        this.worries.forEach(worry => {
            this.createWorryBead(worry);
        });
    }
    
    shakeJar() {
        const jar = document.getElementById('worry-jar');
        jar.classList.add('jar-shake');
        
        // Shake all beads
        const beads = document.querySelectorAll('.worry-bead');
        beads.forEach(bead => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            const randomRotation = (Math.random() - 0.5) * 30;
            
            bead.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
            
            setTimeout(() => {
                bead.style.transform = '';
            }, 500);
        });
        
        setTimeout(() => {
            jar.classList.remove('jar-shake');
        }, 500);
    }
    
    emptyJar() {
        const jar = document.getElementById('worry-jar');
        jar.classList.add('jar-empty');
        
        this.worries = [];
        this.jarContent.innerHTML = '';
        this.updateStats();
        this.saveWorriesToStorage();
        
        setTimeout(() => {
            jar.classList.remove('jar-empty');
        }, 1000);
    }
    
    pourWorries() {
        const beads = document.querySelectorAll('.worry-bead');
        beads.forEach((bead, index) => {
            setTimeout(() => {
                bead.classList.add('bead-pour');
                setTimeout(() => {
                    if (bead.parentNode) {
                        bead.parentNode.removeChild(bead);
                    }
                }, 1000);
            }, index * 100);
        });
        
        // Clear worries array after animation
        setTimeout(() => {
            this.worries = [];
            this.updateStats();
            this.saveWorriesToStorage();
        }, beads.length * 100 + 1000);
    }
    
    
    showWorryModal(worry) {
        const modal = document.getElementById('worry-modal');
        document.getElementById('modal-worry-text').textContent = worry.text;
        document.getElementById('modal-category').textContent = worry.category;
        document.getElementById('modal-intensity').textContent = worry.intensity + '/10';
        
        const similarCount = this.worries.filter(w => 
            w.id !== worry.id && w.category === worry.category
        ).length;
        document.getElementById('modal-connections').textContent = similarCount + ' similar';
        
        document.getElementById('modal-date').textContent = new Date(worry.createdAt).toLocaleDateString();
        
        modal.style.display = 'block';
    }
    
    editSelectedWorry() {
        if (!this.selectedWorry) return;
        
        const newText = prompt('Edit worry:', this.selectedWorry.text);
        if (newText && newText.trim()) {
            this.selectedWorry.text = newText.trim();
            this.saveWorriesToStorage();
            this.updateStats();
            this.renderWorries(); // Re-render to update tooltips
        }
        
        document.getElementById('worry-modal').style.display = 'none';
    }
    
    deleteSelectedWorry() {
        if (!this.selectedWorry) return;
        
        if (confirm('Are you sure you want to remove this worry from the jar?')) {
            this.worries = this.worries.filter(w => w.id !== this.selectedWorry.id);
            const bead = document.getElementById(`bead-${this.selectedWorry.id}`);
            if (bead) {
                bead.classList.add('bead-pour');
                setTimeout(() => {
                    if (bead.parentNode) {
                        bead.parentNode.removeChild(bead);
                    }
                }, 1000);
            }
            this.updateStats();
            this.saveWorriesToStorage();
            document.getElementById('worry-modal').style.display = 'none';
        }
    }
    
    findSimilarWorries() {
        if (!this.selectedWorry) return;
        
        const similarWorries = this.worries.filter(worry => 
            worry.id !== this.selectedWorry.id && 
            (worry.category === this.selectedWorry.category || 
             this.calculateSimilarity(worry.text, this.selectedWorry.text) > 0.3)
        );
        
        if (similarWorries.length > 0) {
            const message = `Similar worries found:\n\n${similarWorries.map(w => `• ${w.text}`).join('\n')}`;
            alert(message);
        } else {
            alert('No similar worries found.');
        }
        
        document.getElementById('worry-modal').style.display = 'none';
    }
    
    calculateSimilarity(text1, text2) {
        // Simple similarity calculation based on common words
        const words1 = text1.toLowerCase().split(/\s+/);
        const words2 = text2.toLowerCase().split(/\s+/);
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length / Math.max(words1.length, words2.length);
    }
    
    exportWorries() {
        const data = {
            worries: this.worries,
            exportedAt: new Date().toISOString(),
            totalWorries: this.worries.length
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'worry_jar_export.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    resetJar() {
        this.worries = [];
        this.jarContent.innerHTML = '';
        this.selectedWorry = null;
        this.saveWorriesToStorage();
        this.updateStats();
    }
    
    updateStats() {
        document.getElementById('total-worries').textContent = this.worries.length;
        
        // Calculate "connections" as similar worries
        let connections = 0;
        this.worries.forEach(worry => {
            const similar = this.worries.filter(w => 
                w.id !== worry.id && w.category === worry.category
            ).length;
            connections += similar;
        });
        document.getElementById('active-connections').textContent = connections;
        
        // Mind clarity decreases as jar fills
        const clarity = Math.max(0, 100 - (this.worries.length * 8));
        document.getElementById('mind-clarity').textContent = clarity + '%';
    }
}

// Initialize the Worry Jar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WorryJar();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Jar is responsive by default with CSS
});