import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Palette, 
  Bell, 
  Eye, 
  EyeOff,
  Heart,
  Phone,
  Lock,
  User,
  Sparkles,
  Moon,
  Sun,
  Settings,
  Check,
  AlertTriangle,
  Info,
  Save,
  RotateCcw,
  Star,
  Zap,
  Users,
  MessageCircle
} from 'lucide-react';

interface SettingsPageProps {
  user: any;
  onBack: () => void;
}

interface UserSettings {
  // Privacy Settings
  displayName: 'full' | 'nickname' | 'anonymous';
  showAvatar: boolean;
  showActivity: boolean;
  
  // Appearance Settings
  avatarStyle: 'pixel' | 'minimal' | 'detailed';
  theme: 'light' | 'dark' | 'auto';
  colorPalette: 'warm' | 'cool' | 'neutral' | 'vibrant';
  backgroundStyle: 'gradient' | 'solid' | 'pattern';
  
  // Notification Settings
  challengeReminders: boolean;
  storyNudges: boolean;
  wellnessCheckIns: boolean;
  communityUpdates: boolean;
  notificationFrequency: 'gentle' | 'moderate' | 'minimal';
  
  // Wellness Preferences
  wellnessFocus: string[];
  preferredChallenges: string[];
  moodTracking: boolean;
  goalSetting: boolean;
  
  // Emergency Settings
  emergencyContacts: string[];
  crisisMode: boolean;
}

const avatarStyles = [
  { id: 'pixel', name: 'Pixel Art', icon: '🎮', description: 'Retro gaming style' },
  { id: 'minimal', name: 'Minimal', icon: '⚪', description: 'Clean and simple' },
  { id: 'detailed', name: 'Detailed', icon: '👤', description: 'More realistic' }
];

const colorPalettes = [
  { id: 'warm', name: 'Warm', colors: ['#FF6B6B', '#FFE66D', '#FF8E53'], description: 'Cozy and comforting' },
  { id: 'cool', name: 'Cool', colors: ['#4ECDC4', '#45B7D1', '#96CEB4'], description: 'Calm and peaceful' },
  { id: 'neutral', name: 'Neutral', colors: ['#A8A8A8', '#D3D3D3', '#F5F5F5'], description: 'Balanced and serene' },
  { id: 'vibrant', name: 'Vibrant', colors: ['#FF9FF3', '#54A0FF', '#5F27CD'], description: 'Energetic and uplifting' }
];

const wellnessFocusOptions = [
  { id: 'gratitude', name: 'Gratitude', icon: '🙏', description: 'Focus on appreciation and thankfulness' },
  { id: 'resilience', name: 'Resilience', icon: '💪', description: 'Build strength and bounce back' },
  { id: 'calm', name: 'Calm', icon: '🧘', description: 'Find peace and mindfulness' },
  { id: 'connection', name: 'Connection', icon: '🤝', description: 'Build relationships and community' },
  { id: 'creativity', name: 'Creativity', icon: '🎨', description: 'Express yourself through art and ideas' },
  { id: 'growth', name: 'Growth', icon: '🌱', description: 'Learn and develop new skills' }
];

const emergencyContacts = [
  { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
  { name: 'SAMHSA National Helpline', number: '1-800-662-4357', available: '24/7' }
];

export function SettingsPage({ user, onBack }: SettingsPageProps) {
  const [settings, setSettings] = useState<UserSettings>({
    displayName: 'anonymous',
    showAvatar: true,
    showActivity: false,
    avatarStyle: 'pixel',
    theme: 'auto',
    colorPalette: 'warm',
    backgroundStyle: 'gradient',
    challengeReminders: true,
    storyNudges: true,
    wellnessCheckIns: true,
    communityUpdates: false,
    notificationFrequency: 'gentle',
    wellnessFocus: ['gratitude', 'calm'],
    preferredChallenges: ['mindfulness', 'breathing'],
    moodTracking: true,
    goalSetting: true,
    emergencyContacts: [],
    crisisMode: false
  });

  const [activeSection, setActiveSection] = useState<string>('privacy');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('mindbloom-settings', JSON.stringify(settings));
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    setSettings({
      displayName: 'anonymous',
      showAvatar: true,
      showActivity: false,
      avatarStyle: 'pixel',
      theme: 'auto',
      colorPalette: 'warm',
      backgroundStyle: 'gradient',
      challengeReminders: true,
      storyNudges: true,
      wellnessCheckIns: true,
      communityUpdates: false,
      notificationFrequency: 'gentle',
      wellnessFocus: ['gratitude', 'calm'],
      preferredChallenges: ['mindfulness', 'breathing'],
      moodTracking: true,
      goalSetting: true,
      emergencyContacts: [],
      crisisMode: false
    });
    setHasChanges(true);
  };

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const sections = [
    { id: 'privacy', name: 'Privacy & Safety', icon: Shield, color: 'from-red-500 to-pink-500' },
    { id: 'appearance', name: 'Appearance', icon: Palette, color: 'from-purple-500 to-indigo-500' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'from-blue-500 to-cyan-500' },
    { id: 'wellness', name: 'Wellness Focus', icon: Heart, color: 'from-green-500 to-teal-500' },
    { id: 'emergency', name: 'Emergency', icon: Phone, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-blue-500" />
                Your Safe Space
              </h1>
              <p className="text-gray-600">Customize your wellness journey with complete privacy</p>
            </div>
          </div>
          {hasChanges && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Privacy & Safety Section */}
              {activeSection === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Privacy & Safety</h2>
                        <p className="text-gray-600">Your data is yours — we protect it</p>
                      </div>
                    </div>

                    {/* Privacy Explanation */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <Lock className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-green-800 mb-2">Your Safe Space</h3>
                          <p className="text-sm text-green-700">
                            Everything you share here stays private. We never share your personal information, 
                            and all your conversations are confidential. This is your safe space to grow and heal.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Display Name Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">How Others See You</h3>
                      
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="displayName"
                            value="anonymous"
                            checked={settings.displayName === 'anonymous'}
                            onChange={(e) => updateSetting('displayName', e.target.value as any)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">Fully Anonymous</div>
                            <div className="text-sm text-gray-600">Others only see your avatar and level</div>
                          </div>
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        </label>

                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="displayName"
                            value="nickname"
                            checked={settings.displayName === 'nickname'}
                            onChange={(e) => updateSetting('displayName', e.target.value as any)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">Nickname Only</div>
                            <div className="text-sm text-gray-600">Show a friendly nickname you choose</div>
                          </div>
                          <User className="w-5 h-5 text-gray-400" />
                        </label>

                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="displayName"
                            value="full"
                            checked={settings.displayName === 'full'}
                            onChange={(e) => updateSetting('displayName', e.target.value as any)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">Full Name</div>
                            <div className="text-sm text-gray-600">Show your complete name (less private)</div>
                          </div>
                          <Eye className="w-5 h-5 text-gray-400" />
                        </label>
                      </div>
                    </div>

                    {/* Activity Visibility */}
                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-medium text-gray-800">Activity Visibility</h3>
                      
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">Show Avatar</div>
                              <div className="text-sm text-gray-600">Let others see your avatar in community spaces</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.showAvatar}
                            onChange={(e) => updateSetting('showAvatar', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">Show Activity</div>
                              <div className="text-sm text-gray-600">Share your wellness progress with the community</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.showActivity}
                            onChange={(e) => updateSetting('showActivity', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Data Transparency */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-blue-800 mb-2">How We Protect Your Data</h3>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• All conversations are encrypted and never shared</li>
                            <li>• Your personal information stays on your device</li>
                            <li>• We never sell or share your data with third parties</li>
                            <li>• You can delete your data anytime</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Palette className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Appearance</h2>
                        <p className="text-gray-600">Make the app feel like home</p>
                      </div>
                    </div>

                    {/* Avatar Style */}
                    <div className="space-y-4 mb-6">
                      <h3 className="text-lg font-medium text-gray-800">Avatar Style</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {avatarStyles.map((style) => (
                          <label
                            key={style.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              settings.avatarStyle === style.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="avatarStyle"
                              value={style.id}
                              checked={settings.avatarStyle === style.id}
                              onChange={(e) => updateSetting('avatarStyle', e.target.value as any)}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <div className="text-3xl mb-2">{style.icon}</div>
                              <div className="font-medium text-gray-800">{style.name}</div>
                              <div className="text-sm text-gray-600">{style.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div className="space-y-4 mb-6">
                      <h3 className="text-lg font-medium text-gray-800">Color Palette</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {colorPalettes.map((palette) => (
                          <label
                            key={palette.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              settings.colorPalette === palette.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="colorPalette"
                              value={palette.id}
                              checked={settings.colorPalette === palette.id}
                              onChange={(e) => updateSetting('colorPalette', e.target.value as any)}
                              className="sr-only"
                            />
                            <div className="flex items-center space-x-3">
                              <div className="flex space-x-1">
                                {palette.colors.map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{palette.name}</div>
                                <div className="text-sm text-gray-600">{palette.description}</div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Theme */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'light', name: 'Light', icon: Sun, description: 'Bright and cheerful' },
                          { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
                          { id: 'auto', name: 'Auto', icon: Settings, description: 'Follows system' }
                        ].map((theme) => (
                          <label
                            key={theme.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              settings.theme === theme.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="theme"
                              value={theme.id}
                              checked={settings.theme === theme.id}
                              onChange={(e) => updateSetting('theme', e.target.value as any)}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <theme.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                              <div className="font-medium text-gray-800">{theme.name}</div>
                              <div className="text-sm text-gray-600">{theme.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Gentle Nudges</h2>
                        <p className="text-gray-600">Stay connected with supportive reminders</p>
                      </div>
                    </div>

                    {/* Notification Frequency */}
                    <div className="space-y-4 mb-6">
                      <h3 className="text-lg font-medium text-gray-800">How Often?</h3>
                      <div className="space-y-3">
                        {[
                          { id: 'minimal', name: 'Minimal', description: 'Only important updates' },
                          { id: 'gentle', name: 'Gentle', description: 'A few helpful nudges per day' },
                          { id: 'moderate', name: 'Moderate', description: 'Regular wellness check-ins' }
                        ].map((freq) => (
                          <label
                            key={freq.id}
                            className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 ${
                              settings.notificationFrequency === freq.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="notificationFrequency"
                              value={freq.id}
                              checked={settings.notificationFrequency === freq.id}
                              onChange={(e) => updateSetting('notificationFrequency', e.target.value as any)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <div>
                              <div className="font-medium text-gray-800">{freq.name}</div>
                              <div className="text-sm text-gray-600">{freq.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Notification Types */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">What Would You Like?</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'challengeReminders', name: 'Challenge Reminders', description: 'Gentle nudges for daily wellness challenges' },
                          { key: 'storyNudges', name: 'Story Sharing', description: 'Encouragement to share your journey' },
                          { key: 'wellnessCheckIns', name: 'Wellness Check-ins', description: 'How are you feeling today?' },
                          { key: 'communityUpdates', name: 'Community Updates', description: 'New stories and community activity' }
                        ].map((notif) => (
                          <label
                            key={notif.key}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <div>
                              <div className="font-medium text-gray-800">{notif.name}</div>
                              <div className="text-sm text-gray-600">{notif.description}</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings[notif.key as keyof UserSettings] as boolean}
                              onChange={(e) => updateSetting(notif.key as keyof UserSettings, e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Wellness Focus Section */}
              {activeSection === 'wellness' && (
                <motion.div
                  key="wellness"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Wellness Focus</h2>
                        <p className="text-gray-600">Choose what matters most to you</p>
                      </div>
                    </div>

                    {/* Wellness Focus Options */}
                    <div className="space-y-4 mb-6">
                      <h3 className="text-lg font-medium text-gray-800">What Would You Like to Focus On?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wellnessFocusOptions.map((option) => (
                          <label
                            key={option.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              settings.wellnessFocus.includes(option.id)
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={settings.wellnessFocus.includes(option.id)}
                              onChange={(e) => {
                                const newFocus = e.target.checked
                                  ? [...settings.wellnessFocus, option.id]
                                  : settings.wellnessFocus.filter(f => f !== option.id);
                                updateSetting('wellnessFocus', newFocus);
                              }}
                              className="sr-only"
                            />
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{option.icon}</div>
                              <div>
                                <div className="font-medium text-gray-800">{option.name}</div>
                                <div className="text-sm text-gray-600">{option.description}</div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Additional Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Additional Preferences</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'moodTracking', name: 'Mood Tracking', description: 'Track your daily mood and patterns' },
                          { key: 'goalSetting', name: 'Goal Setting', description: 'Set and track personal wellness goals' }
                        ].map((pref) => (
                          <label
                            key={pref.key}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <div>
                              <div className="font-medium text-gray-800">{pref.name}</div>
                              <div className="text-sm text-gray-600">{pref.description}</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings[pref.key as keyof UserSettings] as boolean}
                              onChange={(e) => updateSetting(pref.key as keyof UserSettings, e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Emergency Section */}
              {activeSection === 'emergency' && (
                <motion.div
                  key="emergency"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Emergency Support</h2>
                        <p className="text-gray-600">Help is always available when you need it</p>
                      </div>
                    </div>

                    {/* Crisis Mode Toggle */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <div>
                            <h3 className="font-medium text-red-800">Crisis Mode</h3>
                            <p className="text-sm text-red-700">Enable for immediate access to crisis resources</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.crisisMode}
                            onChange={(e) => updateSetting('crisisMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                    </div>

                    {/* Emergency Contacts */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Crisis Support Resources</h3>
                      <div className="space-y-3">
                        {emergencyContacts.map((contact, index) => (
                          <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-800">{contact.name}</h4>
                                <p className="text-sm text-gray-600">{contact.available}</p>
                                <p className="text-lg font-mono text-gray-800 mt-1">{contact.number}</p>
                              </div>
                              <button
                                onClick={() => handleEmergencyCall(contact.number)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                              >
                                <Phone className="w-4 h-4" />
                                <span>Call</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Safety Message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                      <div className="flex items-start space-x-3">
                        <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-blue-800 mb-2">You Are Not Alone</h3>
                          <p className="text-sm text-blue-700">
                            If you're having thoughts of self-harm, please reach out to these resources immediately. 
                            You matter, and there are people who want to help you through this.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
