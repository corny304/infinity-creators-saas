import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Sparkles, TrendingUp, Lock, Check } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useEffect, useState } from "react";
import TeaserGenerator from "@/components/TeaserGenerator";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // SEO: Set dynamic page title and meta tags for OF creators
  useEffect(() => {
    document.title = "Viral Scripts für OnlyFans & TikTok | Infinity Creators";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AI-generierte Scripts für OnlyFans-Creator: PPV-Upsells, Story-Polls, Link-in-Bio-Funnels. Optimiert für TikTok, Instagram Reels & YouTube Shorts.');
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'OnlyFans Scripts, OF Creator Tools, PPV Upsell, TikTok Scripts, Reels Scripts, Content Creator AI, Viral Shorts Generator');
    }
  }, []);

  // Detect and store referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    
    if (ref) {
      // Store referral code in localStorage for use during OAuth callback
      localStorage.setItem('pendingReferralCode', ref);
      setReferralCode(ref);
      
      // Clean up URL (remove ref parameter)
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else {
      // Check if there's a stored referral code
      const stored = localStorage.getItem('pendingReferralCode');
      if (stored) {
        setReferralCode(stored);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="font-bold text-white text-lg">Infinity Creators</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => navigate("/generator")}>
                  Generator
                </Button>
                <Button variant="ghost" onClick={() => navigate("/blog")}>
                  Blog
                </Button>
                <Button onClick={() => navigate("/pricing")}>
                  Pricing
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/blog")}>
                  Blog
                </Button>
                <Button asChild>
                  <a href={getLoginUrl(referralCode || undefined)}>Sign In</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - 2-Column Layout */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Viral Scripts für OnlyFans & Creator
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Generiere in 30 Sekunden perfekte TikTok/Reels-Scripts für PPV-Upsells, Story-Polls & Link-in-Bio-Funnels. Speziell für OF-Creator optimiert.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {isAuthenticated ? (
                <>
                  <Button size="lg" className="text-lg px-8" onClick={() => navigate("/generator")}>
                    ✨ Start Generating
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8 border-slate-600 text-white hover:bg-slate-800" onClick={() => navigate("/pricing")}>
                    View Pricing
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="text-lg px-8" asChild>
                    <a href={getLoginUrl(referralCode || undefined)}>Get Started Free</a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8 border-slate-600 text-white hover:bg-slate-800" onClick={() => navigate("/pricing")}>
                    View Pricing
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-yellow-400">⚡ 30s</div>
                <p className="text-slate-400 text-sm mt-1">Generate a complete script</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-yellow-400">💰</div>
                <p className="text-slate-400 text-sm mt-1">Monetized</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-yellow-400">🚀</div>
                <p className="text-slate-400 text-sm mt-1">Unlimited</p>
              </div>
            </div>
          </div>

          {/* Right: Animated Demo */}
          <div className="relative">
            <TeaserGenerator referralCode={referralCode} />
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold">
              ✨ AI-Powered
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Monetization Feature Section */}
      <section className="bg-slate-800/30 border-y border-slate-700 py-20 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Stop Hunting. Start Earning.
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Why spend hours searching? Our AI automatically detects products in your script and inserts high-paying affiliate links instantly.
              </p>

              {/* Bullet Points with Icons */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-500/20 rounded-lg p-2 mt-1">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Auto-Link Injection</h3>
                    <p className="text-slate-400">We find the exact gear or products mentioned in your video and insert the links for you.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/20 rounded-lg p-2 mt-1">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Context-Aware</h3>
                    <p className="text-slate-400">Whether it's a "Tech Review" or a "Makeup Tutorial", the AI selects relevant products that fit your niche.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 rounded-lg p-2 mt-1">
                    <Check className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Ready to Earn</h3>
                    <p className="text-slate-400">Just copy the script, paste the links in your bio/description, and start generating commissions.</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="text-lg px-8" onClick={() => isAuthenticated ? navigate("/generator") : window.location.href = getLoginUrl()}>
                Generate Monetized Script →
              </Button>
            </div>

            {/* Right: Feature Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                <img 
                  src="/monetization-feature.png" 
                  alt="Auto-detected Affiliate Links in Script" 
                  className="w-full h-auto"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold">
                💰 Auto-Monetized
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Why Choose Infinity Creators?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <Sparkles className="w-8 h-8 text-yellow-400 mb-2" />
              <CardTitle className="text-white">AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Advanced AI generates engaging, viral-worthy scripts optimized for short-form platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <Zap className="w-8 h-8 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Get professional scripts in seconds, not hours. Perfect for content creators on deadline.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Monetized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Automatic affiliate links for equipment mentioned in scripts. Earn passive income.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <Lock className="w-8 h-8 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Your data is encrypted and never shared. Full control over your content.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Simple Pricing</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Free</CardTitle>
              <CardDescription className="text-slate-400">Get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-white">$0</div>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ 3 free scripts</li>
                <li>✓ Basic features</li>
                <li>✓ Affiliate links</li>
              </ul>
              <Button className="w-full" asChild>
                <a href={getLoginUrl()}>Get Started</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-yellow-500 ring-2 ring-yellow-500/50 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              🔥 Early Adopter Deal
            </div>
            <CardHeader className="pt-8">
              <CardTitle className="text-white">Pro</CardTitle>
              <CardDescription className="text-slate-400">For creators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-500 line-through">$29</span>
                <span className="text-4xl font-bold text-white">$9<span className="text-sm text-slate-400">/mo</span></span>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                <p className="text-xs text-yellow-400 font-medium">⚡ First 100 users only • Lock in this price forever</p>
              </div>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Unlimited scripts</li>
                <li>✓ All features</li>
                <li>✓ Affiliate links</li>
                <li>✓ Priority support</li>
              </ul>
              <Button className="w-full" onClick={() => navigate("/pricing")}>
                Subscribe
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Agency</CardTitle>
              <CardDescription className="text-slate-400">For teams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-white">$99<span className="text-sm text-slate-400">/mo</span></div>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Unlimited scripts</li>
                <li>✓ Team management</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Dedicated support</li>
              </ul>
              <Button className="w-full" onClick={() => navigate("/pricing")}>
                Subscribe
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-500 to-orange-500 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Create Viral Content?</h2>
          <p className="text-lg text-white/90 mb-8">
            Start generating AI-powered scripts with automatic affiliate links today.
          </p>
          {isAuthenticated ? (
            <Button size="lg" className="text-lg px-8 bg-slate-900 hover:bg-slate-800" onClick={() => navigate("/generator")}>
              Start Generating Now
            </Button>
          ) : (
            <Button size="lg" className="text-lg px-8 bg-slate-900 hover:bg-slate-800" asChild>
              <a href={getLoginUrl()}>Get Started Free</a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer with Legal Links */}
      <footer className="border-t border-slate-700 bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
            <p className="text-sm">
              © 2024 Infinity Creators. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/impressum.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Impressum
              </a>
              <a href="/datenschutz.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Datenschutz
              </a>
              <a href="/agb.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                AGB
              </a>
              <a href="/widerruf.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Widerruf
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
