/**
 * HapticFeedback - Provides haptic feedback for interactions
 */
export class HapticFeedback {
  /**
   * Light tap for regular interactions
   */
  static lightTap() {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  /**
   * Medium tap for important actions
   */
  static mediumTap() {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }

  /**
   * Strong tap for achievements/level ups
   */
  static strongTap() {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  }

  /**
   * Success pattern
   */
  static success() {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
  }

  /**
   * Achievement pattern
   */
  static achievement() {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 100, 50, 100]);
    }
  }
}

