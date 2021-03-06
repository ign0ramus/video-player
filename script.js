const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const player = document.querySelector('.player');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const speed = document.querySelector('.player-speed');
const fullscreenBtn = document.querySelector('.fullscreen');

// Play & Pause ----------------------------------- //
function showPlayIcon() {
	playBtn.classList.replace('fa-pause', 'fa-play');
}

function togglePlay() {
	if (video.paused) {
		video.play();
		playBtn.classList.replace('fa-play', 'fa-pause');
	} else {
		video.pause();
		showPlayIcon();
	}
}

// Progress Bar ------------------------------ //
function calcDisplayTimeFormat(time) {
	let minutes = Math.floor(time / 60);
	minutes = minutes < 10 ? '0' + minutes : minutes;
	let seconds = Math.floor(time % 60);
	seconds = seconds < 10 ? '0' + seconds : seconds;
	return `${minutes}:${seconds}`;
}

function updateProgress() {
	progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
	currentTime.textContent = `${calcDisplayTimeFormat(video.currentTime)} /`;
	duration.textContent = calcDisplayTimeFormat(video.duration);
}

function setProgress(e) {
	const newTime = e.offsetX / progressRange.offsetWidth;
	progressBar.style.width = `${newTime * 100}%`;
	video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //
let lastVolume = 1;

function changeVolumeIcon(volume) {
	volumeIcon.className = '';
	if (volume > 0.7) {
		volumeIcon.classList.add('fas', 'fa-volume-up');
	} else if (volume < 0.7 && volume > 0) {
		volumeIcon.classList.add('fas', 'fa-volume-down');
	} else if (volume === 0) {
		volumeIcon.classList.add('fas', 'fa-volume-mute');
	}
}

function changeVolume(e) {
	let volume = e.offsetX / volumeRange.offsetWidth;
	if (volume < 0.1) {
		volume = 0;
	} else if (volume > 0.9) {
		volume = 1;
	}

	volumeBar.style.width = `${volume * 100}%`;
	video.volume = volume;
	changeVolumeIcon(volume);
	lastVolume = volume;
}

function toggleMute() {
	if (video.volume) {
		lastVolume = video.volume;
		video.volume = 0;
		volumeBar.style.width = 0;
		changeVolumeIcon(0);
	} else {
		video.volume = lastVolume;
		volumeBar.style.width = `${lastVolume * 100}%`;
		changeVolumeIcon(lastVolume);
	}
}

// Change Playback Speed --------------------- //
function changeSpeed() {
	video.playbackRate = speed.value;
}

// Fullscreen -------------------------------- //
let fullscreen = false;

/* View in fullscreen */
function openFullscreen(elem) {
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) {
		/* Firefox */
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) {
		/* Chrome, Safari and Opera */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		/* IE/Edge */
		elem.msRequestFullscreen();
	}

	video.classList.add('video-fullscreen');
}

/* Close fullscreen */
function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		/* Firefox */
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		/* Chrome, Safari and Opera */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		/* IE/Edge */
		document.msExitFullscreen();
	}
	video.classList.remove('video-fullscreen');
}

function toggleFullscreen() {
	if (fullscreen) {
		closeFullscreen();
	} else {
		openFullscreen(player);
	}

	fullscreen = !fullscreen;
}

function exitHandler() {
	if (
		!document.fullscreenElement &&
		!document.webkitIsFullScreen &&
		!document.mozFullScreen &&
		!document.msFullscreenElement
	) {
		video.classList.remove('video-fullscreen');
		fullscreen = false;
	}
}

// Event listeners --------------------------- //
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('ended', showPlayIcon);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);
