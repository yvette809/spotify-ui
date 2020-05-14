let device = {
  width: window.innerWidth,
  height: window.innerHeight,
};
var lastScrollTop = 0;

let activePage = "Home";
let currentSong = {};
let isPlaying = false;
let isMuted = false;
let songIndex = 0;
window.onload = function () {
  this.start("Home");
  createControllers();
  initializePlayer(0);
};

window.onresize = updateScreenSizes;
function toggleMobileMenu() {
  let root = document.getElementById("root");
  root.innerHTML = "";

  let menuContainer = addElement(root, "div", { className: "mobile-menu" });
  let logoContainer = addElement(menuContainer, "div", {
    className: "logo-container",
  });

  let logo = addElement(logoContainer, "img", {
    src: "./assets/brand/Spotify_Logo_RGB_White.png",
    style: "height:40px;",
  });
  let closeButton = addElement(logoContainer, "button", {
    className: "controls-button",
    onclick: function () {
      start(activePage);
    },
  });
  let closeIcon = addElement(closeButton, "i", {
    className: "fas fa-times",
    style: "font-size:15pt",
  });
  let menu = [
    { text: "Home", icon: icons.home },
    { text: "Search", icon: icons.search },
    { text: "Your Library", icon: icons.library },
  ];
  let ul = addElement(menuContainer, "ul", {
    className: "side-bar-list",
  });

  for (let i = 0; i < menu.length; i++) {
    let item = menu[i];
    let li = addElement(ul, "li", {
      className:
        activePage === item.text
          ? "side-bar-list-item-active"
          : "side-bar-list-item",
    });
    let button = addElement(li, "button", {
      className: "side-bar-list-link",
      onclick: function () {
        activePage = item.text;
        start(item.text);
      },
    });

    let icon = addElement(button, "i", { className: item.icon });
    let div = addElement(button, "div", {
      className: "side-bar-list-item-text",
      innerText: item.text,
    });
  }
}
function toggleMobilePlayer() {
  let root = document.getElementById("root");
  let playerContainer = addElement(root, "div", {
    className: "mobile-fs-player slide-in-bottom",
  });
  let mbPlayerNav = addElement(playerContainer, "div", {
    className: "mobile-fs-player-nav",
  });
  let chevronDown = addElement(mbPlayerNav, "button", {
    className: "controls-button",
    onclick: function () {
      playerContainer.remove();
    },
  });
  let chevronDownIcon = addElement(chevronDown, "i", {
    className: "fas fa-chevron-down",
  });
  let albumName = addElement(mbPlayerNav, "div", {
    innerText: album.name,
    style: "color:#fff",
  });
  let moreButton = addElement(mbPlayerNav, "button", {
    className: "controls-button",
  });
  let moreIcon = addElement(moreButton, "i", {
    className: "fas fa-ellipsis-v",
  });
  let albumCoverContainer = addElement(playerContainer, "div", {
    className: "w-100 fs-album-cover-container",
  });
  let albumCover = addElement(albumCoverContainer, "img", {
    className: "card-container w-100",
    src: album.cover,
    style: "margin-top:3em;object-fit:center;max-width:500px;",
  });

  let songInfoContainer = addElement(playerContainer, "div", {
    className: "songInfoContainer",
  });
  let title = addElement(songInfoContainer, "h4", {
    innerText: album.songs[songIndex].name,
  });
  let likeButton = addElement(songInfoContainer, "button", {
    className: "controls-button",
  });
  let likeIcon = addElement(likeButton, "i", {
    className: icons.like,
    style: "font-size:20pt",
  });
  let artistName = addElement(playerContainer, "h6", {
    innerText: album.artist,
  });
  let progressContainer = addElement(playerContainer, "div", {
    className: "progress-container w-100",
    style: "height:100px;",
  });
  let currentTime = addElement(progressContainer, "div", {
    innerText: "00:20",
    className: "progress-time",
    id: "current-time",
  });
  let progress = addElement(progressContainer, "input", {
    type: "range",
    value: 0,
    id: "progress",
    className: "progress-range",
    onchange: function (e) {
      onTimeChange(e.target.value);
    },
  });
  let songDuration = addElement(progressContainer, "div", {
    innerText: "04:50",
    className: "progress-time",
    id: "duration",
  });
  let controls = [
    { text: "Shuffle", icon: icons.shuffle },
    { text: "Backward", icon: icons.backward },
    { text: "Play", icon: icons.play },
    { text: "Forward", icon: icons.forward },
    { text: "Repeat", icon: icons.repeat },
  ];
  let controller = addElement(playerContainer, "div", {
    className: "controller",
  });
  let controlsContainer = addElement(controller, "div", {
    className: "controls-container",
  });
  for (let i = 0; i < controls.length; i++) {
    let control = controls[i];
    let button = addElement(controlsContainer, "button", {
      className: `controls-button ${control.text}`,
      name: control.text,
      onclick: function () {
        if (control.text === "Play") {
          play();
        } else if (control.text === "Shuffle") {
          switchSong(Math.ceil(Math.random() * album.songs.length - 1));
        } else if (control.text === "Forward") {
          switchSong(songIndex + 1);
        } else if (control.text === "Backward") {
          switchSong(songIndex - 1);
        } else if (control.text === "Repeat") {
          switchSong(songIndex);
        } else {
          alert(control.text);
        }
        title.innerText = album.songs[songIndex].name;
      },
    });
    let icon = addElement(button, "i", {
      className:
        control.text === "Play"
          ? isPlaying
            ? icons.pause
            : icons.play
          : control.icon,
      style: `font-size:${control.text === "Play" ? "5em" : "2em"}`,
    });
  }
  return playerContainer;
}
// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
function start(page) {
  createLayout();
  routeToPage(page);
}
function initializePlayer() {
  let root = document.querySelector("#player-area");
  let player = addElement(root, "audio", { id: "player" });
  player.source = null;
  let source = addElement(player, "source", {
    src: "./data/album/0.m4a",
    type: "audio/x-m4a",
    controls: true,
    style: "z-index:-1",
  });
  player.onloadedmetadata = function () {
    player.volume = 0.5;
    let duration = document.querySelector("#duration");
    let currentTime = document.querySelector("#current-time");
    currentTime.innerText = "00:00";
    duration.innerText = toHHMMSS(player.duration);
  };
}
async function switchSong(index) {
  if (index >= 0 && index <= album.songs.length - 1) {
    let currentTime = document.querySelector("#current-time");
    let title = document.querySelector(".song-info-title");
    let songTitles = document.querySelectorAll(".song-info-text");
    for (let i = 0; i < songTitles.length; i++) {
      songTitles[i].id === `song-${index + 1}`
        ? (songTitles[i].style.color = " #1ed760")
        : (songTitles[i].style.color = "white");
    }
    title.innerText = "";
    currentSong = album.songs[songIndex].name;
    songIndex = index;
    title.innerText =
      album.songs[songIndex].name.length > 20
        ? album.songs[songIndex].name.substring(0, 20) + " ..."
        : album.songs[songIndex].name;

    currentTime.innerText = "00:00";
    let player = document.getElementById("player");
    player.src = "./data/album/" + index + ".m4a";
    player.onloadedmetadata = function () {
      player.volume = 0.5;
      let progress = document.querySelector("#progress");
      progress.value = 0;
      let duration = document.querySelector("#duration");
      let currentTime = document.querySelector("#current-time");
      currentTime.innerText = "00:00";
      duration.innerText = toHHMMSS(player.duration);
      play();
      isPlaying ? player.play() : play();
    };
  }
}
function play() {
  let player = document.getElementById("player");
  isPlaying ? player.pause() : player.play();
  let playButtons = document.querySelectorAll(".Play");
  for (button of playButtons) {
    button.firstChild.className = isPlaying
      ? "fas fa-play-circle"
      : "fas fa-pause-circle";
  }
  let songTitles = document.querySelectorAll(".song-info-text");
  for (let i = 0; i < songTitles.length; i++) {
    songTitles[i].id === `song-${songIndex}`
      ? (songTitles[i].style.color = " #1ed760")
      : (songTitles[i].style.color = "white");
  }
  isPlaying = !isPlaying;
  player.ontimeupdate = function () {
    let currentTime = document.querySelector("#current-time");
    currentTime.innerText = "00:00";
    currentTime.innerText = toHHMMSS(player.currentTime);
    let progresses = document.querySelectorAll(".progress-range");
    progresses.forEach(
      (progress) =>
        (progress.value = Math.ceil(
          (player.currentTime / player.duration) * 100
        ))
    );
  };
  player.onended = function () {
    isPlaying = !isPlaying;
    playButton.firstChild.className = "fas fa-play-circle";
    let progress = document.querySelector("#progress");
    progress.value = 0;
    if (songIndex < album.songs.length - 1) {
      switchSong(songIndex + 1);
      play();
    }
  };
}
function onVolumeChange(value) {
  let player = document.getElementById("player");
  let volume = parseInt(value) / 100;
  player.volume = volume;
}

function onTimeChange(value) {
  let player = document.getElementById("player");
  let percent = parseInt(value) / 100;
  player.currentTime = player.duration * percent;
}

function onVolumeToggle() {
  let player = document.getElementById("player");
  let volumeButton = document.querySelector("#Volume");
  isMuted = !isMuted;
  volumeButton.firstChild.className = isMuted
    ? "fas fa-volume-up"
    : "fas fa-volume-mute";
  player.muted = isMuted ? false : true;
}
function updateScreenSizes() {
  device.width = window.innerWidth;
  device.height = window.innerHeight;
  let songInfo = document.querySelector(".songInfoContainer");
  if (device.width <= 1024) {
    songInfo.addEventListener("click", () => toggleMobilePlayer());
  } else {
    sonfInfo.removeEventListener("click", () => {});
  }
}
function createLayout() {
  let root = document.querySelector("#root");
  root.innerHTML = "";
  root.style = `height:${device.height}px;`;
  let sideBar = addElement(root, "div", {
    className: "side-bar d-none d-lg-block",
  });

  let container = addElement(root, "div", { className: "main-container" });
  let menuButton = addElement(root, "button", {
    className: "controls-button mobile-menu-icon d-block d-xl-none",
    onclick: function () {
      toggleMobileMenu();
    },
  });
  let menuIcon = addElement(menuButton, "i", {
    className: "fas fa-bars",
    style: "font-size:15pt",
  });
  container.innerHTML = "";
  //routeToPage(activePage);
  //sideBar.style.height = window.innerHeight;

  //checkImages();
  createSideBarMenu(container);
  //routeToPage("Home");
}

function createSideBarMenu() {
  let menu = [
    { text: "Home", icon: icons.home },
    { text: "Search", icon: icons.search },
    { text: "Your Library", icon: icons.library },
  ];
  let sideBar = document.querySelector(".side-bar");
  sideBar.innerHTML = null;
  let logoContainer = addElement(sideBar, "div", {
    className: "logo-container",
  });
  let logo = addElement(logoContainer, "img", {
    src: "./assets/brand/Spotify_Logo_RGB_White.png",
    style: "height:40px;",
  });

  let ul = addElement(sideBar, "ul", { className: "side-bar-list" });

  for (let i = 0; i < menu.length; i++) {
    let item = menu[i];
    let li = addElement(ul, "li", {
      className:
        activePage === item.text
          ? "side-bar-list-item-active"
          : "side-bar-list-item",
    });
    let button = addElement(li, "button", {
      className: "side-bar-list-link",
      onclick: function () {
        activePage = item.text;
        createSideBarMenu();
        routeToPage(item.text);
      },
    });

    let icon = addElement(button, "i", { className: item.icon });
    let div = addElement(button, "div", {
      className: "side-bar-list-item-text",
      innerText: item.text,
    });
  }
  let authButtons = addElement(sideBar, "div", {
    className: "auth-buttons",
  });
  let installApp = addElement(authButtons, "div", {
    innerHTML: `<i class="fas fa-arrow-circle-down"></i> Install app`,
    style: "cursor:pointer;",
  });
  let signUpButton = addElement(authButtons, "button", {
    className: "primary-button",
    innerText: "SIGN UP",
    style:
      "margin:20px 0px;height:30px;width:90%;background-color:white;color:black;",
    onclick: function () {
      loginPage();
    },
  });
  let loginButton = addElement(authButtons, "button", {
    className: "secondary-button",
    innerText: "LOG IN",
    style: "margin:10px 0px;height:30px;width:90%;",
    onclick: function () {
      loginPage();
    },
  });
}
function createControllers() {
  let root = document.querySelector("#player-area");
  root.innerHTML = "";

  let controllers = addElement(root, "div", { className: "controllers" });

  songInfo(controllers);
  playerControls(controllers);
  rightController(controllers);
}
function playerControls(container) {
  let controls = [
    { text: "Shuffle", icon: icons.shuffle },
    { text: "Backward", icon: icons.backward },
    { text: "Play", icon: icons.play },
    { text: "Forward", icon: icons.forward },
    { text: "Repeat", icon: icons.repeat },
  ];
  let controller = addElement(container, "div", {
    className: "controller d-none d-lg-flex",
  });
  let controlsContainer = addElement(controller, "div", {
    className: "controls-container",
  });
  for (let i = 0; i < controls.length; i++) {
    let control = controls[i];
    let button = addElement(controlsContainer, "button", {
      className: `controls-button ${control.text}`,
      name: control.text,
      onclick: function () {
        if (control.text === "Play") {
          play();
        } else if (control.text === "Shuffle") {
          switchSong(Math.ceil(Math.random() * album.songs.length - 1));
        } else if (control.text === "Forward") {
          switchSong(songIndex + 1);
        } else if (control.text === "Backward") {
          switchSong(songIndex - 1);
        } else if (control.text === "Repeat") {
          switchSong(songIndex);
        } else {
          alert(control.text);
        }
      },
    });
    let icon = addElement(button, "i", {
      className: control.icon,
      style: `font-size:${control.text === "Play" ? "20pt" : "10pt"}`,
    });
  }
  let progressContainer = addElement(controller, "div", {
    className: "progress-container w-100",
  });
  let currentTime = addElement(progressContainer, "div", {
    innerText: "00:20",
    className: "progress-time",
    id: "current-time",
  });
  let progress = addElement(progressContainer, "input", {
    type: "range",
    value: 0,
    id: "progress",
    className: "progress-range",
    onchange: function (e) {
      onTimeChange(e.target.value);
    },
  });
  let songDuration = addElement(progressContainer, "div", {
    innerText: "04:50",
    className: "progress-time",
    id: "duration",
  });
}

function songInfo(container) {
  let songInfoContainer = addElement(container, "div", {
    className: "songInfoContainer",
  });
  if (device.width <= 1024) {
    songInfoContainer.addEventListener("click", () => toggleMobilePlayer());
  } else {
    songInfoContainer.removeEventListener("click", () => {});
  }
  let albumCover = addElement(songInfoContainer, "button", {
    className: "controls-button",
    onclick: function () {
      routeToPage("Details");
    },
  });
  let cover = addElement(albumCover, "img", {
    className: "song-info-cover",
    src: albums[0].cover,
  });
  let songInfoText = addElement(songInfoContainer, "div", {
    className: "song-info-text",
    style: "margin-right:3em;font-size:10pt;",
  });
  let title = addElement(songInfoText, "div", {
    className: "song-info-title",
    innerText: album.songs[songIndex].name,
  });
  let artist = addElement(songInfoText, "button", {
    className: "song-info-artist controls-button",
    innerText: "Queen",
    onclick: function () {
      bandDetailPage();
    },
    style:
      "color:lightgrey;font-size:10pt;font-weight:100;opacity:0.5;margin:0px;",
  });
  let likeButton = addElement(songInfoContainer, "button", {
    className: "controls-button d-none d-lg-flex",
  });
  let likeIcon = addElement(likeButton, "i", { className: icons.like });

  let windowButton = addElement(songInfoContainer, "button", {
    className: "controls-button d-none d-lg-flex",
  });
  let windowIcon = addElement(windowButton, "i", { className: icons.window });
}

function rightController(container) {
  let rightControllerContainer = addElement(container, "div", {
    className: "rightControllerContainer",
  });

  let listButton = addElement(rightControllerContainer, "button", {
    className: "controls-button d-none d-lg-flex",
  });
  let listIcon = addElement(listButton, "i", { className: icons.list });

  let desktopButton = addElement(rightControllerContainer, "button", {
    className: "controls-button d-none d-lg-flex",
  });
  let desktopIcon = addElement(desktopButton, "i", {
    className: icons.desktop,
  });

  let volumeButton = addElement(rightControllerContainer, "button", {
    className: "controls-button d-none d-lg-flex",
    id: "Volume",

    onclick: function () {
      onVolumeToggle();
    },
  });
  let volumeIcon = addElement(volumeButton, "i", { className: icons.volume });
  let volumeBar = addElement(rightControllerContainer, "input", {
    type: "range",
    className: "volume-bar d-none d-lg-flex",
    onchange: function (e) {
      onVolumeChange(e.target.value);
    },
  });
  let playButton = addElement(rightControllerContainer, "button", {
    className: "controls-button d-block d-lg-none Play",
    style: "position:absolute;bottom:30px;right:30px;",
    onclick: function () {
      play();
      isPlaying ? (playButton.firstChild.className = icons.pause) : icons.play;
    },
  });
  let playIcon = addElement(playButton, "i", {
    className: icons.play,
    style: "font-size:25pt;",
  });
  let fsButton = addElement(rightControllerContainer, "button", {
    className: "controls-button d-none d-lg-flex",
    style: "margin-left:2em",
  });
  let fsIcon = addElement(fsButton, "i", { className: icons.fullscreen });
  fsButton.addEventListener("click", function () {
    toggleMobilePlayer();
  });
}

function routeToPage(page) {
  createPage(page);
}

function createPage(page) {
  let container = document.querySelector(".main-container");
  container.innerHTML = "";
  if (page === "Home") {
    homePage();
  }
  if (page === "Details") {
    detailsPage();
  }
  if (page === "Search") {
    detailsPage();
  }
  if (page === "Your Library") {
    detailsPage();
  }
}
function homePage() {
  let container = document.querySelector(".main-container");
  container.classList.add("home-container");
  container.style = "padding:50px;";
  let tabs = [
    "TRENDING",
    "PODCAST",
    "MOODS AND GENRES",
    "NEW RELEASES",
    "DISCOVER",
  ];
  createTab(container, tabs);
  let title = addElement(container, "h1", {
    className: "d-none d-md-flex",
    innerText: "#TIMETRAVEL",
    style: "margin-bottom:25px;font-size:2vw;margin-left:20px;",
  });
  let row = addElement(container, "div", { className: "row" });
  for (let i = 0; i < list1.length; i++) {
    let item = list1[i];
    let col = addElement(row, "div", {
      className: "col-md-6 col-lg-6 col-sm-12 col-xs-12 col-xl-2",
    });
    let cardContainer = addElement(col, "div", {
      className: "card-container",
    });
    let img = addElement(cardContainer, "img", {
      src: item.cover,
      style: "margin-bottom:25px",
      className: "w-75",
    });
    let text = addElement(cardContainer, "div", { innerText: item.name });
  }

  let secondTitle = addElement(container, "h1", {
    className: "d-none d-md-flex",
    innerText: "WHILE YOU CODE",
    style: "margin-bottom:25px;font-size:2vw;margin-left:20px;",
  });
  let secondRow = addElement(container, "div", { className: "row" });
  for (let i = 0; i < list2.length; i++) {
    let item = list2[i];
    let col = addElement(secondRow, "div", {
      className: "col-md-6 col-lg-6 col-sm-12 col-xs-12 col-xl-2",
    });
    let cardContainer = addElement(col, "div", {
      className: "card-container",
    });
    let img = addElement(cardContainer, "img", {
      src: item.cover,
      className: "w-75",
      style: "margin-bottom:25px;",
    });
    let text = addElement(cardContainer, "div", { innerText: item.name });
  }
}

function detailsPage() {
  let container = document.querySelector(".main-container");
  container.innerHTML = "";
  container.className = "main-container";
  container.innerHTML = "";
  let row = addElement(container, "div", { className: "row" });
  let leftCol = addElement(row, "div", {
    className: "col-md-12 col-sm-12 col-xl-4 col-lg-4 left-col",
  });

  let albumCover = addElement(leftCol, "div", {
    className: "album-cover-container",
  });
  let albumCoverButton = addElement(albumCover, "button", {
    className: "controls-button",
  });
  let cover = addElement(albumCoverButton, "img", {
    src: album.cover,
    className: "album-cover",
    style: "object-fit:cover;width:50%;",
  });
  let albumTitle = addElement(leftCol, "h3", {
    innerText: album.name,
    style: "text-align:center;padding-top:60px;",
  });
  let artistButton = addElement(leftCol, "button", {
    className: "controls-button",
    onclick: function () {
      bandDetailPage();
    },
  });

  let artist = addElement(artistButton, "h6", {
    innerText: album.artist,
    style: "color:lightgrey;opacity:0.3",
  });
  let playButton = addElement(leftCol, "button", {
    className: "primary-button",
    innerText: "PLAY",
    style: "margin:20px 0px;",
    onclick: function () {
      play();
    },
  });

  let albumInfo = addElement(leftCol, "p", {
    innerText: `${album.release} . ${album.songs.length} SONGS`,
    style: "margin-bottom:15px;color:lightgrey;",
  });
  let buttonContainer = addElement(leftCol, "div", {
    className: "left-button-container",
  });
  let likeButton = addElement(buttonContainer, "button", {
    className: "controls-button",
  });
  let likeIcon = addElement(likeButton, "i", { className: icons.like });

  let moreButton = addElement(buttonContainer, "button", {
    className: "controls-button",
  });
  let moreIcon = addElement(moreButton, "i", { className: icons.more });

  let rightCol = addElement(row, "div", {
    className: "col-md-12 col-sm-12 col-xs-12  col-lg-8 col-xl-8 right-col",
  });
  for (let i = 0; i < album.songs.length; i++) {
    let song = album.songs[i];
    let songContainer = addElement(rightCol, "button", {
      className: "song-container",
      onclick: async function () {
        await switchSong(i);
        await switchSong(i);
      },
    });
    let div = addElement(songContainer, "div", { className: "song-left" });
    let icon = addElement(div, "i", { className: "fas fa-music" });
    let text = addElement(div, "div", {
      id: `song-${i}`,
      className: "song-info-text",
      style: `color:${i === songIndex ? "#1ed760" : "#fff"}`,
    });
    let songName = addElement(text, "div", {
      innerText: song.name,
    });
    let artistName = addElement(text, "button", {
      className: "controls-button d-none d-md-flex",
      innerText: album.artist,
      style: "margin:0px;",
      onclick: function () {
        bandDetailPage();
      },
    });
    let duration = addElement(songContainer, "div", {
      innerText: song.length,
      className: "d-none d-md-flex",
    });
  }
}
function loginPage() {
  let root = document.querySelector("#root");
  root.innerHTML = "";
  let playerArea = document.querySelector("#player-area");
  playerArea.innerHTML = "";
  root.style = "background-color:#fff";
  let signUp = addElement(root, "div", { className: "signup" });
  let navBar = addElement(signUp, "div", { className: "navBar" });
  let logo = addElement(navBar, "img", {
    src: "./assets/brand/Spotify_Logo_RGB_Black.png",
    style: "height:60px;",
  });
  let form = addElement(signUp, "div", { className: "sign-up-form" });
  let instructions = addElement(form, "div", {
    innerText: "To continue, log in to Spotify.",
    style: "margin-top:50px;",
  });
  let fbButton = addElement(form, "button", {
    className: "primary-button",
    innerHTML: `<i style="margin-right:1em;" class="fab fa-facebook"></i> CONTINUE WITH FACEBOOK`,
    style:
      "background-color:#3b5999;width:450px;min-height:48px;margin-top:20px;",
  });
  let appleButton = addElement(form, "button", {
    className: "primary-button",
    innerHTML: `<i style="margin-right:1em;" class="fab fa-apple"></i> CONTINUE WITH APPLE`,
    style: "background-color:#000;width:450px;min-height:48px;margin-top:20px;",
  });

  let hrContainer = addElement(form, "hr", {
    className: "hr-container",
    style: "margin-top:40px",
  });
  let or = addElement(form, "div", {
    innerText: "OR",
    style: "position:relative;top:-30px;",
  });
  let emailInput = addElement(form, "input", {
    type: "text",
    placeholder: "Email address or username",
  });
  let passwordInput = addElement(form, "input", {
    type: "password",
    placeholder: "Password",
  });
  let buttonsContainer = addElement(form, "div", {
    className: "form-buttons-container",
  });

  let checkboxContainer = addElement(buttonsContainer, "label", {
    innerText: "Remember me",
    className: "checkbox-container",
  });
  let checkboxInput = addElement(checkboxContainer, "input", {
    type: "checkbox",
    checked: true,
  });

  let span = addElement(checkboxContainer, "span", { className: "checkmark" });
  let logInButton = addElement(buttonsContainer, "button", {
    className: "primary-button",
    innerText: "LOG IN",
    style: "margin:20px 0px;height:50px;width:200px;",
    onclick: function () {
      start();
    },
  });
  let forgot = addElement(form, "p", {
    innerText: "Forgot your password?",
    style: "color:#1ed760;text-align:center;",
  });
  addElement(form, "hr", { style: "margin:20px 0px;" });

  let dontHaveAccount = addElement(form, "div", {
    innerText: "Don't have an account?",
    style: "font-size:18px;",
  });
  let signUpButton = addElement(form, "button", {
    className: "secondary-button",
    innerText: "SIGN UP FOR SPOTIFY",
    style:
      "margin:20px 0px;height:46px;width:450px;background-color:white;border:1px solid black;color:black;",
    onclick: function () {
      start();
    },
  });
  addElement(form, "hr", { style: "margin:30px 0px;" });
  addElement(form, "div", {
    innerHTML: `If you click "Log in with Facebook" and are not a Spotify user, you will be registered and you agree to Spotify's <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy<a/>.`,
    style: "width:450px;font-size:10pt;",
  });
}
function bandDetailPage() {
  let container = document.querySelector(".main-container");
  container.innerHTML = "";
  container.className = "main-container";
  container.style = "margin:0px;padding:0px;";
  const backgroundStyle = `background:url(https://www.burnleyexpress.net/sttms.blob.core.windows.net/images/QVNIMTEzMjE5NjU3.jpg);min-height:600px;object-fit:center;background-position:20% 40%; background-repeat:no-repeat;background-size:cover;width:100%;`;

  let background = addElement(container, "div", {
    id: "band-background-image",
    style: backgroundStyle,
  });
  let overlay = addElement(container, "div", {
    className: "main-content-overlay",
  });

  let bandInfoContainer = addElement(container, "div", {
    className: "bandInfoContainer mx-auto",
  });
  let followers = addElement(bandInfoContainer, "div", {
    innerText: `${Math.ceil(Math.random() * 99)},${Math.ceil(
      Math.random() * 999
    )} ,${Math.ceil(Math.random() * 999)} MONTHLY LISTENERS`,
    style: "color:white;font-size:1.5vw;",
  });
  let bandName = addElement(bandInfoContainer, "div", {
    innerText: album.artist,
    style: "color:white;font-size:8vw;",
  });
  let buttonContainer = addElement(bandInfoContainer, "div", {
    className: "row",
  });
  let playButton = addElement(buttonContainer, "button", {
    className:
      "mx-auto primary-button col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3",
    innerText: "PLAY",
    style: "margin:20px 0px;width:100%;min-width:8vw;",
    onclick: function () {
      play();
    },
  });
  let followButton = addElement(buttonContainer, "button", {
    className:
      "mx-auto secondary-button col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3",
    innerText: "FOLLOW",
    style: "margin:20px;width:100%;min-width:8vw;",
  });
  let moreButton = addElement(buttonContainer, "button", {
    className:
      "mx-auto controls-button col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3",
  });
  let moreIcon = addElement(moreButton, "i", { className: icons.more });

  overlay.addEventListener("scroll", function () {
    var a = overlay.scrollTop;
    var b = overlay.scrollHeight - overlay.clientHeight;
    var c = a / b;
    let percent = c * 100;
    let background = document.querySelector("#band-background-image");
    let bandInfoContainer = document.querySelector(".bandInfoContainer");
    let overlaybg = `linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(46, 48, 46, 1) 58%
  )`;
    let style = background.style;
    if (percent > 5) {
      background.style = "opacity:0;transition:0.3s;";
      bandInfoContainer.style = "opacity:0;transition:0.3s;";
      overlay.style.background = `linear-gradient(
    180deg,
    rgba(${255 / percent}, ${255 / percent}, ${255 / percent}, 1) 0%,
    rgba(${255 / percent}, ${255 / percent}, ${255 / percent}, 1) 58%
  )`;
    } else {
      background.style = backgroundStyle;
      bandInfoContainer.style = "opacity:1;transition:0.3s;";
      overlay.style.background = overlaybg;
    }
  });

  let tabs = ["OVERVIEW", "RELEATED ARTIST", "ABOUT"];
  createTab(overlay, tabs);
  let title = addElement(overlay, "div", {
    innerText: "Albums",
    className: "d-none d-md-block",
    style: "margin:20px;font-size:2vw;color:#fff;",
  });
  let row = addElement(overlay, "div", { className: "row" });
  for (let i = 0; i < albums.length; i++) {
    let album = albums[i];
    let col = addElement(row, "div", {
      className: "col-xl-2 col-md-6 col-sm-6 col-xs-12",
    });
    let albumCardContainer = addElement(col, "div", {
      className: "card-container",
    });
    let image = addElement(albumCardContainer, "img", {
      className: "album-cover",
      src: album.cover,
      style: "width:200px;object-fit:cover;height:200px;margin-bottom:50px;",
    });
    let text = addElement(albumCardContainer, "div", {
      innerText: album.name,
      style: "font-size:10pt;text-align:center;",
    });
  }
}
function createTab(root, tabs) {
  let tabsContainer = addElement(root, "div", { className: "tabs-container" });
  for (let i = 0; i < tabs.length; i++) {
    let tabContainer = addElement(tabsContainer, "div", {
      className: "tab-container d-none d-md-block",
    });
    let text = addElement(tabContainer, "h6", {
      innerText: tabs[i],
    });
    i === 0
      ? addElement(tabContainer, "div", {
          style: "background-color:#1ed760;height:3px;width:40%;",
        })
      : addElement(tabContainer, "div", {
          style: "background-color:transparent;height:3px;width:40%;",
        });
  }
}
