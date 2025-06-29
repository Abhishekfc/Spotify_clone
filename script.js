console.log("let play with javascript")
let currentSong = new Audio();

function secondsToMinuteSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`
}

async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();


    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");


    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}


const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currentSong.src = "/songs/" + track;
    if(!pause){

        currentSong.play();
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {


    //get the list of all songs
    let songs = await getSongs();
    playMusic(songs[0], true);



    //show all the songs in playslist
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + ` <li>
                                <img class="invert "src="music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div>Abhishek Sharma</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="play.svg" alt="">
                                </div></li>`;
    }

    //attach event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    ///attach and event listener to play prev play and nexr
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        } else {
            currentSong.pause()
            play.src = "play2.svg"

        }
    });

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)

        document.querySelector(".songtime").innerHTML = `${secondsToMinuteSeconds(currentSong.currentTime)}/${secondsToMinuteSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left =  percent + "%";
        currentSong.currentTime = (currentSong.duration * percent )/ 100;
    })


    // Add an event listener for hamburger
   let menuOpen = false;

document.querySelector(".hamburger").addEventListener("click", () => {
    const left = document.querySelector(".left");
    const hamburger = document.querySelector(".hamburger");

    if (!menuOpen) {
        left.style.left = "0";
        hamburger.src = "close.svg";
        menuOpen = true;
    } else {
        left.style.left = "-100%";
        hamburger.src = "hamburger.svg";
        menuOpen = false;
    }
});

//  Fix: Reset sidebar on large screen resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 1156) {
    left.style.left = "0"; 
    hamburger.src = "hamburger.svg";
    menuOpen = false;
  }
});
    

}

main();