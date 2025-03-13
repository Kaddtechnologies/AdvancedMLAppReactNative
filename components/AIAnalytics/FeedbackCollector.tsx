import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from './styles/FeedbackCollectorStyles';
import StyledText from '../ui/StyledText';
import { Colors } from '../../constants/Colors';

interface FeedbackCollectorProps {
  chatId: string;
  onSubmit: (rating: number, comments: string) => Promise<boolean>;
}

const FeedbackCollector: React.FC<FeedbackCollectorProps> = ({ chatId, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const colors = Colors.dark;

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;

    setSubmitting(true);
    try {
      const success = await onSubmit(rating, comments);
      if (success) {
        setSubmitted(true);
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
        <StyledText variant="cardTitle" weight="medium" style={styles.title}>
          Thank You for Your Feedback!
        </StyledText>
        <StyledText variant="body" style={styles.subtitle}>
          Your feedback helps our AI learn and improve.
        </StyledText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StyledText variant="cardTitle" weight="medium" style={styles.title}>
        Help Improve the AI
      </StyledText>
      <StyledText variant="body" style={styles.subtitle}>
        Your feedback helps our AI learn and get better
      </StyledText>

      <View style={styles.ratingContainer}>
        <StyledText variant="body" style={styles.ratingLabel}>
          How helpful was this response?
        </StyledText>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleStarPress(star)}
              style={styles.star}
            >
              <FontAwesome
                name={rating >= star ? 'star' : 'star-o'}
                size={30}
                color={rating >= star ? colors.accent : colors.accentSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.commentsContainer}>
        <StyledText variant="body" style={styles.commentsLabel}>
          Additional comments (optional)
        </StyledText>
        <TextInput
          value={comments}
          onChangeText={setComments}
          multiline
          numberOfLines={4}
          style={styles.commentsInput}
          placeholder="Share your thoughts..."
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            rating === 0 || submitting ? styles.submitButtonDisabled : null
          ]}
          onPress={handleSubmit}
          disabled={rating === 0 || submitting}
        >
          <StyledText variant="body" weight="medium" style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </StyledText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeedbackCollector;