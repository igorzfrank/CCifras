let songs = [];
let favoriteSongs = new Set(); // Usar um Set para armazenar músicas favoritas
let capoPosition = 0; // Inicialmente sem capotraste

function updateCapo() {
  const capoSelector = document.getElementById("capoSelector");
  capoPosition = parseInt(capoSelector.value, 10); // Obter a posição do capotraste

  const currentKey = document.getElementById("currentKey").textContent;
  const step = capoPosition; // O número de casas do capotraste equivale ao número de tons a baixar

  // Atualizar o tom atual considerando o capotraste
  const newKey = shiftChord(currentKey, -step); // Baixar o tom
  document.getElementById("currentKey").textContent = newKey;
  updateChords(newKey, -step); // Atualizar as cifras
}

async function loadSongs() {
  try {
    const response = await fetch("musicas.json");
    songs = await response.json();

    const songList = document.getElementById("songList");
    songList.innerHTML = "";
    songs.forEach((song) => {
      const li = document.createElement("li");
      li.textContent = song.titulo;

      // Criar botão de favoritar
      const favoriteButton = document.createElement("button");
      favoriteButton.textContent = favoriteSongs.has(song.titulo)
        ? "Desfavoritar"
        : "Favoritar";
      favoriteButton.onclick = (e) => {
        e.stopPropagation(); // Impedir que o clique no botão abra a música
        toggleFavorite(song.titulo, favoriteButton);
      };

      li.onclick = () => displaySong(song);
      li.appendChild(favoriteButton);
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
  // Definir o tom atual como o tom original da música
  document.getElementById("currentKey").textContent = song.tomOriginal;

  // Calcular o passo para transpor a cifra para o tom original
  const currentKey = "C"; // Considerando que o tom inicial é C
  const step = chords.indexOf(song.tomOriginal) - chords.indexOf(currentKey);

  // Atualizar a exibição da cifra para o tom original
  const transposedCifras = updateChordsForDisplay(song.cifras, step);
  document.getElementById("songDisplay").innerHTML = transposedCifras;
}

// Função auxiliar para atualizar as cifras para o tom desejado
function updateChordsForDisplay(cifras, step) {
  const chordRegex = /<b>([A-G]#?(m?)(?:\/[A-G]#?)?)<\/b>/g;

  return cifras.replace(chordRegex, (match, chord) => {
    return `<b>${shiftChord(chord, step)}</b>`;
  });
}

function transpose(step) {
  const currentKey = document.getElementById("currentKey").textContent;
  const newKey = shiftChord(currentKey, step);
  document.getElementById("currentKey").textContent = newKey;
  updateChords(newKey, step);
  
  // Resetar o capo para 0
  capoPosition = 0; // Adicione esta linha
  document.getElementById("capoSelector").value = 0; // Atualiza o seletor do capo
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

function toggleFavorite(songTitle, button) {
  if (favoriteSongs.has(songTitle)) {
    favoriteSongs.delete(songTitle);
    button.textContent = "Favoritar";
  } else {
    favoriteSongs.add(songTitle);
    button.textContent = "Desfavoritar";
  }
}

function filterSongs() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const songList = document.getElementById("songList");
  songList.innerHTML = "";

  songs.forEach((song) => {
    const isFavorite = favoriteSongs.has(song.titulo);
    const matchesSearch = song.titulo.toLowerCase().includes(searchInput);

    // Mostrar a música se corresponder à busca ou se for favorita
    if (matchesSearch || isFavorite) {
      const li = document.createElement("li");
      li.textContent = song.titulo;

      // Criar botão de favoritar
      const favoriteButton = document.createElement("button");
      favoriteButton.textContent = isFavorite ? "Desfavoritar" : "Favoritar";
      favoriteButton.onclick = (e) => {
        e.stopPropagation(); // Impedir que o clique no botão abra a música
        toggleFavorite(song.titulo, favoriteButton);
      };

      li.onclick = () => displaySong(song);
      li.appendChild(favoriteButton);
      songList.appendChild(li);
    }
  });
}

document.addEventListener("DOMContentLoaded", loadSongs);
