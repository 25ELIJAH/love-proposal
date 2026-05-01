// Get the encoded data from the URL
const params = new URLSearchParams(window.location.search);
const encoded = params.get('data');

if (!encoded) {
  document.body.innerHTML = '<h1 style="color:white;text-align:center;margin-top:4rem;">No proposal data found 💔</h1>';
} else {

  const data = JSON.parse(decodeURIComponent(atob(encoded)));

  // Fill in the proposal content
  document.getElementById('proposal-title').textContent = `💝 Dear ${data.receiver}`;
  document.getElementById('proposal-subtitle').textContent = `A special message from ${data.sender}`;
  document.getElementById('proposal-message').textContent = `"${data.message}"`;
  document.getElementById('proposal-question').textContent = `${data.receiver}, will you be mine? 💍`;

  // Load the photos
  const memoriesDiv = document.getElementById('memories');
  if (data.photos && data.photos.length > 0) {
    data.photos.forEach(photoSrc => {
      const img = document.createElement('img');
      img.src = photoSrc;
      memoriesDiv.appendChild(img);
    });
  }

  // Play the love song
  if (data.song) {
    const audio = document.getElementById('love-song');
    audio.src = data.song;
    audio.play().catch(() => {
      console.log('Autoplay blocked by browser');
    });
  }

  // Float hearts across the screen
  const heartsContainer = document.getElementById('hearts-container');
  const heartEmojis = ['❤️', '💖', '💕', '💗', '💓', '💞', '🌹'];

  function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 16) + 'px';
    heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 8000);
  }

  setInterval(createHeart, 600);

  // Yes button
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const celebration = document.getElementById('celebration');

  yesBtn.addEventListener('click', function() {
    celebration.style.display = 'flex';
    document.getElementById('celebration-message').textContent =
      `${data.sender} is the luckiest person alive! 💍 You just made their world complete, ${data.receiver}!`;

    // Confetti
    const confetti = document.getElementById('confetti-container');
    confetti.textContent = '🎉🎊💍💖🥂✨🌹🎀';
  });

  // No button runs away!
  noBtn.addEventListener('mouseover', function() {
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 60;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.transition = 'all 0.3s ease';
  });

}