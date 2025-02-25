let channels = []; // from json
let player;
let currentChannel = 0;
let currentSong = 0;
let isPowerOn = true;
let infoTimeout;
let isInitialized = false;

function toggleGuide() {
    const guide = document.getElementById('channelGuide');
    guide.classList.toggle('hidden');
}

// fetch channels from json
async function fetchChannels() {
    try {
        const response = await fetch('../assets/json/channels.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load channels: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading channels:', error);
        document.getElementById('channelListContainer').innerHTML = 
            `<div class="error-message">Error loading channels: ${error.message}</div>`;
        throw error;
    }
}

async function initApp() {
    try {
        // show static effect while loading
        const staticElement = document.getElementById('tvStatic');
        staticElement.style.opacity = '0.8';
        
        // fetch channels from JSON file
        channels = await fetchChannels();
        
        // update the ui
        updateChannelGuide();
        
        // initialize with the first channel if yt player is ready
        if (player && player.loadVideoById) {
            changeChannel(0);
            isInitialized = true;
        }
        
        staticElement.style.opacity = '0.1';
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

// load iframe -- yt api
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: '',
        playerVars: {
            'playsinline': 1,
            'autoplay': 0,
            'controls': 0,
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // ff channels are already loaded, initialize the first channel
    if (channels.length > 0 && !isInitialized) {
        changeChannel(0);
        isInitialized = true;
    }
}

function onPlayerStateChange(event) {
    // when video ends, play next song in current channel
    if (event.data === YT.PlayerState.ENDED) {
        nextSong();
    }
}

function togglePower() {
    isPowerOn = !isPowerOn;
    const staticElement = document.getElementById('tvStatic');
    const channelDisplay = document.getElementById('channelDisplay');
    
    if (isPowerOn) {
        staticElement.style.opacity = '0.1';
        channelDisplay.style.opacity = '1';
        if (player && player.playVideo) {
            player.playVideo();
        }
    } else {
        staticElement.style.opacity = '0.8';
        channelDisplay.style.opacity = '0.3';
        if (player && player.pauseVideo) {
            player.pauseVideo();
        }
    }
}

function togglePlay() {
    if (!isPowerOn || channels.length === 0) return;
    
    if (player) {
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }
}

function prevChannel() {
    if (!isPowerOn || channels.length === 0) return;
    
    currentChannel = (currentChannel - 1 + channels.length) % channels.length;
    changeChannel(currentChannel);
}

function nextChannel() {
    if (!isPowerOn || channels.length === 0) return;
    
    currentChannel = (currentChannel + 1) % channels.length;
    changeChannel(currentChannel);
}

function nextSong() {
    if (!isPowerOn || channels.length === 0) return;
    
    const channel = channels[currentChannel];
    currentSong = (currentSong + 1) % channel.songs.length;
    playSong(currentSong);
}

function changeChannel(channelIndex) {
    if (!isPowerOn || channels.length === 0) return;
    
    currentChannel = channelIndex;
    currentSong = 0; // start with the first song on the channel
    
    // update channel display
    document.getElementById('channelDisplay').innerText = channels[channelIndex].id;
    
    // show static effect when changing channels
    const staticElement = document.getElementById('tvStatic');
    staticElement.style.opacity = '0.8';
    
    // update active channel in guide
    updateChannelGuide();
    
    // delay to simulate channel changing
    setTimeout(() => {
        playSong(currentSong);
        staticElement.style.opacity = '0.1';
        showInfoBriefly();
    }, 800);
}

function playSong(songIndex) {
    if (!isPowerOn || channels.length === 0) return;
    
    const channel = channels[currentChannel];
    const song = channel.songs[songIndex];
    
    if (song && song.videoId && player && player.loadVideoById) {
        player.loadVideoById(song.videoId);
        
        // update info display
        document.getElementById('nowPlayingTitle').innerText = song.title;
        document.getElementById('nowPlayingArtist').innerText = song.artist;
        
        showInfoBriefly();
    }
}

function showInfoBriefly() {
    const infoDisplay = document.getElementById('infoDisplay');
    infoDisplay.style.opacity = '1';
    
    if (infoTimeout) {
        clearTimeout(infoTimeout);
    }
    
    // hide info display after a few seconds
    infoTimeout = setTimeout(() => {
        infoDisplay.style.opacity = '0';
    }, 4000);
}

function showChannelInfo() {
    if (!isPowerOn || channels.length === 0) return;
    showInfoBriefly();
}

function updateChannelGuide() {
    if (channels.length === 0) return;
    
    const channelListContainer = document.getElementById('channelListContainer');
    const channelList = document.createElement('ul');
    channelList.id = 'channelList';
    
    channels.forEach((channel, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="channel-number">${channel.id}</span>
            <b>${channel.name}</b>
            <div>${channel.description}</div>
            ${currentChannel === index ? '<div class="nowplaying">NOW PLAYING</div>' : ''}
        `;
        
        li.onclick = () => changeChannel(index);
        
        if (currentChannel === index) {
            li.classList.add('active');
        }
        
        channelList.appendChild(li);
    });
    
    // replace the loading message with the channel list
    channelListContainer.innerHTML = '';
    channelListContainer.appendChild(channelList);
}

function refreshChannels() {
    // re-fetch channels from JSON file
    const staticElement = document.getElementById('tvStatic');
    staticElement.style.opacity = '0.8';
    
    document.getElementById('channelListContainer').innerHTML = 
        '<div class="loading">Refreshing channels...</div>';
    
    initApp();
}

// initialize the application when page loads
window.addEventListener('load', initApp);