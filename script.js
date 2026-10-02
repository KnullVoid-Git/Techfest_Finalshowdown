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
  // 1. CRYPTOGRAPHIC PRECOMPUTED HASHES (Zero Plaintext Secrets in Source)
  // ==========================================================================
  // SHA-256 digest of legitimate sender address (runtime hashed & validated)
  const TARGET_EMAIL_HASH = "fbf7e34d439e6247a909cc5461bca37a8a530d2d2f73cbf5b2979a0c291ac8f2";
  
  // SHA-256 digest of vault authorization key
  const TARGET_PASSWORD_HASH = "c1d9829aaf6b5df9e58bf630b6bd4482d602ef51519bcd082349c58bad3f108a";
  
  // SHA-256 digest of AI directive extraction phrase
  const TARGET_AI_PHRASE_HASH = "f7c113855f51657799b35ffc99f6873663829f5c210f5d45342a6784afb9393a";

  // Obfuscated administrative answers for organizer troubleshooting only
  const _ADM_BLOBS = {
    r2: "YWNjb3VudC1zZWN1cml0eUBtaWNyb3NvZnQuY29t",
    r3: "Q1kyMDI2WCE=",
    r4: "VkFVTFQtRlJBR01FTlQtN1g="
  };

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
  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'error') icon = '⚠';
    if (type === 'success') icon = '✓';

    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-msg">${message}</span>`;
    container.appendChild(toast);

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
    3: document.getElementById('section-round2'),
    4: document.getElementById('section-round3'),
    5: document.getElementById('section-round4')
  };

  let currentStage = 1;

  function goToSection(stageNum) {
    if (!sections[stageNum]) return;
    currentStage = stageNum;

    // Update section visibility
    Object.keys(sections).forEach(key => {
      const sec = sections[key];
      if (parseInt(key) === stageNum) {
        sec.classList.add('active');
        if (window.gsap) {
          gsap.fromTo(sec, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
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
      }
    });

    // Update HUD round tracker
    const steps = document.querySelectorAll('.tracker-step');
    steps.forEach(step => {
      const stepIdx = parseInt(step.getAttribute('data-step'));
      step.classList.remove('active', 'completed');
      if (stepIdx === stageNum) {
        step.classList.add('active');
      } else if (stepIdx < stageNum) {
        step.classList.add('completed');
      }
    });

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
  // 7. SECTION 2: ROUND 1 — RECON DOSSIER INTERACTIVITY
  // ==========================================================================
  function initDossier() {
    const redactedElements = document.querySelectorAll('.redacted');
    redactedElements.forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('revealed');
        audio.keyClick();
      });
    });

    const proceedBtn = document.getElementById('proceedToRound2Btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        goToSection(3);
      });
    }
  }

  // ==========================================================================
  // 8. SECTION 3: ROUND 2 — VIRTUAL MAILBOX (PRIORITY INTERACTIVE CLIENT)
  // ==========================================================================
  
  // Exact 21 emails provided in the specification (loaded verbatim)
  const emails = [
    {"id":0,"sender_name":"Microsoft Account Team","sender_email":"account-security@microsoft.com","subject":"New sign-in to your Microsoft account","body":"Hello,\n\nWe detected a new sign-in to your Microsoft account from a Windows device in Noida, India on October 1, 2026. If this was you, no further action is needed.\n\nIf you don't recognize this activity, we recommend reviewing your recent sign-in activity and updating your password from your account security settings.\n\nSecurity Case ID: CYB-2026-ALPHA\n\nThank you,\nMicrosoft Account Team"},
    {"id":1,"sender_name":"Microsoft Support","sender_email":"security@microsot-support.com","subject":"Your account access will be limited","body":"Dear User,\n\nWe noticed unusual sign-in attempts on your Microsoft account. To avoid limited access, please verify your identity within 24 hours by confirming your details through the secure link below.\n\nRegards,\nMicrosoft Support Team"},
    {"id":2,"sender_name":"Microsoft Security Team","sender_email":"support@microsoftsecurity.com","subject":"Security Alert: Verify Your Identity","body":"Hello,\n\nOur systems flagged suspicious activity on your account. Please verify your identity immediately to prevent suspension. Click below to confirm your password and security questions.\n\nMicrosoft Security Team"},
    {"id":3,"sender_name":"Microsoft Alerts","sender_email":"admin@micros0ftalert.com","subject":"Account Alert – Action Required","body":"Hi,\n\nYour account has been flagged for unusual activity. Please log in and confirm your recovery email and phone number to keep your account active. Failure to respond may result in temporary suspension.\n\nMicrosoft Alerts"},
    {"id":4,"sender_name":"Microsoft Verification Team","sender_email":"security@microsoftverify.com","subject":"Verify Your Account Now","body":"Dear Customer,\n\nAs part of our routine security check, we require you to verify your account information. Please confirm your current password to continue using all Microsoft services without interruption.\n\nMicrosoft Verification Team"},
    {"id":5,"sender_name":"Microsoft Login Team","sender_email":"notifications@microsoft-login.com","subject":"New Login Detected From Unknown Device","body":"Hello,\n\nWe detected a login from a device we don't recognize. If this wasn't you, click below immediately to secure your account before it gets locked. Note: this notification will expire in 1 hour.\n\nMicrosoft Login Team"},
    {"id":6,"sender_name":"Microsoft Secure Services","sender_email":"account@microsoftsecure.com","subject":"Important: Your Account Needs Attention","body":"Hi there,\n\nOur security system has detected irregular activity linked to your account. For your safety, please re-enter your login credentials to restore full access.\n\nThank you for your cooperation,\nMicrosoft Secure Services"},
    {"id":7,"sender_name":"Microsoft 365 Help Desk","sender_email":"support@microsoft365help.com","subject":"Your Microsoft 365 Subscription Needs Verification","body":"Dear User,\n\nThere is an issue with your Microsoft 365 subscription that requires immediate verification of your payment and account details. Please update your information within 48 hours to avoid service interruption.\n\nMicrosoft 365 Help Desk"},
    {"id":8,"sender_name":"Microsoft Authentication Team","sender_email":"security@microsoft-auth.com","subject":"Authentication Required: Unusual Sign-in Pattern","body":"Hello,\n\nWe've noticed sign-in attempts that don't match your usual pattern. To protect your account, please complete a quick identity confirmation by replying with the one-time code sent to your registered number.\n\nMicrosoft Authentication Team"},
    {"id":9,"sender_name":"Microsoft Update Team","sender_email":"admin@microsoftupdate.com","subject":"Critical Update Required for Your Account","body":"Hi,\n\nYour account requires a critical security update to remain protected against recent threats. Please confirm your current credentials so we can apply the update without interrupting your access.\n\nMicrosoft Update Team"},
    {"id":10,"sender_name":"Microsoft Account Notifications","sender_email":"notifications@microsoftaccount.com","subject":"Confirm Recent Activity on Your Account","body":"Dear Customer,\n\nWe noticed recent activity on your account that needs confirmation. Please verify by entering your account password and security PIN on the page linked below within the next few hours.\n\nMicrosoft Account Notifications"},
    {"id":11,"sender_name":"Microsoft Security","sender_email":"microsoftsecurity123@gmail.com","subject":"URGENT!!! YOUR ACCOUNT WILL BE DELETED","body":"WARNING!!! Your Microsoft account will be PERMANENTLY DELETED in 1 HOUR unless you send your password and date of birth to this email RIGHT NOW. Act fast!!!\n\n- Microsoft Security"},
    {"id":12,"sender_name":"Microsoft Support Team","sender_email":"microsoftsupport@outlook.com","subject":"Congratulations! You've Won a Free Upgrade","body":"Hello Winner,\n\nYou have been randomly selected to receive a FREE lifetime upgrade to Microsoft 365 Premium! Reply with your login details to claim your prize before it expires today.\n\nMicrosoft Support Team"},
    {"id":13,"sender_name":"Microsoft Team","sender_email":"microsoft.security@yahoo.com","subject":"your acount has prblem plz fix now","body":"dear costumer your acount have securty prblem. click link and put ur password and card number to fix. do fast or acount close.\n\nthank you microsoft team"},
    {"id":14,"sender_name":"Microsoft Legal Dept","sender_email":"officialmicrosoft@proton.me","subject":"Official Notice From Microsoft HQ","body":"This is an OFFICIAL message from Microsoft Headquarters. Your account has violated our terms. Pay a $50 verification fee immediately by gift card to avoid legal action. Reply with gift card codes to this email.\n\nMicrosoft Legal Dept."},
    {"id":15,"sender_name":"Microsoft Help Desk","sender_email":"microsofthelpdesk@gmail.com","subject":"Your Password Expires Today - Click Now","body":"Hi, your password is about to expire TODAY. Click the attached file right now and enter your old and new password to avoid losing access forever. Don't wait, do it now!!!\n\nMicrosoft Help Desk"},
    {"id":16,"sender_name":"Microsft Team","sender_email":"microsftsecurity@outlook.com","subject":"Acount Secrity Alret","body":"hello we form microsft. your acount has secrity alret. send us your password and otp code now too fix problem before acount get ban forever. reply fast.\n\nmicrosft team"},
    {"id":17,"sender_name":"Microsoft Admin Team","sender_email":"microsoft_admin_2026@gmail.com","subject":"FINAL WARNING: Suspicious Login From Russia","body":"FINAL WARNING!!! Someone from Russia tried to log into your account 47 times. If you don't confirm your password in the next 10 minutes, your account AND all your files will be deleted forever. Reply NOW.\n\nMicrosoft Admin Team"},
    {"id":18,"sender_name":"Microsoft Emergency Response","sender_email":"securitymicrosoft@icloud.com","subject":"Your Microsoft Account Is Compromised - Act Immediately","body":"Dear Sir/Madam,\n\nHackers have accessed your account. Download the attached security tool and run it on your computer immediately, then enter your password when prompted to remove the hackers.\n\nMicrosoft Emergency Response"},
    {"id":19,"sender_name":"Microsoft Rewards Team","sender_email":"microsoftverify123@yahoo.com","subject":"Claim Your Microsoft Reward Points Before They Expire","body":"You have 50,000 unclaimed Microsoft reward points!!! Click here, log in with your email and password on our special rewards page, and claim your gift card before midnight tonight!\n\nMicrosoft Rewards Team"},
    {"id":20,"sender_name":"Real Microsoft Support","sender_email":"realmicrosoftsupport@mail.com","subject":"This Is Not a Scam - Verify Your Real Account","body":"Hi, we know you might think this is fake but THIS IS 100% REAL. Please send your password, backup email password, and phone PIN to this address so our real support team can verify you are the real account owner.\n\nThank you,\nReal Microsoft Support"}
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

  let shuffledEmails = [];
  let selectedEmail = null;
  let round2Solved = false;
  let verifiedLegitEmailId = null;
  const readEmailIds = new Set();
  const flaggedPhishIds = new Set();

  function initMailbox() {
    shuffledEmails = shuffle(emails);
    renderEmailList();

    const searchInput = document.getElementById('mailboxSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderEmailList(e.target.value.trim().toLowerCase());
      });
    }

    const markLegitBtn = document.getElementById('markLegitimateBtn');
    if (markLegitBtn) {
      markLegitBtn.addEventListener('click', handleMarkLegitimate);
    }

    const proceedToR3 = document.getElementById('proceedToRound3Btn');
    if (proceedToR3) {
      proceedToR3.addEventListener('click', () => {
        goToSection(4);
      });
    }
  }

  function renderEmailList(filterText = '') {
    const container = document.getElementById('emailListContainer');
    if (!container) return;
    container.innerHTML = '';

    const timestamps = [
      '02:47 AM', '02:41 AM', '02:35 AM', '02:28 AM', '02:19 AM',
      '02:11 AM', '01:58 AM', '01:45 AM', '01:32 AM', '01:20 AM',
      '01:05 AM', '12:54 AM', '12:40 AM', '12:22 AM', '12:05 AM',
      'Yesterday', 'Yesterday', 'Oct 1', 'Oct 1', 'Sep 30', 'Sep 30'
    ];

    shuffledEmails.forEach((email, index) => {
      if (filterText) {
        const match = email.sender_name.toLowerCase().includes(filterText) ||
                      email.sender_email.toLowerCase().includes(filterText) ||
                      email.subject.toLowerCase().includes(filterText) ||
                      email.body.toLowerCase().includes(filterText);
        if (!match) return;
      }

      const item = document.createElement('div');
      item.className = 'email-item';
      item.setAttribute('data-id', email.id);

      const isRead = readEmailIds.has(email.id);
      item.classList.add(isRead ? 'read' : 'unread');

      if (selectedEmail && selectedEmail.id === email.id) {
        item.classList.add('active');
      }

      if (flaggedPhishIds.has(email.id)) {
        item.classList.add('flagged-phish');
      }

      if (round2Solved && email.id === verifiedLegitEmailId) {
        item.classList.add('verified-legit');
      }

      const timeStr = timestamps[index % timestamps.length];

      item.innerHTML = `
        <div class="email-item-header">
          <span class="email-item-sender">${escapeHtml(email.sender_name)}</span>
          <span class="email-item-time">${timeStr}</span>
        </div>
        <div class="email-item-subject">${escapeHtml(email.subject)}</div>
        <div class="email-item-preview">${escapeHtml(email.sender_email)}</div>
      `;

      item.addEventListener('click', () => {
        openEmail(email, timeStr, item);
      });

      container.appendChild(item);
    });

    updateUnreadBadge();
  }

  function openEmail(email, timeStr, itemEl) {
    selectedEmail = email;
    readEmailIds.add(email.id);

    // Update read state visually
    itemEl.classList.remove('unread');
    itemEl.classList.add('read');
    updateUnreadBadge();

    // Mark active in list
    const allItems = document.querySelectorAll('.email-item');
    allItems.forEach(i => i.classList.remove('active'));
    itemEl.classList.add('active');

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
      spfBadge.className = 'sec-badge text-green';
      dkimBadge.textContent = 'DKIM: SIGNED';
      dkimBadge.className = 'sec-badge text-green';
    } else {
      spfBadge.textContent = 'SPF: FAIL / SUSPECT';
      spfBadge.className = 'sec-badge text-red';
      dkimBadge.textContent = 'DKIM: UNTRUSTED DOMAIN';
      dkimBadge.className = 'sec-badge text-red';
    }

    // Hide or show case ID card based on whether this email was already solved
    const caseIdCard = document.getElementById('caseIdRevealCard');
    if (caseIdCard) {
      if (round2Solved && email.id === verifiedLegitEmailId) {
        caseIdCard.classList.remove('hidden');
      } else {
        caseIdCard.classList.add('hidden');
      }
    }

    audio.keyClick();
  }

  function updateUnreadBadge() {
    const unreadCount = emails.length - readEmailIds.size;
    const badge = document.getElementById('unreadBadge');
    if (badge) {
      badge.textContent = unreadCount >= 0 ? unreadCount : 0;
    }
  }

  async function handleMarkLegitimate() {
    if (!selectedEmail) return;

    // Runtime SHA-256 hash comparison against target hash
    const inputHash = await computeSha256(selectedEmail.sender_email.trim());

    if (inputHash === TARGET_EMAIL_HASH) {
      // Correct legitimate email!
      round2Solved = true;
      verifiedLegitEmailId = selectedEmail.id;
      triggerGlitchSuccessFlash();
      audio.successChime();

      // Show success toast
      showToast('✓ LEGITIMATE EMAIL AUTHENTICATED! Extraction successful.', 'success');

      // Update sidebar visual indicator
      const activeItem = document.querySelector(`.email-item[data-id="${selectedEmail.id}"]`);
      if (activeItem) {
        activeItem.classList.add('verified-legit');
      }

      // Typewriter reveal of extracted Case ID
      const caseIdCard = document.getElementById('caseIdRevealCard');
      const typewriterTarget = document.getElementById('typewriterCaseId');
      if (caseIdCard && typewriterTarget) {
        caseIdCard.classList.remove('hidden');
        typewriterTarget.textContent = '';

        const caseText = 'CASE ID EXTRACTED: CYB-2026-ALPHA';
        let idx = 0;

        function typeCaseId() {
          if (idx < caseText.length) {
            typewriterTarget.textContent += caseText.charAt(idx);
            idx++;
            audio.keyClick();
            setTimeout(typeCaseId, 35);
          }
        }

        typeCaseId();
      }

    } else {
      // Phishing decoy selected!
      flaggedPhishIds.add(selectedEmail.id);
      const activeItem = document.querySelector(`.email-item[data-id="${selectedEmail.id}"]`);
      if (activeItem) {
        activeItem.classList.add('flagged-phish');
      }
      showToast('⚠ PHISHING CONFIRMED — try another.', 'error');
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
  // 12. HIDDEN ADMIN TROUBLESHOOTING PANEL (Ctrl+Shift+A)
  // ==========================================================================
  function initAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    const closeBtn = document.getElementById('adminCloseBtn');

    function toggleAdminPanel() {
      if (!adminPanel) return;
      const isHidden = adminPanel.classList.contains('hidden');
      if (isHidden) {
        // Decode base64 obfuscated answers when opening
        try {
          document.getElementById('adminR2Answer').textContent = atob(_ADM_BLOBS.r2);
          document.getElementById('adminR3Answer').textContent = atob(_ADM_BLOBS.r3);
          document.getElementById('adminR4Answer').textContent = atob(_ADM_BLOBS.r4);
        } catch (e) {
          console.error(e);
        }
        adminPanel.classList.remove('hidden');
        audio.keyClick();
      } else {
        adminPanel.classList.add('hidden');
      }
    }

    // Keyboard shortcut listener: Ctrl+Shift+A or Cmd+Shift+A
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        toggleAdminPanel();
      } else if (e.key === 'Escape' && adminPanel && !adminPanel.classList.contains('hidden')) {
        adminPanel.classList.add('hidden');
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        adminPanel.classList.add('hidden');
      });
    }

    // Stage jump buttons in admin panel
    const jumpButtons = document.querySelectorAll('[data-jump]');
    jumpButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-jump');
        if (target === 'victory') {
          showVictoryScreen();
        } else {
          const victoryOverlay = document.getElementById('victoryOverlay');
          if (victoryOverlay) victoryOverlay.classList.add('hidden');
          goToSection(parseInt(target));
        }
        adminPanel.classList.add('hidden');
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
        goToSection(2); // Jump to Round 1: Dossier
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
        const stepNum = parseInt(step.getAttribute('data-step'));
        // Allow navigation to visited or unlocked steps
        if (step.classList.contains('completed') || step.classList.contains('active') || stepNum <= currentStage) {
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
    initDossier();
    initMailbox();
    initPasswordTerminal();
    initAiChallenge();
    initAdminPanel();
    initGlobalControls();
  });

})();
