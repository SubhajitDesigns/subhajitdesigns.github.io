
(()=> {
  const root=document.getElementById('heySubhajit');
  if(!root || root.dataset.initialized==='true') return;
  root.dataset.initialized='true';
  const orb=root.querySelector('.hs-orb-button');
  const panel=root.querySelector('.hs-panel');
  const close=root.querySelector('.hs-close');
  const status=root.querySelector('.hs-status-text');
  const transcript=root.querySelector('.hs-transcript');
  const enable=root.querySelector('.hs-permission');
  const help=root.querySelector('.hs-help');
  const textInput=root.querySelector('.hs-text-input');
  const send=root.querySelector('.hs-send');
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  let recognition=null,enabled=false,awake=false,speaking=false,restartTimer=null,manualStop=false,lastHeard='',wakeTimeout=null,queuedCommand=null;
  const setState=(state,message)=>{
    root.dataset.state=state;
    if(message) status.textContent=message;
    orb.setAttribute('aria-label',state==='listening'?'Voice assistant listening for Hey Subhajit':state==='speaking'?'Voice assistant speaking':'Open Hey Subhajit voice assistant');
  };
  const openPanel=()=>{root.classList.add('is-open');orb.setAttribute('aria-expanded','true')};
  const closePanel=()=>{root.classList.remove('is-open');orb.setAttribute('aria-expanded','false')};
  const chooseVoice=()=>{
    if(!('speechSynthesis' in window))return null;
    const voices=window.speechSynthesis.getVoices()||[];
    if(!voices.length)return null;
    const preferred=[
      /\b(ravi|prabhat|rishi)\b.*en[-_ ]?in/i,
      /en[-_ ]?in.*\b(ravi|prabhat|rishi)\b/i,
      /google.*english.*india/i,
      /english.*india/i,
      /en[-_]IN/i
    ];
    for(const pattern of preferred){const found=voices.find(v=>pattern.test(v.name+' '+v.lang));if(found)return found;}
    return voices.find(v=>/^en[-_]IN$/i.test(v.lang))||voices.find(v=>/^en[-_]/i.test(v.lang))||null;
  };
  const say=(message)=>{
    transcript.textContent=message;
    if(!('speechSynthesis' in window)){setState(enabled?'listening':'idle',message);return}
    speaking=true;
    try{if(recognition)recognition.stop()}catch(e){}
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(message);
    utterance.lang='en-IN';utterance.rate=.90;utterance.pitch=.94;utterance.volume=1;
    const voice=chooseVoice();if(voice)utterance.voice=voice;
    utterance.onstart=()=>setState('speaking','Speaking');
    utterance.onend=()=>{speaking=false;if(queuedCommand){const next=queuedCommand;queuedCommand=null;setTimeout(()=>runCommand(next),220);return}if(enabled&&!manualStop){setState('listening','Listening for “Hey Subhajit”…');scheduleRestart(450)}else setState('idle','Voice assistant is off')};
    utterance.onerror=()=>{speaking=false;if(enabled&&!manualStop)scheduleRestart(600);else setState('idle','Voice assistant is off')};
    window.speechSynthesis.speak(utterance);
  };
  const scrollToSection=(id,label)=>{
    const el=document.getElementById(id);
    if(!el){say("I couldn't find that section on this page yet.");return}
    closePanel();
    el.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    say('Yes, for sure! Taking you to '+label+'.');
  };
  const runCommand=(raw)=>{
    const q=raw.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
    if(!q)return;
    transcript.textContent='“'+raw+'”';
    const audio=document.getElementById('siteMusicAudio');
    const clickControl=(id)=>{const control=document.getElementById(id);if(control){control.click();return true}return false};
    if(/\b(stop talking|be quiet|silence|stop speaking)\b/.test(q)){window.speechSynthesis.cancel();speaking=false;setState(enabled?'listening':'idle',enabled?'Listening for “Hey Subhajit”…':'Voice assistant is off');if(enabled)scheduleRestart(300);return}
    if(/\b(stop listening|turn off voice|disable voice|goodbye assistant)\b/.test(q)){disableListening();return}
    if(/\b(help|what can you do|commands)\b/.test(q)){say('I can navigate the portfolio, open your resume or show reel, switch themes, and control the music. Try saying turn off the music, mute the music, or show me your work.');return}
    if(/\b(testimonials?|reviews?|client feedback)\b/.test(q)){scrollToSection('clients','the clients section');return}
    if(/\b(resume|cv|curriculum vitae)\b/.test(q)){say('Of course, opening your resume.');setTimeout(()=>{window.location.href='resume.html'},850);return}
    if(/\b(about|who are you|tell me about|about you|yourself)\b/.test(q)){scrollToSection('about','the About section');return}
    if(/\b(crafted|craft|portfolio work|show me your work|projects|designs|featured work|work section)\b/.test(q)){scrollToSection('work','Crafted Designs');return}
    if(/\b(what i do|services|skills|toolkit)\b/.test(q)){scrollToSection('what-i-do','What I Do');return}
    if(/\b(client|clients|brands)\b/.test(q)){scrollToSection('clients','the Clients section');return}
    if(/\b(contact|email|hire you|get in touch|reach you)\b/.test(q)){scrollToSection('contact','the Contact section');return}
    if(/\b(home|top|start|landing page)\b/.test(q)){scrollToSection('top','the top of the page');return}
    if(/\b(show reel|play reel|watch reel)\b/.test(q)){const reel=document.getElementById('showReel');if(reel){reel.click();say('Opening the show reel.')}else say('I can’t find the show reel button.');return}
    if(/\b(light mode|switch to light|turn on light theme)\b/.test(q)){const t=document.getElementById('themeToggle');if(t&&!t.checked)t.click();say('Switching to light mode.');return}
    if(/\b(dark mode|switch to dark|turn on dark theme)\b/.test(q)){const t=document.getElementById('themeToggle');if(t&&t.checked)t.click();say('Switching to dark mode.');return}
    if(/\b(mute|silence)\b.*\b(music|soundtrack|song|audio)\b|\b(music|soundtrack|song|audio)\b.*\b(mute|silence)\b/.test(q)){
      if(audio&&!audio.muted){clickControl('musicMute');say('Okay, I’ve muted the music.')}else say('The music is already muted.');return;
    }
    if(/\b(unmute)\b.*\b(music|soundtrack|song|audio)\b|\b(music|soundtrack|song|audio)\b.*\b(unmute)\b/.test(q)){
      if(audio&&audio.muted){clickControl('musicMute');say('The music is unmuted.')}else say('The music is already unmuted.');return;
    }
    if(/\b(turn off|switch off|stop|pause|turn down|stop playing)\b.*\b(music|soundtrack|song|audio)\b|\b(music|soundtrack|song|audio)\b.*\b(turn off|switch off|stop|pause|stop playing)\b/.test(q)){
      if(audio&&!audio.paused){clickControl('musicPlay');say('Okay, I’ve turned off the music.')}else say('The music is already stopped.');return;
    }
    if(/\b(turn on|switch on|play|start|resume)\b.*\b(music|soundtrack|song|audio)\b|\b(music|soundtrack|song|audio)\b.*\b(turn on|switch on|play|start|resume)\b/.test(q)){
      if(audio&&audio.paused)clickControl('musicPlay');if(audio&&audio.muted)clickControl('musicMute');say('Sure, starting the music.');return;
    }
    if(/\b(next song|next track|next music|skip song|skip track)\b/.test(q)){clickControl('musicNext');say('Skipping to the next track.');return}
    if(/\b(previous song|previous track|go back a song|last track)\b/.test(q)){clickControl('musicPrev');say('Going back to the previous track.');return}
    say('Sorry, I didn’t catch that. Try saying show me your work, open my resume, or turn off the music.');
  };
  const wakePhrase=(text)=>{
    const normalized=text.toLowerCase().replace(/[.,!?]/g,' ').replace(/\s+/g,' ').trim();
    const patterns=[/hey\s+subhajit/,/hey\s+subha\s+jeet/,/hey\s+subhajeet/,/hi\s+subhajit/];
    return patterns.some(p=>p.test(normalized));
  };
  const handleResult=(event)=>{
    let interim='';
    for(let i=event.resultIndex;i<event.results.length;i++){
      const phrase=event.results[i][0].transcript.trim();
      if(event.results[i].isFinal){
        lastHeard=phrase;
        if(!awake){
          if(wakePhrase(phrase)){
            awake=true;
            const remainder=phrase.toLowerCase().replace(/.*?(?:hey\s+subhajit|hey\s+subha\s+jeet|hey\s+subhajeet|hi\s+subhajit)\s*/,'').trim();
            if(remainder.length>2)queuedCommand=remainder;
            say('Hi there! Welcome to Subhajit Designs. How can I help you today.');
            clearTimeout(wakeTimeout);wakeTimeout=setTimeout(()=>{awake=false},12000);
          }
        }else{
          clearTimeout(wakeTimeout);
          wakeTimeout=setTimeout(()=>{awake=false;transcript.textContent='Say “Hey Subhajit” whenever you need me.'},12000);
          runCommand(phrase);
        }
      }else interim+=phrase+' ';
    }
    if(interim.trim()&&awake&&!speaking)transcript.textContent='“'+interim.trim()+'…”';
  };
  const scheduleRestart=(delay)=>{
    clearTimeout(restartTimer);
    restartTimer=setTimeout(()=>{if(!enabled||manualStop||speaking||!recognition)return;try{recognition.start()}catch(e){}},delay);
  };
  const startRecognition=()=>{
    if(!SpeechRecognition){help.textContent='Voice wake-word listening is not supported in this browser. Use the command box below, or try a current desktop version of Chrome or Edge.';setState('idle','Voice recognition is not supported here');return false}
    if(!recognition){
      recognition=new SpeechRecognition();
      recognition.lang='en-IN';
      recognition.continuous=true;
      recognition.interimResults=true;
      recognition.maxAlternatives=1;
      recognition.onresult=handleResult;
      recognition.onerror=(event)=>{
        if(event.error==='not-allowed'||event.error==='service-not-allowed'){
          enabled=false;manualStop=true;setState('idle','Microphone permission was denied');help.textContent='Allow microphone access for this site in your browser settings, then tap Enable voice listening again.';enable.hidden=false;enable.textContent='Enable voice listening';return;
        }
        if(event.error==='audio-capture'){setState('idle','No microphone was found');help.textContent='Connect or enable a microphone, then try again.'}
      };
      recognition.onend=()=>{if(enabled&&!manualStop&&!speaking)scheduleRestart(400)};
    }
    manualStop=false;
    try{recognition.start();enabled=true;awake=false;setState('listening','Listening for “Hey Subhajit”…');enable.hidden=false;enable.textContent='Stop voice listening';help.textContent='Say “Hey Subhajit” to wake me, then give a command. Use Stop voice listening whenever you want to turn the microphone off.';transcript.textContent='Your microphone is on. I’m waiting for the wake phrase.';return true}
    catch(e){enabled=true;scheduleRestart(600);return true}
  };
  const disableListening=()=>{
    enabled=false;manualStop=true;awake=false;clearTimeout(restartTimer);clearTimeout(wakeTimeout);
    if(recognition){try{recognition.stop()}catch(e){}}
    if(window.speechSynthesis)window.speechSynthesis.cancel();
    speaking=false;enable.hidden=false;enable.textContent='Enable voice listening';setState('idle','Voice assistant is off');
  };
  orb.addEventListener('click',()=>{
    openPanel();
    if(!enabled){transcript.textContent='Enable the microphone to let me listen for “Hey Subhajit”.';return}
    if(speaking){window.speechSynthesis.cancel();speaking=false;scheduleRestart(300);setState('listening','Listening for “Hey Subhajit”…')}
    else{awake=true;clearTimeout(wakeTimeout);wakeTimeout=setTimeout(()=>{awake=false},15000);say('I’m listening. What would you like to see?')}
  });
  close.addEventListener('click',closePanel);
  enable.addEventListener('click',()=>{
    if(enabled){disableListening();help.textContent='The microphone is off. Enable voice listening whenever you want me again.';return}
    if(!window.isSecureContext){help.textContent='Microphone access requires a secure website (HTTPS). Open the portfolio over HTTPS and try again.';return}
    startRecognition();
  });
  root.querySelectorAll('[data-hs-command]').forEach(button=>button.addEventListener('click',()=>runCommand(button.dataset.hsCommand)));
  const submitText=()=>{const value=textInput.value.trim();if(!value)return;openPanel();textInput.value='';awake=true;runCommand(value);if(enabled){clearTimeout(wakeTimeout);wakeTimeout=setTimeout(()=>{awake=false},12000)}};
  send.addEventListener('click',submitText);
  root.querySelector('.hs-text-row').addEventListener('submit',e=>{e.preventDefault();submitText()});
  textInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submitText()}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanel()});
  window.addEventListener('pagehide',()=>{enabled=false;manualStop=true;try{recognition&&recognition.stop()}catch(e){}if(window.speechSynthesis)window.speechSynthesis.cancel()});
  setState('idle','Tap to meet your voice assistant');
})();
