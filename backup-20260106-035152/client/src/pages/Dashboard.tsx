import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Zap, TrendingUp, Copy, Check, Users, Gift } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  
  const { data: creditInfo, isLoading } = trpc.credits.getBalance.useQuery(undefined, {
    enabled: !!user,
  });
  
  const { data: referralCode } = trpc.referral.getMyReferralCode.useQuery(undefined, {
    enabled: !!user,
  });
  
  const { data: referralStats } = trpc.referral.getStats.useQuery(undefined, {
    enabled: !!user,
  });
  
  const { data: myReferrals } = trpc.referral.getMyReferrals.useQuery(undefined, {
    enabled: !!user,
  });

  // SEO: Set dynamic page title
  useEffect(() => {
    document.title = "Creator Dashboard - Manage Credits | Infinity Creators";
  }, []);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>Please log in to access your dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Welcome, {user.name || 'Creator'}!</h1>
          <p className="text-slate-300 mt-2">Manage your credits and generate viral shorts scripts</p>
        </div>

        {/* Stats Grid */}
        <h2 className="text-2xl font-bold text-white mb-4">Your Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Credits Card */}
          <Card className="bg-slate-800/50 border-slate-700 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Available Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-white">{creditInfo?.credits || 0}</div>
                <Zap className="w-12 h-12 text-yellow-400 opacity-30" />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {creditInfo?.plan === 'agency' || creditInfo?.plan === 'pro'
                  ? 'Unlimited with your plan'
                  : 'Buy more credits to continue generating'}
              </p>
            </CardContent>
          </Card>

          {/* Plan Card */}
          <Card className="bg-slate-800/50 border-slate-700 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white capitalize">{creditInfo?.plan || 'Free'}</div>
              {creditInfo?.subscription && (
                <p className="text-xs text-slate-400 mt-2">
                  Renews {new Date(creditInfo.subscription.renewsAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Usage Card */}
          <Card className="bg-slate-800/50 border-slate-700 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Generations This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-white">
                  {creditInfo?.transactions?.filter((t) => t.type === 'usage').length || 0}
                </div>
                <TrendingUp className="w-12 h-12 text-blue-400 opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Section */}
        <h2 className="text-2xl font-bold text-white mb-4">🎁 Earn Free Credits</h2>
        <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Invite Friends & Earn 5 Credits
            </CardTitle>
            <CardDescription className="text-slate-300">
              Share your referral link and get 5 free credits when your friend makes their first purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Referral Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">{referralStats?.totalReferrals || 0}</div>
                <div className="text-xs text-slate-400">Referrals</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">{referralStats?.totalCreditsEarned || 0}</div>
                <div className="text-xs text-slate-400">Credits Earned</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">{referralStats?.pendingRewards || 0}</div>
                <div className="text-xs text-slate-400">Pending</div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Your Referral Link</label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={referralCode ? `${window.location.origin}/?ref=${referralCode.referralCode}` : 'Loading...'}
                  className="bg-slate-800 border-slate-600 text-white font-mono text-sm"
                />
                <Button
                  onClick={() => {
                    if (referralCode) {
                      const url = `${window.location.origin}/?ref=${referralCode.referralCode}`;
                      navigator.clipboard.writeText(url);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  disabled={!referralCode}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                Your referral code: <span className="font-mono text-white">{referralCode?.referralCode || 'Loading...'}</span>
              </p>
            </div>

            {/* Referral List */}
            {myReferrals && myReferrals.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Your Referrals ({myReferrals.length})</label>
                <div className="bg-slate-800/50 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {myReferrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-white">{referral.refereeName || 'Anonymous'}</span>
                        <span className="text-slate-400 ml-2 text-xs">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {referral.rewardClaimed === 1 ? (
                          <span className="text-green-400 text-xs flex items-center gap-1">
                            <Check className="w-3 h-3" /> +{referral.creditsEarned} credits
                          </span>
                        ) : (
                          <span className="text-yellow-400 text-xs">Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Button
            size="lg"
            className="h-16 text-lg font-semibold"
            onClick={() => navigate('/generator')}
          >
            ✨ Generate Script
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-16 text-lg font-semibold"
            onClick={() => navigate('/pricing')}
          >
            💳 Buy Credits or Subscribe
          </Button>
        </div>

        {/* Recent Transactions */}
        {creditInfo?.transactions && creditInfo.transactions.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-slate-400">Your credit transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {creditInfo.transactions.slice(-5).reverse().map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                    <div>
                      <p className="font-medium text-white capitalize">{transaction.type}</p>
                      <p className="text-sm text-slate-400">{transaction.description}</p>
                    </div>
                    <div className={`font-semibold ${transaction.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
