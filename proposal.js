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
// Download letter as PDF
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = '📜 Download This Letter';
  downloadBtn.classList.add('download-btn');
  downloadBtn.addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;

    // Parchment background
    doc.setFillColor(249, 237, 216);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer border
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner border
    doc.setDrawColor(196, 150, 30);
    doc.setLineWidth(0.3);
    doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

    // Top decorative line
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(0.5);
    doc.line(margin, 30, pageWidth - margin, 30);
    doc.line(margin, 32, pageWidth - margin, 32);

    // Corner flourishes
    doc.setFontSize(16);
    doc.setTextColor(184, 134, 11);
    doc.text('❧', 15, 22);
    doc.text('❧', pageWidth - 22, 22);

    // PDF Title at top center
    doc.setFontSize(11);
    doc.setTextColor(139, 38, 53);
    doc.setFont('times', 'italic');
    const pdfTitle = `${data.receiver}'s Proposal Letter`;
    doc.text(pdfTitle, pageWidth / 2, 24, { align: 'center' });

    // Greeting
    doc.setFontSize(18);
    doc.setTextColor(44, 24, 16);
    doc.setFont('times', 'bolditalic');
    doc.text(`My Dearest ${data.receiver},`, margin, 46);

    // Divider under greeting
    doc.setDrawColor(196, 160, 110);
    doc.setLineWidth(0.3);
    doc.line(margin, 50, pageWidth - margin, 50);

    // Letter body
    doc.setFontSize(13);
    doc.setFont('times', 'italic');
    doc.setTextColor(44, 24, 16);

    const lines = doc.splitTextToSize(data.message, contentWidth);
    let yPos = 62;
    const lineHeight = 8;

    lines.forEach(line => {
      if (yPos > pageHeight - 60) {
        doc.addPage();
        // Parchment background on new page
        doc.setFillColor(249, 237, 216);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setDrawColor(184, 134, 11);
        doc.setLineWidth(0.8);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
        yPos = 30;
      }
      doc.setTextColor(44, 24, 16);
      doc.text(line, margin, yPos);
      yPos += lineHeight;
    });

    // Signature section
    yPos += 10;

    // Divider before signature
    doc.setDrawColor(196, 160, 110);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // To recipient
    doc.setFontSize(11);
    doc.setFont('times', 'italic');
    doc.setTextColor(92, 61, 46);
    doc.text(`To: ${data.receiver}`, margin, yPos);

    // Closing and sender name on right
    doc.setFontSize(12);
    doc.setFont('times', 'italic');
    doc.setTextColor(44, 24, 16);
    doc.text('With all my love,', pageWidth - margin, yPos, { align: 'right' });
    yPos += 10;

    doc.setFontSize(20);
    doc.setFont('times', 'bolditalic');
    doc.setTextColor(139, 38, 53);
    doc.text(data.sender, pageWidth - margin, yPos, { align: 'right' });

    // Bottom decorative line
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
    doc.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28);

    // Date and time at bottom
    const now = new Date();
    const day = now.getDate();
    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const dateString = `Written on this day, the ${day}th of ${month}, in the year ${year} — at ${hour12}:${minutes} ${ampm}`;

    doc.setFontSize(9);
    doc.setFont('times', 'italic');
    doc.setTextColor(92, 61, 46);
    doc.text(dateString, pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Bottom corner flourish
    doc.setFontSize(14);
    doc.setTextColor(184, 134, 11);
    doc.text('❧', 15, pageHeight - 15);
    doc.text('❧', pageWidth - 20, pageHeight - 15);

    // Save the PDF
    doc.save(`${data.receiver}'s Proposal Letter.pdf`);
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

    // Hide the proposal card
    document.getElementById('proposal-card').style.display = 'none';

    // Create full screen celebration
    const boom = document.createElement('div');
    boom.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      animation: fadeInUp 0.8s ease forwards;
      overflow: hidden;
      padding: 2rem;
    `;

    boom.innerHTML = `
      <div id="fireworks-container" style="position:fixed;inset:0;pointer-events:none;z-index:0;"></div>

      <div style="
        position: relative;
        z-index: 1;
        background: linear-gradient(160deg, #f9edd8 0%, #f0d9aa 40%, #e8c98a 100%);
        border-radius: 4px;
        padding: 3rem 2.5rem;
        max-width: 520px;
        width: 100%;
        text-align: center;
        box-shadow:
          0 0 0 1px #c9a96e,
          0 0 0 4px #f4e4c1,
          0 0 0 5px #b8860b,
          10px 10px 60px rgba(0,0,0,0.8);
        border-top: 3px double #b8860b;
        border-bottom: 3px double #b8860b;
        animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      ">
        <div style="font-size: 60px; margin-bottom: 0.5rem; animation: heartbeat 1s infinite;">💍</div>

        <h1 style="
          font-family: 'Pinyon Script', cursive;
          font-size: 52px;
          color: #8b2635;
          line-height: 1.2;
          margin-bottom: 0.5rem;
        ">She Said Yes!</h1>

        <div style="
          font-size: 32px;
          letter-spacing: 6px;
          margin: 0.8rem 0;
          animation: pulse 1s infinite alternate;
        ">🎉💖🥂✨🌹🎊💍🎀</div>

        <div style="
          background: rgba(139, 38, 53, 0.08);
          border: 1px solid #c9a96e;
          border-radius: 4px;
          padding: 1.2rem 1.5rem;
          margin: 1.2rem 0;
        ">
          <p style="
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 17px;
            color: #2c1810;
            font-style: italic;
            line-height: 1.9;
            margin-bottom: 8px;
          ">"And now these three remain: faith, hope and love.<br/>But the greatest of these is love."</p>
          <p style="
            font-family: 'Lato', sans-serif;
            font-size: 11px;
            color: #5c3d2e;
            letter-spacing: 2px;
            text-transform: uppercase;
          ">— 1 Corinthians 13:13 —</p>
        </div>

        <p style="
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px;
          color: #2c1810;
          font-style: italic;
          line-height: 1.8;
          margin-bottom: 1.2rem;
        ">
          ${data.receiver}, you just made ${data.sender} the luckiest person alive. 💍<br/>
          Your love story has just begun — and it will be beautiful.
        </p>

        <div style="
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          color: #b8860b;
          letter-spacing: 3px;
          text-transform: uppercase;
          border-top: 1px solid #d4b896;
          padding-top: 1rem;
          margin-top: 0.5rem;
        ">❧ Forever Starts Today ❧</div>
      </div>
    `;

    document.body.appendChild(boom);

    // Add keyframe animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes popIn {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes heartbeat {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      @keyframes firework {
        0% { transform: translate(0,0) scale(1); opacity: 1; }
        100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Launch fireworks
    const fireworksContainer = document.getElementById('fireworks-container');
    const colors = ['#ff6b9d', '#ffd700', '#ff4444', '#00ffcc', '#ff9966', '#ffffff', '#b8860b'];

    function launchFirework() {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.7;

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        const angle = (i / 20) * 360;
        const distance = Math.random() * 120 + 60;
        const dx = Math.cos(angle * Math.PI / 180) * distance;
        const dy = Math.sin(angle * Math.PI / 180) * distance;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;

        particle.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          --dx: ${dx}px;
          --dy: ${dy}px;
          animation: firework ${Math.random() * 0.8 + 0.6}s ease-out forwards;
          box-shadow: 0 0 6px ${color};
        `;
        fireworksContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 1400);
      }
    }

    // Launch fireworks repeatedly
    launchFirework();
    const fireworkInterval = setInterval(launchFirework, 600);
    setTimeout(() => clearInterval(fireworkInterval), 8000);

    // Keep launching hearts too
    const heartsContainer = document.getElementById('hearts-container');
    if (heartsContainer) {
      heartsContainer.style.zIndex = '9998';
    }

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
    noBtn.style.position = 'relative';
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';
    noBtn.textContent = '"Love never fails — 1 Cor 13:8. I\'m not giving up on you." 💌';
    noBtn.style.fontSize = '11px';
    noBtn.style.padding = '10px 16px';
    noBtn.style.background = 'rgba(139, 38, 53, 0.1)';
    noBtn.style.border = '1px solid #8b2635';
    noBtn.style.color = '#8b2635';
    noBtn.style.borderRadius = '4px';
    noBtn.style.cursor = 'default';
    noBtn.style.zIndex = '1';
  });