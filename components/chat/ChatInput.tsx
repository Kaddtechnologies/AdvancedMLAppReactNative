import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/Theme';
import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface ChatInputProps {
  onSend: (message: string) => void;
  style?: ViewStyle;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  style,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const Container = Platform.OS === 'ios' ? BlurView : View;
  const containerProps = Platform.OS === 'ios' ? {
    intensity: 50,
    tint: colorScheme,
  } : {
    style: { backgroundColor: colors.background },
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Container {...containerProps}>
        <View style={[styles.container, style]}>
          <View style={[
            styles.inputContainer,
            { backgroundColor: colors.secondaryBackgroundGradient.colors[0] }
          ]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
              editable={!disabled}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: message.trim() ? colors.accent : colors.textSecondary,
                  opacity: disabled ? 0.5 : 1,
                },
              ]}
              onPress={handleSend}
              disabled={!message.trim() || disabled}
            >
              <FontAwesome
                name="send"
                size={16}
                color={colors.textOnPrimary}
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: BorderRadius.large,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    marginRight: Spacing.m,
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 8 : 0,
  },
  sendIcon: {
    marginLeft: 2,
  },
});

export default ChatInput;