(() => {
 const player=document.getElementById('siteMusicPlayer'),audio=document.getElementById('siteMusicAudio');if(!player||!audio)return;
 const tracks=[
  {title:'Midnight Drive',artist:'Portfolio radio · 01',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'},
  {title:'After Hours',artist:'Portfolio radio · 02',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'},
  {title:'Neon Skies',artist:'Portfolio radio · 03',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'}
 ];
 const $=id=>document.getElementById(id),playBtn=$('musicPlay'),progress=$('musicProgress'),volume=$('musicVolume');let index=0;
 const timeLabel=s=>!Number.isFinite(s)||s<0?'0:00':Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
 function sync(){player.classList.toggle('is-playing',!audio.paused);playBtn.textContent=audio.paused?'▶':'Ⅱ';playBtn.setAttribute('aria-label',audio.paused?'Play music':'Pause music');$('musicMute').textContent=audio.muted?'🔇':'🔊';$('musicMute').setAttribute('aria-label',audio.muted?'Unmute audio':'Mute audio');$('musicMute').setAttribute('aria-pressed',String(audio.muted))}
 function load(i,autoplay){index=(i+tracks.length)%tracks.length;const t=tracks[index];audio.src=t.src;$('musicTrackName').textContent=t.title;$('musicTrackArtist').textContent=t.artist;$('musicTrackNumber').textContent=String(index+1).padStart(2,'0')+' / '+String(tracks.length).padStart(2,'0');progress.value=0;$('musicCurrentTime').textContent='0:00';$('musicDuration').textContent='0:00';sync();if(autoplay)audio.play().catch(()=>sync())}
 playBtn.addEventListener('click',()=>{if(audio.paused){if(!audio.src)load(index,false);audio.play().catch(()=>sync())}else audio.pause()});
 $('musicPrev').addEventListener('click',()=>load(index-1,true));$('musicNext').addEventListener('click',()=>load(index+1,true));
 audio.addEventListener('timeupdate',()=>{$('musicCurrentTime').textContent=timeLabel(audio.currentTime);if(Number.isFinite(audio.duration)&&audio.duration>0){progress.value=audio.currentTime/audio.duration*100;$('musicDuration').textContent=timeLabel(audio.duration)}});
 audio.addEventListener('loadedmetadata',()=> $('musicDuration').textContent=timeLabel(audio.duration));audio.addEventListener('ended',()=>load(index+1,true));audio.addEventListener('play',sync);audio.addEventListener('pause',sync);
 progress.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(progress.value)/100*audio.duration});
 volume.addEventListener('input',()=>audio.volume=Number(volume.value));audio.volume=Number(volume.value);
 $('musicMute').addEventListener('click',()=>{audio.muted=!audio.muted;$('musicMute').textContent=audio.muted?'🔇':'🔊';$('musicMute').setAttribute('aria-label',audio.muted?'Unmute audio':'Mute audio');$('musicMute').setAttribute('aria-pressed',String(audio.muted))});
 $('musicCollapse').addEventListener('click',()=>{const collapsed=player.classList.toggle('is-collapsed');$('musicCollapse').textContent=collapsed?'+':'−';$('musicCollapse').setAttribute('aria-label',collapsed?'Expand music player':'Minimize music player')});
 load(0,true);
})();