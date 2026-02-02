import { useState, useCallback, useEffect, useRef } from 'react';
import { Room, RoomEvent, Track, DataPacket_Kind } from 'livekit-client';
import type { UserProfile, AgentAction } from '../types';

interface UseVoiceAgentOptions {
  onAgentAction?: (action: AgentAction) => void;
}

export function useVoiceAgent(options: UseVoiceAgentOptions = {}) {
  const { onAgentAction } = options;
  const [room] = useState(() => new Room());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContainerRef = useRef<HTMLDivElement | null>(null);
  const onAgentActionRef = useRef(onAgentAction);

  // Keep callback ref updated
  useEffect(() => {
    onAgentActionRef.current = onAgentAction;
  }, [onAgentAction]);

  useEffect(() => {
    // Handle agent audio track subscription
    const handleTrackSubscribed = (track: Track) => {
      if (track.kind === Track.Kind.Audio) {
        const audioElement = track.attach();
        audioElement.id = `audio-${track.sid}`;
        if (audioContainerRef.current) {
          audioContainerRef.current.appendChild(audioElement);
        } else {
          document.body.appendChild(audioElement);
        }
      }
    };

    // Handle track unsubscription
    const handleTrackUnsubscribed = (track: Track) => {
      if (track.kind === Track.Kind.Audio) {
        track.detach().forEach((el) => el.remove());
      }
    };

    // Handle connection state changes
    const handleConnected = () => {
      setIsConnected(true);
      setError(null);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setIsMicEnabled(false);
    };

    // Handle data messages from agent
    const handleDataReceived = (
      payload: Uint8Array,
      _participant?: unknown,
      _kind?: DataPacket_Kind,
      topic?: string
    ) => {
      try {
        const decoder = new TextDecoder();
        const message = decoder.decode(payload);
        console.log('[VoiceAgent] Raw data received - topic:', topic, 'message:', message);

        const parsed = JSON.parse(message);
        console.log('[VoiceAgent] Parsed JSON:', parsed);

        // Handle Vocal Bridge format: { type: "client_action", action: "...", payload: {...} }
        // Also handle our direct format: { action: "...", key: "...", value: "..." }
        let action: AgentAction;

        if (parsed.type === 'client_action') {
          // Vocal Bridge format - flatten it
          action = {
            action: parsed.action,
            ...parsed.payload,
          };
          console.log('[VoiceAgent] Converted from Vocal Bridge format:', action);
        } else if (parsed.action) {
          // Direct format
          action = parsed as AgentAction;
          console.log('[VoiceAgent] Direct format action:', action);
        } else {
          // Log all received messages even if not actions (for debugging)
          console.log('[VoiceAgent] Non-action message received:', parsed);
          return;
        }

        console.log('[VoiceAgent] Dispatching action to handler:', action);

        if (onAgentActionRef.current) {
          onAgentActionRef.current(action);
        } else {
          console.warn('[VoiceAgent] No action handler registered!');
        }
      } catch (err) {
        console.error('[VoiceAgent] Failed to parse agent data:', err, 'raw:', new TextDecoder().decode(payload));
      }
    };

    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.DataReceived, handleDataReceived);
      room.disconnect();
    };
  }, [room]);

  const sendActionToAgent = useCallback(
    async (action: string, payload: Record<string, unknown>) => {
      if (!isConnected) {
        console.warn('[VoiceAgent] Cannot send action: not connected');
        return;
      }

      // Use Vocal Bridge format with client_actions topic
      const message = JSON.stringify({
        type: 'client_action',
        action,
        payload,
      });
      const encoder = new TextEncoder();
      const data = encoder.encode(message);

      console.log('[VoiceAgent] Sending action to agent:', message);
      await room.localParticipant.publishData(data, {
        reliable: true,
        topic: 'client_actions',
      });
    },
    [room, isConnected]
  );

  const connect = useCallback(
    async (userProfile?: UserProfile) => {
      setIsConnecting(true);
      setError(null);

      try {
        // Get token from backend
        const response = await fetch('/api/voice-token');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get voice token');
        }

        const { livekit_url, token } = await response.json();

        // Connect to LiveKit room
        await room.connect(livekit_url, token);

        // Enable microphone
        await room.localParticipant.setMicrophoneEnabled(true);
        setIsMicEnabled(true);

        // Send user profile to agent if provided
        if (userProfile && Object.keys(userProfile).length > 0) {
          // Small delay to ensure connection is fully established
          setTimeout(async () => {
            const message = JSON.stringify({
              type: 'client_action',
              action: 'user_profile',
              payload: userProfile,
            });
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            console.log('[VoiceAgent] Sending user profile to agent:', message);
            await room.localParticipant.publishData(data, {
              reliable: true,
              topic: 'client_actions',
            });
          }, 500);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Connection failed';
        setError(message);
        console.error('Voice agent connection error:', err);
      } finally {
        setIsConnecting(false);
      }
    },
    [room]
  );

  const disconnect = useCallback(async () => {
    await room.disconnect();
  }, [room]);

  const toggleMic = useCallback(async () => {
    const enabled = !isMicEnabled;
    await room.localParticipant.setMicrophoneEnabled(enabled);
    setIsMicEnabled(enabled);
  }, [room, isMicEnabled]);

  const setAudioContainer = useCallback((container: HTMLDivElement | null) => {
    audioContainerRef.current = container;
  }, []);

  return {
    isConnected,
    isConnecting,
    isMicEnabled,
    error,
    connect,
    disconnect,
    toggleMic,
    setAudioContainer,
    sendActionToAgent,
  };
}
