const params = new URLSearchParams(window.location.search);
const encoded = params.get('data');

if (!encoded) {
  document.body.innerHTML = '<h1 style="color:white;text-align:center;margin-top:4rem;font-family:Georgia,serif;">No proposal data found 💔</h1>';
} else {

  const data = JSON.parse(decodeURIComponent(atob(encoded)));

  // Fill in content
  document.getElementById('proposal-title').textContent = `💝 My Dearest ${data.receiver}`;
  document.getElementById('proposal-subtitle').textContent = `A letter written with love, from the heart of ${data.sender}`;
  document.getElementById('proposal-question').textContent = `${data.receiver}, will you be mine? 💍`;

  // Render letter on paper
  const messageDiv = document.getElementById('proposal-message');
  messageDiv.innerHTML = `
    <div class="letter-paper">
      <p class="letter-body">${data.message}</p>
      <div class="letter-signature">
        <span class="letter-to">To: ${data.receiver}</span>
        <span class="letter-from">With all my love,<br/><strong>${data.sender}</strong></span>
      </div>
    </div>
  `;

  // Download letter button
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = '📜 Download This Letter';
  downloadBtn.classList.add('download-btn');
  downloadBtn.addEventListener('click', function() {
    const letterContent = `
My Dearest ${data.receiver},

${data.message}

To: ${data.receiver}
With all my love,
${data.sender}
    `.trim();

    const blob = new Blob([letterContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `A Letter to ${data.receiver} from ${data.sender}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });
  messageDiv.appendChild(downloadBtn);

  // Load photos from localStorage
  const memoriesDiv = document.getElementById('memories');
  const savedPhotos = localStorage.getItem('proposalPhotos');
  if (data.hasPhotos && savedPhotos) {
    JSON.parse(savedPhotos).forEach(photoSrc => {
      const img = document.createElement('img');
      img.src = photoSrc;
      memoriesDiv.appendChild(img);
    });
  }

  // Music plays via hidden YouTube iframe
  // Unmutes on first click since browsers block autoplay with sound
  const ytFrame = document.getElementById('yt-music');

  const playHint = document.createElement('div');
  playHint.textContent = '🎵 Tap anywhere to play music';
  playHint.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(139, 38, 53, 0.85);
    color: #f4e4c1;
    padding: 10px 24px;
    border-radius: 50px;
    font-family: 'Lato', sans-serif;
    font-size: 13px;
    letter-spacing: 1px;
    z-index: 999;
    cursor: pointer;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(playHint);

  document.addEventListener('click', () => {
    ytFrame.src = "https://www.youtube.com/embed/vGJTaP6anOU?autoplay=1&loop=1&playlist=vGJTaP6anOU&controls=0";
    playHint.style.display = 'none';
  }, { once: true });
  // Try autoplay immediately
  startMusic();

  // Play on first click anywhere
  document.addEventListener('click', () => {
    startMusic();
  }, { once: true });

  // Floating hearts
  const heartsContainer = document.getElementById('hearts-container');
  const heartEmojis = ['❤️', '💖', '💕', '💗', '💓', '💞', '🌹', '💍'];

  function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
    heart.style.animationDuration = (Math.random() * 4 + 5) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 9000);
  }

  setInterval(createHeart, 600);

  // Yes and No buttons
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const celebration = document.getElementById('celebration');

  yesBtn.addEventListener('click', function() {
    celebration.style.display = 'flex';
    document.getElementById('celebration-message').innerHTML = `
      <em>"There is no fear in love; but perfect love casteth out fear."</em><br/>
      — 1 John 4:18 —<br/><br/>
      ${data.receiver}, you just made ${data.sender}'s world complete. 💍
    `;
    const confetti = document.getElementById('confetti-container');
    confetti.textContent = '🎉🎊💍💖🥂✨🌹🎀';
  });

  // No button runs away
  noBtn.addEventListener('mouseover', function() {
    const maxX = window.innerWidth - 140;
    const maxY = window.innerHeight - 60;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.transition = 'all 0.3s ease';
    noBtn.style.zIndex = '999';
  });

  // No button click message
  noBtn.addEventListener('click', function() {
    noBtn.textContent = '"Love never fails — 1 Cor 13:8. I\'m not giving up on you." 💌';
    noBtn.style.fontSize = '11px';
    noBtn.style.padding = '10px 16px';
    noBtn.style.position = 'relative';
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';
  });

}