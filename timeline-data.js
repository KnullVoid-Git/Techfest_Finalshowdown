/**
 * ============================================================================
 * BREACH TIMELINE — EVIDENCE DATA & CONFIGURATION
 * Round: Forensic Log Analysis (NovaTech Solutions Incident)
 * ============================================================================
 * 
 * Instructions to modify key or add team variants:
 * 1. To change the default team key: change `defaultKey` and update `defaultHash`
 *    with the SHA-256 hash of the transformed 4-digit code.
 * 2. To add a new team variant: add an entry under `teamVariants` mapping the
 *    team ID (e.g. 'team-delta') to { key, targetHash, customData?: ... }.
 * 3. Never store plaintext answers in this file. Store only SHA-256 hex hashes.
 */

(function () {
  'use strict';

  // Base evidence dataset for NovaTech Solutions breach
  const DEFAULT_DATASET = {
    // Evidence 1: Physical Door Access Control System
    doorBadgeLog: [
      { time: '09:02 AM', name: 'Priya Nair (HR)', action: 'Entry' },
      { time: '09:10 AM', name: 'Rohan Das (IT Admin)', action: 'Entry' },
      { time: '06:00 PM', name: 'Priya Nair', action: 'Exit' },
      { time: '06:30 PM', name: 'Rohan Das', action: 'Exit' },
      { time: '09:00 PM', name: 'Kabir Singh (Guard)', action: 'Entry' }
    ],

    // Evidence 2: Enterprise Authentication & Active Directory Spool
    loginLog: [
      { time: '09:00 AM', user: 'Sneha Iyer', event: 'Failed login (wrong password)', device: 'Home Wi-Fi' },
      { time: '09:01 AM', user: 'Sneha Iyer', event: 'Login success', device: 'Home Wi-Fi' },
      { time: '09:05 AM', user: 'Priya Nair', event: 'Login success', device: 'Office PC' },
      { time: '09:12 AM', user: 'Rohan Das', event: 'Login success', device: 'Office PC' },
      { time: '02:00 PM', user: 'Sneha Iyer', event: 'Downloaded payroll file', device: 'Home Wi-Fi' },
      { time: '06:28 PM', user: 'Rohan Das', event: 'Logout', device: 'Office PC' },
      { time: '08:45 PM', user: 'Sneha Iyer', event: 'Logout', device: 'Home Wi-Fi' },
      { time: '09:10 PM', user: 'Kabir Singh', event: 'Login success', device: 'Security Desk PC' },
      { time: '11:05 PM', user: 'Rohan Das', event: 'Login success', device: 'Remote (Home)' },
      { time: '11:40 PM', user: 'Rohan Das', event: 'Logout', device: 'Remote (Home)' },
      { time: '01:09 AM', user: 'Aarav Mehta', event: 'Failed login (wrong password)', device: 'Office PC' },
      { time: '01:11 AM', user: 'Aarav Mehta', event: 'Failed login (wrong password)', device: 'Office PC' },
      { time: '01:14 AM', user: 'Aarav Mehta', event: 'Failed login (wrong password)', device: 'Office PC' },
      { time: '01:17 AM', user: 'Aarav Mehta', event: 'Login success', device: 'Office PC' },
      { time: '01:21 AM', user: 'Aarav Mehta', event: 'Downloaded "Client_Database.zip"', device: 'Office PC' },
      { time: '01:30 AM', user: 'Aarav Mehta', event: 'Logout', device: 'Office PC' }
    ],

    // Evidence 3: Internal Physical Notice Board Bulletin
    noticeBoard: [
      { subject: 'Aarav Mehta (Accounts)', note: 'On leave Friday and Saturday' },
      { subject: 'Priya Nair (HR)', note: 'Normal shift, leaves at 6 PM' },
      { subject: 'Rohan Das (IT)', note: 'Approved remote server maintenance, 11:00 PM to 12:00 AM' },
      { subject: 'Sneha Iyer (Finance)', note: 'Working from home all day Friday' },
      { subject: 'Kabir Singh (Guard)', note: 'Night shift, 9 PM to 6 AM' }
    ]
  };

  // Configuration object: easily move round order, customize keys & hashes
  const BREACH_TIMELINE_CONFIG = {
    // Configurable round order / number: change this number to move the round anywhere
    roundNumber: 3,

    title: 'Breach Timeline',
    subtitle: 'FORENSIC LOG AUDIT // INCIDENT RESPONSE',
    introText: 'NovaTech Solutions was hacked on Friday, 3 Oct. Study the evidence. Find the exact time the attacker first got in.',

    // Default encryption key applied per-digit modulo 10
    // Raw breach time: 01:17 AM -> "0117"
    // Key 3: (0+3, 1+3, 1+3, 7+3) -> "3440"
    defaultKey: 3,

    // SHA-256 hash of "3440"
    defaultHash: 'd55f9f377e5f62397fd8db6c7f490530240028d4e12cc902191001e205ae69d9',

    // Per-team variants mapping: teamId -> { key, targetHash, dataset? }
    teamVariants: {
      'team-alpha': {
        key: 3,
        // SHA-256 of "3440"
        targetHash: 'd55f9f377e5f62397fd8db6c7f490530240028d4e12cc902191001e205ae69d9'
      },
      'team-beta': {
        key: 4,
        // SHA-256 of "4551"
        targetHash: 'c196451df88696ab27f6f6e7a6d5eae46bd7a0827aec128294fbc9721ba36bd4'
      },
      'team-gamma': {
        key: 5,
        // SHA-256 of "5662"
        targetHash: '31463ca37e9c81f5567068587774f7a07d4871f0dfb7372882abbddf840fef33'
      }
    },

    // Resolves key and targetHash for a given team
    getConfigForTeam: function (teamId) {
      if (teamId && this.teamVariants[teamId]) {
        return {
          key: this.teamVariants[teamId].key,
          targetHash: this.teamVariants[teamId].targetHash,
          dataset: this.teamVariants[teamId].dataset || DEFAULT_DATASET
        };
      }
      return {
        key: this.defaultKey,
        targetHash: this.defaultHash,
        dataset: DEFAULT_DATASET
      };
    }
  };

  // Expose globally
  window.BreachTimelineData = DEFAULT_DATASET;
  window.BreachTimelineConfig = BREACH_TIMELINE_CONFIG;
})();
