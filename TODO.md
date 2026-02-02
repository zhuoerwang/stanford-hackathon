# Hackathon TODO List

## Priority 1: Core Demo (Must Have)

- [x] **Fix client action issues** - Debug data channel message handling ✅
  - [x] Verify `add_criteria` action updates sidebar ✅
  - [x] Verify `show_trials` action displays trial cards ✅
  - [x] Test `update_match_count` action ✅
  - [x] Check console logs for parsing errors ✅
  - [x] Registered client actions in Vocal Bridge config (builtin_tools.json)
  - [x] Fixed message format to use Vocal Bridge `type: client_action` format
  - [x] Added `client_actions` topic for data channel messages

- [x] **Prompt optimization** ⭐ CRITICAL (see docs/PROMPT_DRAFT.md) ✅
  - [x] **Main conversation prompt** - Updated via `vb config set --prompt`
    - [x] Give agent a name (Sarah) for warmth ✅
    - [x] Add emotional intelligence guidelines (what to say, what NOT to say) ✅
    - [x] Add explicit `user_profile` handling instructions ✅
    - [x] Add `add_criteria` action instructions (update UI as info confirmed) ✅
    - [x] Add `show_trials` action instructions ✅
    - [x] Add `trial_selected` handling (fetch details with mcp-tools_get_trial_details) ✅
  - [ ] **After-call summary prompt**
    - [ ] Design doctor letter template (see PROMPT_DRAFT.md)
    - [ ] Implement summary generation (end of call trigger)
    - [ ] Include: patient info, criteria, trials, next steps, disclaimer

- [ ] **Doctor report letter generation**
  - [ ] Design report template (PDF or printable HTML)
  - [ ] Add "Generate Report" button after trials are matched
  - [ ] Include: patient info, matched trials, eligibility summary
  - [ ] Export as PDF or email-ready format

## Priority 2: Enhanced Features (Should Have)

- [ ] **UI/UX tuning**
  - [x] Polish visual design (colors, spacing, typography)
  - [x] Mobile responsive layout

## Priority 3: Deployment (Must Have for Demo)

- [ ] **Deploy accessible website**
  - [ ] Option A: Vercel (client) + AWS/Railway (server)
  - [ ] Option B: Local + ngrok for demo
  - [ ] Configure environment variables
  - [ ] Test end-to-end on deployed URL
  - [ ] Get shareable demo link

## Priority 4: Presentation (Must Have)

- [ ] **Business presentation**
  - [x] Create presentation outline (PRESENTATION_OUTLINE.md)
  - [ ] Build slide deck (Google Slides / PowerPoint)
  - [ ] Record demo video as backup
  - [ ] Practice pitch timing (3-5 min?)
  - [ ] Prepare for Q&A

## Bugs / Issues Tracker

| Issue | Status | Notes |
|-------|--------|-------|
| Client action parsing | ✅ Fixed | Updated useVoiceAgent.ts with proper format |
| Client actions not registered | ✅ Fixed | Added builtin_tools.json config |
| trial_selected not working | ✅ Fixed | Updated prompt with mcp-tools_get_trial_details instructions |
| Trial details not showing in UI | ✅ Fixed | Added TrialDetailPanel modal + show_trial_details action |
| | | |

## Prompt Design Notes

### Current Issues
1. **Not empathetic enough** - Feels robotic, doesn't acknowledge patient's emotional state
2. **Memory loss** - Agent doesn't retain/reference info sent via client actions (user_profile)
3. **Context fragmentation** - Collected criteria not consistently used in follow-up questions

### Current Prompt Analysis (from docs/instructions.md)
- Has empathy language but needs stronger emotional intelligence
- Missing: explicit instructions to acknowledge `user_profile` data on connect
- Missing: instructions to use `add_criteria` action to update UI
- Missing: after-call summary generation
- Missing: memory persistence strategy

### Prompt Architecture (Proposed)

```
┌─────────────────────────────────────────────────────────┐
│  SYSTEM PROMPT                                          │
│  ├── Role: Compassionate clinical trial navigator       │
│  ├── Tone guidelines: Empathy-first, patient-centered   │
│  ├── Memory instructions: Track & reference all data    │
│  └── Output format: When to send client actions         │
├─────────────────────────────────────────────────────────┤
│  MEMORY MCP (if implemented)                            │
│  ├── store_patient_info(key, value)                     │
│  ├── get_patient_info(key)                              │
│  └── get_all_patient_info()                             │
├─────────────────────────────────────────────────────────┤
│  AFTER-CALL SUMMARY PROMPT                              │
│  ├── Summarize conversation                             │
│  ├── List confirmed eligibility criteria                │
│  ├── List matched trials                                │
│  └── Generate doctor letter draft                       │
└─────────────────────────────────────────────────────────┘
```

### Empathy Phrases to Include
- "I understand this can be overwhelming..."
- "Thank you for sharing that with me..."
- "I'm here to help you find options..."
- "Take your time, there's no rush..."
- "That's really helpful information..."

### Memory Key-Value Pairs to Track
- `cancer_type`, `cancer_stage`, `diagnosis_date`
- `prior_treatments[]`, `current_medications[]`
- `biomarkers{}`, `genetic_mutations[]`
- `location`, `travel_willingness`
- `preferences` (trial phase, duration concerns)
- `trials_shown[]`, `trials_interested[]`

---

## Quick Wins (If Time Permits)

- [ ] Add more cancer type options
- [ ] Improve location detection UX
- [x] Add trial detail modal/popup ✅
- [ ] Sound effects for new trial found
- [ ] Accessibility improvements (screen reader)

---

## Session Log

### [Date: Today]
- Started debugging client action issues
- Created presentation outline
- Created this TODO list

### [Session: Client Actions & Prompt Fix]
- Fixed `useVoiceAgent.ts`: Added Vocal Bridge message format (`type: client_action`)
- Fixed `useVoiceAgent.ts`: Added `client_actions` topic for data channel
- Fixed `useVoiceAgent.ts`: Enhanced logging for debugging
- Created `builtin_tools.json` with client action definitions (add_criteria, show_trials, trial_selected, user_profile, update_match_count, clear_trials)
- Registered client actions via `vb config set --builtin-tools-file`
- Updated `prompts/agent_prompt.md`:
  - Added `add_criteria` action instructions
  - Added `show_trials` action instructions
  - Added `trial_selected` handling → calls `mcp-tools_get_trial_details`
  - Added `user_profile` acknowledgment instructions
- Synced prompt to agent via `vb config set --prompt`
- Verified: `add_criteria` now updates sidebar when agent confirms info

### [Session: Trial Detail Modal]
- Created `TrialDetailPanel.tsx` component with modal overlay
- Added `TrialDetail` type extending Trial with eligibility, contact, sponsor, etc.
- Added `show_trial_details` client action to builtin_tools.json
- Updated prompt to trigger `show_trial_details` after calling `mcp-tools_get_trial_details`
- Fixed action parsing to handle Vocal Bridge format (payload spread onto action object)
- Added CSS styles for trial detail modal
- Verified: Clicking trial card now shows detailed modal with all trial info

