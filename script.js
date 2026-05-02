const photoUpload = document.getElementById('photo-upload');
const photoPreview = document.getElementById('photo-preview');
const generateBtn = document.getElementById('generate-btn');
const linkBox = document.getElementById('link-box');
const linkDisplay = document.getElementById('link-display');
const copyBtn = document.getElementById('copy-btn');

let uploadedPhotos = [];

// Show photo previews as user selects them
photoUpload.addEventListener('change', function() {
  const files = Array.from(this.files).slice(0, 5);
  uploadedPhotos = [];
  photoPreview.innerHTML = '';

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedPhotos.push(e.target.result);
      const img = document.createElement('img');
      img.src = e.target.result;
      photoPreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// Generate the shareable link
generateBtn.addEventListener('click', function() {
  const senderName = document.getElementById('sender-name').value.trim();
  const receiverName = document.getElementById('receiver-name').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!senderName || !receiverName || !message) {
    alert('Please fill in your name, their name and your message!');
    return;
  }

  const data = {    
    sender: senderName,
    receiver: receiverName,
    message: message,
    photos: uploadedPhotos
  };

  const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
const proposalUrl = `https://my-love-proposal-app.netlify.app/proposal.html?data=${encoded}`;
  const linkText = `Proposal from ${senderName} to ${receiverName}`;

  const anchor = document.getElementById('proposal-link-anchor');
  anchor.textContent = linkText;
  anchor.href = proposalUrl;

  linkDisplay.textContent = proposalUrl;
  linkBox.style.display = 'block';

  copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(proposalUrl).then(() => {
      copyBtn.textContent = 'Copied! ✅';
      setTimeout(() => copyBtn.textContent = 'Copy Link 📋', 2000);
    });
  });
});