        function searchSite() {
            const query = document.getElementById('searchInput').value.trim();
            if (query) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }
        }

        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchSite();
            }
        });

        const emojiElement = document.querySelector('.emoji-animation');
        emojiElement.addEventListener('click', function() {
            const randomEmoji = ['🎵', '🎶', '🎸', '🎹', '🎧', '🎼', '💿', '🎺', '🥁'];
            this.textContent = randomEmoji[Math.floor(Math.random() * randomEmoji.length)];
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });

        const codeElement = document.querySelector('.error-code');
        codeElement.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'codeSlideIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, 10);
        });

        document.querySelectorAll('.btn, .suggestion-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.width = '10px';
                ripple.style.height = '10px';
                ripple.style.background = 'rgba(255,255,255,0.4)';
                ripple.style.borderRadius = '50%';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.animation = 'rippleEffect 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        const messages = [
            "🎵 404: This track is in the vault!",
            "🎶 The DJ couldn't find this one in the catalog!",
            "🎸 404: This page went on indefinite hiatus!",
            "🎹 Looks like this page never made it to the studio!",
            "🎧 Signal lost—this page is off-air!",
            "🎼 This note didn't make the final remix!",
            "💿 404: The record is scratched, page unavailable!",
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        console.log(randomMessage);

        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.opacity = '0.7';
            });
            el.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
        });

        if (window.innerWidth > 768) {
            document.addEventListener('mousemove', function(e) {
                const orbs = document.querySelectorAll('.glow-orb');
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                
                orbs.forEach((orb, index) => {
                    const offsetX = (x - 0.5) * 25 * (index + 1);
                    const offsetY = (y - 0.5) * 25 * (index + 1);
                    orb.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                });
            });
            
            
        }