let songs = [
    {
        title: "Song One",
        artist: "Artist One",
        src: "songs/song1.mp3"
    },
    {
        title: "Song Two",
        artist: "Artist Two",
        src: "songs/song2.mp3"
    },
    {   
        title: "Song Three",
        artist: "Artist Three",
        src: "songs/song3.mp3"
    }
]; 

let audio = document.getElementById("audio");
let title = document.getElementById("title");
let artist = document.getElementById("artist");
let playBtn = document.getElementById("play");
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
let progress = document.getElementById("progress");
let currentTimeEl = document.getElementById("currentTime");
let durationEl = document.getElementById("duration");
let volume = document.getElementById("volume");
let playlist = document.getElementById("playlist");

let songIndex = 0;
let isPlaying = false;

function loadSong(index) {
    let song = songs[index];

    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;

    let items = document.querySelectorAll("#playlist li");

    items.forEach((item, i) => {
        item.classList.toggle("active", i === index);
    });
}

function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸";
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶";
}

function nextSong() {
    songIndex++;

    if (songIndex >= songs.length) {
        songIndex = 0;
    }

    loadSong(songIndex);
    playSong();
}

function prevSong() {
    songIndex--;

    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }

    loadSong(songIndex);
    playSong();
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
}

songs.forEach((song, index) => {
    let li = document.createElement("li");

    li.textContent = song.title + " - " + song.artist;

    li.addEventListener("click", () => {
        songIndex = index;
        loadSong(songIndex);
        playSong();
    });

    playlist.appendChild(li);
});

playBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

audio.addEventListener("ended", () => {
    nextSong();
});

loadSong(songIndex);