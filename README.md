# Clinical Trial Matching Voice Agent

A voice-enabled clinical trial matching assistant that helps patients find relevant clinical trials using AI and the ClinicalTrials.gov database.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Client   │────▶│  Express Server │────▶│  Vocal Bridge   │
│  (localhost:    │     │  (localhost:    │     │  (Voice Agent)  │
│   5173)         │     │   3001)         │     │                 │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │              WebRTC (LiveKit)                 │
        └───────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+
- npm 9+
- Vocal Bridge API key (get from [vocalbridgeai.com](https://vocalbridgeai.com))

## Quick Start

### 1. Clone and Install

```bash
# Install all dependencies (root, server, and client)
npm run install:all
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
VOCAL_BRIDGE_API_KEY=vb_your_api_key_here
```

### 3. Run the Application

```bash
# Start both server and client concurrently
npm run dev
```

This will start:
- **Server**: http://localhost:3001 (API backend)
- **Client**: http://localhost:5173 (React frontend)

### 4. Open the App

Navigate to http://localhost:5173 in your browser.

## Manual Setup (Alternative)

If you prefer to run server and client separately:

**Terminal 1 - Server:**
```bash
cd server
npm install
npm start
```

**Terminal 2 - Client:**
```bash
cd client
npm install
npm run dev
```

## Features

### Pre-Call Setup
- **Auto Location Detection**: Browser geolocation automatically detects user location
- **Quick-Select Chips**: Pre-select cancer type, stage, prior treatments, and biomarkers
- **Profile sent on connect**: Selected options are sent to the agent when the call starts

### During Call
- **Voice Conversation**: Real-time voice chat with AI assistant via WebRTC
- **Profile Sidebar**: Shows collected criteria, updates dynamically during conversation
- **Trial Cards**: Displays matching trials when found by the agent

### Agent Actions (Data Channel)

The agent can send actions to update the UI in real-time:

| Action | Description | Payload |
|--------|-------------|---------|
| `add_criteria` | Add/update eligibility criteria | `{ key: "Stage", value: "3A" }` |
| `show_trials` | Display trial cards | `{ trials: [...] }` |
| `update_match_count` | Update matching trials count | `{ payload: { count: 12 } }` |
| `clear_trials` | Clear trial list | - |

**Example from agent (Python):**
```python
import json

# Update criteria in sidebar
await room.local_participant.publish_data(
    json.dumps({
        "action": "add_criteria",
        "key": "Cancer Type",
        "value": "Lung"
    }).encode('utf-8'),
    reliable=True
)

# Show trial results
await room.local_participant.publish_data(
    json.dumps({
        "action": "show_trials",
        "trials": [
            {
                "nct_id": "NCT12345678",
                "title": "Phase 3 Study of Drug X",
                "phase": "Phase 3",
                "status": "Recruiting",
                "locations": ["Stanford, CA", "UCSF, CA"]
            }
        ]
    }).encode('utf-8'),
    reliable=True
)
```

### Client to Agent Actions

The client sends data to the agent:

| Action | When | Payload |
|--------|------|---------|
| `user_profile` | On connect | `{ location, cancerType, stage, priorTreatments, biomarkers }` |
| `trial_selected` | User clicks trial card | `{ nct_id: "NCT12345678" }` |

## Project Structure

```
vbhackthon/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChipSelector.tsx      # Reusable chip/button group
│   │   │   ├── IntakeForm.tsx        # Pre-call form with chips
│   │   │   ├── ProfileSidebar.tsx    # Eligibility tracker sidebar
│   │   │   ├── TrialCard.tsx         # Individual trial card
│   │   │   ├── TrialList.tsx         # Trial cards container
│   │   │   └── VoiceAgentPanel.tsx   # Main panel component
│   │   ├── hooks/
│   │   │   └── useVoiceAgent.ts      # LiveKit connection hook
│   │   ├── services/
│   │   │   └── location.ts           # Browser geolocation service
│   │   ├── types.ts                  # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
├── server/                    # Express backend
│   ├── index.js              # Token endpoint for Vocal Bridge
│   └── package.json
├── .env                       # Environment variables (create this)
├── instructions.md            # Vocal Bridge integration docs
├── package.json              # Root package with dev scripts
└── README.md                 # This file
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VOCAL_BRIDGE_API_KEY` | Your Vocal Bridge API key | Yes |
| `PORT` | Server port (default: 3001) | No |

## Troubleshooting

### Location not detected
- Ensure you've granted location permissions in your browser
- Check browser console for geolocation errors
- Location uses BigDataCloud free API for reverse geocoding

### Voice not working
- Check microphone permissions in browser
- Verify the Vocal Bridge API key is correct
- Check browser console for WebRTC errors

### Agent not receiving data
- Open browser DevTools (F12) -> Console
- Look for `[VoiceAgent]` and `[VoiceAgentPanel]` log messages
- Verify agent is sending JSON in correct format

### Server errors
- Verify `.env` file exists in root directory
- Check that `VOCAL_BRIDGE_API_KEY` is set correctly
- Look at server terminal for error messages

## Development

### Client Development
```bash
cd client
npm run dev      # Start dev server with HMR
npm run build    # Production build
npm run lint     # Run ESLint
```

### Adding New Agent Actions

1. Add the action type to `src/types.ts`:
```typescript
export interface AgentAction {
  action: string;
  // ... add new fields
}
```

2. Handle the action in `VoiceAgentPanel.tsx`:
```typescript
case 'your_new_action':
  // Handle the action
  break;
```

## Agent Configuration

The voice agent is configured through Vocal Bridge. Key settings:

- **Agent Name**: test
- **Mode**: cascaded_concierge
- **MCP Tools**: Clinical Trials API (search_trials, get_trial_details, etc.)

See `instructions.md` for full agent configuration and prompt.

## CLI Tools

Use the Vocal Bridge CLI to manage your agent:

```bash
# Install CLI
pip install vocal-bridge

# Authenticate
vb auth login

# View agent info
vb agent

# Review call logs
vb logs

# Update prompt
vb prompt edit

# Stream debug events
vb debug
```

## License

Private - All rights reserved
