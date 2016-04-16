var audio = new Audio('audio/bgm.mp3');
audio.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
}, false);
audio.play();