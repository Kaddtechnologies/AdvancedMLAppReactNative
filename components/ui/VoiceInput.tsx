import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import { Mic, MicOff } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import StyledText from './StyledText';

interface VoiceInputProps {
  onTextChange: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onTextChange, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  useEffect(() => {
    // Initialize voice
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value[0]) {
        onTextChange(e.value[0]);
      }
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setError(e.error?.message || 'Error occurred while recording');
      setIsListening(false);
    };

    return () => {
      // Cleanup
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setError(null);
      await Voice.start('en-US');
    } catch (e: any) {
      setError(e.message || 'Error starting voice recognition');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e: any) {
      setError(e.message || 'Error stopping voice recognition');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isListening
              ? colors.accent
              : 'rgba(255, 255, 255, 0.1)',
          },
        ]}
        onPress={toggleListening}
        disabled={disabled}
      >
        {isListening ? (
          <View style={styles.recordingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <MicOff size={20} color="#fff" style={styles.icon} />
          </View>
        ) : (
          <Mic size={20} color={colors.text} />
        )}
      </TouchableOpacity>
      {error && (
        <StyledText style={styles.errorText} numberOfLines={1}>
          {error}
        </StyledText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    maxWidth: 150,
    textAlign: 'center',
  },
});