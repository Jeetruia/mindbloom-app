# MindBloom Design System

## 🎨 Visual Theme

**Vibe**: Uplifting, soft-futuristic, emotionally intelligent  
**Style**: Pastel gradients, glassmorphism, floating orbs, subtle bokeh glow  
**Tone**: Cozy yet alive — "a garden of thoughts" aesthetic  
**Fonts**: Poppins (primary), Baloo 2 (secondary), Outfit (display)

## 🎨 Color Palette

### Primary Colors (Bloom-inspired)
```typescript
bloom: {
  pink: '#FF8FA3',
  peach: '#FFB88C',
  lavender: '#B19CD9',
  mint: '#A8E6CF',
  sky: '#87CEEB',
  violet: '#9B8FB8',
}
```

### Mood Colors
```typescript
mood: {
  calm: '#87CEEB',      // Sky blue
  happy: '#FFB88C',     // Peach
  reflective: '#B19CD9', // Lavender
  energetic: '#FF8FA3',  // Pink
  peaceful: '#A8E6CF',   // Mint
  creative: '#D4A5F7',   // Soft purple
}
```

### Gradients
- **Bloom**: `from-pink-300 via-peach-300 to-lavender-300`
- **Calm**: `from-sky-300 via-mint-300 to-lavender-300`
- **Energetic**: `from-pink-400 via-peach-400 to-violet-400`
- **Peaceful**: `from-mint-300 via-sky-300 to-lavender-300`

## 🧩 UI Components

### BloomButton
Animated gradient button that "blooms" on click with particle effects.

```tsx
<BloomButton
  variant="primary" // primary | secondary | mint | lavender
  size="md"        // sm | md | lg
  onClick={handleClick}
  icon={<Icon />}
>
  Button Text
</BloomButton>
```

**Animation Variants**:
- **Idle**: Subtle glow pulse
- **Hover**: Scale up + enhanced glow
- **Active**: Ripple effect + particles burst

### XPToast
Floating +XP particle animation with confetti burst.

```tsx
<XPToast
  xp={25}
  show={true}
  onComplete={() => setShow(false)}
  position={{ x: 50, y: 80 }}
/>
```

**Features**:
- Floating animation upward
- Confetti burst particles
- Auto-dismiss after 2 seconds

### MoodBackground
Gradient that shifts hue based on current detected mood.

```tsx
<MoodBackground mood="calm" intensity={0.7}>
  {children}
</MoodBackground>
```

**Moods**: calm | happy | reflective | energetic | peaceful | creative

### AIAvatar
Mira's expressive avatar with dynamic states.

```tsx
<AIAvatar
  mood="calm"
  size="lg"
  isSpeaking={false}
/>
```

**Features**:
- Mood-based color gradients
- Orbiting particles
- Speaking indicator
- Animated glow effect

### AchievementCard
Flipping card that bursts confetti when unlocked.

```tsx
<AchievementCard
  title="First Steps"
  description="Completed your first challenge"
  icon="🌟"
  unlocked={true}
  rarity="rare"
  onUnlock={() => {}}
/>
```

**Rarity Colors**:
- Common: Gray
- Rare: Blue
- Epic: Purple
- Legendary: Gold gradient

### QuestMap
Challenge flow visualization with animated paths.

```tsx
<QuestMap
  quests={[
    { id: '1', title: 'Quest 1', status: 'completed', x: 10, y: 20 },
    { id: '2', title: 'Quest 2', status: 'available', x: 50, y: 40 },
  ]}
  onQuestClick={(id) => {}}
/>
```

## 🎭 Animations

### Bloom Animation
```css
@keyframes bloom {
  0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
  50% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
```

### Floating Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

### Glow Pulse
```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 143, 163, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 143, 163, 0.6); }
}
```

## 🎮 Interaction Patterns

### Buttons
- **Hover**: Soft bounce + glow ripple
- **Click**: Bloom scale + particle burst
- **Loading**: Spinning bloom petals

### Chat Interface
- **Message appearance**: Bloom + particle sparkle
- **Background**: Hue pulse with conversation tone
- **Typing indicator**: Pulsing bubble (Framer Motion spring)

### Loading States
- Spinning bloom petals
- Floating orbs with gentle motion
- Gradient pulse

### Achievements
- Card flip animation
- Confetti burst (30 particles)
- Sparkle effect overlay

## 📱 Emotionally Adaptive UI

The UI adapts based on:
1. **Detected Mood**: Changes color gradients and ambient effects
2. **Time of Day**: 
   - Morning: Energetic tones
   - Afternoon: Happy tones
   - Evening: Reflective tones
   - Night: Calm tones
3. **User Progress**: Garden grows, more plants appear
4. **Conversation Tone**: Chat background adjusts hue

## 🔊 Sound & Haptic Feedback

### Suggested Sound Effects
- **XP Gain**: Gentle chime (high-pitched, soft)
- **Achievement Unlock**: Melodic ascending notes
- **Button Click**: Soft "pop" or "blip"
- **Message Sent**: Subtle whoosh
- **Level Up**: Celebratory fanfare (gentle, not jarring)

### Haptic Feedback
- **XP Toast**: Light tap vibration
- **Achievement**: Double tap (short-long)
- **Button Press**: Light tap
- **Level Up**: Stronger vibration pattern

## 🎯 Usage Examples

### Basic Page with Mood Background
```tsx
import { MoodBackground } from './components/ui/MoodBackground';
import { useTheme } from './contexts/ThemeContext';

function MyPage() {
  const { mood } = useTheme();
  
  return (
    <MoodBackground mood={mood}>
      <div className="p-8">
        {/* Your content */}
      </div>
    </MoodBackground>
  );
}
```

### Button with XP Reward
```tsx
import { BloomButton } from './components/ui/BloomButton';
import { XPToast } from './components/ui/XPToast';
import { useGamification } from './contexts/GamificationContext';

function MyComponent() {
  const { addXP } = useGamification();
  const [showXP, setShowXP] = useState(false);
  
  const handleAction = async () => {
    await addXP({
      id: Date.now().toString(),
      type: 'game',
      xp: 25,
      description: 'Completed action',
      timestamp: new Date(),
    });
    setShowXP(true);
  };
  
  return (
    <>
      <BloomButton onClick={handleAction}>
        Do Something
      </BloomButton>
      <XPToast xp={25} show={showXP} onComplete={() => setShowXP(false)} />
    </>
  );
}
```

## 🌸 Bloom Animations

All animations use the "bloom" easing function:
```typescript
easing: [0.34, 1.56, 0.64, 1] // Custom bloom easing
```

This creates a gentle "bounce-back" effect that mimics a flower opening.

## 📐 Spacing & Layout

- **Container padding**: `p-6` or `p-8` for main content
- **Card spacing**: `gap-4` or `gap-6` for grids
- **Section spacing**: `mb-8` or `mb-12` between sections
- **Border radius**: `rounded-2xl` or `rounded-3xl` for major cards

## 🎨 Glassmorphism

Use the `.glass` or `.glass-strong` utility classes:
```tsx
<div className="glass rounded-2xl p-6">
  {/* Content with glass effect */}
</div>
```

This creates a frosted glass effect with backdrop blur.

