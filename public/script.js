const controls = document.querySelector("#controls");
const btnPlay = document.querySelector("#play-control");
let index = 0;
let currentMusic;
let isPlaying = false;

controls.addEventListener("click", function (event) {
    const audios = [];
    let music = {};

    if (event.target.id !== "controls") {
        const musics = document.querySelectorAll('.musics');

        musics.forEach(function (item) {
            if (item.nodeName !== "#text") {
                music.name = item.querySelector('.music-name').innerText;
                music.artist = item.querySelector('.music-artist').innerText;
                music.image = item.querySelector('.music-image').src;
                music.audio = item.querySelector('.audio');
                audios.push(Object.assign({}, music)); // Use Object.assign to create a copy
            }
        });
    }

    function updateDataMusic() {
        currentMusic = audios[index];
        document.querySelector("#currentImg").src = currentMusic.image;
        document.querySelector("#currentName").innerText = currentMusic.name;
        document.querySelector("#currentArtist").innerText = currentMusic.artist;
        document.querySelector("#volume").value = currentMusic.audio.volume * 100;

        const progressbar = document.querySelector("#progressbar");
        const textCurrentDuration = document.querySelector("#current-duration");
        const textTotalDuration = document.querySelector("#total-duration");

        progressbar.max = currentMusic.audio.duration;
        textTotalDuration.innerText = secondsToMinutes(currentMusic.audio.duration);

        currentMusic.audio.ontimeupdate = function () {
            textCurrentDuration.innerText = secondsToMinutes(
                currentMusic.audio.currentTime
            );
            progressbar.valueAsNumber = currentMusic.audio.currentTime;
        };
    }

    if (event.target.id === "play-control") {
        if (index === 0) {
            updateDataMusic();
        }

        if (!isPlaying) {
            btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
            currentMusic.audio.play();
            isPlaying = true;
        } else {
            btnPlay.classList.replace("bi-pause-fill", "bi-play-fill");
            currentMusic.audio.pause();
            isPlaying = false;
        }
        musicEnded();
    }

    if (event.target.id === "vol-icon") {
        currentMusic.audio.muted = !currentMusic.audio.muted;
        event.target.classList.replace(
            currentMusic.audio.muted ? "bi-volume-up-fill" : "bi-volume-mute-fill",
            currentMusic.audio.muted ? "bi-volume-mute-fill" : "bi-volume-up-fill"
        );
        musicEnded();
    }

    if (event.target.id === "volume") {
        currentMusic.audio.volume = event.target.valueAsNumber / 100;
        musicEnded();
    }

    if (event.target.id === "progressbar") {
        currentMusic.audio.currentTime = event.target.valueAsNumber;
        musicEnded();
    }

    if (event.target.id === "next-control") {
        index++;

        if (index === audios.length) {
            index = 0;
        }

        currentMusic.audio.pause();
        updateDataMusic();
        currentMusic.audio.play();
        btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
        musicEnded();
    }

    if (event.target.id === "prev-control") {
        index--;

        if (index === -1) {
            index = audios.length - 1;
        }

        currentMusic.audio.pause();
        updateDataMusic();
        currentMusic.audio.play();
        btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
        musicEnded();
    }

    function musicEnded() {
        currentMusic.audio.addEventListener("ended", function () {
            index++;

            if (index === audios.length) {
                index = 0;
            }

            currentMusic.audio.pause();
            updateDataMusic();
            currentMusic.audio.play();
            btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
        });
    }
});

function secondsToMinutes(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
}
