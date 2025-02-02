let musicas = [];

// Carregar o JSON
fetch('musicas.json')
    .then(response => response.json())
    .then(data => {
        musicas = data; // Armazena as músicas carregadas
    })
    .catch(error => console.error('Erro ao carregar o JSON:', error));

// Função para buscar música e atualizar a lista
function buscarMusica() {
    const busca = document.getElementById('busca').value.toLowerCase();
    const listaMusicas = document.getElementById('listaMusicas');

    // Limpa a lista anterior
    listaMusicas.innerHTML = '';

    // Filtra as músicas que correspondem à busca
    const musicasFiltradas = musicas.filter(musica => musica.titulo.toLowerCase().includes(busca));

    // Exibe as músicas filtradas na lista
    musicasFiltradas.forEach(musica => {
        const item = document.createElement('div');
        item.className = 'musica-item';
        item.textContent = musica.titulo;
        item.onclick = () => exibirMusica(musica);
        listaMusicas.appendChild(item);
    });
}

// Função para exibir a música selecionada
function exibirMusica(musica) {
    const cifrasDiv = document.getElementById('cifras');
    cifrasDiv.innerHTML = `<h3>${musica.titulo} - ${musica.cantor}</h3>${musica.cifras}`;
}

// Evento de digitação no campo de busca (atualiza a lista em tempo real)
document.getElementById('busca').addEventListener('input', buscarMusica);

const majorChordsMap = {
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11,
};

const minorChordsMap = {
    'Am': 0, 'A#m': 1, 'Bbm': 1,
    'Bm': 2,
    'Cm': 3, 'C#m': 4, 'Dbm': 4,
    'Dm': 5, 'D#m': 6, 'Ebm': 6,
    'Em': 7, 'Fm': 8, 'F#m': 9, 'Gbm': 9,
    'Gm': 10, 'G#m': 11, 'Abm': 11,
};

const reverseMajorChordsMap = Object.fromEntries(Object.entries(majorChordsMap).map(([key, value]) => [value, key]));
const reverseMinorChordsMap = Object.fromEntries(Object.entries(minorChordsMap).map(([key, value]) => [value, key]));

// Transpor acordes
function transpose(semiTones) {
    const chordsDiv = document.getElementById("cifras");
    const text = chordsDiv.innerHTML;

    const updatedText = text.replace(/<b>(.*?)<\/b>/g, (match, chord) => {
        let newChord = chord; // Inicializa a nova nota como a original

        const isMinor = chord.endsWith('m'); // Verifica se é menor
        const chordParts = chord.split('/'); // Divide por "/"
        const chordWithoutBass = chordParts[0]; // Acorde principal

        // Transpor o acorde principal
        if (isMinor && minorChordsMap[chordWithoutBass] !== undefined) {
            const currentChordValue = minorChordsMap[chordWithoutBass];
            let newChordIndex = (currentChordValue + semiTones) % 12;
            if (newChordIndex < 0) newChordIndex += 12; // Corrige se o valor for negativo
            newChord = reverseMinorChordsMap[newChordIndex]; // Obtém a nova nota menor
        } else if (majorChordsMap[chordWithoutBass] !== undefined) {
            const currentChordValue = majorChordsMap[chordWithoutBass];
            let newChordIndex = (currentChordValue + semiTones) % 12;
            if (newChordIndex < 0) newChordIndex += 12; // Corrige se o valor for negativo
            newChord = reverseMajorChordsMap[newChordIndex]; // Obtém a nova nota maior
        }

        // Se houver um baixo, transpor também
        if (chordParts.length > 1) {
            const bassChord = chordParts[1]; // O acorde de baixo
            let newBassChord = bassChord; // Inicializa o novo baixo como o original
            const isBassMinor = bassChord.endsWith('m'); // Verifica se é menor

            // Transpor o acorde de baixo
            if (isBassMinor && minorChordsMap[bassChord] !== undefined) {
                const currentBassValue = minorChordsMap[bassChord];
                let newBassIndex = (currentBassValue + semiTones) % 12;
                if (newBassIndex < 0) newBassIndex += 12; // Corrige se o valor for negativo
                newBassChord = reverseMinorChordsMap[newBassIndex]; // Obtém a nova nota menor
            } else if (majorChordsMap[bassChord] !== undefined) {
                const currentBassValue = majorChordsMap[bassChord];
                let newBassIndex = (currentBassValue + semiTones) % 12;
                if (newBassIndex < 0) newBassIndex += 12; // Corrige se o valor for negativo
                newBassChord = reverseMajorChordsMap[newBassIndex]; // Obtém a nova nota maior
            }

            newChord += '/' + newBassChord; // Adiciona o novo baixo
        }

        return `<b>${newChord}</b>`; // Retorna a nova nota
    });

    chordsDiv.innerHTML = updatedText; // Atualiza o conteúdo da div
}





