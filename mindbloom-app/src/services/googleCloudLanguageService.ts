/**
 * Google Cloud Natural Language API Service
 * 
 * Provides sentiment analysis, entity extraction, and content classification
 * Useful for crisis detection and understanding user emotions
 */

interface SentimentAnalysisResult {
  score: number; // -1.0 to 1.0
  magnitude: number; // 0.0 to infinity
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface Entity {
  name: string;
  type: string;
  salience: number; // 0.0 to 1.0
  metadata?: Record<string, string>;
}

interface AnalyzeSentimentResponse {
  documentSentiment: SentimentAnalysisResult;
  sentences?: Array<{
    text: { content: string };
    sentiment: SentimentAnalysisResult;
  }>;
  language?: string;
}

interface AnalyzeEntitiesResponse {
  entities: Entity[];
  language?: string;
}

interface ClassificationCategory {
  name: string;
  confidence: number;
}

interface ClassifyTextResponse {
  categories: ClassificationCategory[];
}

class GoogleCloudLanguageService {
  private proxyUrl: string | null;

  constructor() {
    this.proxyUrl = process.env.REACT_APP_GOOGLE_CLOUD_PROXY_URL || null;
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string, language?: string): Promise<SentimentAnalysisResult> {
    if (!this.proxyUrl) {
      // Fallback to simple sentiment analysis
      return this.fallbackSentimentAnalysis(text);
    }

    const response = await fetch(`${this.proxyUrl}/language/analyze-sentiment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          type: 'PLAIN_TEXT',
          content: text,
          languageCode: language || 'en',
        },
        encodingType: 'UTF8',
      }),
    });

    if (!response.ok) {
      console.warn('Cloud Language API failed, using fallback');
      return this.fallbackSentimentAnalysis(text);
    }

    const data: AnalyzeSentimentResponse = await response.json();
    
    // Determine sentiment from score
    let sentiment: 'positive' | 'negative' | 'neutral';
    if (data.documentSentiment.score > 0.25) {
      sentiment = 'positive';
    } else if (data.documentSentiment.score < -0.25) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }

    return {
      score: data.documentSentiment.score,
      magnitude: data.documentSentiment.magnitude,
      sentiment,
    };
  }

  /**
   * Extract entities from text
   */
  async extractEntities(text: string, language?: string): Promise<Entity[]> {
    if (!this.proxyUrl) {
      return [];
    }

    const response = await fetch(`${this.proxyUrl}/language/analyze-entities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          type: 'PLAIN_TEXT',
          content: text,
          languageCode: language || 'en',
        },
        encodingType: 'UTF8',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Entity extraction error: ${response.status} - ${error.message || 'Unknown error'}`);
    }

    const data: AnalyzeEntitiesResponse = await response.json();
    return data.entities.map(entity => ({
      name: entity.name,
      type: entity.type,
      salience: entity.salience,
      metadata: entity.metadata,
    }));
  }

  /**
   * Classify text into categories
   */
  async classifyText(text: string): Promise<ClassificationCategory[]> {
    if (!this.proxyUrl) {
      return [];
    }

    const response = await fetch(`${this.proxyUrl}/language/classify-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          type: 'PLAIN_TEXT',
          content: text,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Text classification error: ${response.status} - ${error.message || 'Unknown error'}`);
    }

    const data: ClassifyTextResponse = await response.json();
    return data.categories || [];
  }

  /**
   * Enhanced crisis detection using sentiment analysis
   */
  async detectCrisis(text: string): Promise<{
    isCrisis: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    indicators: string[];
  }> {
    // Crisis keywords
    const criticalKeywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'want to die', 'take my life'];
    const highKeywords = ['depressed', 'hopeless', 'worthless', 'can\'t go on', 'give up', 'no point'];
    const mediumKeywords = ['sad', 'lonely', 'anxious', 'worried', 'stressed', 'overwhelmed'];
    
    const lowerText = text.toLowerCase();
    
    // Check for critical keywords
    const criticalMatches = criticalKeywords.filter(keyword => lowerText.includes(keyword));
    if (criticalMatches.length > 0) {
      return {
        isCrisis: true,
        severity: 'critical',
        confidence: 0.95,
        indicators: criticalMatches,
      };
    }

    // Analyze sentiment
    let sentiment: SentimentAnalysisResult;
    try {
      sentiment = await this.analyzeSentiment(text);
    } catch (error) {
      sentiment = this.fallbackSentimentAnalysis(text);
    }

    // Combine sentiment with keywords
    const highMatches = highKeywords.filter(keyword => lowerText.includes(keyword));
    const mediumMatches = mediumKeywords.filter(keyword => lowerText.includes(keyword));

    if (highMatches.length > 0 && sentiment.score < -0.5) {
      return {
        isCrisis: true,
        severity: 'high',
        confidence: 0.85,
        indicators: highMatches,
      };
    }

    if (mediumMatches.length > 0 && sentiment.score < -0.3) {
      return {
        isCrisis: true,
        severity: 'medium',
        confidence: 0.7,
        indicators: mediumMatches,
      };
    }

    if (sentiment.score < -0.7 && sentiment.magnitude > 0.5) {
      return {
        isCrisis: true,
        severity: 'medium',
        confidence: 0.75,
        indicators: ['negative sentiment'],
      };
    }

    return {
      isCrisis: false,
      severity: 'low',
      confidence: 0.5,
      indicators: [],
    };
  }

  /**
   * Get emotional tone analysis
   */
  async analyzeEmotionalTone(text: string): Promise<{
    primaryEmotion: string;
    emotions: Array<{ emotion: string; intensity: number }>;
    overall: SentimentAnalysisResult;
  }> {
    const sentiment = await this.analyzeSentiment(text);
    
    // Map sentiment to emotions
    const emotions: Array<{ emotion: string; intensity: number }> = [];
    
    if (sentiment.score > 0.5) {
      emotions.push({ emotion: 'joy', intensity: sentiment.score });
      emotions.push({ emotion: 'contentment', intensity: sentiment.score * 0.7 });
    } else if (sentiment.score < -0.5) {
      emotions.push({ emotion: 'sadness', intensity: Math.abs(sentiment.score) });
      emotions.push({ emotion: 'anxiety', intensity: sentiment.magnitude * 0.5 });
    } else {
      emotions.push({ emotion: 'neutral', intensity: 0.5 });
    }

    // Detect specific emotions from keywords
    const lowerText = text.toLowerCase();
    if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
      emotions.push({ emotion: 'anger', intensity: 0.7 });
    }
    if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) {
      emotions.push({ emotion: 'anxiety', intensity: 0.8 });
    }
    if (lowerText.includes('lonely') || lowerText.includes('isolated')) {
      emotions.push({ emotion: 'loneliness', intensity: 0.7 });
    }

    // Get primary emotion (highest intensity)
    const primaryEmotion = emotions.reduce((prev, current) => 
      (current.intensity > prev.intensity) ? current : prev
    , emotions[0] || { emotion: 'neutral', intensity: 0 });

    return {
      primaryEmotion: primaryEmotion.emotion,
      emotions,
      overall: sentiment,
    };
  }

  /**
   * Fallback sentiment analysis (simple keyword-based)
   */
  private fallbackSentimentAnalysis(text: string): SentimentAnalysisResult {
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'amazing', 'love', 'enjoy', 'excited', 'grateful'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'worried', 'anxious', 'depressed'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });

    const total = words.length;
    const score = total > 0 ? (positiveCount - negativeCount) / total : 0;
    const magnitude = Math.abs(score);

    let sentiment: 'positive' | 'negative' | 'neutral';
    if (score > 0.1) {
      sentiment = 'positive';
    } else if (score < -0.1) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }

    return { score, magnitude, sentiment };
  }
}

// Export singleton instance
export const googleCloudLanguageService = new GoogleCloudLanguageService();
export default GoogleCloudLanguageService;

