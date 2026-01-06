import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AnimatedDemo() {
  const [step, setStep] = useState<'typing' | 'generating' | 'result' | 'reset'>('typing');
  const [typedText, setTypedText] = useState('');
  const [resultText, setResultText] = useState('');
  
  const inputText = "viral tech gadgets under $50";
  const generatedScript = "🔥 STOP SCROLLING! I found 5 Amazon tech gadgets under $50 that actually changed my life. Number 3 will blow your mind! 🤯\n\n[Auto-detected products with affiliate links inserted]";

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (step === 'typing') {
      if (typedText.length < inputText.length) {
        timeout = setTimeout(() => {
          setTypedText(inputText.slice(0, typedText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => setStep('generating'), 500);
      }
    }

    if (step === 'generating') {
      timeout = setTimeout(() => setStep('result'), 2000);
    }

    if (step === 'result') {
      if (resultText.length < generatedScript.length) {
        timeout = setTimeout(() => {
          setResultText(generatedScript.slice(0, resultText.length + 2));
        }, 30);
      } else {
        timeout = setTimeout(() => setStep('reset'), 3000);
      }
    }

    if (step === 'reset') {
      setTypedText('');
      setResultText('');
      timeout = setTimeout(() => setStep('typing'), 500);
    }

    return () => clearTimeout(timeout);
  }, [step, typedText, resultText]);

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
          <div className="text-white font-medium">✨ Viral Script Generator</div>
          
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <div className="text-sm text-slate-400 mb-2">Enter your topic:</div>
            <div className="text-white min-h-[24px]">
              {typedText}
              {step === 'typing' && <span className="animate-pulse">|</span>}
            </div>
          </div>

          {step === 'generating' && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <span className="text-blue-400">Generating viral script...</span>
            </div>
          )}

          {(step === 'result' || step === 'reset') && resultText && (
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/30 animate-in fade-in duration-500">
              <div className="text-sm text-blue-400 font-medium mb-2">✅ Generated Script:</div>
              <div className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                {resultText}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
