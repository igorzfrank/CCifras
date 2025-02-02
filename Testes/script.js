let songs = [];

async function loadSongs() {
  try {
    const response = await fetch("musicas.json");
    songs = await response.json();

    const songList = document.getElementById("songList");
    songList.innerHTML = "";
    songs.forEach((song) => {
      const li = document.createElement("li");
      li.textContent = song.titulo;
      li.onclick = () => displaySong(song);
      songList.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar as músicas:", error);
  }
}

const chords = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
const minorChords = chords.map((c) => c + "m");

function displaySong(song) {
  document.getElementById("currentKey").textContent = "C";
  document.getElementById("songDisplay").innerHTML = song.cifras;
}

function transpose(step) {
  const currentKey = document.getElementById("currentKey").textContent;
  const newKey = shiftChord(currentKey, step);
  document.getElementById("currentKey").textContent = newKey;
  updateChords(newKey, step);
}

function changeKey() {
  const newKey = document.getElementById("keySelector").value;
  const currentKey = document.getElementById("currentKey").textContent;
  const step = chords.indexOf(newKey) - chords.indexOf(currentKey);
  document.getElementById("currentKey").textContent = newKey;
  updateChords(newKey, step);
}

function shiftChord(chord, step) {
  const chordParts = chord.split("/");

  return chordParts
    .map((part) => {
      const chordList = part.includes("m") ? minorChords : chords;
      let index = chordList.indexOf(part);
      if (index === -1) return part;
      return chordList[(index + step + chordList.length) % chordList.length];
    })
    .join("/");
}

function updateChords(newKey, step) {
  let songDisplay = document.getElementById("songDisplay").innerHTML;
  const chordRegex = /<b>([A-G]#?(m?)(?:\/[A-G]#?)?)<\/b>/g;

  songDisplay = songDisplay.replace(chordRegex, (match, chord) => {
    return `<b>${shiftChord(chord, step)}</b>`;
  });

  document.getElementById("songDisplay").innerHTML = songDisplay;
}

function setKey(newKey) {
  const currentKey = document.getElementById("currentKey").textContent;
  const step = chords.indexOf(newKey) - chords.indexOf(currentKey);
  document.getElementById("currentKey").textContent = newKey;
  updateChords(newKey, step);
}

function filterSongs() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const songList = document.getElementById("songList");
  songList.innerHTML = "";

  songs.forEach((song) => {
    if (song.titulo.toLowerCase().includes(searchInput)) {
      const li = document.createElement("li");
      li.textContent = song.titulo;
      li.onclick = () => displaySong(song);
      songList.appendChild(li);
    }
  });
}

document.addEventListener("DOMContentLoaded", loadSongs);
