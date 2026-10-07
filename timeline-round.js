/**
 * ============================================================================
 * BREACH TIMELINE — CONTROLLER & INTERACTION ENGINE
 * Round: Forensic Log Analysis
 * ============================================================================
 */

(function () {
  'use strict';

  const MAX_ATTEMPTS = 3;
  const STORAGE_KEY_ATTEMPTS = 'bo_timeline_attempts_left';
  const STORAGE_KEY_COMPLETED = 'bo_timeline_completed';

  function isTimelineCompleted() {
    try {
      return sessionStorage.getItem(STORAGE_KEY_COMPLETED) === 'true';
    } catch (_) {
      return false;
    }
  }

  function getAttemptsLeft() {
    try {
      const val = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
      if (val === null) return MAX_ATTEMPTS;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? MAX_ATTEMPTS : Math.max(0, Math.min(MAX_ATTEMPTS, parsed));
    } catch (_) {
      return MAX_ATTEMPTS;
    }
  }

  function setAttemptsLeft(num) {
    const val = Math.max(0, Math.min(MAX_ATTEMPTS, num));
    try {
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, val.toString());
    } catch (_) {}
    renderAttemptPips(val);
    checkLockoutState(val);
    return val;
  }

  function renderAttemptPips(val) {
    const pipsContainer = document.getElementById('timelineAttemptPips');
    if (!pipsContainer) return;
    pipsContainer.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const pip = document.createElement('span');
      pip.className = 'pip' + (i < val ? ' filled' : '');
      pipsContainer.appendChild(pip);
    }
  }

  function checkLockoutState(attempts) {
    const overlay = document.getElementById('timelineLockoutOverlay');
    if (!overlay) return;
    if (attempts <= 0) {
      overlay.classList.remove('hidden');
      if (window.audio && typeof window.audio.glitchZap === 'function') {
        window.audio.glitchZap();
      }
    } else {
      overlay.classList.add('hidden');
    }
  }

  function getActiveTeamId() {
    try {
      return localStorage.getItem('r1_active_team') || 'team-alpha';
    } catch (_) {
      return 'team-alpha';
    }
  }

  function renderTeamKeyBadge() {
    const badgeEl = document.getElementById('timelineTeamKeyBadge');
    if (!badgeEl) return;
    const teamId = getActiveTeamId();
    const config = window.BreachTimelineConfig ? window.BreachTimelineConfig.getConfigForTeam(teamId) : { key: 3 };
    const cleanTeamName = teamId.replace('team-', '').toUpperCase();
    badgeEl.innerHTML = `<span>TEAM: <strong>${cleanTeamName}</strong></span> <span>KEY: <strong>${config.key}</strong></span>`;
  }

  function renderEvidenceData() {
    const data = window.BreachTimelineData;
    if (!data) return;

    // 1. Door Badge Log Table
    const doorBody = document.getElementById('timelineDoorTableBody');
    if (doorBody && data.doorBadgeLog) {
      doorBody.innerHTML = '';
      data.doorBadgeLog.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="timeline-col-time">${row.time}</td>
          <td class="timeline-col-user">${row.name}</td>
          <td class="timeline-col-event">${row.action}</td>
        `;
        doorBody.appendChild(tr);
      });
    }

    // 2. Login Log Table
    const loginBody = document.getElementById('timelineLoginTableBody');
    if (loginBody && data.loginLog) {
      loginBody.innerHTML = '';
      data.loginLog.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="timeline-col-time">${row.time}</td>
          <td class="timeline-col-user">${row.user}</td>
          <td class="timeline-col-event">${row.event}</td>
          <td class="timeline-col-device">${row.device}</td>
        `;
        loginBody.appendChild(tr);
      });
    }

    // 3. Notice Board Cards (Bulletin)
    const noticeList = document.getElementById('timelineNoticeBoardList');
    if (noticeList && data.noticeBoard) {
      noticeList.innerHTML = '';
      data.noticeBoard.forEach(bulletin => {
        const card = document.createElement('div');
        card.className = 'notice-board-card';
        card.innerHTML = `
          <div class="notice-person-name">📌 ${bulletin.subject}</div>
          <div class="notice-note-text">${bulletin.note}</div>
        `;
        noticeList.appendChild(card);
      });
    }
  }

  function resetTimelineRound(options = {}) {
    const restoreAttempts = options.restoreAttempts !== false;
    if (restoreAttempts) {
      setAttemptsLeft(MAX_ATTEMPTS);
    }
    const input = document.getElementById('timelineTimeInput');
    const feedback = document.getElementById('timelineFeedback');
    const revealCard = document.getElementById('timelineRevealCard');
    if (input) input.value = '';
    if (feedback) feedback.textContent = '';
    if (revealCard) revealCard.classList.add('hidden');

    checkLockoutState(restoreAttempts ? MAX_ATTEMPTS : getAttemptsLeft());
    renderTeamKeyBadge();

    if (options.announce && window.showToast) {
      window.showToast('✓ TIMELINE RECON RESHIFTED // 3/3 ATTEMPTS RESTORED', 'success');
      if (window.audio && typeof window.audio.successChime === 'function') {
        window.audio.successChime();
      }
    }
  }

  function initBreachTimeline() {
    renderEvidenceData();
    renderAttemptPips(getAttemptsLeft());
    checkLockoutState(getAttemptsLeft());
    renderTeamKeyBadge();

    // Tab Navigation setup
    const tabButtons = [
      { id: 'tabBtnDoor', target: 'paneDoorLog' },
      { id: 'tabBtnLogin', target: 'paneLoginLog' },
      { id: 'tabBtnNotice', target: 'paneNoticeBoard' }
    ];

    tabButtons.forEach(tb => {
      const btn = document.getElementById(tb.id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        // Toggle tabs
        tabButtons.forEach(b => {
          const bEl = document.getElementById(b.id);
          const pEl = document.getElementById(b.target);
          const isActive = (b.id === tb.id);
          if (bEl) bEl.classList.toggle('active', isActive);
          if (pEl) pEl.classList.toggle('active', isActive);
        });

        if (window.audio && typeof window.audio.keyClick === 'function') {
          window.audio.keyClick();
        }
      });
    });

    // Verification Form Handler
    const form = document.getElementById('timelineVerifyForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const attempts = getAttemptsLeft();
        if (attempts <= 0) {
          checkLockoutState(0);
          return;
        }

        const inputEl = document.getElementById('timelineTimeInput');
        const feedbackEl = document.getElementById('timelineFeedback');
        const panel = document.getElementById('timelineVerifyPanel');
        const rawVal = (inputEl ? inputEl.value : '').trim();

        // Empty validation: do not decrement attempt
        if (!rawVal) {
          if (feedbackEl) {
            feedbackEl.textContent = 'ENTER 4-DIGIT ENCRYPTED CODE';
            feedbackEl.className = 'sec-feedback text-yellow';
          }
          if (window.showToast) {
            window.showToast('Please enter the 4-digit transformed code', 'info');
          }
          return;
        }

        // Clean digits
        const cleanVal = rawVal.replace(/\D/g, '');
        if (cleanVal.length !== 4) {
          if (feedbackEl) {
            feedbackEl.textContent = 'CODE MUST BE EXACTLY 4 DIGITS (HHMM)';
            feedbackEl.className = 'sec-feedback text-yellow';
          }
          if (window.showToast) {
            window.showToast('Please enter exactly 4 numeric digits', 'warning');
          }
          return;
        }

        // Compute SHA-256 of trimmed input
        let enteredHash = '';
        if (typeof window.computeSha256 === 'function') {
          enteredHash = await window.computeSha256(cleanVal);
        } else if (window.crypto && window.crypto.subtle) {
          const enc = new TextEncoder().encode(cleanVal);
          const buf = await window.crypto.subtle.digest('SHA-256', enc);
          enteredHash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Get target hash for active team
        const teamId = getActiveTeamId();
        const teamConfig = window.BreachTimelineConfig ? window.BreachTimelineConfig.getConfigForTeam(teamId) : null;
        const targetHash = teamConfig ? teamConfig.targetHash : 'd55f9f377e5f62397fd8db6c7f490530240028d4e12cc902191001e205ae69d9';

        if (enteredHash === targetHash) {
          // Correct!
          sessionStorage.setItem(STORAGE_KEY_COMPLETED, 'true');

          if (feedbackEl) {
            feedbackEl.textContent = '✓ TIMELINE VERIFIED';
            feedbackEl.className = 'sec-feedback text-green';
          }

          if (window.triggerGlitchSuccessFlash) {
            window.triggerGlitchSuccessFlash();
          }
          if (window.audio && typeof window.audio.successChime === 'function') {
            window.audio.successChime();
          }
          if (window.showToast) {
            window.showToast('✓ ACCESS GRANTED — Breach entry vector authenticated!', 'success');
          }

          // Typewriter reveal of success
          const revealCard = document.getElementById('timelineRevealCard');
          const typewriterTarget = document.getElementById('timelineTypewriterText');
          if (revealCard) {
            revealCard.classList.remove('hidden');
            if (typewriterTarget) {
              typewriterTarget.textContent = '';
              const msg = 'AUTHENTICATION SUCCESSFUL // FIRST BREACH TIME: 01:17 AM VERIFIED';
              let idx = 0;
              function typeSuccess() {
                if (idx < msg.length) {
                  typewriterTarget.textContent += msg.charAt(idx);
                  idx++;
                  if (window.audio && typeof window.audio.keyClick === 'function') {
                    window.audio.keyClick();
                  }
                  setTimeout(typeSuccess, 25);
                }
              }
              typeSuccess();
            }
            revealCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          // Incorrect code — decrement attempt
          const newAttempts = setAttemptsLeft(attempts - 1);
          if (window.audio && typeof window.audio.errorBuzz === 'function') {
            window.audio.errorBuzz();
          }

          if (panel) {
            panel.classList.remove('shake-panel');
            void panel.offsetWidth;
            panel.classList.add('shake-panel');
          }

          if (feedbackEl) {
            feedbackEl.textContent = 'TIMESTAMP REJECTED';
            feedbackEl.className = 'sec-feedback text-red';
          }

          if (window.showToast) {
            window.showToast(`TIMESTAMP REJECTED. Attempts remaining: ${newAttempts}`, 'error');
          }

          if (newAttempts <= 0) {
            checkLockoutState(0);
          }
        }
      });
    }

    // Proceed to Next Round Button
    const proceedBtn = document.getElementById('proceedFromTimelineBtn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        if (typeof window.goToSection === 'function') {
          window.goToSection(4); // Jump to Round 3: Password Terminal (Phase 4)
        }
      });
    }

    // Lockout Retry Button
    const retryBtn = document.getElementById('timelineLockoutRetryBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        resetTimelineRound({ restoreAttempts: true, announce: true });
      });
    }

    // Lockout Call Organizer Button
    const callOrgBtn = document.getElementById('timelineLockoutCallOrgBtn');
    if (callOrgBtn) {
      callOrgBtn.addEventListener('click', () => {
        if (typeof window.globalOpenAdminConsole === 'function') {
          window.globalOpenAdminConsole();
        }
      });
    }

    // Listen to team selection change to update team key badge
    const teamSelect = document.getElementById('teamSelect');
    if (teamSelect) {
      teamSelect.addEventListener('change', () => {
        setTimeout(renderTeamKeyBadge, 50);
      });
    }
  }

  // Expose globally
  window.initBreachTimeline = initBreachTimeline;
  window.resetTimelineRound = resetTimelineRound;
  window.isTimelineCompleted = isTimelineCompleted;
})();
