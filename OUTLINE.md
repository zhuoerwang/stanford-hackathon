# TrialMatch - 3-Minute Demo Pitch Outline

## 1. Hook (15 seconds)

**One powerful stat:**

> "85% of cancer patients didn't know trials were an option. 75% would have enrolled if someone told them."
- Joel Wang @ CEO Palo Lab Inc & Martin Schneider, MD/PhD @ Standford

---

## 2. Problem (30 seconds)

### The Discovery Barrier
- **Doctors don't help**: No time (15-min appointments), no incentive (not compensated for referrals)
- **Patients don't know**: Trials exist but no one tells them
- **System is unusable**: Patients are weak, exhausted, and don't understand medical jargon—navigating 30+ eligibility criteria isn't realistic
- **Enrollment bottleneck**: Trial coordinators are short-handed, flooded with calls from unqualified patients

### The Cost
- **80% of trials** fail to meet enrollment timelines
- **$8 million/day** lost revenue when trials are delayed
- **$1,200 per screen failure** — every unqualified patient wastes this much

**Transition:** "We asked: what if patients could just talk to find trials—and coordinators only got pre-screened, qualified leads?"

---

## 3. Live Demo (90 seconds) ⭐ THE MAIN EVENT

**Setup:** Have app open, pre-recorded backup ready

### Demo Flow
1. **Connect** - Click "Talk to Sarah" → voice connection establishes
2. **Speak** - Describe symptoms/diagnosis naturally
3. **Watch** - Trials appear in real-time in the sidebar
4. **Interact** - Click a trial card to see full details

### Narration Call-outs During Demo
- "Notice the sidebar updating in real-time—that's our data channel syncing between the voice agent and the UI"
- "When I click this trial, the agent fetches full details from ClinicalTrials.gov via MCP tools"
- "I can ask follow-up questions about any trial, and Sarah explains it in plain language"

### Demo Highlights
- Voice-to-UI synchronization
- Real-time trial matching
- Interactive trial details
- Empathetic, conversational tone

---

## 4. How It Works (30 seconds)

### Three Key Technologies

1. **Vocal Bridge** - Powers the conversational AI voice agent
2. **MCP Tools** - Agent searches ClinicalTrials.gov in real-time during the call
3. **Client Actions** - Bidirectional communication between agent and app

### Client Actions (Bidirectional)

| Agent → App | App → Agent |
|-------------|-------------|
| `show_trials` | `user_profile` |
| `add_criteria` | `trial_selected` |
| `show_trial_details` | |

### Simple Architecture

```
User ↔ Voice Agent (Vocal Bridge) ↔ ClinicalTrials.gov (MCP)
         ↕
    React App (Client Actions)
```

---

## 5. What's Next (15 seconds)

### Future Vision
- **Mobile app** with Apple Health integration (auto-import medical data)
- **Doctor report generation** (PDF summary for oncologist review)
- **Smarter screening**: Cache ClinicalTrials.gov daily, pre-analyze criteria for targeted questions
- **Multilingual support**: Reach diverse patient populations

**Closing:** "We built this in [X hours]. Imagine what's possible."

---

## Backup Notes

### If Demo Fails
- Have pre-recorded video ready
- Show screenshots of key interactions
- Walk through the flow verbally

### Key Differentiators (mention if asked)
- Voice-native (not bolted-on)
- Real-time UI updates (not static results)
- Empathetic design (for patients in vulnerable moments)
- Doctor-ready output (bridges patient to clinical action)

### Tech Stack (if asked)
- Frontend: React + TypeScript + Vite
- Backend: Express.js
- Voice: Vocal Bridge + LiveKit WebRTC
- Data: ClinicalTrials.gov via MCP tools
- AI: Claude-powered voice agent
