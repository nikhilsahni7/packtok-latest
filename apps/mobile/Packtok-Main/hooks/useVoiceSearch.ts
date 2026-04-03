import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";

let SpeechRecognition: any = null;
try {
  // Use require to prevent instant crashing on Expo Go
  SpeechRecognition = require("expo-speech-recognition");
} catch (e) {
  console.warn("expo-speech-recognition not found");
}

interface UseVoiceSearchOptions {
  /** When provided, the final transcript is passed to this callback instead of navigating to /search */
  onResult?: (transcript: string) => void;
}

export function useVoiceSearch(options?: UseVoiceSearchOptions) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const latestTranscriptRef = useRef("");
  const hasSubmittedResultRef = useRef(false);
  const onResultRef = useRef(options?.onResult);
  onResultRef.current = options?.onResult;

  const commitVoiceSearch = useCallback(() => {
    if (hasSubmittedResultRef.current) {
      return;
    }

    const query = latestTranscriptRef.current.trim();
    if (!query) {
      return;
    }

    hasSubmittedResultRef.current = true;
    if (onResultRef.current) {
      onResultRef.current(query);
    } else {
      router.push({
        pathname: "/search",
        params: { q: query },
      } as any);
    }

    latestTranscriptRef.current = "";
    setTranscript("");
  }, [router]);

  // Conditionally hook events if the native module is actually present
  if (SpeechRecognition?.useSpeechRecognitionEvent) {
    SpeechRecognition.useSpeechRecognitionEvent("start", () => {
      hasSubmittedResultRef.current = false;
      latestTranscriptRef.current = "";
      setTranscript("");
      setIsListening(true);
    });

    SpeechRecognition.useSpeechRecognitionEvent("end", () => {
      setIsListening(false);
      // Finalize the latest recognized query even if React state updates lag.
      commitVoiceSearch();
    });

    SpeechRecognition.useSpeechRecognitionEvent("result", (event: any) => {
      const speechText = event?.results?.[0]?.transcript?.trim() || "";
      if (!speechText) {
        return;
      }

      latestTranscriptRef.current = speechText;
      setTranscript(speechText);

      // On some devices/end-of-speech paths, relying only on `end` can miss
      // the last phrase. Commit immediately when final result arrives.
      if (event?.isFinal) {
        commitVoiceSearch();
      }
    });

    SpeechRecognition.useSpeechRecognitionEvent("error", (event: any) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);

      if (event?.error === "busy") {
        Alert.alert(
          "Voice Search Busy",
          "Voice recognition is already running. Tap the mic once to stop, then try again.",
        );
        return;
      }
      if (event?.error === "not-allowed") {
        Alert.alert(
          "Permissions Required",
          "Please enable microphone and speech recognition permissions in settings.",
        );
        return;
      }
      if (event?.error === "no-speech" || event?.error === "speech-timeout") {
        Alert.alert(
          "No Speech Detected",
          "We could not hear your voice. Try speaking clearly and closer to the microphone.",
        );
        return;
      }

      Alert.alert(
        "Voice Search Error",
        "Could not understand your speech. Please try again.",
      );
    });
  }

  const startListening = useCallback(async () => {
    // Graceful fallback if module isn't loaded (e.g. running inside standard Expo Go)
    const module = SpeechRecognition?.ExpoSpeechRecognitionModule;

    if (!module) {
      Alert.alert(
        "Voice Search",
        "Voice search using this library requires a custom development client. Please build the app natively to use this feature.",
      );
      return;
    }

    if (isListening) {
      module.stop();
      return;
    }

    try {
      if (
        typeof module.isRecognitionAvailable === "function" &&
        !module.isRecognitionAvailable()
      ) {
        Alert.alert(
          "Voice Search Unavailable",
          "Speech recognition service is not available on this device right now.",
        );
        return;
      }

      const result = await module.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert(
          "Permissions Required",
          "Please enable microphone permissions in your settings to use voice search.",
        );
        return;
      }

      hasSubmittedResultRef.current = false;
      latestTranscriptRef.current = "";
      setTranscript("");

      module.start({
        lang: "en-US",
        interimResults: true,
        continuous: false,
        maxAlternatives: 1,
        addsPunctuation: true,
        iosTaskHint: "search",
        androidIntentOptions: {
          EXTRA_LANGUAGE_MODEL: "web_search",
        },
      });
    } catch (error: any) {
      console.warn("Voice search init error:", error);
      Alert.alert(
        "Voice Search",
        "Native speech recognition module is not configured correctly. This feature requires a development build.",
      );
      setIsListening(false);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (SpeechRecognition?.ExpoSpeechRecognitionModule) {
      SpeechRecognition.ExpoSpeechRecognitionModule.stop();
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
}
