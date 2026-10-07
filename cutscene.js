/**
 * ============================================================================
 * CINEMATIC CUTSCENE SYSTEM (vanilla ES6+)
 * Feature-complete movie / video game cutscene engine
 * Features:
 *  - Pure Web Audio API SoundManager (ambient drone, key ticks, boom, glitch, chime, whoosh)
 *  - Canvas-based subtle binary/matrix particle background
 *  - Typewriter text renderer with blinking cursor, click/Space fast-forward, & auto-scroll
 *  - Data-driven cutscene scenes config
 *  - Breach panel & Fragment recovery persistence in localStorage
 *  - Screen shake, glitch flash, cinematic letterboxing
 *  - Skip button & Mute toggle
 *  - Prefers-reduced-motion compliance
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. DATA-DRIVEN CUTSCENE CONFIGURATIONS
  // ==========================================================================
  const CUTSCENE_CONFIGS = {
    'cutscene-1': {
      id: 'cutscene-1',
      storageKey: 'bo_cutscene_watched_1',
      type: 'narration',
      label: 'SECURITY LAYER 01 // RECONNAISSANCE',
      title: 'THE HUMAN ERROR',
      lines: [
        "I didn't need sophisticated malware to get inside.",
        "I only needed to know someone well enough.",
        "People reveal more than they realize. Their interests, their habits, their names and the things they love.",
        "All those little details can become the key to their digital lives.",
        "I've given you the same information I had.",
        "Let's see whether you can discover the mistake they made."
      ],
      quoteWrap: true,
      pulseHoldLastLine: true
    },
    'cutscene-2-partA': {
      id: 'cutscene-2-partA',
      type: 'breach-fragment',
      badge: 'SECURITY LAYER BREACHED',
      subtitle: 'Evidence fragment recovered.',
      fragmentLabel: 'FRAGMENT 01: 1',
      fragmentKey: '01',
      fragmentValue: '1',
      note: 'Preserve this fragment. It will be required later.',
      ghostIntro: 'The Ghost responds:',
      ghostQuotes: [
        "Interesting. You discovered that the strongest-looking systems can fall because of the simplest human mistakes.",
        "But people don't just expose themselves through passwords.",
        "Sometimes, they willingly open the door."
      ],
      nextRoundNotice: 'The next round begins.',
      pulseHoldNotice: true
    },
    'cutscene-2-partB': {
      id: 'cutscene-2-partB',
      storageKey: 'bo_cutscene_watched_2',
      type: 'narration',
      label: 'SECURITY LAYER 02 // COMMUNICATION ANALYSIS',
      title: 'THE PERFECT LIE',
      lines: [
        "I never forced my way into their systems.",
        "I sent them an invitation.",
        "One convincing message.",
        "One familiar name.",
        "One moment of carelessness.",
        "And someone opened the door for me.",
        "I've intercepted several communications. Most are harmless.",
        "One contains the evidence of my deception.",
        "Find it."
      ],
      quoteWrap: true,
      pulseHoldLastLine: true
    }
  };

  // ==========================================================================
  // 2. SYNTHESIZED WEB AUDIO SOUND MANAGER
  // ==========================================================================
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.droneOsc1 = null;
      this.droneOsc2 = null;
      this.droneGain = null;
      this.droneFilter = null;
      this.unlocked = false;

      // Load saved mute state
      try {
        const savedMute = localStorage.getItem('bo_cutscene_muted');
        if (savedMute !== null) {
          this.isMuted = savedMute === 'true';
        }
      } catch (_) {}
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch (err) {
        // Silently fallback if unsupported
      }
    }

    unlock() {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          this.unlocked = true;
        }).catch(() => {});
      } else {
        this.unlocked = true;
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      try {
        localStorage.setItem('bo_cutscene_muted', String(this.isMuted));
      } catch (_) {}
      if (this.isMuted) {
        if (this.droneGain && this.ctx) {
          this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
      } else {
        if (this.droneGain && this.ctx) {
          this.droneGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        }
      }
      return this.isMuted;
    }

    // 2.1 Ambient Drone Loop
    startAmbientDrone() {
      if (this.isMuted) return;
      this.unlock();
      if (!this.ctx) return;

      try {
        this.stopAmbientDrone();

        const t = this.ctx.currentTime;
        this.droneOsc1 = this.ctx.createOscillator();
        this.droneOsc2 = this.ctx.createOscillator();
        this.droneGain = this.ctx.createGain();
        this.droneFilter = this.ctx.createBiquadFilter();

        // Low dual frequencies for mysterious subterranean tension
        this.droneOsc1.type = 'sine';
        this.droneOsc1.frequency.setValueAtTime(55, t); // A1 note
        this.droneOsc2.type = 'sawtooth';
        this.droneOsc2.frequency.setValueAtTime(110.5, t); // Slight detune

        // Low-pass filter to soften sawtooth
        this.droneFilter.type = 'lowpass';
        this.droneFilter.frequency.setValueAtTime(140, t);

        // Gentle fade-in
        this.droneGain.gain.setValueAtTime(0.001, t);
        this.droneGain.gain.exponentialRampToValueAtTime(0.06, t + 2.0);

        this.droneOsc1.connect(this.droneFilter);
        this.droneOsc2.connect(this.droneFilter);
        this.droneFilter.connect(this.droneGain);
        this.droneGain.connect(this.ctx.destination);

        this.droneOsc1.start(t);
        this.droneOsc2.start(t);
      } catch (_) {}
    }

    stopAmbientDrone() {
      if (!this.ctx || !this.droneGain) return;
      try {
        const t = this.ctx.currentTime;
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, t);
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

        setTimeout(() => {
          try {
            if (this.droneOsc1) { this.droneOsc1.stop(); this.droneOsc1.disconnect(); }
            if (this.droneOsc2) { this.droneOsc2.stop(); this.droneOsc2.disconnect(); }
            if (this.droneGain) { this.droneGain.disconnect(); }
            this.droneOsc1 = null;
            this.droneOsc2 = null;
            this.droneGain = null;
          } catch (_) {}
        }, 1300);
      } catch (_) {}
    }

    // 2.2 Soft Keyboard Tick
    playKeyboardTick() {
      if (this.isMuted) return;
      this.unlock();
      if (!this.ctx) return;

      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Subtle randomized pitch around 1.8kHz - 2.5kHz
        const freq = 1800 + (Math.random() * 700 - 350);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.035, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.018);
      } catch (_) {}
    }

    // 2.3 Glitch / Static Burst
    playGlitchBurst() {
      if (this.isMuted) return;
      this.unlock();
      if (!this.ctx) return;

      try {
        const t = this.ctx.currentTime;
        const dur = 0.09;
        const bufferSize = Math.floor(this.ctx.sampleRate * dur);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.4;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, t);
        filter.Q.setValueAtTime(2.5, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        whiteNoise.start(t);
      } catch (_) {}
    }

    // 2.4 Deep Impact Boom
    playImpactBoom() {
      if (this.isMuted) return;
      this.unlock();
      if (!this.ctx) return;

      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(95, t);
        osc.frequency.exponentialRampToValueAtTime(28, t + 0.7);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.9);
      } catch (_) {}
    }

    // 2.5 Access Granted Chime (Harmonic Arpeggio)
    playAccessGrantedChime() {
      if (this.isMuted) return;
      this.unlock();
      if (!this.ctx) return;

      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const baseTime = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
          const t = baseTime + idx * 0.11;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.65);
        });
      } catch (_) {}
    }

    // 2.6 Cinematic Letterbox Whoosh
    playWhoosh() {
      if (this.isMuted) return;
      this.unlock();
      if (!this.ctx) return;

      try {
        const t = this.ctx.currentTime;
        const dur = 0.45;
        const bufferSize = Math.floor(this.ctx.sampleRate * dur);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(300, t);
        filter.frequency.exponentialRampToValueAtTime(900, t + 0.25);
        filter.frequency.exponentialRampToValueAtTime(200, t + dur);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        source.start(t);
      } catch (_) {}
    }
  }

  const sound = new SoundManager();

  // ==========================================================================
  // 3. BACKGROUND BINARY / MATRIX PARTICLE ENGINE
  // ==========================================================================
  class ParticleEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.particles = [];
      this.animId = null;
      this.running = false;
      this.onResize = this.resize.bind(this);
    }

    start() {
      if (!this.canvas || !this.ctx || this.running) return;
      this.running = true;
      this.resize();
      window.addEventListener('resize', this.onResize);

      // Create subtle floating binary particles
      const count = Math.min(45, Math.floor(window.innerWidth / 30));
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          char: Math.random() > 0.5 ? '1' : '0',
          speed: 0.35 + Math.random() * 0.65,
          opacity: 0.15 + Math.random() * 0.35,
          size: 10 + Math.random() * 6
        });
      }

      this.loop();
    }

    stop() {
      this.running = false;
      if (this.animId) cancelAnimationFrame(this.animId);
      window.removeEventListener('resize', this.onResize);
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    loop() {
      if (!this.running) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.font = '12px "JetBrains Mono", monospace';
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        this.ctx.fillStyle = `rgba(107, 255, 176, ${p.opacity})`;
        this.ctx.fillText(p.char, p.x, p.y);

        p.y += p.speed;
        if (p.y > this.canvas.height) {
          p.y = -10;
          p.x = Math.random() * this.canvas.width;
          p.char = Math.random() > 0.5 ? '1' : '0';
        }
      }

      this.animId = requestAnimationFrame(this.loop.bind(this));
    }
  }

  // ==========================================================================
  // 4. MAIN CUTSCENE PLAYER CONTROLLER
  // ==========================================================================
  class CutscenePlayer {
    constructor() {
      this.overlay = null;
      this.particleCanvas = null;
      this.particleEngine = null;
      this.contentWrapper = null;
      this.muteBtn = null;
      this.skipBtn = null;
      this.advanceHint = null;

      this.currentSceneConfig = null;
      this.currentSceneId = null;
      this.onCompleteCallback = null;
      this.isPlaying = false;
      this.isInterrupted = false;

      // Typewriter state
      this.activeTypingTimer = null;
      this.isLineTyping = false;
      this.skipCurrentLineFn = null;
      this.advanceNextLineFn = null;

      this.initDom();
    }

    initDom() {
      // Find or dynamically build the cutscene overlay elements
      let overlay = document.getElementById('cutsceneOverlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'cutsceneOverlay';
        overlay.innerHTML = `
          <div class="cutscene-letterbox cutscene-letterbox-top"></div>
          <div class="cutscene-letterbox cutscene-letterbox-bottom"></div>
          <div class="cutscene-vignette"></div>
          <div class="cutscene-scanlines"></div>
          <div class="cutscene-grain"></div>
          <canvas id="cutsceneParticleCanvas"></canvas>
          <div class="cutscene-glitch-flash-overlay" id="cutsceneGlitchFlash"></div>
          <button type="button" class="cutscene-audio-btn" id="cutsceneMuteBtn" aria-label="Toggle Sound">
            <span class="mute-icon">🔊</span> <span class="mute-text">AUDIO</span>
          </button>
          <button type="button" class="cutscene-skip-btn" id="cutsceneSkipBtn" aria-label="Skip Cutscene">
            <span>SKIP</span> ▸
          </button>
          <div class="cutscene-advance-hint" id="cutsceneHint">CLICK / SPACE TO ADVANCE ▸</div>
          <div class="cutscene-content-wrapper" id="cutsceneContentWrapper"></div>
        `;
        document.body.appendChild(overlay);
      }

      this.overlay = overlay;
      this.particleCanvas = document.getElementById('cutsceneParticleCanvas');
      this.contentWrapper = document.getElementById('cutsceneContentWrapper');
      this.muteBtn = document.getElementById('cutsceneMuteBtn');
      this.skipBtn = document.getElementById('cutsceneSkipBtn');
      this.advanceHint = document.getElementById('cutsceneHint');

      if (this.particleCanvas) {
        this.particleEngine = new ParticleEngine(this.particleCanvas);
      }

      this.bindControls();
      this.updateMuteBtnState();
    }

    bindControls() {
      // Mute Toggle Button
      if (this.muteBtn) {
        this.muteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          sound.unlock();
          sound.toggleMute();
          this.updateMuteBtnState();
        });
      }

      // Skip Button
      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.skipCurrentCutscene();
        });
      }

      // Click or Keypress speeds up line or advances
      if (this.overlay) {
        this.overlay.addEventListener('click', (e) => {
          if (e.target.closest('#cutsceneMuteBtn') || e.target.closest('#cutsceneSkipBtn')) return;
          sound.unlock();
          this.handleAdvanceAction();
        });
      }

      window.addEventListener('keydown', (e) => {
        if (!this.isPlaying) return;
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          sound.unlock();
          this.handleAdvanceAction();
        } else if (e.code === 'Escape') {
          this.skipCurrentCutscene();
        }
      });
    }

    updateMuteBtnState() {
      if (!this.muteBtn) return;
      const isMuted = sound.isMuted;
      const icon = this.muteBtn.querySelector('.mute-icon');
      const text = this.muteBtn.querySelector('.mute-text');
      if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
      if (text) text.textContent = isMuted ? 'MUTED' : 'AUDIO';
    }

    handleAdvanceAction() {
      if (this.isLineTyping && typeof this.skipCurrentLineFn === 'function') {
        // Fast-forward current typing line instantly
        this.skipCurrentLineFn();
      } else if (!this.isLineTyping && typeof this.advanceNextLineFn === 'function') {
        // Advance immediately to next line
        this.advanceNextLineFn();
      }
    }

    // ========================================================================
    // Persistence Helpers
    // ========================================================================
    hasWatched(sceneId) {
      try {
        const key = CUTSCENE_CONFIGS[sceneId] ? CUTSCENE_CONFIGS[sceneId].storageKey : null;
        if (!key) return false;
        return localStorage.getItem(key) === 'true';
      } catch (_) {
        return false;
      }
    }

    markWatched(sceneId) {
      try {
        const key = CUTSCENE_CONFIGS[sceneId] ? CUTSCENE_CONFIGS[sceneId].storageKey : null;
        if (key) {
          localStorage.setItem(key, 'true');
        }
      } catch (_) {}
    }

    resetWatched() {
      try {
        localStorage.removeItem('bo_cutscene_watched_1');
        localStorage.removeItem('bo_cutscene_watched_2');
      } catch (_) {}
    }

    saveFragment(key, val) {
      try {
        let frags = {};
        const raw = localStorage.getItem('bo_recovered_fragments');
        if (raw) frags = JSON.parse(raw);
        frags[key] = val;
        localStorage.setItem('bo_recovered_fragments', JSON.stringify(frags));
      } catch (_) {}
    }

    getFragments() {
      try {
        const raw = localStorage.getItem('bo_recovered_fragments');
        return raw ? JSON.parse(raw) : { "01": "1" };
      } catch (_) {
        return { "01": "1" };
      }
    }

    // ========================================================================
    // Play Sequences
    // ========================================================================
    play(sceneId, onComplete) {
      const config = CUTSCENE_CONFIGS[sceneId];
      if (!config) {
        if (onComplete) onComplete();
        return;
      }

      this.currentSceneConfig = config;
      this.currentSceneId = sceneId;
      this.onCompleteCallback = onComplete;
      this.isPlaying = true;
      this.isInterrupted = false;

      // Start visuals & audio
      this.overlay.classList.add('active');
      sound.unlock();
      sound.startAmbientDrone();
      if (this.particleEngine) this.particleEngine.start();

      // Trigger cinematic letterbox bars with whoosh
      setTimeout(() => {
        sound.playWhoosh();
        this.overlay.classList.add('letterboxed');
      }, 100);

      // Render scene
      this.contentWrapper.innerHTML = '';

      if (config.type === 'breach-fragment') {
        this.renderBreachFragmentScene(config);
      } else {
        this.renderNarrationScene(config);
      }
    }

    // Chain Cutscene 2 Part A -> Part B
    playCutscene2(onFinalComplete) {
      this.play('cutscene-2-partA', () => {
        // Transition seamlessly to Part B
        this.play('cutscene-2-partB', () => {
          this.markWatched('cutscene-2-partB');
          if (onFinalComplete) onFinalComplete();
        });
      });
    }

    // ========================================================================
    // Render Scene Type A: Narration Dialogue (Cutscene 1, Cutscene 2 Part B)
    // ========================================================================
    renderNarrationScene(config) {
      const wrapper = this.contentWrapper;
      wrapper.innerHTML = `
        <div class="cutscene-label" id="cLabel">${config.label}</div>
        <div class="cutscene-title" id="cTitle">${config.title}</div>
        <div class="cutscene-lines-container" id="cLines"></div>
      `;

      const labelEl = document.getElementById('cLabel');
      const titleEl = document.getElementById('cTitle');
      const linesContainer = document.getElementById('cLines');

      // 1. Label reveals first with letter-spacing animation
      setTimeout(() => {
        if (this.isInterrupted) return;
        labelEl.classList.add('revealed');
      }, 450);

      // 2. Title appears with quick glitch effect and impact boom
      setTimeout(() => {
        if (this.isInterrupted) return;
        titleEl.classList.add('revealed', 'glitch-flash');
        sound.playGlitchBurst();
        sound.playImpactBoom();
      }, 1200);

      // 3. Lines typewriter sequence
      setTimeout(() => {
        if (this.isInterrupted) return;
        this.startLinesTypewriter(config.lines, linesContainer, config.quoteWrap, () => {
          // Finished all lines
          this.markWatched(config.id);
          const holdDelay = config.pulseHoldLastLine ? 2200 : 1500;
          setTimeout(() => {
            if (this.isInterrupted) return;
            this.finishCutscene();
          }, holdDelay);
        });
      }, 2100);
    }

    // ========================================================================
    // Render Scene Type B: Breach Panel & Ghost Response (Cutscene 2 Part A)
    // ========================================================================
    renderBreachFragmentScene(config) {
      const wrapper = this.contentWrapper;

      // Save fragment immediately
      if (config.fragmentKey && config.fragmentValue) {
        this.saveFragment(config.fragmentKey, config.fragmentValue);
      }

      wrapper.innerHTML = `
        <div class="cutscene-breach-panel" id="cBreachPanel">
          <div class="breach-badge">${config.badge}</div>
          <div class="breach-subtitle">${config.subtitle}</div>
          <div class="breach-fragment-val pulse-glow" id="cFragVal">${config.fragmentLabel}</div>
          <div class="breach-note">${config.note}</div>
        </div>

        <div class="ghost-response-container" id="cGhostContainer">
          <div class="ghost-speaker-intro">${config.ghostIntro}</div>
          <div class="ghost-quote-wrapper" id="cGhostQuotes"></div>
          <div class="next-round-line pulse-hold" id="cNextRound" style="opacity:0;">${config.nextRoundNotice}</div>
        </div>
      `;

      const panelEl = document.getElementById('cBreachPanel');
      const ghostContainer = document.getElementById('cGhostContainer');
      const ghostQuotesEl = document.getElementById('cGhostQuotes');
      const nextRoundEl = document.getElementById('cNextRound');
      const flashOverlay = document.getElementById('cutsceneGlitchFlash');

      // 1. Screen shake + glitch flash + rising access chime
      setTimeout(() => {
        if (this.isInterrupted) return;
        if (flashOverlay) {
          flashOverlay.classList.remove('trigger-flash');
          void flashOverlay.offsetWidth;
          flashOverlay.classList.add('trigger-flash');
        }
        this.overlay.classList.add('cutscene-screen-shake');
        sound.playGlitchBurst();
        sound.playAccessGrantedChime();

        panelEl.classList.add('revealed');
        sound.playImpactBoom();
      }, 400);

      // 2. Remove shake class after animation
      setTimeout(() => {
        this.overlay.classList.remove('cutscene-screen-shake');
      }, 900);

      // 3. Ghost response intro reveals
      setTimeout(() => {
        if (this.isInterrupted) return;
        ghostContainer.classList.add('revealed');

        // Render Ghost Quote lines line by line
        this.startLinesTypewriter(config.ghostQuotes, ghostQuotesEl, true, () => {
          // Show "The next round begins." with slow pulse
          if (nextRoundEl) {
            nextRoundEl.style.transition = 'opacity 0.6s ease';
            nextRoundEl.style.opacity = '1';
            sound.playKeyboardTick();
          }

          setTimeout(() => {
            if (this.isInterrupted) return;
            this.finishCutscene();
          }, 2400);
        });
      }, 2000);
    }

    // ========================================================================
    // Line-by-Line Typewriter Engine
    // ========================================================================
    startLinesTypewriter(linesArray, containerEl, wrapQuotes, onAllDone) {
      let currentLineIdx = 0;
      const totalLines = linesArray.length;

      const advanceToNext = () => {
        if (this.isInterrupted) return;
        currentLineIdx++;
        if (currentLineIdx < totalLines) {
          typeSingleLine(currentLineIdx);
        } else {
          this.isLineTyping = false;
          this.skipCurrentLineFn = null;
          this.advanceNextLineFn = null;
          if (onAllDone) onAllDone();
        }
      };

      const typeSingleLine = (idx) => {
        if (this.isInterrupted) return;
        this.isLineTyping = true;

        // Dim previous lines
        const prevLines = containerEl.querySelectorAll('.cutscene-line-item');
        prevLines.forEach(l => {
          l.classList.remove('active');
          l.classList.add('completed');
        });

        // Determine full text with opening / closing quotes
        let fullLineText = linesArray[idx];
        if (wrapQuotes) {
          if (idx === 0) fullLineText = `"${fullLineText}`;
          if (idx === totalLines - 1) fullLineText = `${fullLineText}"`;
        }

        const lineEl = document.createElement('div');
        lineEl.className = 'cutscene-line-item active';
        lineEl.innerHTML = `<span class="text-slot"></span><span class="cutscene-cursor"></span>`;
        containerEl.appendChild(lineEl);

        // Auto-scroll content if overflowing
        this.autoScrollBottom();

        const textSlot = lineEl.querySelector('.text-slot');
        const cursor = lineEl.querySelector('.cutscene-cursor');
        let charIdx = 0;
        const charDelay = 32; // ~30-40ms per character

        // Skip line function for instant click/space speedup
        this.skipCurrentLineFn = () => {
          if (this.activeTypingTimer) clearTimeout(this.activeTypingTimer);
          textSlot.textContent = fullLineText;
          if (cursor) cursor.remove();
          this.isLineTyping = false;
          this.autoScrollBottom();

          // Prepare advance to next line on subsequent click or short delay
          this.advanceNextLineFn = advanceToNext;
          this.activeTypingTimer = setTimeout(advanceToNext, 650);
        };

        const typeNextChar = () => {
          if (this.isInterrupted) return;
          if (charIdx < fullLineText.length) {
            textSlot.textContent += fullLineText.charAt(charIdx);
            charIdx++;

            // Tick on non-whitespace chars
            if (fullLineText.charAt(charIdx - 1).trim()) {
              sound.playKeyboardTick();
            }

            this.activeTypingTimer = setTimeout(typeNextChar, charDelay);
          } else {
            // Line typing complete
            if (cursor) cursor.remove();
            this.isLineTyping = false;
            this.skipCurrentLineFn = null;
            this.autoScrollBottom();

            // Setup line pause before next line
            this.advanceNextLineFn = advanceToNext;
            const linePause = idx === totalLines - 1 ? 700 : 1100;
            this.activeTypingTimer = setTimeout(advanceToNext, linePause);
          }
        };

        typeNextChar();
      };

      // Start with line 0
      typeSingleLine(0);
    }

    autoScrollBottom() {
      if (!this.contentWrapper) return;
      try {
        this.contentWrapper.scrollTo({
          top: this.contentWrapper.scrollHeight,
          behavior: 'smooth'
        });
      } catch (_) {}
    }

    // ========================================================================
    // Finish & Dismiss Cutscene
    // ========================================================================
    finishCutscene() {
      if (!this.isPlaying) return;
      this.isPlaying = false;
      this.isInterrupted = false;

      if (this.activeTypingTimer) clearTimeout(this.activeTypingTimer);
      sound.stopAmbientDrone();

      // Smooth fade to black
      this.overlay.classList.remove('letterboxed');
      this.overlay.style.transition = 'opacity 0.65s ease';
      this.overlay.classList.remove('active');

      setTimeout(() => {
        if (this.particleEngine) this.particleEngine.stop();
        this.contentWrapper.innerHTML = '';
        this.overlay.style.transition = '';

        if (typeof this.onCompleteCallback === 'function') {
          const cb = this.onCompleteCallback;
          this.onCompleteCallback = null;
          cb();
        }
      }, 700);
    }

    skipCurrentCutscene() {
      if (!this.isPlaying) return;
      this.isInterrupted = true;
      if (this.currentSceneConfig) {
        this.markWatched(this.currentSceneConfig.id);
        if (this.currentSceneConfig.fragmentKey && this.currentSceneConfig.fragmentValue) {
          this.saveFragment(this.currentSceneConfig.fragmentKey, this.currentSceneConfig.fragmentValue);
        }
      }
      this.finishCutscene();
    }
  }

  // Instantiate and expose globally
  window.CutscenePlayer = new CutscenePlayer();
  window.CutsceneSound = sound;
})();
