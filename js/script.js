console.log("let play with javascript");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinuteSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;

    let a = await fetch(`${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML += ` <li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Abhishek Sharma</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
    let a = await fetch(`songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cardcontainer");
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];

            try {
                let a = await fetch(`songs/${folder}/info.json`);
                let response = await a.json();

                cardcontainer.innerHTML += `<div data-folder="${folder}" class="card">
                    <div class="play">
                        <img src="img/play.svg" alt="">
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="">
                    <p>${response.title}</p>
                    <span>${response.description}</span>
                </div>`;
            } catch (err) {
                console.warn(`Error loading info.json for ${folder}`, err);
            }
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

async function main() {
    await getSongs(`songs/cs`);
    playMusic(songs[0], true);
    displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play2.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinuteSeconds(currentSong.currentTime)} / ${secondsToMinuteSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    let menuOpen = false;

    document.querySelector(".hamburger").addEventListener("click", () => {
        const left = document.querySelector(".left");
        const hamburger = document.querySelector(".hamburger");

        if (!menuOpen) {
            left.style.left = "0";
            hamburger.src = "img/close.svg";
            menuOpen = true;
        } else {
            left.style.left = "-100%";
            hamburger.src = "img/hamburger.svg";
            menuOpen = false;
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1156) {
            document.querySelector(".left").style.left = "0";
            document.querySelector(".hamburger").src = "hamburger.svg";
            menuOpen = false;
        }
    });

    previous.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        const volumeImg = document.querySelector(".volume>img");

        if (currentSong.volume > 0) {
            volumeImg.src = volumeImg.src.replace("img/mute.svg", "img/volume.svg");
        } else {
            volumeImg.src = volumeImg.src.replace("img/volume.svg", "img/mute.svg");
        }
    });

    document.querySelector(".volume>img").addEventListener("click", e => {
        const input = document.querySelector(".range input");

        if (e.target.src.includes("volume.svg")) {
            e.target.src = "img/mute.svg";
            currentSong.volume = 0;
            input.value = 0;
        } else {
            e.target.src = "img/volume.svg";
            currentSong.volume = 0.10;
            input.value = 10;
        }
    });
}

main();
