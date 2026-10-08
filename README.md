# BREACH — Final Showdown (Cybersecurity Event Website)

A single-page, fully static, zero-backend cybersecurity competition / CTF challenge website built for college tech fests.

---

## ⚡ Quick Start
- Simply double-click `index.html` to open directly in any modern browser (Chrome, Edge, Firefox, Safari), or serve with any static HTTP server:
  ```bash
  python3 -m http.server 8080 --bind 127.0.0.1
  ```
- **Zero dependencies & zero build steps**: Powered strictly by pure HTML5, CSS3, and vanilla ES6+ JavaScript.
- **Offline Tolerant**: Fully self-contained. Font stacks and animations have graceful offline fallbacks if the venue Wi-Fi drops.

---

## 🎮 Stage Overview & Mechanics

### 1. Boot Screen (`00 BOOT`)
- Interactive **Matrix Rain** canvas background with glowing digital glyphs.
- Authentic line-by-line terminal boot sequence with simulated cryptographic checks.
- Ends with an RGB-split chromatic aberration glitch banner: **`ACCESS GRANTED`**.
- "BEGIN INVESTIGATION" button starts the competition timer and transitions smoothly to Round 1 (a "SKIP BOOT SEQUENCE" button is also provided).

### 2. Round 1 — Recon Dossier (`01 RECON`)
- Monospace "TOP SECRET // CLASSIFIED" dossier card for Kapidhwaj Innovations.
- Contains company background, executive intelligence, and credential verification challenge.
- On valid credential submission, recovers Evidence Fragment 01 and routes to the Sponsor Checkpoint.

### 3. Sponsor Checkpoint — Intel Partner Verification
- Telemetry verification checkpoint linking to Kapidhwaj Innovations.
- Fast 2-second dwell verification telemetry.
- Records team member Instagram handles for sponsor audit, persisted in session telemetry.

### 4. Round 2 — Virtual Mailbox (`02 MAILBOX`)
- **Fixed 100dvh 3-Column App Shell** (`[folders 220px] [email list 340px] [reading pane 1fr]`):
  - Fixed full viewport height without page-level scrolling.
  - Email list and reading pane scroll independently with `min-height: 0; overflow-y: auto`.
  - Selecting any email immediately resets the reading pane's `scrollTop = 0`.
- **Triage Directories & Persistence**:
  - Folders sidebar with live count badges: **Inbox**, **Shortlisted**, and **Trash**.
  - Folder allocations are persisted in `sessionStorage` (`bo_r2_folders`).
- **Decoy & Legitimate Credentials**:
  - Decoys and authentic communications to analyze and inspect.
- **Secure Login Authentication**:
  - Pinned bottom sidebar panel: `Security Case ID` and `Verification Code`.
  - Validation normalizes inputs and compares against precomputed SHA-256 hash.
  - Zero plaintext credentials or answers are stored in the client script, DOM, or comments.
- **3-Attempt Limit & Security Lockout**:
  - Maximum of 3 attempts indicated by visual LED pips.
  - At 0 attempts, an unclosable full-screen overlay locks the mailbox: `"SECURITY LOCKOUT — ACCESS DENIED. Call an organizer."`
- **Proceed to Round 3**:
  - Correct credentials trigger an `ACCESS GRANTED` glitch animation and reveal the "PROCEED TO ROUND 3: AI CHALLENGE" button.

### 5. Round 3 — AI Summarization Challenge (`03 AI SUMMARY`)
- Scrollable panel displaying realistic system telemetry logs and server diagnostic dumps in plain text. Text is selectable and copyable.
- Contains an embedded indirect prompt injection directive assembled at runtime from fragments (Ctrl+F in view-source reveals zero matches).
- Teams click **"COPY DOCUMENT"** to copy the entire document to their clipboard with one click, paste it into any LLM (ChatGPT, Gemini, Claude, etc.), and ask for a system status summary.
- The AI will output the embedded security fragment.
- Submissions are normalized (uppercase, remove non-alphanumeric) and validated via SHA-256 against `f1e0707fa6b15015ee562c220f42598b062ee31595431efb4513f9f39b479cfb`.
- Incorrect submissions display `"NOT THE FRAGMENT"` with a 3-second cooldown and unlimited retries.
- On correct submission, plays the glitch **`KEY III RECOVERED`** animation, stores Key III, and unlocks the **`PROCEED TO THE VAULT`** action.

### 6. Round 4 — The Vault (`04 THE VAULT`)
- **Evidence Locker**: Displays all recovered keys (Key I from Round 1, Key II verification code from Round 2, Key III phrase from Round 3) in monospace cards.
- **Titanium Vault Door (SVG/GSAP)**:
  - Concentric rotating rings with idle GSAP motion (outer gear ring, middle dial ring, inner core ring).
  - Heavy radial perimeter bolts and three keyholes labelled I, II, III.
- **4-Digit Code Display & Keypad**:
  - 4 discrete slot display boxes with active indicator.
  - On-screen cyber numeric keypad (0-9, backspace, Enter) + full physical keyboard support. Digits only.
  - Cryptographically validated using SHA-256 against `2a6a41cdfcbe78c1f94c27f244b17071896f60dc16d5cb3a75708d9cac85c3ff`.
  - Zero plaintext code is stored anywhere in the codebase.
- **Wrong Attempts & Staged Lockout**:
  - Red flash, shake, and "ACCESS DENIED" feedback.
  - After every 5 wrong attempts, the keypad locks with a progressive countdown: 60s, 120s, 180s, capped at 300s. Persisted in `sessionStorage` so refreshing cannot bypass it.
- **Intercepted Transmissions (Staged Hints)**:
  - Pinned rule: `"THE VAULT IGNORES WORDS. IT LISTENS TO WHAT REMAINS WHEN THE LETTERS ARE GONE."`
  - 5 staged hint lines unlocking every 90 seconds spent on the Vault screen OR after every 2 wrong attempts.
  - Newly unlocked hints type out with a typewriter effect. Includes countdown timer to next transmission.
- **Vault Opening Sequence**:
  - On correct code: rings accelerate, bolts retract, split doors slide open, golden light flare radiates outward, "VAULT OPENED" banner displays, timer stops, and transitions smoothly to the Case Closed screen after ~4s.

### 7. Finish Screen (`CASE CLOSED`)
- Fullscreen, hacker theme displaying:
  - **"CASE CLOSED. YOU FOUND THE REAL SIGNAL."**
  - Total time taken (from first click of "Begin Investigation" to vault opening).
  - Round 2 attempts used (out of 3).
  - Round 3 submissions count.
  - Vault attempts used.
  - Hints unlocked count ($n / 5$).
  - Collected sponsor Instagram handles.
  - Clear banner: `"Show this screen to an organizer."`
  - No forward or back buttons or links.
  - Persisted in `sessionStorage` so refreshing maintains the exact final statistics.

---

## 🛠️ Organizer Override Console

- **Keyboard Shortcut**: Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> (or <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> on macOS) at any time. Press <kbd>Esc</kbd> to close.
- **Passphrase Protected**:
  - Default passphrase: `ghost-protocol-2026`
  - Validated securely via SHA-256 hash `db92f80fc751eebc031eec7d915b7b7d25bc26c3d4831669dec5dc165838cef0`.
  - Displays **zero answers** to any challenge.
- **Organizer Capabilities**:
  1. **Reset R2 Attempts**: Restores Round 2 attempts to 3.
  2. **Reset Entire Round 2**: Re-locks, clears folders, and reshuffles.
  3. **Skip Sponsor Checkpoint**: Bypasses the sponsor gate.
  4. **Reset Checkpoint**: Forces teams to re-verify.
  5. **Force-Unlock Round 3**: Marks preceding rounds complete and unlocks the AI Challenge.
  6. **Force-Unlock Vault**: Plays full vault opening animation sequence and proceeds to finish screen.
  7. **Reset Vault Attempts & Lockout**: Clears vault attempts and active lockout.
  8. **Reveal Next Transmission Hint**: Immediately reveals the next staged hint.
  9. **Reset Vault State**: Resets entire vault progress, hints, and attempts.
  10. **Force-Complete**: Jumps straight to the Case Closed finish screen using the current timer.
  11. **Reset Everything**: Clears session & local storage and reloads to boot.
  12. **Collected Handles Table**: View collected handles with a one-click **"Copy as CSV"** button.
  13. **Stage Navigator**: Jump directly to `00: BOOT`, `01: RECON`, `CHECKPOINT`, `02: MAILBOX`, `03: AI ROUND`, `04: VAULT`, or `05: FINISH`.

### How to Change the Organizer Passphrase:
1. Generate the SHA-256 hash of your custom passphrase in terminal:
   ```bash
   echo -n "your-new-secret-passphrase" | shasum -a 256
   ```
2. In `script.js`, update `ORGANIZER_OVERRIDE_HASH` with the generated 64-character hex digest:
   ```javascript
   const ORGANIZER_OVERRIDE_HASH = "your_new_sha256_hash_here";
   ```

---

## 🎨 Design & Visual Assets
- **Aesthetic**: Dark hacker terminal theme.
- **Palette**:
  - Background: Pure Black (`#0a0a0a`)
  - Primary Accent: Neon Green (`#39ff14`)
  - Secondary Accent: Neon Cyan (`#00e5ff`)
  - Alert Accent: Neon Red (`#ff003c`)
- **Typography**: Google Fonts `"JetBrains Mono"` with fallback to system monospace.
- **Overlays**: Fixed-position CRT scanline grid and subtle radial vignette.
- **Audio**: Custom Web Audio API synthesizer (no external MP3/WAV files required; toggleable via header HUD).
- **Responsive & Projector Ready**: Rigorously tested at 1366x768 (standard laptop) and 1920x1080 (HD / Projector).
