import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock } from "lucide-react";
import { getLoginUrl } from "@/const";

interface TeaserGeneratorProps {
  referralCode?: string | null;
}

export default function TeaserGenerator({ referralCode }: TeaserGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowTeaser(true);
    }, 2000);
  };

  const teaserScript = `🔥 STOP SCROLLING! I found 5 ${topic} that actually changed my life. Number 3 will blow your mind! 🤯

Here's what you need to know...`;

  const blurredContent = `[🔒 Premium Content Locked]

✨ Auto-detected products:
• Product 1: [AFFILIATE LINK]
• Product 2: [AFFILIATE LINK]  
• Product 3: [AFFILIATE LINK]

💰 Full script with monetization links
📋 Copy & paste ready
🎯 Optimized for viral engagement`;

  return (
    <Card className="bg-slate-800/90 border-slate-700 p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span>infinitycreators.com/generator</span>
        </div>

        <div className="space-y-3">
          <div className="text-white font-medium">✨ Try the Viral Script Generator</div>
          
          {!showTeaser ? (
            <>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <div className="text-sm text-slate-400 mb-2">Enter your topic:</div>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., tech gadgets under $50"
                  className="bg-slate-800 border-slate-600 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  '✨ Generate Script'
                )}
              </Button>
            </>
          ) : (
            <div className="relative">
              {/* Teaser Content (visible) */}
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/30">
                <div className="text-sm text-blue-400 font-medium mb-2">✅ Generated Script:</div>
                <div className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                  {teaserScript}
                </div>
              </div>

              {/* Blurred Content with Overlay */}
              <div className="relative mt-4">
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/30 blur-sm select-none">
                  <div className="text-white text-sm whitespace-pre-wrap leading-relaxed opacity-50">
                    {blurredContent}
                  </div>
                </div>

                {/* Signup CTA Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center bg-slate-900/95 rounded-xl p-6 border-2 border-blue-500 shadow-2xl max-w-sm">
                    <Lock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Unlock Full Script + Affiliate Links
                    </h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Get the complete script with automatic affiliate links ready to copy & paste
                    </p>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      asChild
                    >
                      <a href={getLoginUrl(referralCode || undefined)}>
                        🔓 Create Free Account
                      </a>
                    </Button>
                    <p className="text-xs text-slate-400 mt-3">
                      No credit card required • 5 free scripts
                    </p>
                  </div>
                </div>
              </div>

              {/* Try Again Button */}
              <Button
                onClick={() => {
                  setShowTeaser(false);
                  setTopic('');
                }}
                variant="outline"
                className="w-full mt-4 border-slate-600 text-white hover:bg-slate-800"
              >
                Try Another Topic
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
