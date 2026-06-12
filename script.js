const audio = document.getElementById('meuAudio');
const mainPlayBtn = document.getElementById('mainPlayBtn');
const playerPlayBtn = document.getElementById('playerPlayBtn');
const playIcon = document.getElementById('playIcon');
const progressBar = document.getElementById('progressBar');
const currentTimeSpan = document.getElementById('currentTime');
const durationTimeSpan = document.getElementById('durationTime');
const volumeSlider = document.querySelector('.volume-slider');

// Seleciona todas as linhas de música e os elementos do player inferior
const trackRows = document.querySelectorAll('.track-row');
const playerTitle = document.querySelector('.player-title');
const playerArtist = document.querySelector('.player-artist');

let currentTrackIndex = 0;

// Função para carregar uma música na barra inferior
function loadTrack(trackElement) {
    // Remove o visual verde 'active' de todas as linhas e coloca na atual
    trackRows.forEach(row => row.classList.remove('active'));
    trackElement.classList.add('active');

    // Pega as informações dos atributos 'data-' do HTML
    const src = trackElement.getAttribute('data-src');
    currentTrackIndex = parseInt(trackElement.getAttribute('data-index'));
    
    const title = trackElement.querySelector('.track-title').textContent;
    const artist = trackElement.querySelector('.track-artist').textContent;

    // Atualiza o player de áudio e o texto inferior
    audio.src = src;
    playerTitle.textContent = title;
    playerArtist.textContent = artist;
}

// Função para dar Play / Pause
function togglePlay() {
    if (audio.paused) {
        audio.play().catch(e => console.log("Clique na página antes para interagir."));
        playIcon.textContent = 'pause';
        mainPlayBtn.innerHTML = '<span class="material-icons">pause</span>';
    } else {
        audio.pause();
        playIcon.textContent = 'play_arrow';
        mainPlayBtn.innerHTML = '<span class="material-icons">play_arrow</span>';
    }
}

// Evento para quando clicar direto em uma linha da playlist
trackRows.forEach(row => {
    row.addEventListener('click', () => {
        loadTrack(row);
        audio.play();
        playIcon.textContent = 'pause';
        mainPlayBtn.innerHTML = '<span class="material-icons">pause</span>';
    });
});

// Botões principais de Play/Pause
mainPlayBtn.addEventListener('click', togglePlay);
playerPlayBtn.addEventListener('click', togglePlay);

// Avançar para a próxima música automaticamente quando a atual acabar
audio.addEventListener('ended', () => {
    currentTrackIndex++;
    if (currentTrackIndex < trackRows.length) {
        loadTrack(trackRows[currentTrackIndex]);
        audio.play();
    } else {
        // Se for a última, volta para a primeira e pausa
        loadTrack(trackRows[0]);
        playIcon.textContent = 'play_arrow';
        mainPlayBtn.innerHTML = '<span class="material-icons">play_arrow</span>';
    }
});

// --- Controles de Tempo e Volume (Mantidos do anterior) ---
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

audio.addEventListener('loadedmetadata', () => {
    durationTimeSpan.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    }
});

progressBar.addEventListener('input', () => {
    const newTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = newTime;
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});