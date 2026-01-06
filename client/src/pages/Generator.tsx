import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, Download, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Streamdown } from 'streamdown';

export default function Generator() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState<'funny' | 'professional' | 'casual' | 'motivational'>('casual');
  const [generatedScript, setGeneratedScript] = useState('');

  // SEO: Set dynamic page title
  useEffect(() => {
    document.title = "AI Script Generator - Create Viral Shorts | Infinity Creators";
  }, []);

  const { data: templates, isLoading: templatesLoading } = trpc.templates.list.useQuery();

  // Update placeholder when template changes
  useEffect(() => {
    if (selectedTemplate && templates) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        setTopic('');
      }
    }
  }, [selectedTemplate, templates]);

  const generateMutation = trpc.generation.create.useMutation({
    onSuccess: (data) => {
      setGeneratedScript(data.script);
      toast.success(`✨ Script generated! ${data.affiliateCount} affiliate links inserted.`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate script');
    },
  });

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    generateMutation.mutate({
      topic,
      targetAudience: audience || undefined,
      tone,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    toast.success('Script copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `script_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to generate scripts</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Generate Viral Shorts Script</h1>
          <p className="text-slate-600 mt-2">AI-powered script generation with automatic affiliate links</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">Script Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Template Selection */}
                <div>
                  <Label htmlFor="template" className="text-sm font-medium">
                    Template (Optional)
                  </Label>
                  <Select
                    value={selectedTemplate?.toString() || "custom"}
                    onValueChange={(value) => {
                      if (value === "custom") {
                        setSelectedTemplate(null);
                      } else {
                        setSelectedTemplate(parseInt(value));
                      }
                    }}
                    disabled={generateMutation.isPending}
                  >
                    <SelectTrigger id="template" className="mt-2">
                      <SelectValue placeholder="Custom (No Template)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom (No Template)</SelectItem>
                      {templates?.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.icon} {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTemplate && templates && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {templates.find(t => t.id === selectedTemplate)?.description}
                    </p>
                  )}
                </div>

                {/* Topic Input */}
                <div>
                  <Label htmlFor="topic" className="text-sm font-medium">
                    Topic or Keyword *
                  </Label>
                  <Input
                    id="topic"
                    placeholder={
                      selectedTemplate && templates
                        ? templates.find(t => t.id === selectedTemplate)?.topicPlaceholder || "e.g., How to start a YouTube channel"
                        : "e.g., How to start a YouTube channel"
                    }
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={generateMutation.isPending}
                    className="mt-2"
                  />
                  {selectedTemplate && templates && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Example: {templates.find(t => t.id === selectedTemplate)?.exampleTopic}
                    </p>
                  )}
                </div>

                {/* Target Audience */}
                <div>
                  <Label htmlFor="audience" className="text-sm font-medium">
                    Target Audience (Optional)
                  </Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Beginners, entrepreneurs"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    disabled={generateMutation.isPending}
                    className="mt-2"
                  />
                </div>

                {/* Tone Selection */}
                <div>
                  <Label htmlFor="tone" className="text-sm font-medium">
                    Tone
                  </Label>
                  <Select value={tone} onValueChange={(value: any) => setTone(value)} disabled={generateMutation.isPending}>
                    <SelectTrigger id="tone" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funny">😂 Funny</SelectItem>
                      <SelectItem value="professional">💼 Professional</SelectItem>
                      <SelectItem value="casual">😊 Casual</SelectItem>
                      <SelectItem value="motivational">🚀 Motivational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !topic.trim()}
                  className="w-full mt-6"
                  size="lg"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin mr-2 w-4 h-4" />
                      Generating...
                    </>
                  ) : (
                    <>
                      ✨ Generate Script
                    </>
                  )}
                </Button>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-blue-900">
                    <strong>💡 Tip:</strong> The AI will automatically insert relevant affiliate links for equipment mentioned in the script.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Area */}
          <div className="lg:col-span-2">
            {generatedScript ? (
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-xl">Generated Script</CardTitle>
                    <CardDescription>Ready to use or edit</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 rounded-lg p-6 prose prose-sm max-w-none">
                    <Streamdown>{generatedScript}</Streamdown>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg font-medium">No script generated yet</p>
                    <p className="text-slate-400 text-sm mt-2">Enter a topic and click "Generate Script" to get started</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
