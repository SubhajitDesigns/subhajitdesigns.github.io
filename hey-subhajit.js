
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
  let recognition=null,enabled=false,awake=false,speaking=false,restartTimer=null,manualStop=false,lastHeard='',wakeTimeout=null;
  const setState=(state,message)=>{
    root.dataset.state=state;
    if(message) status.textContent=message;
    orb.setAttribute('aria-label',state==='listening'?'Voice assistant listening for Hey Subhajit':state==='speaking'?'Voice assistant speaking':'Open Hey Subhajit voice assistant');
  };
  const openPanel=()=>{root.classList.add('is-open');orb.setAttribute('aria-expanded','true')};
  const closePanel=()=>{root.classList.remove('is-open');orb.setAttribute('aria-expanded','false')};
  const say=(message)=>{
    transcript.textContent=message;
    if(!('speechSynthesis' in window)){setState(enabled?'listening':'idle',message);return}
    speaking=true;
    try{if(recognition)recognition.stop()}catch(e){}
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(message);
    utterance.lang='en-IN';utterance.rate=.96;utterance.pitch=1.02;utterance.volume=1;
    utterance.onstart=()=>setState('speaking','Speaking');
    utterance.onend=()=>{speaking=false;if(enabled&&!manualStop){setState('listening','Listening for “Hey Subhajit”…');scheduleRestart(350)}else setState('idle','Voice assistant is off')};
    utterance.onerror=()=>{speaking=false;if(enabled&&!manualStop)scheduleRestart(500);else setState('idle','Voice assistant is off')};
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
    if(/\b(stop talking|be quiet|silence|stop speaking)\b/.test(q)){window.speechSynthesis.cancel();speaking=false;setState(enabled?'listening':'idle',enabled?'Listening for “Hey Subhajit”…':'Voice assistant is off');if(enabled)scheduleRestart(300);return}
    if(/\b(stop listening|turn off|disable voice|goodbye assistant)\b/.test(q)){disableListening();say('No problem. I’ll stop listening. Tap the orb whenever you want me again.');return}
    if(/\b(resume|cv|curriculum vitae)\b/.test(q)){say('Of course! Opening the resume.');setTimeout(()=>{window.location.href='resume.html'},700);return}
    if(/\b(testimonials?|reviews?|client feedback)\b/.test(q)){scrollToSection('clients','the clients section');return}
    if(/\b(about|who are you|tell me about|about you|yourself)\b/.test(q)){scrollToSection('about','the About section');return}
    if(/\b(crafted|craft|portfolio work|show me your work|projects|designs|featured work)\b/.test(q)){scrollToSection('work','Crafted Designs');return}
    if(/\b(what i do|services|skills|toolkit)\b/.test(q)){scrollToSection('what-i-do','What I Do');return}
    if(/\b(client|clients|brands)\b/.test(q)){scrollToSection('clients','the Clients section');return}
    if(/\b(contact|email|hire you|get in touch|reach you)\b/.test(q)){scrollToSection('contact','the Contact section');return}
    if(/\b(home|top|start|landing page)\b/.test(q)){scrollToSection('top','the top of the page');return}
    if(/\b(play music|play the music|start music|resume music)\b/.test(q)){const p=document.getElementById('musicPlay');if(p){p.click();say('Sure! I’ll start the soundtrack.')}else say('I can’t find the music controls right now.');return}
    if(/\b(pause music|stop music|mute music|mute the soundtrack)\b/.test(q)){const p=document.getElementById('musicMute');if(/mute/.test(q)&&p)p.click();else{const play=document.getElementById('musicPlay');if(play)play.click()}say('Okay, soundtrack controls updated.');return}
    if(/\b(help|what can you do|commands)\b/.test(q)){say('I can show you About, Crafted Designs, What I Do, Clients, Contact, or your resume. You can also ask me to control the soundtrack.');return}
    say('Sorry, I didn’t catch that. Try saying, show me your crafted designs, or open my resume.');
  };
  const wakePhrase=(text)=>{
    const normalized=text.toLowerCase().replace(/[.,!?]/g,' ').replace(/\s+/g,' ').trim();
    const patterns=[/hey subhajit/,/hey subha jeet/,/hey subhajeet/,/hi subhajit/];
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
            const remainder=phrase.toLowerCase().replace(/.*?hey\s+subha?j(?:it|eet)\s*/,'').trim();
            say('Hi there! Welcome to Subhajit Designs. How can I help you today?');
            if(remainder.length>2)setTimeout(()=>runCommand(remainder),1600);
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
          enabled=false;manualStop=true;setState('idle','Microphone permission was denied');help.textContent='Allow microphone access for this site in your browser settings, then tap Enable voice again.';enable.hidden=false;enable.textContent='Enable voice listening';return;
        }
        if(event.error==='audio-capture'){setState('idle','No microphone was found');help.textContent='Connect or enable a microphone, then try again.'}
      };
      recognition.onend=()=>{if(enabled&&!manualStop&&!speaking)scheduleRestart(400)};
    }
    manualStop=false;
    try{recognition.start();enabled=true;awake=false;setState('listening','Listening for “Hey Subhajit”…');enable.hidden=true;help.textContent='Say “Hey Subhajit” to wake me, then give a command. Listening stops when you turn it off.';transcript.textContent='Your microphone is on. I’m waiting for the wake phrase.';return true}
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
