import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import StyledText from '../ui/StyledText';
import { Colors } from '../../constants/Colors';
import { Spacing, BorderRadius } from '../../constants/Theme';
import ChatService from '../../services/ChatService';

interface ChatFeedbackProps {
  messageId: string;
  onFeedbackSubmitted?: () => void;
}

const ChatFeedback: React.FC<ChatFeedbackProps> = ({ messageId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const colors = Colors.dark;

  const handleRating = async (selectedRating: number) => {
    if (submitting) return;

    setRating(selectedRating);
    setSubmitting(true);

    try {
      await ChatService.submitFeedback(messageId, selectedRating, '');
      setSubmitted(true);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <StyledText variant="secondary" style={styles.thankYouText}>
          Thanks for your feedback!
        </StyledText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StyledText variant="secondary" style={styles.promptText}>
        Was this response helpful?
      </StyledText>
      <View style={styles.ratingContainer}>
        <TouchableOpacity
          style={styles.ratingButton}
          onPress={() => handleRating(1)}
          disabled={submitting}
        >
          <FontAwesome
            name="thumbs-down"
            size={18}
            color={rating === 1 ? colors.accent : colors.accentSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ratingButton}
          onPress={() => handleRating(3)}
          disabled={submitting}
        >
          <FontAwesome
            name="thumbs-up"
            size={18}
            color={rating === 3 ? colors.accent : colors.accentSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.s,
    marginBottom: Spacing.m,
    alignItems: 'center',
  },
  promptText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xs,
  },
  thankYouText: {
    fontSize: 14,
    color: Colors.dark.accent,
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ratingButton: {
    padding: Spacing.s,
    marginHorizontal: Spacing.s,
  },
});

export default ChatFeedback;