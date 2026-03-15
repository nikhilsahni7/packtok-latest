import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

let SpeechRecognition: any = null;
try {
  // Use require to prevent instant crashing on Expo Go
  SpeechRecognition = require("expo-speech-recognition");
} catch (e) {
  console.warn("expo-speech-recognition not found");
}

export function useVoiceSearch() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Conditionally hook events if the native module is actually present
  if (SpeechRecognition?.useSpeechRecognitionEvent) {
    SpeechRecognition.useSpeechRecognitionEvent("start", () => setIsListening(true));
    
    SpeechRecognition.useSpeechRecognitionEvent("end", () => {
      setIsListening(false);
      // When finished, if we have a transcript, execute the search
      if (transcript.trim()) {
        router.push({
          pathname: "/search",
          params: { q: transcript.trim() },
        } as any);
        setTranscript(""); // clear it for next time
      }
    });

    SpeechRecognition.useSpeechRecognitionEvent("result", (event: any) => {
      const speechText = event.results[0]?.transcript || "";
      setTranscript(speechText);
    });

    SpeechRecognition.useSpeechRecognitionEvent("error", (event: any) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
      Alert.alert("Voice Search Error", "Could not understand your speech. Please try again.");
    });
  }

  const startListening = useCallback(async () => {
    // Graceful fallback if module isn't loaded (e.g. running inside standard Expo Go)
    if (!SpeechRecognition?.ExpoSpeechRecognitionModule) {
      Alert.alert(
        "Voice Search", 
        "Voice search using this library requires a custom development client. Please build the app natively to use this feature."
      );
      return;
    }

    try {
      const result = await SpeechRecognition.ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert("Permissions Required", "Please enable microphone permissions in your settings to use voice search.");
        return;
      }

      await SpeechRecognition.ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        continuous: false,
      });
      
    } catch (error: any) {
      console.warn("Voice search init error:", error);
      Alert.alert(
        "Voice Search", 
        "Native speech recognition module is not configured correctly. This feature requires a development build."
      );
      setIsListening(false);
    }
  }, []);

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
