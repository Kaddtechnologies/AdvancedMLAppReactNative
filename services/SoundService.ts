import { Audio } from 'expo-av';

class SoundService {
  private sendSound: Audio.Sound | null = null;
  private receiveSound: Audio.Sound | null = null;

  async initialize() {
    try {
      // Load sounds
      const { sound: send } = await Audio.Sound.createAsync(
        require('../assets/sounds/send.mp3')
      );
      const { sound: receive } = await Audio.Sound.createAsync(
        require('../assets/sounds/receive.mp3')
      );

      this.sendSound = send;
      this.receiveSound = receive;
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  }

  async playSendSound() {
    try {
      if (this.sendSound) {
        await this.sendSound.replayAsync();
      }
    } catch (error) {
      console.error('Error playing send sound:', error);
    }
  }

  async playReceiveSound() {
    try {
      if (this.receiveSound) {
        await this.receiveSound.replayAsync();
      }
    } catch (error) {
      console.error('Error playing receive sound:', error);
    }
  }

  async unload() {
    try {
      if (this.sendSound) {
        await this.sendSound.unloadAsync();
      }
      if (this.receiveSound) {
        await this.receiveSound.unloadAsync();
      }
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  }
}

export default new SoundService();