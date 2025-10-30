let songss = [];
let CurrentSong = new Audio();
let CurrentSongIndex = 0;
let currentFolder;

function SecondToMinutes(second) {
  const seconds = Math.floor(second / 60);
  const remainSecond = Math.floor(second % 60);
  return `${seconds} : ${remainSecond}`
}
async function getsongs(folder) {
  currentFolder = folder;
  const songURL = await fetch(`${folder}/info.json`);
  const response = await songURL.json();
  songss = response.songs;

  let SongList = document.querySelector('.song-list').getElementsByTagName('ul')[0];
  SongList.innerHTML = "";
  for (let song of songss) {
    const fullpath = decodeURIComponent(song.songName);
    const songName = fullpath.replaceAll('.mp3', '');
    SongList.innerHTML += `<li>
                            <img class="invert" src="images/music.svg" height="30px" alt="">
                            <div class="info">
                                <div>${songName}</div>
                                <div>Ayushreee</div>
                            </div>
                            <div class="play-now">
                                <span>Play now</span>
                                <img class="invert" src="images/play.svg" height="20px" alt="">
                            </div>
                         </li>`
  }

  Array.from(document.querySelector('.song-list').getElementsByTagName('li')).forEach(li => {
    li.addEventListener('click', () => {
      playMusic(li.querySelector('.info').firstElementChild.innerHTML.trim());
    })
  });
  return songss;
}
const playMusic = (track) => {
  CurrentSong.src = `${currentFolder}/${track}.mp3`
  CurrentSong.play();
  play.src = 'images/pause.svg';

  document.querySelector('.song-info').innerHTML = track;
  document.querySelector('.song-time').innerHTML = '00:00 | 00:00'

}

async function displayAlbum() {
  const songURL = await fetch("songs/album.json");
  const response = await songURL.json();

  response.forEach(response => {
    document.querySelector('.card-container').innerHTML += ` <div data-folder="${response.folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" viewBox="0 0 512 512">
                                <circle cx="256" cy="256" r="256" fill="rgb(11, 255, 11)" />
                                <path d="M500.235,236.946L30.901,2.28C16.717-4.813,0.028,5.502,0.028,21.361v469.333c0,15.859,16.689,26.173,30.874,19.081
                                 l469.333-234.667C515.958,267.247,515.958,244.808,500.235,236.946z 
                                   M42.694,456.176V55.879l400.297,200.149L42.694,456.176z" fill="black"
                                    transform="translate(156,106) scale(0.5)" />
                            </svg>
                        </div>
                        <img src= "${response.folder}/cover.jpg">

                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`


  })
  //load the songs when we click on playlist
  Array.from(document.getElementsByClassName('card')).forEach(e => {
    e.addEventListener('click', async (item) => {
      songss = await getsongs(`${item.currentTarget.dataset.folder}`)

    })
  })
  // }
}

async function main() {

  await getsongs(`songs/ncs`);
  await displayAlbum()

  play.addEventListener('click', () => {
    if (CurrentSong.paused) {
      CurrentSong.play();
      play.src = 'images/pause.svg';
    }
    else {
      CurrentSong.pause();
      play.src = 'images/play.svg';
    }
  })

  CurrentSong.addEventListener('timeupdate', () => {
    document.querySelector('.song-time').innerHTML = `${SecondToMinutes(CurrentSong.currentTime)} | ${SecondToMinutes(CurrentSong.duration)}`;
    document.querySelector('.circle').style.left = (CurrentSong.currentTime / CurrentSong.duration * 100) + "%";
  })

  document.querySelector('.seek-bar').addEventListener('click', (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector('.circle').style.left = percent + "%";
    CurrentSong.currentTime = ((CurrentSong.duration) * percent) / 100;
  })
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.left').style.left = 0;
  })
  document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.left').style.left = "-100%";
  })

  document.getElementById('previous').addEventListener('click', () => {
   CurrentSongIndex--;
   if(CurrentSongIndex < 0){
    CurrentSongIndex = songss.length - 1;
   }
   playMusic(songss[CurrentSongIndex].songName);
  })
  document.getElementById('next').addEventListener('click', () => {
  CurrentSongIndex++;
   if(CurrentSongIndex > songss.length){
    CurrentSongIndex = 0;
   }
   playMusic(songss[CurrentSongIndex].songName);
  })
  document.querySelector('.range').getElementsByTagName('input')[0].addEventListener("input", (e) => {
    let volume = parseInt(e.target.value) / 100;
    CurrentSong.volume = volume;
  })

  //add event listner to volume svg
  document.querySelector('.volume-svg>img').addEventListener('click', (e) => {
    const img = e.target;
    const isMuted = img.src.includes('images/muted.svg');
    if (isMuted) {
      img.src = 'images/volume.svg'
      CurrentSong.volume = 1;
      document.querySelector('.range').getElementsByTagName('input')[0].value = 100;
    }
    else {
      e.target.src = 'images/muted.svg'
      CurrentSong.volume = 0;
      document.querySelector('.range').getElementsByTagName('input')[0].value = 0;

    }
  })
}
main()

