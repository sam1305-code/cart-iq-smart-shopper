import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VoiceAssistantProps {
  isListening: boolean;
  onToggleListening: () => void;
  onVoiceCommand: (command: string) => void;
}

export function VoiceAssistant({ isListening, onToggleListening, onVoiceCommand }: VoiceAssistantProps) {
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');

  // Simulate voice recognition for demo
  useEffect(() => {
    if (isListening) {
      const timer = setTimeout(() => {
        const mockCommands = [
          "Show me eco-friendly alternatives",
          "What's the carbon footprint of my cart?", 
          "Find organic options",
          "Where can I find almond milk?",
          "Is there a better alternative to regular detergent?",
          "What aisle is the pasta in?",
          "Do you have any sulfate-free shampoo?",
          "Show me local and sustainable options",
          "What's the healthiest bread you have?",
          "Where are the cleaning supplies located?",
          "Are there any plant-based alternatives to this?",
          "What's the most eco-friendly laundry option?",
          "How can I reduce my environmental impact?",
          "Show me products with less packaging"
        ];
        const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
        setCurrentTranscript(randomCommand);
        onVoiceCommand(randomCommand);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setCurrentTranscript('');
    }
  }, [isListening, onVoiceCommand]);

  const VoiceWaveform = () => (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-primary rounded-full ${
            isListening ? 'animate-voice-wave' : 'h-2'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isListening ? '20px' : '8px'
          }}
        />
      ))}
    </div>
  );

  return (
    <Card className="p-6 bg-gradient-card border-0 shadow-card">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant={isListening ? "voice" : "outline"}
            size="lg"
            onClick={onToggleListening}
            className={`rounded-full p-4 ${isListening ? 'shadow-voice' : ''}`}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
          
          <VoiceWaveform />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">EcoCart Assistant</h3>
          <p className="text-muted-foreground text-sm">
            {isListening ? 'Listening...' : 'Tap microphone to start'}
          </p>
        </div>

        {currentTranscript && (
          <div className="w-full p-4 bg-accent rounded-lg animate-fade-in">
            <div className="flex items-start gap-2">
              <Volume2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm font-medium">"{currentTranscript}"</p>
            </div>
          </div>
        )}

        {lastResponse && (
          <div className="w-full p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
            <p className="text-sm text-primary">{lastResponse}</p>
          </div>
        )}
      </div>
    </Card>
  );
}