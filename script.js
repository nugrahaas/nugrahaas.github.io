// Fungsi untuk meresize gambar
function resizeImage() {
    var file = document.getElementById('image-input').files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var img = document.createElement("img");
        img.onload = function() {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            var widthInput = document.getElementById("width-input");
            var heightInput = document.getElementById("height-input");

            var width = parseInt(widthInput.value) || img.width;
            var height = parseInt(heightInput.value) || img.height;

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            var outputImage = document.getElementById("output-image");
            outputImage.src = canvas.toDataURL(file.type);

            var imageDownload = document.getElementById("image-download");
            imageDownload.href = outputImage.src;

        };

        img.src = e.target.result;
    }

    reader.readAsDataURL(file);
}

function compressAudio() {
    const input = document.getElementById("audioInput");
    const file = input.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const audio = new Audio();
        audio.src = e.target.result;
        audio.controls = true;
  
        const previewAudio = document.getElementById("previewAudio");
        previewAudio.src = audio.src;
        previewAudio.style.display = "inline";
  
        const downloadLink = document.getElementById("downloadLink");
        downloadLink.href = audio.src;
        downloadLink.style.display = "inline";
  
        // Kompresi audio
  
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioSource = audioContext.createMediaElementSource(audio);
        const audioDestination = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(audioDestination.stream);
        const chunks = [];
  
        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data);
        };
  
        mediaRecorder.onstop = function () {
          const compressedBlob = new Blob(chunks, { type: "audio/webm" });
          const compressedAudioUrl = URL.createObjectURL(compressedBlob);
  
          const compressedAudio = new Audio();
          compressedAudio.src = compressedAudioUrl;
          compressedAudio.controls = true;
  
          const compressedPreviewAudio = document.getElementById("compressedPreviewAudio");
          compressedPreviewAudio.src = compressedAudio.src;
          compressedPreviewAudio.style.display = "inline";
  
          const compressedDownloadLink = document.getElementById("compressedDownloadLink");
  
          // Mengubah jenis file menjadi mp3
          compressedDownloadLink.href = compressedAudio.src;
          compressedDownloadLink.download = file.name.replace(/\.[^/.]+$/, "") + ".mp3";
          compressedDownloadLink.style.display = "inline";
  
          const audioContainer = document.getElementById("audioContainer");
          audioContainer.innerHTML = ""; // Hapus konten sebelumnya
          audioContainer.appendChild(compressedAudio);
        };
  
        audioSource.connect(audioDestination);
        audio.play();
        mediaRecorder.start();
  
        // Menggunakan event 'ended' untuk menghentikan rekaman saat audio selesai diputar
        audio.onended = function () {
          mediaRecorder.stop();
        };
  
        // Batasi durasi kompresi sesuai dengan durasi audio asli
        audio.onloadedmetadata = function () {
          setTimeout(function () {
            audio.pause();
            mediaRecorder.stop();
          }, audio.duration * 1000);
        };
      };
      reader.readAsDataURL(file);
    }
}

// Event listener saat memilih gambar
document.getElementById('image-input').addEventListener('change', resizeImage);

// Event listener saat memilih audio
document.getElementById('audio-input').addEventListener('change', compressAudio);

// Event listener saat tombol resize gambar diklik
document.getElementById('resize-button').addEventListener('click', resizeImage);

// Event listener saat tombol kompresi audio diklik
document.getElementById('compress-button').addEventListener('click', compressAudio);
