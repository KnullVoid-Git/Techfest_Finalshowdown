/**
 * ============================================================================
 * BREACH — FINAL SHOWDOWN | TECH FEST CTF JAVASCRIPT CONTROLLER
 * Fully static, zero-framework vanilla ES6+ logic
 * Features:
 *  - Matrix Rain Canvas Engine
 *  - Synthesized Web Audio API sound generator
 *  - Line-by-line typewriter boot sequence
 *  - Shuffled Two-Pane Virtual Mailbox with SHA-256 runtime authentication
 *  - Password Terminal with attempt tracking, 30s lockout & brute-force progress
 *  - AI Prompt Injection Challenge with clipboard export & SHA-256 validation
 *  - Fullscreen Glitch Victory celebration
 *  - Hidden Organizer Admin Console (Ctrl+Shift+A) with obfuscated answer decoding
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONFIG: SPONSOR CHECKPOINT CONSTANTS & PRECOMPUTED HASHES
  // ==========================================================================
  const IG_URL = "https://www.instagram.com/kapidhwaj.innovations/";
  const IG_HANDLE = "@kapidhwaj.innovations";
  const MIN_AWAY_SECONDS = 10;
  const REQUIRE_PROOF_CODE = true;
  const REQUIRE_HANDLES = true;
  const PROOF_HASH = "b4fcf04c8e6aa45ab3f5c3262b57015142cb34d11430d2acd651e8d74580a14d";

  const STORAGE_KEY_CHECKPOINT = 'bo_sponsor_checkpoint';
  const STORAGE_KEY_COLLECTED_HANDLES = 'bo_collected_ig_handles';

  const MAX_ATTEMPTS = 3;
  const STORAGE_KEY_ATTEMPTS = 'bo_r2_attempts';
  const STORAGE_KEY_FOLDERS = 'bo_r2_folders';

  // SHA-256 digest of credential pair (normalized case ID + "|" + normalized code)
  const TARGET_CREDENTIAL_HASH = "1c6e701b949a0256ae02e1d87f60cd93fe0c808a5fa6807e4d9438534500416d";

  // SHA-256 digest of Round 1 Reconnaissance passphrase
  const TARGET_ROUND1_HASH = "7374a2beeea3a0eca783d2dceb13febbd4c9bb702fe50ac1165c97b8cac05907";

  // SHA-256 digest of organizer override passphrase (default: ghost-protocol-2026)
  const ORGANIZER_OVERRIDE_HASH = "db92f80fc751eebc031eec7d915b7b7d25bc26c3d4831669dec5dc165838cef0";

  // SHA-256 digest of vault authorization key (Round 3)
  const TARGET_PASSWORD_HASH = "c1d9829aaf6b5df9e58bf630b6bd4482d602ef51519bcd082349c58bad3f108a";
  
  // SHA-256 digest of AI directive extraction phrase (Round 4)
  const TARGET_AI_PHRASE_HASH = "f7c113855f51657799b35ffc99f6873663829f5c210f5d45342a6784afb9393a";

  // Pure JavaScript SHA-256 implementation (Fallback for non-secure contexts / file://)
  function jsSha256(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let result = '';
    const words = [];
    const asciiBitLength = ascii.length * 8;
    const hash = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    let i, j;
    for (i = 0; i < ascii.length; i++) {
      const code = ascii.charCodeAt(i);
      words[i >> 2] |= (code & 0xff) << (24 - (i % 4) * 8);
    }
    words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
    words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

    for (i = 0; i < words.length; i += 16) {
      const w = [];
      for (j = 0; j < 16; j++) w[j] = words[i + j] | 0;
      for (j = 16; j < 64; j++) {
        const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
      let a = hash[0], b = hash[1], c = hash[2], d = hash[3], e = hash[4], f = hash[5], g = hash[6], h = hash[7];
      for (j = 0; j < 64; j++) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = (h + S1 + ch + k[j] + w[j]) | 0;
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) | 0;

        h = g; g = f; f = e; e = (d + temp1) | 0;
        d = c; c = b; b = a; a = (temp1 + temp2) | 0;
      }
      hash[0] = (hash[0] + a) | 0;
      hash[1] = (hash[1] + b) | 0;
      hash[2] = (hash[2] + c) | 0;
      hash[3] = (hash[3] + d) | 0;
      hash[4] = (hash[4] + e) | 0;
      hash[5] = (hash[5] + f) | 0;
      hash[6] = (hash[6] + g) | 0;
      hash[7] = (hash[7] + h) | 0;
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j >= 0; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  // Universal SHA-256 resolver: uses crypto.subtle if available, else jsSha256
  async function computeSha256(text) {
    if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        return jsSha256(text);
      }
    }
    return jsSha256(text);
  }

  // ==========================================================================
  // 2. SYNTHESIZED WEB AUDIO API SOUND SYSTEM
  // ==========================================================================
  class CyberAudio {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    keyClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700 + Math.random() * 400, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }

    successChime() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.08, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.35);
      });
    }

    errorBuzz() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(110, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    }

    glitchZap() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  }

  const audio = new CyberAudio();

  // ==========================================================================
  // 3. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  function showToast(message, type = 'info', duration = 3500, onUndo = null) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'error') icon = '⚠';
    if (type === 'success') icon = '✓';

    let undoHtml = '';
    if (typeof onUndo === 'function') {
      undoHtml = `<button class="toast-undo-btn" id="toastUndoBtn">UNDO</button>`;
    }

    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-msg">${message}</span>${undoHtml}`;
    container.appendChild(toast);

    if (typeof onUndo === 'function') {
      const undoBtn = toast.querySelector('#toastUndoBtn');
      if (undoBtn) {
        undoBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onUndo();
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        });
      }
    }

    if (type === 'error') {
      audio.errorBuzz();
    } else if (type === 'success') {
      audio.successChime();
    } else {
      audio.keyClick();
    }

    setTimeout(() => {
      toast.style.animation = 'toast-out 0.3s forwards';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  // Fullscreen green glitch flash
  function triggerGlitchSuccessFlash() {
    const flash = document.getElementById('glitchSuccessFlash');
    if (!flash) return;
    flash.classList.remove('flash-active');
    void flash.offsetWidth; // reflow
    flash.classList.add('flash-active');
    audio.glitchZap();
  }

  // ==========================================================================
  // 4. MATRIX RAIN CANVAS BACKGROUND (Boot Screen)
  // ==========================================================================
  function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ<>%$#@*+=~';
    const fontSize = 14;
    let columns = 0;
    let drops = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -50);
      }
    }

    window.addEventListener('resize', resize);
    resize();

    function draw() {
      ctx.fillStyle = 'rgba(6, 10, 7, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of drop is bright cyan/white, tail is neon green
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#00e5ff';
          ctx.shadowColor = '#00e5ff';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = '#39ff14';
          ctx.shadowColor = '#39ff14';
          ctx.shadowBlur = 4;
        }

        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  // ==========================================================================
  // 5. STAGE / SECTION NAVIGATION CONTROLLER
  // ==========================================================================
  const sections = {
    1: document.getElementById('section-boot'),
    2: document.getElementById('section-round1'),
    'checkpoint': document.getElementById('section-checkpoint'),
    3: document.getElementById('section-round2'),
    4: document.getElementById('section-round3'),
    5: document.getElementById('section-round4')
  };

  let currentStage = 1;
  let round1Completed = false;
  let adminOverrideActive = false;

  function isCheckpointPassed() {
    if (adminOverrideActive) return true;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_CHECKPOINT);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Boolean(parsed.passed);
      }
    } catch (_) {}
    return false;
  }

  function goToSection(stageNum, bypassLock = false) {
    if (!sections[stageNum]) return;

    // Cutscene 1 Trigger before Round 1
    if ((stageNum === 2 || stageNum === '2') && currentStage === 1 && !bypassLock) {
      if (window.CutscenePlayer && !window.CutscenePlayer.hasWatched('cutscene-1')) {
        window.CutscenePlayer.play('cutscene-1', () => {
          goToSection(2, true);
        });
        return;
      }
    }

    // Strict Stage & Checkpoint Guards
    if (stageNum === 'checkpoint') {
      if (!round1Completed && !adminOverrideActive && !bypassLock) {
        showToast('ACCESS DENIED: Complete Round 1 Reconnaissance first.', 'error');
        audio.errorBuzz();
        return;
      }
    } else if (stageNum === 3 || stageNum === '3' || stageNum === 4 || stageNum === '4' || stageNum === 5 || stageNum === '5') {
      if (!round1Completed && !adminOverrideActive && !bypassLock) {
        showToast('ACCESS DENIED: Complete Round 1 Reconnaissance first.', 'error');
        audio.errorBuzz();
        return;
      }
      if (!isCheckpointPassed() && !adminOverrideActive && !bypassLock) {
        showToast('SPONSOR CHECKPOINT REQUIRED // CHANNEL ENCRYPTED', 'warning');
        audio.errorBuzz();
        goToSection('checkpoint');
        return;
      }

      // Cutscene 2 Trigger before Round 2 (after Round 1 & Sponsor checkpoint)
      if ((stageNum === 3 || stageNum === '3') && !bypassLock) {
        if (window.CutscenePlayer && !window.CutscenePlayer.hasWatched('cutscene-2-partB')) {
          window.CutscenePlayer.playCutscene2(() => {
            goToSection(3, true);
          });
          return;
        }
      }
    }

    currentStage = stageNum;

    // Update section visibility
    Object.keys(sections).forEach(key => {
      const sec = sections[key];
      const isTarget = (String(key) === String(stageNum));
      if (isTarget) {
        sec.classList.add('active');
        if (window.gsap) {
          gsap.set(sec, { clearProps: 'all' });
          gsap.fromTo(sec, { opacity: 0, y: 12 }, { 
            opacity: 1, 
            y: 0, 
            duration: 0.35, 
            ease: 'power2.out',
            onComplete: () => {
              if (String(stageNum) === '3') {
                gsap.set(sec, { clearProps: 'transform' });
              }
            }
          });
        }
        // Trigger glitch entrance flicker on headings
        const headings = sec.querySelectorAll('.glitch-text');
        headings.forEach(h => {
          h.classList.remove('glitch-flicker-trigger');
          void h.offsetWidth;
          h.classList.add('glitch-flicker-trigger');
        });
      } else {
        sec.classList.remove('active');
        if (window.gsap) {
          gsap.set(sec, { clearProps: 'all' });
        }
      }
    });

    if (String(stageNum) === '3') {
      const readingPane = document.getElementById('readingPane');
      if (readingPane) readingPane.scrollTop = 0;
      const emailList = document.getElementById('emailListContainer');
      if (emailList) emailList.scrollTop = 0;
    }

    // Update HUD round tracker
    const steps = document.querySelectorAll('.tracker-step');
    steps.forEach(step => {
      const stepIdx = parseInt(step.getAttribute('data-step'), 10);
      step.classList.remove('active', 'completed');
      if (stageNum === 'checkpoint') {
        if (stepIdx <= 2) {
          step.classList.add('completed');
        }
      } else {
        const numStage = parseInt(stageNum, 10);
        if (stepIdx === numStage) {
          step.classList.add('active');
        } else if (stepIdx < numStage) {
          step.classList.add('completed');
        }
      }
    });

    // Update URL hash for deep link guarding
    try {
      if (stageNum === 'checkpoint') {
        if (window.location.hash !== '#checkpoint') history.replaceState(null, '', '#checkpoint');
      } else if (stageNum === 1 || stageNum === '1') {
        if (window.location.hash !== '#boot') history.replaceState(null, '', '#boot');
      } else if (stageNum === 2 || stageNum === '2') {
        if (window.location.hash !== '#round1') history.replaceState(null, '', '#round1');
      } else if (stageNum === 3 || stageNum === '3') {
        if (window.location.hash !== '#round2') history.replaceState(null, '', '#round2');
      } else if (stageNum === 4 || stageNum === '4') {
        if (window.location.hash !== '#round3') history.replaceState(null, '', '#round3');
      } else if (stageNum === 5 || stageNum === '5') {
        if (window.location.hash !== '#round4') history.replaceState(null, '', '#round4');
      }
    } catch (_) {}

    audio.keyClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================================================
  // 6. SECTION 1: BOOT SEQUENCE & LOG STREAM
  // ==========================================================================
  const bootLines = [
    { prefix: '[KERNEL-INIT]', text: 'Initializing secure hypervisor shell v4.19-breach...', delay: 280 },
    { prefix: '[SYS-MEM]', text: 'Memory integrity verification: 64GB ECC OK. Bitflips: 0', delay: 240 },
    { prefix: '[NET-MESH]', text: 'Establishing TLS 1.3 socket to node://techfest-cyber-grid:8443... ESTABLISHED', delay: 320 },
    { prefix: '[SEC-BYPASS]', text: 'Bypassing local subnet honeypots and perimeter defenses... BYPASSED', delay: 300 },
    { prefix: '[THREAT-DB]', text: 'Loading intrusion signature database: 4,192,802 rules compiled.', delay: 280 },
    { prefix: '[ALERT]', text: 'CRITICAL ANOMALY: Identity exfiltration detected in Sector 7 cloud spool.', delay: 360, alert: true },
    { prefix: '[CRYPT-KEY]', text: 'Decrypting investigator credentials and authorizing forensic session...', delay: 300, success: true }
  ];

  let bootDone = false;

  function runBootSequence() {
    const logStream = document.getElementById('bootLogStream');
    const accessGranted = document.getElementById('bootAccessGranted');
    if (!logStream) return;

    let lineIndex = 0;

    function printNextLine() {
      if (bootDone) return;
      if (lineIndex < bootLines.length) {
        const item = bootLines[lineIndex];
        const lineEl = document.createElement('div');
        lineEl.className = 'boot-log-line';
        if (item.alert) lineEl.classList.add('alert-line');
        if (item.success) lineEl.classList.add('success-line');

        lineEl.innerHTML = `<span class="log-prefix">${item.prefix}</span> <span class="log-msg"></span>`;
        logStream.appendChild(lineEl);

        const msgSpan = lineEl.querySelector('.log-msg');
        let charIndex = 0;

        function typeChar() {
          if (bootDone) {
            msgSpan.textContent = item.text;
            return;
          }
          if (charIndex < item.text.length) {
            msgSpan.textContent += item.text.charAt(charIndex);
            charIndex++;
            audio.keyClick();
            setTimeout(typeChar, 12);
          } else {
            lineIndex++;
            setTimeout(printNextLine, item.delay);
          }
        }

        typeChar();
      } else {
        finishBoot();
      }
    }

    printNextLine();
  }

  function finishBoot() {
    if (bootDone) return;
    bootDone = true;
    const accessGranted = document.getElementById('bootAccessGranted');
    const logStream = document.getElementById('bootLogStream');

    // If skipped, ensure all lines are rendered
    if (logStream && logStream.children.length < bootLines.length) {
      logStream.innerHTML = '';
      bootLines.forEach(item => {
        const lineEl = document.createElement('div');
        lineEl.className = 'boot-log-line';
        if (item.alert) lineEl.classList.add('alert-line');
        if (item.success) lineEl.classList.add('success-line');
        lineEl.innerHTML = `<span class="log-prefix">${item.prefix}</span> <span class="log-msg">${item.text}</span>`;
        logStream.appendChild(lineEl);
      });
    }

    if (accessGranted) {
      accessGranted.classList.add('visible');
      const heading = accessGranted.querySelector('h1');
      if (heading) {
        heading.classList.add('glitch-flicker-trigger');
      }
    }
    audio.successChime();
  }

  // ==========================================================================
  // 7. SECTION 2: ROUND 1 — RECONNAISSANCE CONTROLLER & HYBRID AUTHENTICATION
  // ==========================================================================
  const STORAGE_KEY_TEAMS = 'bo_r1_teams_progress';

  let activeTeamId = 'team-alpha';
  try {
    const savedTeam = localStorage.getItem('r1_active_team');
    if (savedTeam) activeTeamId = savedTeam;
  } catch (e) {}

  function getLocalTeamsData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TEAMS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return {
      "team-alpha": { teamId: "team-alpha", teamName: "Team Alpha", completed: false, attempts: 0, completedAt: null },
      "team-beta": { teamId: "team-beta", teamName: "Team Beta", completed: false, attempts: 0, completedAt: null },
      "team-gamma": { teamId: "team-gamma", teamName: "Team Gamma", completed: false, attempts: 0, completedAt: null }
    };
  }

  function saveLocalTeamsData(data) {
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(data));
    } catch (e) {}
  }

  function getActiveTeamRecord() {
    const teams = getLocalTeamsData();
    if (!teams[activeTeamId]) {
      teams[activeTeamId] = {
        teamId: activeTeamId,
        teamName: `Team ${activeTeamId.replace('team-', '').toUpperCase()}`,
        completed: false,
        attempts: 0,
        completedAt: null
      };
      saveLocalTeamsData(teams);
    }
    return teams[activeTeamId];
  }

  function loadRound1Status() {
    const team = getActiveTeamRecord();

    const errBanner = document.getElementById('round1ErrorBanner');
    const succBanner = document.getElementById('round1SuccessBanner');
    const statusText = document.getElementById('round1StatusText');
    const statusLed = document.getElementById('round1Led');
    const proceedBtn = document.getElementById('proceedToRound2Btn');
    const passwordInput = document.getElementById('round1PasswordInput');

    if (team.completed) {
      round1Completed = true;
      if (errBanner) errBanner.classList.add('hidden');
      if (succBanner) succBanner.classList.remove('hidden');
      const timeInfo = team.completedAt ? ` [${team.completedAt}]` : '';
      if (statusText) statusText.textContent = `STATUS: RECONNAISSANCE COMPLETE // PROCEED TO ROUND 2 AUTHORIZED${timeInfo}`;
      if (statusLed) statusLed.classList.remove('locked');
      if (proceedBtn) {
        proceedBtn.removeAttribute('disabled');
        proceedBtn.classList.remove('locked-btn');
      }
      if (passwordInput) {
        passwordInput.disabled = true;
        passwordInput.placeholder = 'AUTHENTICATED // ACCESS GRANTED';
      }
    } else {
      round1Completed = false;
      if (errBanner) errBanner.classList.add('hidden');
      if (succBanner) succBanner.classList.add('hidden');
      const attemptsText = (team.attempts && team.attempts > 0) ? ` (${team.attempts} ATTEMPTS LOGGED)` : '';
      if (statusText) statusText.textContent = `STATUS: AWAITING ROUND 1 AUTHENTICATION${attemptsText}`;
      if (statusLed) statusLed.classList.add('locked');
      if (proceedBtn) {
        proceedBtn.setAttribute('disabled', 'true');
        proceedBtn.classList.add('locked-btn');
      }
      if (passwordInput) {
        passwordInput.disabled = false;
        passwordInput.placeholder = 'Enter password...';
      }
    }

    // Optional background sync with server if available (never throws or errors)
    if (window.location.protocol.startsWith('http')) {
      fetch(`/api/round1/status?teamId=${encodeURIComponent(activeTeamId)}`)
        .then(r => r.ok ? r.json() : null)
        .then(remote => {
          if (remote && typeof remote.completed === 'boolean') {
            const currentTeams = getLocalTeamsData();
            if (remote.completed && !currentTeams[activeTeamId].completed) {
              currentTeams[activeTeamId] = Object.assign(currentTeams[activeTeamId] || {}, remote);
              saveLocalTeamsData(currentTeams);
              loadRound1Status();
            }
          }
        })
        .catch(() => {});
    }
  }

  async function submitRound1Password(enteredPassword) {
    const errBanner = document.getElementById('round1ErrorBanner');
    const succBanner = document.getElementById('round1SuccessBanner');
    const statusText = document.getElementById('round1StatusText');
    const statusLed = document.getElementById('round1Led');
    const proceedBtn = document.getElementById('proceedToRound2Btn');
    const passwordInput = document.getElementById('round1PasswordInput');

    if (!enteredPassword || !enteredPassword.trim()) {
      showToast('Please enter a password', 'info');
      if (passwordInput) passwordInput.focus();
      return;
    }

    // 1. Client-side cryptographic SHA-256 validation (instant, 100% reliable, zero network failures)
    const normalized = enteredPassword.trim().toLowerCase();
    const hash = await computeSha256(normalized);
    const isCorrect = (hash === TARGET_ROUND1_HASH);

    const teams = getLocalTeamsData();
    const team = teams[activeTeamId] || { teamId: activeTeamId, teamName: activeTeamId, completed: false, attempts: 0, completedAt: null };

    if (isCorrect) {
      team.completed = true;
      if (!team.completedAt) {
        const now = new Date();
        const timeStr = String(now.getUTCHours()).padStart(2, '0') + ':' +
                        String(now.getUTCMinutes()).padStart(2, '0') + ':' +
                        String(now.getUTCSeconds()).padStart(2, '0') + ' UTC';
        team.completedAt = timeStr;
      }
      teams[activeTeamId] = team;
      saveLocalTeamsData(teams);

      round1Completed = true;
      if (errBanner) errBanner.classList.add('hidden');
      if (succBanner) succBanner.classList.remove('hidden');
      if (statusText) statusText.textContent = `STATUS: RECONNAISSANCE COMPLETE // PROCEED TO ROUND 2 AUTHORIZED [${team.completedAt}]`;
      if (statusLed) statusLed.classList.remove('locked');
      if (proceedBtn) {
        proceedBtn.removeAttribute('disabled');
        proceedBtn.classList.remove('locked-btn');
      }
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.disabled = true;
        passwordInput.placeholder = 'AUTHENTICATED // ACCESS GRANTED';
      }
      audio.successChime();
      triggerGlitchSuccessFlash();
      showToast('ROUND 1 COMPLETE // RECONNAISSANCE SUCCESSFUL', 'success');
    } else {
      team.attempts = (team.attempts || 0) + 1;
      teams[activeTeamId] = team;
      saveLocalTeamsData(teams);

      round1Completed = false;
      if (errBanner) errBanner.classList.remove('hidden');
      if (succBanner) succBanner.classList.add('hidden');
      if (statusText) {
        statusText.textContent = `STATUS: INCORRECT ATTEMPT LOGGED (${team.attempts} ATTEMPTS)`;
      }
      if (statusLed) statusLed.classList.add('locked');
      if (proceedBtn) {
        proceedBtn.setAttribute('disabled', 'true');
        proceedBtn.classList.add('locked-btn');
      }
      audio.errorBuzz();
      showToast('INCORRECT PASSWORD — TRY AGAIN', 'error');
      if (passwordInput) {
        passwordInput.focus();
        passwordInput.select();
      }
    }

    // Optional background sync if backend server is available (never produces user error if server is offline)
    if (window.location.protocol.startsWith('http')) {
      fetch('/api/round1/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: activeTeamId,
          password: enteredPassword
        })
      }).catch(() => {});
    }
  }

  function initRound1Recon() {
    const teamSelect = document.getElementById('teamSelect');
    if (teamSelect) {
      // Ensure local teams are in the dropdown
      const localTeams = getLocalTeamsData();
      Object.values(localTeams).forEach(t => {
        if (!teamSelect.querySelector(`option[value="${t.teamId}"]`)) {
          const opt = document.createElement('option');
          opt.value = t.teamId;
          opt.textContent = t.teamName;
          teamSelect.insertBefore(opt, teamSelect.querySelector('option[value="__new__"]'));
        }
      });

      teamSelect.value = activeTeamId;
      if (!teamSelect.value) {
        teamSelect.value = 'team-alpha';
        activeTeamId = 'team-alpha';
      }

      // Also try fetching teams from server if available
      if (window.location.protocol.startsWith('http')) {
        fetch('/api/teams')
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data && data.teams) {
              const currentLocal = getLocalTeamsData();
              data.teams.forEach(t => {
                if (!currentLocal[t.teamId]) {
                  currentLocal[t.teamId] = { teamId: t.teamId, teamName: t.teamName, completed: false, attempts: 0, completedAt: null };
                }
                if (!teamSelect.querySelector(`option[value="${t.teamId}"]`)) {
                  const opt = document.createElement('option');
                  opt.value = t.teamId;
                  opt.textContent = t.teamName;
                  teamSelect.insertBefore(opt, teamSelect.querySelector('option[value="__new__"]'));
                }
              });
              saveLocalTeamsData(currentLocal);
            }
          })
          .catch(() => {});
      }

      teamSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === '__new__') {
          const newName = prompt('Enter New Team Name (e.g. Team Delta):');
          if (newName && newName.trim()) {
            const cleanId = 'team-' + newName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
            const allT = getLocalTeamsData();
            allT[cleanId] = {
              teamId: cleanId,
              teamName: newName.trim(),
              completed: false,
              attempts: 0,
              completedAt: null
            };
            saveLocalTeamsData(allT);

            const opt = document.createElement('option');
            opt.value = cleanId;
            opt.textContent = newName.trim();
            teamSelect.insertBefore(opt, teamSelect.querySelector('option[value="__new__"]'));
            teamSelect.value = cleanId;
            activeTeamId = cleanId;
            try { localStorage.setItem('r1_active_team', cleanId); } catch (_) {}
            showToast(`Switched to ${newName.trim()}`, 'info');
            loadRound1Status();

            if (window.location.protocol.startsWith('http')) {
              fetch('/api/team/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId: cleanId, teamName: newName.trim() })
              }).catch(() => {});
            }
            return;
          }
          teamSelect.value = activeTeamId;
          return;
        }

        activeTeamId = val;
        try { localStorage.setItem('r1_active_team', val); } catch (_) {}
        const selName = teamSelect.options[teamSelect.selectedIndex].text;
        showToast(`Active team: ${selName}`, 'info');
        loadRound1Status();
      });
    }

    // Password submission form
    const form = document.getElementById('round1Form');
    const passwordInput = document.getElementById('round1PasswordInput');
    const submitBtn = document.getElementById('round1SubmitBtn');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = passwordInput ? passwordInput.value : '';
        submitRound1Password(pwd);
      });
    }

    if (submitBtn && form) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const pwd = passwordInput ? passwordInput.value : '';
        submitRound1Password(pwd);
      });
    }

    // Proceed to Round 2 button (Now routes through Sponsor Checkpoint)
    const proceedBtn = document.getElementById('proceedToRound2Btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        if (!round1Completed && !adminOverrideActive) {
          showToast('Complete Round 1 Reconnaissance first.', 'error');
          audio.errorBuzz();
          return;
        }
        if (isCheckpointPassed()) {
          goToSection(3);
        } else {
          goToSection('checkpoint');
        }
      });
    }

    // Initial status render
    loadRound1Status();
  }

  // ==========================================================================
  // 7B. SPONSOR CHECKPOINT: INTEL PARTNER VERIFICATION CONTROLLER
  // ==========================================================================
  function initSponsorCheckpoint() {
    // DOM Elements
    const openInstagramBtn = document.getElementById('openInstagramBtn');
    const igPopupFallback = document.getElementById('igPopupFallback');
    const step1CheckIcon = document.getElementById('step1CheckIcon');
    const step1StatusTag = document.getElementById('step1StatusTag');
    const step1Item = document.getElementById('checkpointStep1');

    const step2CheckIcon = document.getElementById('step2CheckIcon');
    const step2Item = document.getElementById('checkpointStep2');
    const awayScanBox = document.getElementById('awayScanBox');
    const awayStatusMsg = document.getElementById('awayStatusMsg');

    const teamHandleInputs = [
      document.getElementById('teamHandleInput1'),
      document.getElementById('teamHandleInput2'),
      document.getElementById('teamHandleInput3'),
      document.getElementById('teamHandleInput4')
    ];
    const handlesFeedback = document.getElementById('handlesFeedback');
    const step3CheckIcon = document.getElementById('step3CheckIcon');
    const step3Item = document.getElementById('checkpointStep3');

    const sponsorProofForm = document.getElementById('sponsorProofForm');
    const sponsorProofCodeInput = document.getElementById('sponsorProofCodeInput');
    const sponsorProofSubmitBtn = document.getElementById('sponsorProofSubmitBtn');
    const sponsorProofFeedback = document.getElementById('sponsorProofFeedback');
    const step4CheckIcon = document.getElementById('step4CheckIcon');
    const step4Item = document.getElementById('checkpointStep4');

    const sponsorFollowCheckbox = document.getElementById('sponsorFollowCheckbox');
    const step5CheckIcon = document.getElementById('step5CheckIcon');
    const step5Item = document.getElementById('checkpointStep5');

    const checkpointStepsCompletedCount = document.getElementById('checkpointStepsCompletedCount');
    const continueToRound2Btn = document.getElementById('continueToRound2Btn');
    const checkpointStatusLed = document.getElementById('checkpointStatusLed');
    const checkpointStatusText = document.getElementById('checkpointStatusText');

    // Runtime tracking variables
    let lastIgClickTime = 0;
    let tabHiddenStartTime = 0;
    let isScanningAway = false;
    let proofCooldownActive = false;

    // Helper: Normalize proof code (uppercase, strip non-alphanumeric)
    function normalizeProofCode(code) {
      return (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    // Helper: Clean handle (strip optional leading @ and whitespace)
    function cleanHandle(val) {
      if (!val) return '';
      let trimmed = val.trim();
      if (trimmed.startsWith('@')) {
        trimmed = trimmed.substring(1).trim();
      }
      return trimmed;
    }

    // Handle regex: only letters, numbers, periods, and underscores, up to 30 chars
    const HANDLE_REGEX = /^[a-zA-Z0-9._]{1,30}$/;

    // State Accessors
    function getCheckpointState() {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY_CHECKPOINT);
        if (raw) return JSON.parse(raw);
      } catch (_) {}
      return {
        passed: false,
        step1: false,
        step2: false,
        step3: false,
        handles: ['', '', '', ''],
        step4: false,
        step5: false
      };
    }

    function saveCheckpointState(state) {
      try {
        sessionStorage.setItem(STORAGE_KEY_CHECKPOINT, JSON.stringify(state));
      } catch (_) {}
    }

    // Audit storage for Organizer Console
    function saveCollectedHandlesAudit(handlesArray) {
      const activeHandles = (handlesArray || []).filter(h => Boolean(h && h.trim()));
      if (activeHandles.length === 0) return;
      try {
        let list = [];
        const raw = sessionStorage.getItem(STORAGE_KEY_COLLECTED_HANDLES);
        if (raw) list = JSON.parse(raw);
        const existingIdx = list.findIndex(entry => entry.teamId === activeTeamId);
        const now = new Date();
        const timeStr = String(now.getUTCHours()).padStart(2, '0') + ':' +
                        String(now.getUTCMinutes()).padStart(2, '0') + ':' +
                        String(now.getUTCSeconds()).padStart(2, '0') + ' UTC';
        const record = {
          teamId: activeTeamId || 'TEAM-ALPHA',
          teamName: activeTeamId || 'Team Alpha',
          handles: activeHandles,
          timestamp: timeStr
        };
        if (existingIdx >= 0) {
          list[existingIdx] = record;
        } else {
          list.push(record);
        }
        sessionStorage.setItem(STORAGE_KEY_COLLECTED_HANDLES, JSON.stringify(list));
      } catch (_) {}
    }

    // Check overall progress and update Continue button state
    function updateOverallProgress() {
      const state = getCheckpointState();
      const enabledSteps = [
        state.step1,
        state.step2,
        REQUIRE_HANDLES ? state.step3 : true,
        REQUIRE_PROOF_CODE ? state.step4 : true,
        state.step5
      ];

      const completedCount = enabledSteps.filter(Boolean).length;
      const totalCount = enabledSteps.length;

      if (checkpointStepsCompletedCount) {
        checkpointStepsCompletedCount.textContent = `${completedCount}/${totalCount}`;
      }

      const allDone = (completedCount === totalCount);

      if (continueToRound2Btn) {
        if (allDone) {
          continueToRound2Btn.removeAttribute('disabled');
          continueToRound2Btn.classList.remove('locked-btn');
          if (checkpointStatusLed) {
            checkpointStatusLed.className = 'pill-dot green-dot';
          }
          if (checkpointStatusText) {
            checkpointStatusText.textContent = 'CHANNEL READY // ACCESS AUTHORIZED';
            checkpointStatusText.className = 'text-green';
          }
        } else {
          continueToRound2Btn.setAttribute('disabled', 'true');
          continueToRound2Btn.classList.add('locked-btn');
          if (checkpointStatusLed) {
            checkpointStatusLed.className = 'pill-dot red-dot';
          }
          if (checkpointStatusText) {
            checkpointStatusText.textContent = 'CHANNEL ENCRYPTED';
            checkpointStatusText.className = 'text-red';
          }
        }
      }
    }

    // --- STEP 1: OPEN INSTAGRAM ---
    function markStep1Done() {
      const state = getCheckpointState();
      state.step1 = true;
      saveCheckpointState(state);

      if (step1CheckIcon) {
        step1CheckIcon.textContent = '✓';
        step1CheckIcon.className = 'step-check ticked';
      }
      if (step1StatusTag) {
        step1StatusTag.textContent = 'TRANSMITTED // LINK OPENED';
        step1StatusTag.className = 'step-status-tag text-green';
      }
      if (step1Item) step1Item.classList.add('ticked');
      updateOverallProgress();
    }

    function handleOpenInstagram() {
      lastIgClickTime = Date.now();
      tabHiddenStartTime = 0;

      if (step1StatusTag) {
        step1StatusTag.textContent = 'TRANSMITTING // AWAITING RETURN';
        step1StatusTag.className = 'step-status-tag text-yellow';
      }
      if (awayStatusMsg && !getCheckpointState().step2) {
        awayStatusMsg.innerHTML = '<span class="text-yellow">Telemetry stream active. Follow @kapidhwaj.innovations on Instagram, then return to this tab...</span>';
      }

      let popupBlocked = false;
      try {
        const win = window.open(IG_URL, '_blank', 'noopener,noreferrer');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          popupBlocked = true;
        }
      } catch (e) {
        popupBlocked = true;
      }

      if (popupBlocked && igPopupFallback) {
        igPopupFallback.classList.remove('hidden');
      } else if (igPopupFallback) {
        igPopupFallback.classList.add('hidden');
      }

      markStep1Done();
      audio.keyClick();
    }

    if (openInstagramBtn) {
      openInstagramBtn.addEventListener('click', handleOpenInstagram);
    }

    // Support clicking fallback link
    if (igPopupFallback) {
      const fallbackLink = igPopupFallback.querySelector('a');
      if (fallbackLink) {
        fallbackLink.addEventListener('click', () => {
          lastIgClickTime = Date.now();
          tabHiddenStartTime = 0;
          markStep1Done();
        });
      }
    }

    // --- STEP 2: AWAY CHECK (VISIBILITY CHANGE TELEMETRY) ---
    document.addEventListener('visibilitychange', () => {
      const state = getCheckpointState();
      if (state.step2 || isScanningAway) return;

      if (document.visibilityState === 'hidden') {
        if (lastIgClickTime > 0) {
          tabHiddenStartTime = Date.now();
        }
      } else if (document.visibilityState === 'visible') {
        if (lastIgClickTime > 0 && tabHiddenStartTime > 0) {
          const hiddenSeconds = (Date.now() - tabHiddenStartTime) / 1000;
          tabHiddenStartTime = 0; // Prevent duplicate triggers

          if (hiddenSeconds < MIN_AWAY_SECONDS) {
            // Returned too soon
            audio.errorBuzz();
            if (awayStatusMsg) {
              awayStatusMsg.innerHTML = '<span class="text-red">SIGNAL NOT CONFIRMED. Follow the account first, then come back.</span>';
              awayStatusMsg.classList.remove('shake-text');
              void awayStatusMsg.offsetWidth;
              awayStatusMsg.classList.add('shake-text');
            }
            // Require clicking OPEN INSTAGRAM again
            state.step1 = false;
            saveCheckpointState(state);
            lastIgClickTime = 0;

            if (step1CheckIcon) {
              step1CheckIcon.textContent = '◻';
              step1CheckIcon.className = 'step-check';
            }
            if (step1StatusTag) {
              step1StatusTag.textContent = 'RE-TRANSMISSION REQUIRED';
              step1StatusTag.className = 'step-status-tag text-red';
            }
            if (step1Item) step1Item.classList.remove('ticked');
            updateOverallProgress();
          } else {
            // Valid away duration! Play 2-second scan animation
            isScanningAway = true;
            if (awayScanBox) awayScanBox.classList.remove('hidden');
            if (awayStatusMsg) awayStatusMsg.classList.add('hidden');
            audio.keyClick();

            setTimeout(() => {
              isScanningAway = false;
              if (awayScanBox) awayScanBox.classList.add('hidden');
              if (awayStatusMsg) {
                awayStatusMsg.classList.remove('hidden');
                // Strict rule: Success copy says "SIGNAL CONFIRMED", never "FOLLOW VERIFIED"
                awayStatusMsg.innerHTML = '<span class="text-green">✓ SIGNAL CONFIRMED // TELEMETRY LINK ACTIVE</span>';
              }
              state.step2 = true;
              saveCheckpointState(state);

              if (step2CheckIcon) {
                step2CheckIcon.textContent = '✓';
                step2CheckIcon.className = 'step-check ticked';
              }
              if (step2Item) step2Item.classList.add('ticked');

              audio.successChime();
              updateOverallProgress();
            }, 2000);
          }
        }
      }
    });

    // --- STEP 3: TEAM INSTAGRAM HANDLES ---
    function validateAndSyncHandles() {
      if (!REQUIRE_HANDLES) return true;

      const h1 = cleanHandle(teamHandleInputs[0] ? teamHandleInputs[0].value : '');
      const h2 = cleanHandle(teamHandleInputs[1] ? teamHandleInputs[1].value : '');
      const h3 = cleanHandle(teamHandleInputs[2] ? teamHandleInputs[2].value : '');
      const h4 = cleanHandle(teamHandleInputs[3] ? teamHandleInputs[3].value : '');

      let isValid = true;
      let errorMsg = '';

      // Member 1 is required
      if (!h1) {
        isValid = false;
      } else if (!HANDLE_REGEX.test(h1)) {
        isValid = false;
        errorMsg = 'Member 1 handle invalid (letters, numbers, periods, underscores only, max 30 chars).';
      }

      // Optional members 2, 3, 4
      const optionals = [h2, h3, h4];
      for (let i = 0; i < optionals.length; i++) {
        const opt = optionals[i];
        if (opt && !HANDLE_REGEX.test(opt)) {
          isValid = false;
          errorMsg = `Member ${i + 2} handle contains invalid characters.`;
          break;
        }
      }

      const state = getCheckpointState();
      const handlesList = [h1, h2, h3, h4];
      state.handles = handlesList;
      state.step3 = isValid;
      saveCheckpointState(state);

      if (step3CheckIcon) {
        step3CheckIcon.textContent = isValid ? '✓' : '◻';
        step3CheckIcon.className = isValid ? 'step-check ticked' : 'step-check';
      }
      if (step3Item) {
        step3Item.classList.toggle('ticked', isValid);
      }

      if (handlesFeedback) {
        if (errorMsg) {
          handlesFeedback.innerHTML = `<span class="text-red">${escapeHtml(errorMsg)}</span>`;
        } else if (isValid) {
          handlesFeedback.innerHTML = '<span class="text-green">✓ Valid Instagram team handles registered.</span>';
        } else {
          handlesFeedback.innerHTML = 'Accepts letters, numbers, periods, and underscores (max 30 characters).';
        }
      }

      if (isValid) {
        saveCollectedHandlesAudit(handlesList);
      }

      updateOverallProgress();
      return isValid;
    }

    teamHandleInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', validateAndSyncHandles);
        input.addEventListener('blur', validateAndSyncHandles);
      }
    });

    // --- STEP 4: PROOF CODE VERIFICATION ---
    if (sponsorProofForm) {
      sponsorProofForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!REQUIRE_PROOF_CODE) return;
        if (proofCooldownActive) return;

        const rawVal = sponsorProofCodeInput ? sponsorProofCodeInput.value : '';
        const normalized = normalizeProofCode(rawVal);

        if (!normalized) {
          if (sponsorProofFeedback) {
            sponsorProofFeedback.innerHTML = '<span class="text-red">Please enter the classified code.</span>';
          }
          return;
        }

        const hash = await computeSha256(normalized);
        if (hash === PROOF_HASH) {
          // VALID CODE
          const state = getCheckpointState();
          state.step4 = true;
          saveCheckpointState(state);

          if (step4CheckIcon) {
            step4CheckIcon.textContent = '✓';
            step4CheckIcon.className = 'step-check ticked';
          }
          if (step4Item) step4Item.classList.add('ticked');

          if (sponsorProofFeedback) {
            sponsorProofFeedback.innerHTML = '<span class="text-green">✓ KEY VALIDATED // ACCESS AUTHORIZED</span>';
          }
          if (sponsorProofCodeInput) {
            sponsorProofCodeInput.disabled = true;
          }
          if (sponsorProofSubmitBtn) {
            sponsorProofSubmitBtn.disabled = true;
            const btnTextEl = sponsorProofSubmitBtn.querySelector('.btn-text');
            if (btnTextEl) btnTextEl.textContent = 'KEY VALIDATED';
          }

          audio.successChime();
          updateOverallProgress();
        } else {
          // WRONG CODE: Show "INVALID KEY", unlimited retries with 3-second cooldown
          audio.errorBuzz();
          if (sponsorProofFeedback) {
            sponsorProofFeedback.innerHTML = '<span class="text-red">INVALID KEY</span>';
          }
          if (sponsorProofCodeInput) {
            sponsorProofCodeInput.classList.remove('input-error-shake');
            void sponsorProofCodeInput.offsetWidth;
            sponsorProofCodeInput.classList.add('input-error-shake');
          }

          proofCooldownActive = true;
          if (sponsorProofSubmitBtn) {
            sponsorProofSubmitBtn.disabled = true;
            let cooldownSecs = 3;
            const btnTextEl = sponsorProofSubmitBtn.querySelector('.btn-text');
            if (btnTextEl) btnTextEl.textContent = `COOLDOWN (${cooldownSecs}s)`;

            const timer = setInterval(() => {
              cooldownSecs--;
              if (cooldownSecs > 0) {
                if (btnTextEl) btnTextEl.textContent = `COOLDOWN (${cooldownSecs}s)`;
              } else {
                clearInterval(timer);
                proofCooldownActive = false;
                sponsorProofSubmitBtn.disabled = false;
                if (btnTextEl) btnTextEl.textContent = 'VERIFY CODE';
              }
            }, 1000);
          }
        }
      });
    }

    // --- STEP 5: TEAM ATTESTATION CHECKBOX ---
    if (sponsorFollowCheckbox) {
      sponsorFollowCheckbox.addEventListener('change', () => {
        const isChecked = sponsorFollowCheckbox.checked;
        const state = getCheckpointState();
        state.step5 = isChecked;
        saveCheckpointState(state);

        if (step5CheckIcon) {
          step5CheckIcon.textContent = isChecked ? '✓' : '◻';
          step5CheckIcon.className = isChecked ? 'step-check ticked' : 'step-check';
        }
        if (step5Item) {
          step5Item.classList.toggle('ticked', isChecked);
        }

        if (isChecked) audio.keyClick();
        updateOverallProgress();
      });
    }

    // --- CONTINUE TO ROUND 2 ACTION ---
    if (continueToRound2Btn) {
      continueToRound2Btn.addEventListener('click', () => {
        const state = getCheckpointState();
        const enabledSteps = [
          state.step1,
          state.step2,
          REQUIRE_HANDLES ? state.step3 : true,
          REQUIRE_PROOF_CODE ? state.step4 : true,
          state.step5
        ];

        if (enabledSteps.filter(Boolean).length < enabledSteps.length && !adminOverrideActive) {
          showToast('Complete all checkpoint verification steps first.', 'warning');
          audio.errorBuzz();
          return;
        }

        // Mark checkpoint passed permanently in session
        state.passed = true;
        saveCheckpointState(state);

        audio.successChime();
        triggerChannelDecryptedGlitch(() => {
          if (window.CutscenePlayer && !window.CutscenePlayer.hasWatched('cutscene-2-partB')) {
            window.CutscenePlayer.playCutscene2(() => {
              goToSection(3, true);
            });
          } else {
            goToSection(3, true);
          }
        });
      });
    }

    function triggerChannelDecryptedGlitch(callback) {
      const heading = document.querySelector('#section-checkpoint h2');
      const origText = heading ? heading.getAttribute('data-text') : 'ENCRYPTED CHANNEL LOCKED';
      if (heading) {
        heading.setAttribute('data-text', 'CHANNEL DECRYPTED');
        heading.textContent = 'CHANNEL DECRYPTED';
        heading.className = 'glitch-text text-green glitch-flicker-trigger';
      }

      const overlay = document.createElement('div');
      overlay.className = 'checkpoint-glitch-overlay';
      document.body.appendChild(overlay);

      if (window.gsap) {
        gsap.to(overlay, {
          opacity: 0.9,
          duration: 0.18,
          repeat: 3,
          yoyo: true,
          onComplete: () => {
            overlay.remove();
            if (heading) {
              heading.setAttribute('data-text', origText);
              heading.textContent = origText;
              heading.className = 'glitch-text text-red';
            }
            if (callback) callback();
          }
        });
      } else {
        setTimeout(() => {
          overlay.remove();
          if (heading) {
            heading.setAttribute('data-text', origText);
            heading.textContent = origText;
            heading.className = 'glitch-text text-red';
          }
          if (callback) callback();
        }, 800);
      }
    }

    // --- RESTORE CHECKPOINT STATE (PAGE REFRESH PERSISTENCE) ---
    function restoreCheckpointUi() {
      const state = getCheckpointState();

      if (state.step1) {
        if (step1CheckIcon) {
          step1CheckIcon.textContent = '✓';
          step1CheckIcon.className = 'step-check ticked';
        }
        if (step1StatusTag) {
          step1StatusTag.textContent = 'TRANSMITTED // LINK OPENED';
          step1StatusTag.className = 'step-status-tag text-green';
        }
        if (step1Item) step1Item.classList.add('ticked');
      }

      if (state.step2) {
        if (step2CheckIcon) {
          step2CheckIcon.textContent = '✓';
          step2CheckIcon.className = 'step-check ticked';
        }
        if (awayStatusMsg) {
          awayStatusMsg.innerHTML = '<span class="text-green">✓ SIGNAL CONFIRMED // TELEMETRY LINK ACTIVE</span>';
        }
        if (step2Item) step2Item.classList.add('ticked');
      }

      if (Array.isArray(state.handles)) {
        state.handles.forEach((h, idx) => {
          if (teamHandleInputs[idx]) {
            teamHandleInputs[idx].value = h || '';
          }
        });
        if (state.step3) {
          if (step3CheckIcon) {
            step3CheckIcon.textContent = '✓';
            step3CheckIcon.className = 'step-check ticked';
          }
          if (step3Item) step3Item.classList.add('ticked');
          if (handlesFeedback) {
            handlesFeedback.innerHTML = '<span class="text-green">✓ Valid Instagram team handles registered.</span>';
          }
        }
      }

      if (state.step4) {
        if (step4CheckIcon) {
          step4CheckIcon.textContent = '✓';
          step4CheckIcon.className = 'step-check ticked';
        }
        if (step4Item) step4Item.classList.add('ticked');
        if (sponsorProofFeedback) {
          sponsorProofFeedback.innerHTML = '<span class="text-green">✓ KEY VALIDATED // ACCESS AUTHORIZED</span>';
        }
        if (sponsorProofCodeInput) {
          sponsorProofCodeInput.value = '••••••••••••';
          sponsorProofCodeInput.disabled = true;
        }
        if (sponsorProofSubmitBtn) {
          sponsorProofSubmitBtn.disabled = true;
          const btnTextEl = sponsorProofSubmitBtn.querySelector('.btn-text');
          if (btnTextEl) btnTextEl.textContent = 'KEY VALIDATED';
        }
      }

      if (state.step5) {
        if (sponsorFollowCheckbox) sponsorFollowCheckbox.checked = true;
        if (step5CheckIcon) {
          step5CheckIcon.textContent = '✓';
          step5CheckIcon.className = 'step-check ticked';
        }
        if (step5Item) step5Item.classList.add('ticked');
      }

      updateOverallProgress();
    }

    // Expose helpers on window for Organizer Panel interaction
    window._sponsorCheckpoint = {
      restore: restoreCheckpointUi,
      reset: () => {
        sessionStorage.removeItem(STORAGE_KEY_CHECKPOINT);
        lastIgClickTime = 0;
        tabHiddenStartTime = 0;
        if (openInstagramBtn) openInstagramBtn.disabled = false;
        if (step1CheckIcon) { step1CheckIcon.textContent = '◻'; step1CheckIcon.className = 'step-check'; }
        if (step1StatusTag) { step1StatusTag.textContent = 'AWAITING TRANSMISSION'; step1StatusTag.className = 'step-status-tag'; }
        if (step1Item) step1Item.classList.remove('ticked');

        if (step2CheckIcon) { step2CheckIcon.textContent = '◻'; step2CheckIcon.className = 'step-check'; }
        if (step2Item) step2Item.classList.remove('ticked');
        if (awayStatusMsg) awayStatusMsg.textContent = 'Signal idle. Click "OPEN INSTAGRAM" above to begin signal transmission.';

        teamHandleInputs.forEach(inp => { if (inp) inp.value = ''; });
        if (step3CheckIcon) { step3CheckIcon.textContent = '◻'; step3CheckIcon.className = 'step-check'; }
        if (step3Item) step3Item.classList.remove('ticked');
        if (handlesFeedback) handlesFeedback.textContent = 'Accepts letters, numbers, periods, and underscores (max 30 characters).';

        if (sponsorProofCodeInput) {
          sponsorProofCodeInput.value = '';
          sponsorProofCodeInput.disabled = false;
        }
        if (sponsorProofSubmitBtn) {
          sponsorProofSubmitBtn.disabled = false;
          const btnTxt = sponsorProofSubmitBtn.querySelector('.btn-text');
          if (btnTxt) btnTxt.textContent = 'VERIFY CODE';
        }
        if (step4CheckIcon) { step4CheckIcon.textContent = '◻'; step4CheckIcon.className = 'step-check'; }
        if (step4Item) step4Item.classList.remove('ticked');
        if (sponsorProofFeedback) sponsorProofFeedback.textContent = '';

        if (sponsorFollowCheckbox) sponsorFollowCheckbox.checked = false;
        if (step5CheckIcon) { step5CheckIcon.textContent = '◻'; step5CheckIcon.className = 'step-check'; }
        if (step5Item) step5Item.classList.remove('ticked');

        updateOverallProgress();
      },
      skip: () => {
        const state = getCheckpointState();
        state.passed = true;
        state.step1 = true;
        state.step2 = true;
        state.step3 = true;
        state.step4 = true;
        state.step5 = true;
        saveCheckpointState(state);
        restoreCheckpointUi();
      }
    };

    restoreCheckpointUi();
  }

  // ==========================================================================
  // 8. SECTION 3: ROUND 2 — VIRTUAL MAILBOX (PRIORITY INTERACTIVE CLIENT)
  // ==========================================================================
  
  // Exact 21 emails provided in the specification with appended credentials
  const emails = [
    {
      "id": 0,
      "sender_name": "Microsoft Account Team",
      "sender_email": "account-security@microsoft.com",
      "subject": "New sign-in to your Microsoft account",
      "body": "Hello,\n\nWe detected a new sign-in to your Microsoft account from a Windows device in Noida, India on October 1, 2026. If this was you, no further action is needed.\n\nIf you don't recognize this activity, we recommend reviewing your recent sign-in activity and updating your password from your account security settings.\n\nSecurity Case ID: CYB-2026-ALPHA\nVerification Code: 482-917\n\nThank you,\nMicrosoft Account Team"
    },
    {
      "id": 1,
      "sender_name": "Microsoft Support",
      "sender_email": "security@microsot-support.com",
      "subject": "Your account access will be limited",
      "body": "Dear User,\n\nWe noticed unusual sign-in attempts on your Microsoft account. To avoid limited access, please verify your identity within 24 hours by confirming your details through the secure link below.\n\nSecurity Case ID: CYB-2026-BRAVO\nVerification Code: 391-604\n\nRegards,\nMicrosoft Support Team"
    },
    {
      "id": 2,
      "sender_name": "Microsoft Security Team",
      "sender_email": "support@microsoftsecurity.com",
      "subject": "Security Alert: Verify Your Identity",
      "body": "Hello,\n\nOur systems flagged suspicious activity on your account. Please verify your identity immediately to prevent suspension. Click below to confirm your password and security questions.\n\nSecurity Case ID: CYB-2026-ALPHA\nVerification Code: 482-971\n\nMicrosoft Security Team"
    },
    {
      "id": 3,
      "sender_name": "Microsoft Alerts",
      "sender_email": "admin@micros0ftalert.com",
      "subject": "Account Alert – Action Required",
      "body": "Hi,\n\nYour account has been flagged for unusual activity. Please log in and confirm your recovery email and phone number to keep your account active. Failure to respond may result in temporary suspension.\n\nSecurity Case ID: CYB-2O26-ALPHA\nVerification Code: 482-917\n\nMicrosoft Alerts"
    },
    {
      "id": 4,
      "sender_name": "Microsoft Verification Team",
      "sender_email": "security@microsoftverify.com",
      "subject": "Verify Your Account Now",
      "body": "Dear Customer,\n\nAs part of our routine security check, we require you to verify your account information. Please confirm your current password to continue using all Microsoft services without interruption.\n\nSecurity Case ID: CYB-2026-ALPHA\nVerification Code: 428-917\n\nMicrosoft Verification Team"
    },
    {
      "id": 5,
      "sender_name": "Microsoft Login Team",
      "sender_email": "notifications@microsoft-login.com",
      "subject": "New Login Detected From Unknown Device",
      "body": "Hello,\n\nWe detected a login from a device we don't recognize. If this wasn't you, click below immediately to secure your account before it gets locked. Note: this notification will expire in 1 hour.\n\nSecurity Case ID: CYB-2026-DELTA\nVerification Code: 715-382\n\nMicrosoft Login Team"
    },
    {
      "id": 6,
      "sender_name": "Microsoft Secure Services",
      "sender_email": "account@microsoftsecure.com",
      "subject": "Important: Your Account Needs Attention",
      "body": "Hi there,\n\nOur security system has detected irregular activity linked to your account. For your safety, please re-enter your login credentials to restore full access.\n\nSecurity Case ID: CYB-2026-ALPHA-1\nVerification Code: 482-917\n\nThank you for your cooperation,\nMicrosoft Secure Services"
    },
    {
      "id": 7,
      "sender_name": "Microsoft 365 Help Desk",
      "sender_email": "support@microsoft365help.com",
      "subject": "Your Microsoft 365 Subscription Needs Verification",
      "body": "Dear User,\n\nThere is an issue with your Microsoft 365 subscription that requires immediate verification of your payment and account details. Please update your information within 48 hours to avoid service interruption.\n\nSecurity Case ID: CYB-2026-ECHO\nVerification Code: 264-538\n\nMicrosoft 365 Help Desk"
    },
    {
      "id": 8,
      "sender_name": "Microsoft Authentication Team",
      "sender_email": "security@microsoft-auth.com",
      "subject": "Authentication Required: Unusual Sign-in Pattern",
      "body": "Hello,\n\nWe've noticed sign-in attempts that don't match your usual pattern. To protect your account, please complete a quick identity confirmation by replying with the one-time code sent to your registered number.\n\nSecurity Case ID: CYB-2025-ALPHA\nVerification Code: 482-917\n\nMicrosoft Authentication Team"
    },
    {
      "id": 9,
      "sender_name": "Microsoft Update Team",
      "sender_email": "admin@microsoftupdate.com",
      "subject": "Critical Update Required for Your Account",
      "body": "Hi,\n\nYour account requires a critical security update to remain protected against recent threats. Please confirm your current credentials so we can apply the update without interrupting your access.\n\nSecurity Case ID: CYB-2026-SIGMA\nVerification Code: 903-216\n\nMicrosoft Update Team"
    },
    {
      "id": 10,
      "sender_name": "Microsoft Account Notifications",
      "sender_email": "notifications@microsoftaccount.com",
      "subject": "Confirm Recent Activity on Your Account",
      "body": "Dear Customer,\n\nWe noticed recent activity on your account that needs confirmation. Please verify by entering your account password and security PIN on the page linked below within the next few hours.\n\nSecurity Case ID: CYB-2026-OMEGA\nVerification Code: 157-740\n\nMicrosoft Account Notifications"
    },
    {
      "id": 11,
      "sender_name": "Microsoft Security",
      "sender_email": "microsoftsecurity123@gmail.com",
      "subject": "URGENT!!! YOUR ACCOUNT WILL BE DELETED",
      "body": "WARNING!!! Your Microsoft account will be PERMANENTLY DELETED in 1 HOUR unless you send your password and date of birth to this email RIGHT NOW. Act fast!!!\n\nCase ID: CYB-0000-HACK\nCode: 000-000\n\n- Microsoft Security"
    },
    {
      "id": 12,
      "sender_name": "Microsoft Support Team",
      "sender_email": "microsoftsupport@outlook.com",
      "subject": "Congratulations! You've Won a Free Upgrade",
      "body": "Hello Winner,\n\nYou have been randomly selected to receive a FREE lifetime upgrade to Microsoft 365 Premium! Reply with your login details to claim your prize before it expires today.\n\nCase ID: FREE-UPGRADE-2026\nCode: 123-456\n\nMicrosoft Support Team"
    },
    {
      "id": 13,
      "sender_name": "Microsoft Team",
      "sender_email": "microsoft.security@yahoo.com",
      "subject": "your acount has prblem plz fix now",
      "body": "dear costumer your acount have securty prblem. click link and put ur password and card number to fix. do fast or acount close.\n\nCase ID: ACCT-PROBLM-99\nCode: 111-222\n\nthank you microsoft team"
    },
    {
      "id": 14,
      "sender_name": "Microsoft Legal Dept",
      "sender_email": "officialmicrosoft@proton.me",
      "subject": "Official Notice From Microsoft HQ",
      "body": "This is an OFFICIAL message from Microsoft Headquarters. Your account has violated our terms. Pay a $50 verification fee immediately by gift card to avoid legal action. Reply with gift card codes to this email.\n\nCase ID: HQ-LEGAL-5000\nCode: 777-777\n\nMicrosoft Legal Dept."
    },
    {
      "id": 15,
      "sender_name": "Microsoft Help Desk",
      "sender_email": "microsofthelpdesk@gmail.com",
      "subject": "Your Password Expires Today - Click Now",
      "body": "Hi, your password is about to expire TODAY. Click the attached file right now and enter your old and new password to avoid losing access forever. Don't wait, do it now!!!\n\nCase ID: EXPIRE-NOW-01\nCode: 999-999\n\nMicrosoft Help Desk"
    },
    {
      "id": 16,
      "sender_name": "Microsft Team",
      "sender_email": "microsftsecurity@outlook.com",
      "subject": "Acount Secrity Alret",
      "body": "hello we form microsft. your acount has secrity alret. send us your password and otp code now too fix problem before acount get ban forever. reply fast.\n\nCase ID: SECRITY-ALRT-7\nCode: 314-159\n\nmicrosft team"
    },
    {
      "id": 17,
      "sender_name": "Microsoft Admin Team",
      "sender_email": "microsoft_admin_2026@gmail.com",
      "subject": "FINAL WARNING: Suspicious Login From Russia",
      "body": "FINAL WARNING!!! Someone from Russia tried to log into your account 47 times. If you don't confirm your password in the next 10 minutes, your account AND all your files will be deleted forever. Reply NOW.\n\nCase ID: RUSSIA-HACK-47\nCode: 666-666\n\nMicrosoft Admin Team"
    },
    {
      "id": 18,
      "sender_name": "Microsoft Emergency Response",
      "sender_email": "securitymicrosoft@icloud.com",
      "subject": "Your Microsoft Account Is Compromised - Act Immediately",
      "body": "Dear Sir/Madam,\n\nHackers have accessed your account. Download the attached security tool and run it on your computer immediately, then enter your password when prompted to remove the hackers.\n\nCase ID: HACKED-URGENT-1\nCode: 404-404\n\nMicrosoft Emergency Response"
    },
    {
      "id": 19,
      "sender_name": "Microsoft Rewards Team",
      "sender_email": "microsoftverify123@yahoo.com",
      "subject": "Claim Your Microsoft Reward Points Before They Expire",
      "body": "You have 50,000 unclaimed Microsoft reward points!!! Click here, log in with your email and password on our special rewards page, and claim your gift card before midnight tonight!\n\nCase ID: REWARD-50000\nCode: 888-888\n\nMicrosoft Rewards Team"
    },
    {
      "id": 20,
      "sender_name": "Real Microsoft Support",
      "sender_email": "realmicrosoftsupport@mail.com",
      "subject": "This Is Not a Scam - Verify Your Real Account",
      "body": "Hi, we know you might think this is fake but THIS IS 100% REAL. Please send your password, backup email password, and phone PIN to this address so our real support team can verify you are the real account owner.\n\nCase ID: 100-PCT-REAL\nCode: 101-010\n\nThank you,\nReal Microsoft Support"
    }
  ];

  // Fisher-Yates shuffle implementation
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let globalOpenAdminConsole = null;
  let shuffledEmails = [];
  let selectedEmail = null;
  let currentFolder = 'inbox'; // 'inbox' | 'shortlist' | 'trash'
  const readEmailIds = new Set();

  const timestamps = [
    '02:47 AM', '02:41 AM', '02:35 AM', '02:28 AM', '02:19 AM',
    '02:11 AM', '01:58 AM', '01:45 AM', '01:32 AM', '01:20 AM',
    '01:05 AM', '12:54 AM', '12:40 AM', '12:22 AM', '12:05 AM',
    'Yesterday', 'Yesterday', 'Oct 1', 'Oct 1', 'Sep 30', 'Sep 30'
  ];

  // Folder state in sessionStorage
  function getFolderState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_FOLDERS);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveFolderState(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(state));
    } catch (e) {}
  }

  function getEmailFolder(emailId) {
    const state = getFolderState();
    return state[emailId] || 'inbox';
  }

  function setEmailFolder(emailId, targetFolder) {
    const state = getFolderState();
    state[emailId] = targetFolder;
    saveFolderState(state);
    updateFolderCounts();
  }

  function updateFolderCounts() {
    const state = getFolderState();
    let inboxCount = 0;
    let shortlistCount = 0;
    let trashCount = 0;

    emails.forEach(e => {
      const f = state[e.id] || 'inbox';
      if (f === 'inbox') inboxCount++;
      else if (f === 'shortlist') shortlistCount++;
      else if (f === 'trash') trashCount++;
    });

    const cInbox = document.getElementById('countInbox');
    const cShortlist = document.getElementById('countShortlist');
    const cTrash = document.getElementById('countTrash');

    if (cInbox) cInbox.textContent = inboxCount;
    if (cShortlist) cShortlist.textContent = shortlistCount;
    if (cTrash) cTrash.textContent = trashCount;
  }

  // Attempt Management in localStorage
  function getAttemptsLeft() {
    try {
      const val = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
      if (val === null) return MAX_ATTEMPTS;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? MAX_ATTEMPTS : Math.max(0, Math.min(MAX_ATTEMPTS, parsed));
    } catch (e) {
      return MAX_ATTEMPTS;
    }
  }

  function setAttemptsLeft(num) {
    const val = Math.max(0, Math.min(MAX_ATTEMPTS, num));
    try {
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, val.toString());
    } catch (e) {}
    renderAttemptPips(val);
    checkLockoutState(val);
    return val;
  }

  function renderAttemptPips(val) {
    const pipsContainer = document.getElementById('secAttemptPips');
    if (!pipsContainer) return;
    pipsContainer.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const pip = document.createElement('span');
      pip.className = 'pip' + (i < val ? ' filled' : '');
      pipsContainer.appendChild(pip);
    }
  }

  function checkLockoutState(attempts) {
    const overlay = document.getElementById('mailboxLockoutOverlay');
    if (!overlay) return;
    if (attempts <= 0) {
      overlay.classList.remove('hidden');
      audio.glitchZap();
    } else {
      overlay.classList.add('hidden');
    }
  }

  // Normalization helper
  function normalizeCredential(val) {
    return (val || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  // Reset & Reshuffle Round 2 Mailbox
  function resetMailboxWithReshuffle(options = {}) {
    const restoreAttempts = options.restoreAttempts !== false;
    const announce = options.announce !== false;

    // 1. Restore attempts
    if (restoreAttempts) {
      setAttemptsLeft(MAX_ATTEMPTS);
    }

    // 2. Clear triage folder state in sessionStorage
    try {
      sessionStorage.removeItem(STORAGE_KEY_FOLDERS);
    } catch (e) {}

    // 3. Reset internal tracking
    readEmailIds.clear();
    selectedEmail = null;
    currentFolder = 'inbox';

    // 4. Randomly reshuffle emails array (Fisher-Yates)
    shuffledEmails = shuffle(emails);

    // 5. Reset Folder tabs UI
    const folderButtons = [
      { id: 'folderBtnInbox', folder: 'inbox', title: '📥 INBOX SPOOL' },
      { id: 'folderBtnShortlist', folder: 'shortlist', title: '🔖 SHORTLISTED' },
      { id: 'folderBtnTrash', folder: 'trash', title: '🗑 TRASH SPOOL' }
    ];
    folderButtons.forEach(b => {
      const el = document.getElementById(b.id);
      if (el) el.classList.toggle('active', b.folder === 'inbox');
    });
    const titleEl = document.getElementById('currentFolderTitle');
    if (titleEl) titleEl.innerHTML = '<span class="folder-icon">📥</span> INBOX SPOOL';

    // 6. Reset search input
    const searchInput = document.getElementById('mailboxSearchInput');
    if (searchInput) searchInput.value = '';

    // 7. Reset reading pane
    const emptyPrompt = document.getElementById('emptyInboxPrompt');
    const emailView = document.getElementById('emailViewContainer');
    const revealCard = document.getElementById('caseIdRevealCard');
    if (emptyPrompt) emptyPrompt.classList.remove('hidden');
    if (emailView) emailView.classList.add('hidden');
    if (revealCard) revealCard.classList.add('hidden');

    // 8. Reset login inputs & feedback
    const caseIdInput = document.getElementById('secCaseIdInput');
    const codeInput = document.getElementById('secCodeInput');
    const feedback = document.getElementById('secFeedback');
    if (caseIdInput) caseIdInput.value = '';
    if (codeInput) codeInput.value = '';
    if (feedback) feedback.textContent = '';

    // 9. Hide lockout overlay
    checkLockoutState(restoreAttempts ? MAX_ATTEMPTS : getAttemptsLeft());

    // 10. Update folder counts and re-render list
    updateFolderCounts();
    renderEmailList();

    // Reset scroll positions
    const listContainer = document.getElementById('emailListContainer');
    if (listContainer) listContainer.scrollTop = 0;
    const readingPane = document.getElementById('readingPane');
    if (readingPane) readingPane.scrollTop = 0;

    // Mobile shell reset
    const shell = document.getElementById('mailboxShell');
    if (shell) shell.classList.remove('viewing-email');

    // 11. Audio chime & feedback
    if (announce) {
      audio.successChime();
      showToast('✓ INBOX RESHUFFLED // 3/3 ATTEMPTS RESTORED', 'success');
    }
  }

  // Init Mailbox
  function initMailbox() {
    shuffledEmails = shuffle(emails);
    updateFolderCounts();
    renderAttemptPips(getAttemptsLeft());
    checkLockoutState(getAttemptsLeft());
    renderEmailList();

    // Folder navigation tabs
    const folderButtons = [
      { id: 'folderBtnInbox', folder: 'inbox', title: '📥 INBOX SPOOL' },
      { id: 'folderBtnShortlist', folder: 'shortlist', title: '🔖 SHORTLISTED' },
      { id: 'folderBtnTrash', folder: 'trash', title: '🗑 TRASH SPOOL' }
    ];

    folderButtons.forEach(fb => {
      const btn = document.getElementById(fb.id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        currentFolder = fb.folder;
        folderButtons.forEach(b => {
          const el = document.getElementById(b.id);
          if (el) el.classList.toggle('active', b.folder === currentFolder);
        });
        const titleEl = document.getElementById('currentFolderTitle');
        if (titleEl) titleEl.innerHTML = fb.title;
        renderEmailList();
        audio.keyClick();
      });
    });

    // Search filter
    const searchInput = document.getElementById('mailboxSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderEmailList(e.target.value.trim().toLowerCase());
      });
    }

    // Reader Toolbar Triage Buttons
    const readerShortlistBtn = document.getElementById('readerShortlistBtn');
    if (readerShortlistBtn) {
      readerShortlistBtn.addEventListener('click', () => {
        if (selectedEmail) triageEmail(selectedEmail.id, 'shortlist');
      });
    }

    const readerTrashBtn = document.getElementById('readerTrashBtn');
    if (readerTrashBtn) {
      readerTrashBtn.addEventListener('click', () => {
        if (selectedEmail) triageEmail(selectedEmail.id, 'trash');
      });
    }

    const readerRestoreBtn = document.getElementById('readerRestoreBtn');
    if (readerRestoreBtn) {
      readerRestoreBtn.addEventListener('click', () => {
        if (selectedEmail) triageEmail(selectedEmail.id, 'inbox');
      });
    }

    // Mobile Back Button (drill-down on <= 900px)
    const mobileBackBtn = document.getElementById('mobileBackBtn');
    if (mobileBackBtn) {
      mobileBackBtn.addEventListener('click', () => {
        const shell = document.getElementById('mailboxShell');
        if (shell) shell.classList.remove('viewing-email');
        audio.keyClick();
      });
    }

    // Secure Login Form Verification
    const secForm = document.getElementById('secLoginForm');
    if (secForm) {
      secForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const caseId = document.getElementById('secCaseIdInput').value;
        const code = document.getElementById('secCodeInput').value;
        await verifyCredentials(caseId, code);
      });
    }

    // Proceed to Round 3 Button
    const proceedToR3 = document.getElementById('proceedToRound3Btn');
    if (proceedToR3) {
      proceedToR3.addEventListener('click', () => {
        goToSection(4);
      });
    }

    // Lockout Screen Actions: Retry & Reshuffle Button
    const lockoutRetryBtn = document.getElementById('lockoutRetryReshuffleBtn');
    if (lockoutRetryBtn) {
      lockoutRetryBtn.addEventListener('click', () => {
        resetMailboxWithReshuffle({ restoreAttempts: true, announce: true });
      });
    }

    // Lockout Screen Actions: Call Organizer / Open Console
    const lockoutOrgBtn = document.getElementById('lockoutCallOrganizerBtn');
    if (lockoutOrgBtn) {
      lockoutOrgBtn.addEventListener('click', () => {
        if (typeof globalOpenAdminConsole === 'function') {
          globalOpenAdminConsole();
        }
      });
    }

    // Top Header: Reshuffle Button
    const mailboxReshuffleBtn = document.getElementById('mailboxReshuffleBtn');
    if (mailboxReshuffleBtn) {
      mailboxReshuffleBtn.addEventListener('click', () => {
        if (getAttemptsLeft() === 0) {
          resetMailboxWithReshuffle({ restoreAttempts: true, announce: true });
        } else {
          const ok = confirm('Restart Round 2? This will restore 3/3 attempts, reset triage folders, and randomly reshuffle all 21 emails.');
          if (ok) {
            resetMailboxWithReshuffle({ restoreAttempts: true, announce: true });
          }
        }
      });
    }
  }

  function renderEmailList(filterText = '') {
    const container = document.getElementById('emailListContainer');
    const emptyState = document.getElementById('emailListEmptyState');
    const emptyText = document.getElementById('emptyListText');
    if (!container) return;
    container.innerHTML = '';

    const folderEmails = shuffledEmails.filter(e => getEmailFolder(e.id) === currentFolder);

    let matchCount = 0;
    folderEmails.forEach((email) => {
      if (filterText) {
        const match = email.sender_name.toLowerCase().includes(filterText) ||
                      email.sender_email.toLowerCase().includes(filterText) ||
                      email.subject.toLowerCase().includes(filterText) ||
                      email.body.toLowerCase().includes(filterText);
        if (!match) return;
      }

      matchCount++;
      const item = document.createElement('div');
      item.className = 'email-item';
      item.setAttribute('data-id', email.id);

      const isRead = readEmailIds.has(email.id);
      item.classList.add(isRead ? 'read' : 'unread');

      if (selectedEmail && selectedEmail.id === email.id) {
        item.classList.add('active');
      }

      const timeStr = timestamps[email.id % timestamps.length];

      // Build hover triage action buttons based on current folder
      let actionButtonsHtml = '';
      if (currentFolder === 'inbox') {
        actionButtonsHtml = `
          <button class="row-triage-btn" data-triage="shortlist" title="Likely legitimate">🔖</button>
          <button class="row-triage-btn" data-triage="trash" title="Likely phishing">🗑</button>
        `;
      } else if (currentFolder === 'shortlist') {
        actionButtonsHtml = `
          <button class="row-triage-btn" data-triage="inbox" title="Restore to Inbox">↩</button>
          <button class="row-triage-btn" data-triage="trash" title="Move to Trash">🗑</button>
        `;
      } else if (currentFolder === 'trash') {
        actionButtonsHtml = `
          <button class="row-triage-btn" data-triage="inbox" title="Restore to Inbox">↩</button>
          <button class="row-triage-btn" data-triage="shortlist" title="Move to Shortlisted">🔖</button>
        `;
      }

      item.innerHTML = `
        <div class="email-item-header">
          <span class="email-item-sender">${escapeHtml(email.sender_name)}</span>
          <span class="email-item-time">${timeStr}</span>
        </div>
        <div class="email-item-subject">${escapeHtml(email.subject)}</div>
        <div class="email-item-preview">${escapeHtml(email.sender_email)}</div>
        <div class="email-item-actions">${actionButtonsHtml}</div>
      `;

      // Item click opens reading view
      item.addEventListener('click', () => {
        openEmail(email, timeStr, item);
      });

      // Row hover triage buttons click
      const actionBtns = item.querySelectorAll('.row-triage-btn');
      actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetF = btn.getAttribute('data-triage');
          triageEmail(email.id, targetF, item);
        });
      });

      container.appendChild(item);
    });

    if (emptyState && emptyText) {
      if (matchCount === 0) {
        emptyState.classList.remove('hidden');
        if (filterText) {
          emptyText.textContent = 'No matching transmissions found.';
        } else if (currentFolder === 'inbox') {
          emptyText.textContent = 'Inbox clear. All items triaged.';
        } else if (currentFolder === 'shortlist') {
          emptyText.textContent = 'No transmissions shortlisted yet.';
        } else if (currentFolder === 'trash') {
          emptyText.textContent = 'Trash spool is empty.';
        }
      } else {
        emptyState.classList.add('hidden');
      }
    }
  }

  function openEmail(email, timeStr, itemEl) {
    selectedEmail = email;
    readEmailIds.add(email.id);

    if (itemEl) {
      itemEl.classList.remove('unread');
      itemEl.classList.add('read');
      const allItems = document.querySelectorAll('.email-item');
      allItems.forEach(i => i.classList.remove('active'));
      itemEl.classList.add('active');
    }

    // Reset reading pane scroll to top immediately
    const readingPane = document.getElementById('readingPane');
    if (readingPane) {
      readingPane.scrollTop = 0;
    }

    // Drill-down for mobile/narrow screens (<= 900px)
    const mailboxShell = document.getElementById('mailboxShell');
    if (mailboxShell) {
      mailboxShell.classList.add('viewing-email');
    }

    // Populate reading view
    const emptyPrompt = document.getElementById('emptyInboxPrompt');
    const viewContainer = document.getElementById('emailViewContainer');
    if (emptyPrompt) emptyPrompt.classList.add('hidden');
    if (viewContainer) viewContainer.classList.remove('hidden');

    document.getElementById('viewSubject').textContent = email.subject;
    document.getElementById('viewSenderName').textContent = email.sender_name;
    document.getElementById('viewSenderEmail').textContent = `<${email.sender_email}>`;
    document.getElementById('viewTimestamp').textContent = timeStr + ' (UTC)';
    document.getElementById('viewBody').textContent = email.body;

    // Simulated SPF/DKIM flags
    const spfBadge = document.getElementById('viewSpfBadge');
    const dkimBadge = document.getElementById('viewDkimBadge');
    if (email.sender_email.endsWith('@microsoft.com')) {
      spfBadge.textContent = 'SPF: PASS';
      spfBadge.className = 'sec-badge spf-badge text-green';
      dkimBadge.textContent = 'DKIM: SIGNED';
      dkimBadge.className = 'sec-badge dkim-badge text-green';
    } else {
      spfBadge.textContent = 'SPF: FAIL / SUSPECT';
      spfBadge.className = 'sec-badge spf-badge text-red';
      dkimBadge.textContent = 'DKIM: UNTRUSTED DOMAIN';
      dkimBadge.className = 'sec-badge dkim-badge text-red';
    }

    // Sync toolbar buttons for current folder
    const curF = getEmailFolder(email.id);
    updateReaderToolbar(curF);

    audio.keyClick();
  }

  function updateReaderToolbar(folder) {
    const shortlistBtn = document.getElementById('readerShortlistBtn');
    const trashBtn = document.getElementById('readerTrashBtn');
    const restoreBtn = document.getElementById('readerRestoreBtn');

    if (!shortlistBtn || !trashBtn || !restoreBtn) return;

    if (folder === 'inbox') {
      shortlistBtn.classList.remove('hidden');
      trashBtn.classList.remove('hidden');
      restoreBtn.classList.add('hidden');
    } else if (folder === 'shortlist') {
      shortlistBtn.classList.add('hidden');
      trashBtn.classList.remove('hidden');
      restoreBtn.classList.remove('hidden');
    } else if (folder === 'trash') {
      shortlistBtn.classList.remove('hidden');
      trashBtn.classList.add('hidden');
      restoreBtn.classList.remove('hidden');
    }
  }

  function triageEmail(emailId, targetFolder, rowEl = null) {
    const currentF = getEmailFolder(emailId);
    if (currentF === targetFolder) return;

    function applyMove() {
      setEmailFolder(emailId, targetFolder);

      if (rowEl && rowEl.parentNode) {
        if (window.gsap) {
          gsap.to(rowEl, {
            x: -30,
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
              if (rowEl.parentNode) rowEl.parentNode.removeChild(rowEl);
              // Check if list is empty now
              const container = document.getElementById('emailListContainer');
              const emptyState = document.getElementById('emailListEmptyState');
              const emptyText = document.getElementById('emptyListText');
              if (container && (!container.children || container.children.length === 0)) {
                if (emptyState && emptyText) {
                  emptyState.classList.remove('hidden');
                  if (currentFolder === 'inbox') emptyText.textContent = 'Inbox clear. All items triaged.';
                  else if (currentFolder === 'shortlist') emptyText.textContent = 'No transmissions shortlisted yet.';
                  else if (currentFolder === 'trash') emptyText.textContent = 'Trash spool is empty.';
                }
              }
            }
          });
        } else {
          rowEl.parentNode.removeChild(rowEl);
        }
      } else {
        renderEmailList();
      }

      if (selectedEmail && selectedEmail.id === emailId) {
        updateReaderToolbar(targetFolder);
      }

      let label = 'Inbox';
      if (targetFolder === 'shortlist') label = 'Shortlisted';
      if (targetFolder === 'trash') label = 'Trash';

      showToast(`Moved to ${label}`, 'info', 4000, () => {
        // Undo move
        setEmailFolder(emailId, currentF);
        renderEmailList();
        if (selectedEmail && selectedEmail.id === emailId) {
          updateReaderToolbar(currentF);
        }
        showToast(`Restored to ${currentF === 'inbox' ? 'Inbox' : currentF}`, 'info');
      });
    }

    applyMove();
  }

  async function verifyCredentials(caseIdRaw, codeRaw) {
    const attempts = getAttemptsLeft();
    if (attempts <= 0) {
      checkLockoutState(0);
      return;
    }

    const caseId = (caseIdRaw || '').trim();
    const code = (codeRaw || '').trim();
    const feedbackEl = document.getElementById('secFeedback');
    const panel = document.getElementById('secureLoginPanel');

    // Empty or whitespace-only inputs show validation message without consuming an attempt
    if (!caseId || !code) {
      if (feedbackEl) {
        feedbackEl.textContent = 'ENTER CASE ID & VERIFICATION CODE';
        feedbackEl.className = 'sec-feedback text-yellow';
      }
      showToast('Please enter both Case ID and Verification Code', 'info');
      return;
    }

    const normalized = normalizeCredential(caseId) + '|' + normalizeCredential(code);
    const hash = await computeSha256(normalized);

    if (hash === TARGET_CREDENTIAL_HASH) {
      // Correct!
      if (feedbackEl) {
        feedbackEl.textContent = '✓ CREDENTIALS VERIFIED';
        feedbackEl.className = 'sec-feedback text-green';
      }
      triggerGlitchSuccessFlash();
      audio.successChime();
      showToast('✓ ACCESS GRANTED — Legitimate incident authenticated!', 'success');

      // Typewriter reveal of successful authentication
      const revealCard = document.getElementById('caseIdRevealCard');
      const typewriterTarget = document.getElementById('typewriterCaseId');
      if (revealCard) {
        revealCard.classList.remove('hidden');
        if (typewriterTarget) {
          typewriterTarget.textContent = '';
          const msg = 'AUTHENTICATION SUCCESSFUL // ACCESS GRANTED';
          let idx = 0;
          function typeMsg() {
            if (idx < msg.length) {
              typewriterTarget.textContent += msg.charAt(idx);
              idx++;
              audio.keyClick();
              setTimeout(typeMsg, 30);
            }
          }
          typeMsg();
        }
      }

      const proceedBtn = document.getElementById('proceedToRound3Btn');
      if (proceedBtn) {
        proceedBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } else {
      // Incorrect credentials — decrement attempt
      const newAttempts = setAttemptsLeft(attempts - 1);
      audio.errorBuzz();

      if (panel) {
        panel.classList.remove('shake-panel');
        void panel.offsetWidth;
        panel.classList.add('shake-panel');
      }

      if (feedbackEl) {
        feedbackEl.textContent = 'CREDENTIALS REJECTED';
        feedbackEl.className = 'sec-feedback text-red';
      }

      showToast(`CREDENTIALS REJECTED. Attempts remaining: ${newAttempts}`, 'error');

      if (newAttempts <= 0) {
        checkLockoutState(0);
      }
    }
  }

  // ==========================================================================
  // 9. SECTION 4: ROUND 3 — PASSWORD TERMINAL
  // ==========================================================================
  let attemptsRemaining = 10;
  let isLockedOut = false;
  let lockoutTimer = null;
  let isBruteForcing = false;

  function initPasswordTerminal() {
    const form = document.getElementById('pwdTerminalForm');
    const proceedToR4 = document.getElementById('proceedToRound4Btn');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handlePasswordSubmit();
      });
    }

    if (proceedToR4) {
      proceedToR4.addEventListener('click', () => {
        goToSection(5);
      });
    }
  }

  async function handlePasswordSubmit() {
    if (isLockedOut || isBruteForcing) return;

    const input = document.getElementById('passwordInput');
    if (!input) return;
    const value = input.value.trim();

    if (!value) {
      showToast('⚠ Enter a passphrase attempt.', 'error');
      return;
    }

    isBruteForcing = true;
    input.disabled = true;

    // Show cosmetic ~1.5s brute force progress bar
    const bfContainer = document.getElementById('bruteforceContainer');
    const bfFill = document.getElementById('bfProgressFill');
    const bfPercent = document.getElementById('bfPercent');
    const bfStream = document.getElementById('bfStreamOutput');

    if (bfContainer) bfContainer.classList.remove('hidden');

    let progress = 0;
    const startTime = performance.now();
    const duration = 1500; // 1.5 seconds

    function stepProgress(time) {
      const elapsed = time - startTime;
      progress = Math.min(100, Math.floor((elapsed / duration) * 100));

      if (bfFill) bfFill.style.width = `${progress}%`;
      if (bfPercent) bfPercent.textContent = `${progress}%`;
      if (bfStream) {
        const randHex = Math.random().toString(16).substring(2, 10).toUpperCase();
        bfStream.textContent = `HASH: 0x${randHex}... TESTING SALT MATRICES...`;
      }

      if (Math.random() > 0.4) audio.keyClick();

      if (elapsed < duration) {
        requestAnimationFrame(stepProgress);
      } else {
        // Complete brute force check
        if (bfContainer) bfContainer.classList.add('hidden');
        input.disabled = false;
        isBruteForcing = false;
        input.focus();
        verifyPassword(value);
      }
    }

    requestAnimationFrame(stepProgress);
  }

  async function verifyPassword(val) {
    const input = document.getElementById('passwordInput');
    const logs = document.getElementById('pwdTerminalLogs');
    const successAction = document.getElementById('vaultSuccessAction');

    // SHA-256 hash validation
    const hash = await computeSha256(val);

    if (hash === TARGET_PASSWORD_HASH) {
      // SUCCESS!
      triggerGlitchSuccessFlash();
      audio.successChime();

      appendTerminalLog(logs, `[✓] AUTHENTICATION ACCEPTED: Passphrase hash verified.`, 'success');
      appendTerminalLog(logs, `[✓] CLEARANCE LEVEL 4 GRANTED // SECTOR 7 DECIPHERED.`, 'success');

      if (successAction) successAction.classList.remove('hidden');
      if (input) input.disabled = true;

      showToast('✓ VAULT UNLOCKED! Proceed to Round 4.', 'success');

    } else {
      // FAILURE!
      attemptsRemaining--;
      updateAttemptsDisplay();
      audio.errorBuzz();

      appendTerminalLog(logs, `[✗] ACCESS DENIED: Invalid key '${val}'. Hash signature mismatch.`, 'error');
      showToast(`⚠ ACCESS DENIED: Invalid passphrase. (${attemptsRemaining} attempts left)`, 'error');

      if (input) input.value = '';

      if (attemptsRemaining <= 0) {
        triggerLockout();
      }
    }
  }

  function appendTerminalLog(container, text, type = '') {
    if (!container) return;
    const line = document.createElement('div');
    line.className = `log-line ${type}`;
    line.textContent = `> ${text}`;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  }

  function updateAttemptsDisplay() {
    const countDisplay = document.getElementById('attemptsCountDisplay');
    const slots = document.getElementById('attemptsSlots');
    if (countDisplay) {
      countDisplay.textContent = `${attemptsRemaining} / 10`;
      countDisplay.className = attemptsRemaining <= 3 ? 'attempts-number text-red' : 'attempts-number text-green';
    }

    if (slots) {
      const pips = slots.querySelectorAll('.attempt-pip');
      pips.forEach((pip, idx) => {
        if (idx < attemptsRemaining) {
          pip.classList.add('filled');
        } else {
          pip.classList.remove('filled');
        }
      });
    }
  }

  function triggerLockout() {
    isLockedOut = true;
    const lockoutCard = document.getElementById('lockoutCard');
    const countdownEl = document.getElementById('lockoutCountdown');
    const input = document.getElementById('passwordInput');
    const submitBtn = document.getElementById('submitPwdBtn');

    if (lockoutCard) lockoutCard.classList.remove('hidden');
    if (input) input.disabled = true;
    if (submitBtn) submitBtn.disabled = true;

    audio.errorBuzz();
    showToast('🚨 SYSTEM LOCKOUT: 30-Second Security Cooldown Active!', 'error', 5000);

    let secondsLeft = 30;

    if (lockoutTimer) clearInterval(lockoutTimer);
    lockoutTimer = setInterval(() => {
      secondsLeft--;
      const formatted = `00:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
      if (countdownEl) countdownEl.textContent = formatted;

      if (secondsLeft <= 0) {
        clearInterval(lockoutTimer);
        isLockedOut = false;
        attemptsRemaining = 10;
        updateAttemptsDisplay();
        if (lockoutCard) lockoutCard.classList.add('hidden');
        if (input) {
          input.disabled = false;
          input.focus();
        }
        if (submitBtn) submitBtn.disabled = false;

        const logs = document.getElementById('pwdTerminalLogs');
        appendTerminalLog(logs, '[!] LOCKOUT EXPIRED. Resetting memory buffers. Terminal re-armed.', 'success');
        showToast('✓ LOCKOUT EXPIRED: Terminal ready for input.', 'info');
      }
    }, 1000);
  }

  // ==========================================================================
  // 10. SECTION 5: ROUND 4 — AI SUMMARIZATION CHALLENGE
  // ==========================================================================
  function initAiChallenge() {
    const copyBtn = document.getElementById('copyDbBtn');
    const phraseForm = document.getElementById('aiPhraseForm');
    const phraseInput = document.getElementById('aiPhraseInput');
    const feedback = document.getElementById('phraseFeedback');

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const rawText = document.getElementById('rawDbText');
        if (!rawText) return;
        const textToCopy = rawText.textContent.trim();

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('📋 SYSTEM STATUS DATABASE COPIED TO CLIPBOARD!', 'info');
            copyBtn.innerHTML = '✓ COPIED TO CLIPBOARD!';
            setTimeout(() => {
              copyBtn.innerHTML = '<span class="copy-icon">📋</span> COPY SYSTEM DATABASE';
            }, 2500);
          }).catch(() => fallbackCopy(textToCopy, copyBtn));
        } else {
          fallbackCopy(textToCopy, copyBtn);
        }
      });
    }

    function fallbackCopy(text, btn) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('📋 SYSTEM STATUS DATABASE COPIED TO CLIPBOARD!', 'info');
        btn.innerHTML = '✓ COPIED TO CLIPBOARD!';
        setTimeout(() => {
          btn.innerHTML = '<span class="copy-icon">📋</span> COPY SYSTEM DATABASE';
        }, 2500);
      } catch (err) {
        showToast('⚠ Failed to auto-copy. Please manually select the text.', 'error');
      }
      document.body.removeChild(textarea);
    }

    if (phraseForm) {
      phraseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!phraseInput) return;
        const enteredVal = phraseInput.value.trim().toUpperCase();

        if (!enteredVal) {
          showToast('⚠ Enter the extracted security phrase.', 'error');
          return;
        }

        // Validate via SHA-256 hash comparison
        const enteredHash = await computeSha256(enteredVal);

        if (enteredHash === TARGET_AI_PHRASE_HASH) {
          // MISSION COMPLETE!
          triggerGlitchSuccessFlash();
          audio.successChime();

          if (feedback) {
            feedback.innerHTML = `<span class="text-green font-bold">✓ SECURITY OVERRIDE ACCEPTED: PHRASE '${enteredVal}' AUTHENTICATED.</span>`;
          }

          setTimeout(() => {
            showVictoryScreen();
          }, 800);

        } else {
          audio.errorBuzz();
          if (feedback) {
            feedback.innerHTML = `<span class="text-red">✗ INCORRECT PHRASE. Ensure you pasted the document into an AI and inspected the summary verdict.</span>`;
          }
          showToast('⚠ INCORRECT PHRASE — Verify your AI summary output.', 'error');
        }
      });
    }
  }

  // ==========================================================================
  // 11. FULLSCREEN MISSION COMPLETE CELEBRATION
  // ==========================================================================
  function showVictoryScreen() {
    const victoryOverlay = document.getElementById('victoryOverlay');
    if (!victoryOverlay) return;
    victoryOverlay.classList.remove('hidden');

    triggerGlitchSuccessFlash();
    audio.successChime();

    if (window.gsap) {
      gsap.fromTo('.victory-card', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' });
    }

    // Glitch title animation
    const title = document.getElementById('victoryTitle');
    if (title) {
      title.classList.add('glitch-flicker-trigger');
    }

    const replayBtn = document.getElementById('replayBtn');
    if (replayBtn) {
      replayBtn.onclick = () => {
        victoryOverlay.classList.add('hidden');
        goToSection(1);
      };
    }
  }

  // ==========================================================================
  // 12. HIDDEN ORGANIZER OVERRIDE CONSOLE (Ctrl+Shift+A)
  // ==========================================================================
  function initOrganizerOverride() {
    const adminPanel = document.getElementById('adminPanel');
    const closeBtn = document.getElementById('adminCloseBtn');
    const authForm = document.getElementById('adminAuthForm');
    const passphraseInput = document.getElementById('adminPassphraseInput');
    const authFeedback = document.getElementById('adminAuthFeedback');
    const passphraseView = document.getElementById('adminPassphraseView');
    const unlockedView = document.getElementById('adminUnlockedView');

    let isUnlocked = false;

    function openConsole() {
      if (!adminPanel) return;
      adminPanel.classList.remove('hidden');
      if (!isUnlocked) {
        if (passphraseView) passphraseView.classList.remove('hidden');
        if (unlockedView) unlockedView.classList.add('hidden');
        if (authFeedback) authFeedback.textContent = '';
        if (passphraseInput) {
          passphraseInput.value = '';
          setTimeout(() => passphraseInput.focus(), 50);
        }
      }
      audio.keyClick();
    }
    globalOpenAdminConsole = openConsole;

    function closeConsole() {
      if (adminPanel) adminPanel.classList.add('hidden');
    }

    // Keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (adminPanel && !adminPanel.classList.contains('hidden')) {
          closeConsole();
        } else {
          openConsole();
        }
      } else if (e.key === 'Escape' && adminPanel && !adminPanel.classList.contains('hidden')) {
        closeConsole();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeConsole);
    }

    // Passphrase Authentication
    if (authForm) {
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputVal = passphraseInput ? passphraseInput.value.trim() : '';
        const hash = await computeSha256(inputVal);

        if (hash === ORGANIZER_OVERRIDE_HASH) {
          isUnlocked = true;
          if (passphraseView) passphraseView.classList.add('hidden');
          if (unlockedView) unlockedView.classList.remove('hidden');
          if (authFeedback) authFeedback.textContent = '';
          audio.successChime();
          showToast('✓ ORGANIZER CONSOLE AUTHORIZED', 'success');
          renderAdminTeamsTelemetry();
          renderAdminHandlesTable();
          renderAdminFragments();
        } else {
          audio.errorBuzz();
          if (authFeedback) {
            authFeedback.textContent = 'INVALID PASSPHRASE // ACCESS DENIED';
          }
          if (passphraseInput) {
            passphraseInput.value = '';
            passphraseInput.focus();
          }
        }
      });
    }

    // Round 1 Live Teams Telemetry Renderer
    async function renderAdminTeamsTelemetry() {
      const tbody = document.getElementById('adminTeamsTableBody');
      if (!tbody) return;
      try {
        let teamsList = [];
        if (window.location.protocol.startsWith('http')) {
          try {
            const res = await fetch('/api/admin/teams');
            if (res.ok) {
              const data = await res.json();
              if (data && data.teams && data.teams.length > 0) {
                teamsList = data.teams;
              }
            }
          } catch (_) {}
        }
        if (!teamsList || teamsList.length === 0) {
          teamsList = Object.values(getLocalTeamsData());
        }

        tbody.innerHTML = '';
        if (!teamsList || teamsList.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="text-dim">No teams registered</td></tr>';
          return;
        }
        teamsList.forEach(t => {
          const tr = document.createElement('tr');
          const statusHtml = t.completed 
            ? '<span class="text-green" style="font-weight:700">✓ COMPLETED</span>' 
            : '<span class="text-dim">IN PROGRESS</span>';
          const completedAtText = t.completedAt ? escapeHtml(t.completedAt) : '--';
          tr.innerHTML = `
            <td><strong>${escapeHtml(t.teamName)}</strong> <span class="text-dim">(${escapeHtml(t.teamId)})</span></td>
            <td>${statusHtml}</td>
            <td>${t.attempts}</td>
            <td>${completedAtText}</td>
            <td><button type="button" class="cyber-button sm" data-reset-team-id="${escapeHtml(t.teamId)}">RESET</button></td>
          `;
          tbody.appendChild(tr);
        });

        // Bind reset buttons
        tbody.querySelectorAll('[data-reset-team-id]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const teamIdToReset = btn.getAttribute('data-reset-team-id');
            // Always reset local record
            const localTeams = getLocalTeamsData();
            if (localTeams[teamIdToReset]) {
              localTeams[teamIdToReset].completed = false;
              localTeams[teamIdToReset].attempts = 0;
              localTeams[teamIdToReset].completedAt = null;
              saveLocalTeamsData(localTeams);
            }
            // Sync with backend if online
            if (window.location.protocol.startsWith('http')) {
              fetch('/api/admin/reset-team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId: teamIdToReset })
              }).catch(() => {});
            }
            showToast(`✓ Reset progress for ${teamIdToReset}`, 'info');
            renderAdminTeamsTelemetry();
            if (teamIdToReset === activeTeamId) {
              loadRound1Status();
            }
          });
        });
      } catch (e) {
        console.warn('Failed to load admin telemetry:', e);
        tbody.innerHTML = '<tr><td colspan="5" class="text-red">Telemetry fetch error</td></tr>';
      }
    }

    const refreshTeamsBtn = document.getElementById('adminRefreshTeamsBtn');
    if (refreshTeamsBtn) {
      refreshTeamsBtn.addEventListener('click', () => {
        renderAdminTeamsTelemetry();
        showToast('Telemetry refreshed', 'info');
      });
    }

    // Cutscene Replay & Reset Handlers
    const replayC1Btn = document.getElementById('adminReplayCutscene1Btn');
    if (replayC1Btn) {
      replayC1Btn.addEventListener('click', () => {
        closeConsole();
        if (window.CutscenePlayer) {
          window.CutscenePlayer.play('cutscene-1');
        }
      });
    }

    const replayC2Btn = document.getElementById('adminReplayCutscene2Btn');
    if (replayC2Btn) {
      replayC2Btn.addEventListener('click', () => {
        closeConsole();
        if (window.CutscenePlayer) {
          window.CutscenePlayer.playCutscene2();
        }
      });
    }

    const resetCutscenesBtn = document.getElementById('adminResetCutscenesBtn');
    if (resetCutscenesBtn) {
      resetCutscenesBtn.addEventListener('click', () => {
        if (window.CutscenePlayer) {
          window.CutscenePlayer.resetWatched();
        }
        showToast('↺ Cutscene progress reset (will play on next transitions)', 'info');
        audio.errorBuzz();
      });
    }

    function renderAdminFragments() {
      const textEl = document.getElementById('adminFragmentsText');
      if (!textEl) return;
      if (window.CutscenePlayer) {
        const frags = window.CutscenePlayer.getFragments();
        const entries = Object.entries(frags);
        if (entries.length > 0) {
          textEl.textContent = entries.map(([k, v]) => `FRAGMENT ${k}: ${v}`).join(' | ') + ' (Recovered)';
        } else {
          textEl.textContent = 'No fragments recovered yet';
        }
      }
    }

    const refreshFragmentsBtn = document.getElementById('adminRefreshFragmentsBtn');
    if (refreshFragmentsBtn) {
      refreshFragmentsBtn.addEventListener('click', () => {
        renderAdminFragments();
        showToast('Fragments telemetry refreshed', 'info');
      });
    }

    // Action: Skip Sponsor Checkpoint
    const skipCheckpointBtn = document.getElementById('adminSkipCheckpointBtn');
    if (skipCheckpointBtn) {
      skipCheckpointBtn.addEventListener('click', () => {
        adminOverrideActive = true;
        if (window._sponsorCheckpoint && window._sponsorCheckpoint.skip) {
          window._sponsorCheckpoint.skip();
        }
        showToast('✓ Sponsor Checkpoint Skipped via Organizer Override', 'info');
        audio.successChime();
      });
    }

    // Action: Reset Sponsor Checkpoint
    const resetCheckpointBtn = document.getElementById('adminResetCheckpointBtn');
    if (resetCheckpointBtn) {
      resetCheckpointBtn.addEventListener('click', () => {
        if (window._sponsorCheckpoint && window._sponsorCheckpoint.reset) {
          window._sponsorCheckpoint.reset();
        }
        renderAdminHandlesTable();
        showToast('↺ Sponsor Checkpoint reset to initial locked state', 'info');
        audio.errorBuzz();
      });
    }

    // Action 1: Reset attempts (to 3)
    const resetAttemptsBtn = document.getElementById('adminResetAttemptsBtn');
    if (resetAttemptsBtn) {
      resetAttemptsBtn.addEventListener('click', () => {
        setAttemptsLeft(MAX_ATTEMPTS);
        checkLockoutState(MAX_ATTEMPTS);
        showToast('✓ Attempts reset to 3', 'info');
      });
    }

    // Action 2: Reset entire Round 2 (attempts + folders + reshuffle)
    const resetR2Btn = document.getElementById('adminResetR2Btn');
    if (resetR2Btn) {
      resetR2Btn.addEventListener('click', () => {
        resetMailboxWithReshuffle({ restoreAttempts: true, announce: false });
        showToast('✓ Round 2 reset & reshuffled (attempts + folders)', 'info');
      });
    }

    // Action 3: Force-unlock Round 3
    const forceUnlockR3Btn = document.getElementById('adminForceUnlockR3Btn');
    if (forceUnlockR3Btn) {
      forceUnlockR3Btn.addEventListener('click', () => {
        adminOverrideActive = true;
        const revealCard = document.getElementById('caseIdRevealCard');
        if (revealCard) revealCard.classList.remove('hidden');
        closeConsole();
        showToast('✓ Round 3 unlocked via Organizer Override', 'success');
        const proceedBtn = document.getElementById('proceedToRound3Btn');
        if (proceedBtn) {
          proceedBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    // Sponsor Checkpoint Collected Handles Telemetry Table
    function renderAdminHandlesTable() {
      const tbody = document.getElementById('adminHandlesTableBody');
      if (!tbody) return;
      try {
        let list = [];
        const raw = sessionStorage.getItem(STORAGE_KEY_COLLECTED_HANDLES);
        if (raw) list = JSON.parse(raw);
        if (!list || list.length === 0) {
          tbody.innerHTML = '<tr><td colspan="3" class="text-dim">No Instagram handles recorded yet</td></tr>';
          return;
        }
        tbody.innerHTML = list.map(entry => {
          const handlesFormatted = (entry.handles || []).map(h => `@${escapeHtml(h)}`).join(', ');
          return `<tr>
            <td><strong>${escapeHtml(entry.teamName || entry.teamId)}</strong></td>
            <td><span class="text-cyan">${handlesFormatted}</span></td>
            <td class="text-dim">${escapeHtml(entry.timestamp)}</td>
          </tr>`;
        }).join('');
      } catch (_) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-red">Error loading handles telemetry</td></tr>';
      }
    }

    // Copy Collected Handles as CSV
    const copyHandlesCsvBtn = document.getElementById('adminCopyHandlesCsvBtn');
    if (copyHandlesCsvBtn) {
      copyHandlesCsvBtn.addEventListener('click', () => {
        try {
          let list = [];
          const raw = sessionStorage.getItem(STORAGE_KEY_COLLECTED_HANDLES);
          if (raw) list = JSON.parse(raw);
          if (!list || list.length === 0) {
            showToast('No Instagram handles to copy yet', 'info');
            return;
          }
          let csv = 'Team,Instagram Handles,Timestamp\n';
          list.forEach(entry => {
            const teamEsc = '"' + (entry.teamName || entry.teamId).replace(/"/g, '""') + '"';
            const handlesEsc = '"' + (entry.handles || []).map(h => '@' + h).join('; ').replace(/"/g, '""') + '"';
            const timeEsc = '"' + (entry.timestamp || '').replace(/"/g, '""') + '"';
            csv += `${teamEsc},${handlesEsc},${timeEsc}\n`;
          });

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(csv).then(() => {
              showToast('✓ Instagram handles copied as CSV', 'success');
              audio.successChime();
            }).catch(() => {
              prompt('Copy CSV manually:', csv);
            });
          } else {
            prompt('Copy CSV manually:', csv);
          }
        } catch (_) {
          showToast('Error exporting CSV', 'error');
        }
      });
    }

    const refreshHandlesBtn = document.getElementById('adminRefreshHandlesBtn');
    if (refreshHandlesBtn) {
      refreshHandlesBtn.addEventListener('click', () => {
        renderAdminHandlesTable();
        showToast('Handles telemetry refreshed', 'info');
      });
    }

    // Stage jump buttons
    const jumpButtons = document.querySelectorAll('[data-jump]');
    jumpButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-jump');
        adminOverrideActive = true;
        if (target === 'victory') {
          showVictoryScreen();
        } else if (target === 'checkpoint') {
          const victoryOverlay = document.getElementById('victoryOverlay');
          if (victoryOverlay) victoryOverlay.classList.add('hidden');
          goToSection('checkpoint', true);
        } else {
          const victoryOverlay = document.getElementById('victoryOverlay');
          if (victoryOverlay) victoryOverlay.classList.add('hidden');
          goToSection(parseInt(target, 10), true);
        }
        closeConsole();
      });
    });
  }

  // ==========================================================================
  // 13. GLOBAL HEADER & UI INITIALIZATION
  // ==========================================================================
  function initGlobalControls() {
    // Audio toggle in header
    const audioBtn = document.getElementById('audioToggleBtn');
    const audioIcon = document.getElementById('audioIcon');
    const audioLabel = document.getElementById('audioLabel');

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isEnabled = audio.toggle();
        if (audioIcon) audioIcon.textContent = isEnabled ? '🔊' : '🔇';
        if (audioLabel) audioLabel.textContent = isEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
        if (isEnabled) audio.keyClick();
      });
    }

    // Section 1 Begin Investigation button
    const beginBtn = document.getElementById('beginInvestigationBtn');
    if (beginBtn) {
      beginBtn.addEventListener('click', () => {
        if (window.CutscenePlayer && !window.CutscenePlayer.hasWatched('cutscene-1')) {
          window.CutscenePlayer.play('cutscene-1', () => {
            goToSection(2, true);
          });
        } else {
          goToSection(2);
        }
      });
    }

    // Section 1 Skip Boot button
    const skipBtn = document.getElementById('skipBootBtn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        finishBoot();
      });
    }

    // Interactive tracker steps click
    const trackerSteps = document.querySelectorAll('.tracker-step');
    trackerSteps.forEach(step => {
      step.addEventListener('click', () => {
        const stepNum = parseInt(step.getAttribute('data-step'), 10);
        if (stepNum >= 3 && !round1Completed && !adminOverrideActive) {
          showToast('ACCESS DENIED: Complete Round 1 Reconnaissance first.', 'error');
          audio.errorBuzz();
          return;
        }
        if (stepNum >= 3 && !isCheckpointPassed() && !adminOverrideActive) {
          showToast('SPONSOR CHECKPOINT REQUIRED // CHANNEL ENCRYPTED', 'warning');
          audio.errorBuzz();
          goToSection('checkpoint');
          return;
        }
        // Allow navigation to visited or unlocked steps
        if (step.classList.contains('completed') || step.classList.contains('active') || (typeof currentStage === 'number' && stepNum <= currentStage) || adminOverrideActive) {
          goToSection(stepNum);
        }
      });
    });
  }

  // HTML escaping helper
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // 14. APPLICATION BOOTSTRAP
  // ==========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    if (window.gsap && window.ScrollTrigger) {
      try {
        gsap.registerPlugin(ScrollTrigger);
      } catch (err) {
        // Safe fallback
      }
    }
    initMatrixRain();
    runBootSequence();
    initRound1Recon();
    initSponsorCheckpoint();
    initMailbox();
    initPasswordTerminal();
    initAiChallenge();
    initOrganizerOverride();
    initGlobalControls();

    function handleHashRouting() {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#checkpoint' || hash === '#sponsor') {
        if (round1Completed || adminOverrideActive) {
          goToSection('checkpoint');
        } else {
          goToSection(2);
        }
      } else if (hash === '#round2' || hash === '#mailbox') {
        if (!round1Completed && !adminOverrideActive) {
          goToSection(2);
        } else if (!isCheckpointPassed() && !adminOverrideActive) {
          goToSection('checkpoint');
        } else {
          goToSection(3);
          const firstItem = document.querySelector('.email-item');
          if (firstItem) firstItem.click();
        }
      } else if (hash === '#round1' || hash === '#recon' || hash === '#dossier') {
        goToSection(2);
      } else if (hash === '#round3' || hash === '#terminal') {
        if (!round1Completed && !adminOverrideActive) {
          goToSection(2);
        } else if (!isCheckpointPassed() && !adminOverrideActive) {
          goToSection('checkpoint');
        } else {
          goToSection(4);
        }
      } else if (hash === '#round4' || hash === '#ai') {
        if (!round1Completed && !adminOverrideActive) {
          goToSection(2);
        } else if (!isCheckpointPassed() && !adminOverrideActive) {
          goToSection('checkpoint');
        } else {
          goToSection(5);
        }
      }
    }

    window.addEventListener('hashchange', handleHashRouting);
    window.addEventListener('popstate', handleHashRouting);
    handleHashRouting();
  });

})();
