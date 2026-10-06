const songs = [
  {
    title: "Midnight Dreams",
    artist: "Nitesh Music",
    src: "./songs/song1.mp3",
  },

  {
    title: "Neon Lights",
    artist: "Nitesh Music",
    src: "./songs/song2.mp3",
  },

  {
    title: "Lost In The Night",
    artist: "Nitesh Music",
    src: "./songs/song3.mp3",
  },
];

const audio = document.getElementById("audio");

const title = document.getElementById("title");
const artist = document.getElementById("artist");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const progress = document.getElementById("progress");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");

const playlist = document.getElementById("playlist");

const likeBtn = document.getElementById("likeBtn");

let songIndex = 0;

let isPlaying = false;

let shuffle = false;

let repeat = false;

/* =========================
   LOAD SONG
========================= */

function loadSong(index) {
  const song = songs[index];

  title.textContent = song.title;

  artist.textContent = song.artist;

  audio.src = song.src;

  audio.load();

  updatePlaylist();
}

/* =========================
   PLAY
========================= */

function playSong() {
  audio
    .play()
    .then(() => {
      isPlaying = true;

      playBtn.textContent = "❚❚";

      updatePlaylist();
    })
    .catch((error) => {
      console.error("Audio Error:", error);

      alert(
        "Song play nahi ho raha. songs folder aur MP3 filename check karo.",
      );
    });
}

/* =========================
   PAUSE
========================= */

function pauseSong() {
  audio.pause();

  isPlaying = false;

  playBtn.textContent = "▶";

  updatePlaylist();
}

/* =========================
   PLAY BUTTON
========================= */

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

/* =========================
   NEXT
========================= */

nextBtn.addEventListener("click", () => {
  if (shuffle) {
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === songIndex && songs.length > 1);

    songIndex = randomIndex;
  } else {
    songIndex++;

    if (songIndex >= songs.length) {
      songIndex = 0;
    }
  }

  loadSong(songIndex);

  playSong();
});

/* =========================
   PREVIOUS
========================= */

prevBtn.addEventListener("click", () => {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songIndex);

  playSong();
});

/* =========================
   PROGRESS
========================= */

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;

  progress.value = percent;

  currentTime.textContent = formatTime(audio.currentTime);
});

/* =========================
   DURATION
========================= */

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

/* =========================
   SEEK
========================= */

progress.addEventListener("input", () => {
  if (!audio.duration) return;

  audio.currentTime = (progress.value / 100) * audio.duration;
});

/* =========================
   VOLUME
========================= */

audio.volume = 0.8;

volume.value = 0.8;

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);

  volumeValue.textContent = Math.round(audio.volume * 100) + "%";
});

/* =========================
   SONG END
========================= */

audio.addEventListener("ended", () => {
  if (repeat) {
    audio.currentTime = 0;

    playSong();
  } else {
    nextBtn.click();
  }
});

/* =========================
   ERROR CHECK
========================= */

audio.addEventListener("error", () => {
  console.error("Audio file load nahi hua:", audio.src);
});

/* =========================
   FORMAT TIME
========================= */

function formatTime(time) {
  if (!time || isNaN(time)) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);

  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

/* =========================
   PLAYLIST
========================= */

function createPlaylist() {
  playlist.innerHTML = "";

  songs.forEach((song, index) => {
    const item = document.createElement("li");

    item.className = "song-item";

    item.innerHTML = `

            <div class="song-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="song-details">

                <strong>
                    ${song.title}
                </strong>

                <span>
                    ${song.artist}
                </span>

            </div>

            <div class="song-status">
                •
            </div>

        `;

    item.addEventListener("click", () => {
      songIndex = index;

      loadSong(songIndex);

      playSong();
    });

    playlist.appendChild(item);
  });

  document.getElementById("songCount").textContent = `${songs.length} Songs`;
}

/* =========================
   UPDATE PLAYLIST
========================= */

function updatePlaylist() {
  const items = document.querySelectorAll(".song-item");

  items.forEach((item, index) => {
    item.classList.toggle("active", index === songIndex);

    const status = item.querySelector(".song-status");

    if (index === songIndex && isPlaying) {
      status.textContent = "♫";
    } else {
      status.textContent = "•";
    }
  });
}

/* =========================
   SHUFFLE
========================= */

document.getElementById("shuffle").addEventListener("click", function () {
  shuffle = !shuffle;

  this.style.color = shuffle ? "#b26cff" : "";
});

/* =========================
   REPEAT
========================= */

document.getElementById("repeat").addEventListener("click", function () {
  repeat = !repeat;

  this.style.color = repeat ? "#ff55d6" : "";
});

/* =========================
   LIKE
========================= */

likeBtn.addEventListener("click", () => {
  likeBtn.classList.toggle("active");

  likeBtn.textContent = likeBtn.classList.contains("active") ? "♥" : "♡";
});

/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", (event) => {
  if (event.target.tagName === "INPUT") {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();

    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  }

  if (event.code === "ArrowRight") {
    nextBtn.click();
  }

  if (event.code === "ArrowLeft") {
    prevBtn.click();
  }
});

/* =========================
   START
========================= */

createPlaylist();

loadSong(0);
