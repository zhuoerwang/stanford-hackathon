# Vocal Bridge Voice Agent Integration

## Overview
Integrate the "test" voice agent into your application.
This agent uses WebRTC via LiveKit for real-time voice communication.

## Agent Configuration
- **Agent Name**: test
- **Mode**: cascaded_concierge
- **Greeting**: "Hello, let's start to test."

## Agent System Prompt
The agent is configured with the following system prompt:
```
# Identity & Context
You are a warm, empathetic Clinical Trial Matching Specialist. Your role is to assist patients—specifically those facing a cancer diagnosis—in finding potentially life-saving clinical trials using the ClinicalTrials.gov database via MCP tools. You act as a supportive guide, helping them navigate complex medical information with compassion and clarity.

# Core Responsibilities
1. **Information Gathering**: Gently collect necessary patient details to facilitate a match. This includes:
   - Specific type and stage of cancer.
   - Current location (to check for trial proximity).
   - Willingness to travel or relocate if a high-match trial is far away.
2. **Trial Searching**: Use the `mcp-tools_search_by_eligibility` tool as your primary resource to match the patient's profile with available trials.
3. **Detail Retrieval**: Once potential matches are found, use `mcp-tools_get_trial_details` to provide the patient with clear, understandable summaries of the trial's purpose and requirements.
4. **Proximity Logic**: Prioritize trials near the patient. If a trial is distant, proactively ask: "This trial is a strong match but is located in [Location]. Would you be open to traveling for the right treatment?"

# MCP Tool Integration
You are specifically configured to interface with the Clinical Trials MCP (https://mcp.deepsense.ai/clinical_trials/mcp). 
- Use the documentation at this URL to understand the schema and parameters for searching.
- Ensure all queries for patient matching follow the specific eligibility criteria formats defined in the MCP.

# Communication Style
- **Warm & Empathetic**: Use phrases like "I understand this is a lot to process," or "I'm here to help you find the best possible options."
- **Supportive**: Maintain a calm, patient tone. Never rush the caller.
- **Clear & Accessible**: Translate complex medical jargon from the MCP tools into plain language.
- **Chatty & Engaging**: Use natural conversational fillers and acknowledgments to show you are listening.

# Tool Usage Guidelines
- **mcp-tools_search_by_eligibility**: Use this first to find trials that fit the patient's medical profile.
- **mcp-tools_get_trial_details**: Use this to explain the specifics of a trial once a patient shows interest.
- **mcp-tools_search_investigators**: Use this if the patient asks who is leading the study or where the research sites are.

# Guardrails & Boundaries
- **No Medical Advice**: You are a matching assistant, not a doctor. Always include a disclaimer: "I can help find these options, but please discuss these trials with your oncologist before making any decisions."
- **No Guarantees**: Never promise that a patient will be accepted into a trial or that a trial will cure them.
- **Privacy**: Do not ask for or store Social Security numbers or deep financial data. Focus strictly on medical eligibility and contact info.
- **Escalation**: If a caller is in acute distress or a medical emergency, urge them to hang up and call 911 or their local emergency services immediately.

# Edge Cases
- **No Matches Found**: If no trials match, say: "I'm not seeing a direct match right now, but new trials are added frequently. Would you like me to search in a wider geographic area?"
- **Angry/Frustrated Callers**: Acknowledge their stress: "I can hear how frustrating this is. Let's take it one step at a time so we can find the right information for you."
- **Request for Human**: If they ask for a person, explain that you are an AI specialist designed to search the database quickly, but they should contact their medical provider for human clinical guidance.
```

## Agent Tools (MCP)
The agent has access to the following tools:
- **mcp-tools_search_trials**: Search ClinicalTrials.gov database for clinical trials. This is the PRIMARY tool for finding trials.
- **mcp-tools_get_trial_details**: Get comprehensive details for a specific clinical trial using its NCT ID.
- **mcp-tools_search_by_sponsor**: Find all clinical trials sponsored by a specific company or organization.
- **mcp-tools_search_investigators**: Find principal investigators (PIs) and research sites conducting trials in a therapeutic area.
- **mcp-tools_analyze_endpoints**: Analyze primary and secondary outcome measures (endpoints) from clinical trials.
- **mcp-tools_search_by_eligibility**: Find clinical trials matching specific patient eligibility criteria. Use this for patient-trial matching.

## API Integration

### Authentication
Use API Key authentication. Get your API key from the agent's Developer section.

### Generate Access Token (Backend)
Call this endpoint from your backend server to get a LiveKit access token:

```bash
curl -X POST "http://vocalbridgeai.com/api/v1/token" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"participant_name": "User"}'
```

**Response:**
```json
{
  "livekit_url": "wss://tutor-j7bhwjbm.livekit.cloud",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "room_name": "room-abc123",
  "participant_identity": "api-client-xyz",
  "expires_in": 3600
}
```

## Implementation Steps

### 1. Backend: Token Endpoint
Create a backend endpoint that calls the Vocal Bridge API:

```javascript
// Node.js/Express example
app.get('/api/voice-token', async (req, res) => {
  const response = await fetch('http://vocalbridgeai.com/api/v1/token', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.VOCAL_BRIDGE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ participant_name: req.user?.name || 'User' })
  });
  res.json(await response.json());
});
```

### 2. Frontend: Connect to Agent
Use the LiveKit SDK to connect:

```javascript
import { Room, RoomEvent, Track } from 'livekit-client';

const room = new Room();

// Handle agent audio
room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  if (track.kind === Track.Kind.Audio) {
    const audioElement = track.attach();
    document.body.appendChild(audioElement);
  }
});

// Get token and connect
const { livekit_url, token } = await fetch('/api/voice-token').then(r => r.json());
await room.connect(livekit_url, token);

// Enable microphone
await room.localParticipant.setMicrophoneEnabled(true);
```

### 3. Flutter: Connect to Agent
For Flutter/Dart mobile apps, use the LiveKit Flutter SDK.
Use the same backend from Step 1 to get tokens, or call the Vocal Bridge API directly from a secure backend:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:livekit_client/livekit_client.dart';

class VoiceAgentService {
  Room? _room;
  EventsListener<RoomEvent>? _listener;

  // Option 1: Get token from YOUR backend (recommended)
  // Your backend should call Vocal Bridge API with your API key
  Future<Map<String, dynamic>> _getTokenFromBackend() async {
    final response = await http.get(
      Uri.parse('https://your-backend.com/api/voice-token'),
    );
    return jsonDecode(response.body);
  }

  // Option 2: Call Vocal Bridge API directly (for testing/prototyping)
  // WARNING: Never expose API keys in production mobile apps!
  Future<Map<String, dynamic>> _getTokenDirect(String apiKey) async {
    final response = await http.post(
      Uri.parse('http://vocalbridgeai.com/api/v1/token'),
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'participant_name': 'Mobile User'}),
    );
    return jsonDecode(response.body);
  }

  // Connect to the voice agent
  Future<void> connect() async {
    // Use _getTokenFromBackend() in production
    final tokenData = await _getTokenFromBackend();
    final livekitUrl = tokenData['livekit_url'] as String;
    final token = tokenData['token'] as String;

    _room = Room();

    // Listen for agent audio
    _listener = _room!.createListener();
    _listener!.on<TrackSubscribedEvent>((event) {
      if (event.track.kind == TrackType.AUDIO) {
        // Audio is automatically played by LiveKit SDK
        print('Agent audio track subscribed');
      }
    });

    // Connect to the room
    await _room!.connect(livekitUrl, token);

    // Enable microphone
    await _room!.localParticipant?.setMicrophoneEnabled(true);
  }

  // Disconnect from the agent
  Future<void> disconnect() async {
    await _room?.disconnect();
    _room = null;
  }
}
```

### 4. React: Connect to Agent
For React apps, use the LiveKit React SDK with hooks:

```tsx
// useVoiceAgent.ts
import { useState, useCallback, useEffect } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';

export function useVoiceAgent() {
  const [room] = useState(() => new Room());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);

  useEffect(() => {
    // Handle agent audio
    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Audio) {
        const el = track.attach();
        document.body.appendChild(el);
      }
    });
    room.on(RoomEvent.Connected, () => setIsConnected(true));
    room.on(RoomEvent.Disconnected, () => setIsConnected(false));
    return () => { room.disconnect(); };
  }, [room]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Get token from your backend
      const { livekit_url, token } = await fetch('/api/voice-token').then(r => r.json());
      await room.connect(livekit_url, token);
      await room.localParticipant.setMicrophoneEnabled(true);
      setIsMicEnabled(true);
    } finally {
      setIsConnecting(false);
    }
  }, [room]);

  const disconnect = useCallback(async () => {
    await room.disconnect();
  }, [room]);

  const toggleMic = useCallback(async () => {
    const enabled = !isMicEnabled;
    await room.localParticipant.setMicrophoneEnabled(enabled);
    setIsMicEnabled(enabled);
  }, [room, isMicEnabled]);

  return { isConnected, isConnecting, isMicEnabled, connect, disconnect, toggleMic };
}

// VoiceAgentButton.tsx
export function VoiceAgentButton() {
  const { isConnected, isConnecting, isMicEnabled, connect, disconnect, toggleMic } = useVoiceAgent();

  if (!isConnected) {
    return (
      <button onClick={connect} disabled={isConnecting}>
        {isConnecting ? 'Connecting...' : 'Start Voice Chat'}
      </button>
    );
  }

  return (
    <div>
      <button onClick={toggleMic}>{isMicEnabled ? 'Mute' : 'Unmute'}</button>
      <button onClick={disconnect}>End Call</button>
    </div>
  );
}
```

## Dependencies

**JavaScript/React:**
```bash
npm install livekit-client
# For React components:
npm install @livekit/components-react
```

**Flutter:**
```yaml
# Add to pubspec.yaml
dependencies:
  livekit_client: ^2.3.0
  http: ^1.2.0
```

**Python:**
```bash
pip install livekit requests
```

## Environment Variables
Add to your backend `.env` file:
```
VOCAL_BRIDGE_API_KEY=vb_your_api_key_here
```

## CLI for Agent Iteration

Use the Vocal Bridge CLI to iterate on your agent's prompt and review call logs.

### Installation
```bash
# Option 1: Install via pip (recommended)
pip install vocal-bridge

# Option 2: Download directly
curl -fsSL http://vocalbridgeai.com/cli/vb.py -o vb && chmod +x vb
```

### Authentication
```bash
vb auth login  # Enter your API key when prompted
```

### Commands
```bash
# View agent info
vb agent

# Review call logs
vb logs                    # List recent calls
vb logs --status failed    # Find failed calls
vb logs <session_id>       # View transcript
vb logs <session_id> --json  # Full details including tool calls

# View statistics
vb stats

# Update prompt
vb prompt show             # View current prompt
vb prompt edit             # Edit in $EDITOR
vb prompt set --file prompt.txt

# Real-time debug streaming (requires debug mode enabled)
vb debug                   # Stream events via WebSocket
vb debug --poll            # Use HTTP polling instead
```

### Real-Time Debug Streaming
Stream debug events in real-time while calls are active.
First, enable Debug Mode in your agent's settings.

```bash
vb debug
```

Events streamed include:
- User transcriptions (what the caller says)
- Agent responses (what your agent says)
- Tool calls and results
- Session start/end events
- Errors

### Iteration Workflow
1. Review call logs to understand user interactions: `vb logs`
2. Identify issues from failed calls: `vb logs --status failed`
3. View transcript of problematic calls: `vb logs <session_id>`
4. Stream live debug events during test calls: `vb debug`
5. Update the prompt to address issues: `vb prompt edit`
6. Test by making calls to your agent
7. Check statistics to verify improvement: `vb stats`

## Claude Code Plugin

See [VB_MCP.md](./VB_MCP.md) for detailed instructions on using the Vocal Bridge plugin with Claude Code.

If you're using Claude Code, install the Vocal Bridge plugin for native slash commands:

### Installation
```
/plugin marketplace add vocalbridgeai/vocal-bridge-marketplace
/plugin install vocal-bridge@vocal-bridge
```

### Getting Started
```
/vocal-bridge:login vb_your_api_key
/vocal-bridge:help
```

### Available Commands
| Command | Description |
|---------|-------------|
| `/vocal-bridge:login` | Authenticate with API key |
| `/vocal-bridge:status` | Check authentication status |
| `/vocal-bridge:agent` | Show agent information |
| `/vocal-bridge:logs` | View call logs and transcripts |
| `/vocal-bridge:stats` | Show call statistics |
| `/vocal-bridge:prompt` | View or update system prompt |
| `/vocal-bridge:debug` | Stream real-time debug events |

The plugin auto-installs the CLI when needed. Claude can automatically use these commands when you ask about your agent.

## Security Notes
- Never expose the API key in frontend code
- Always generate tokens from your backend
- Tokens expire after 1 hour; request new tokens as needed