import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Copy, Check, Users, Gift, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Referral() {
  const { user, isAuthenticated, loading } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: referralCode, isLoading: codeLoading } = trpc.referral.getMyReferralCode.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: referrals, isLoading: referralsLoading } = trpc.referral.getMyReferrals.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: stats, isLoading: statsLoading } = trpc.referral.getStats.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const copyReferralLink = () => {
    if (!referralCode?.referralCode) return;
    
    const referralLink = `${window.location.origin}?ref=${referralCode.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || codeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-4">Referral Program</h1>
        <p className="text-muted-foreground mb-8">Please log in to access your referral dashboard</p>
        <Button asChild>
          <a href={getLoginUrl()}>Log In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="font-bold text-xl">Infinity Creators</span>
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/dashboard" className="hover:text-[#D4AF37] transition-colors">Dashboard</Link>
            <Link href="/generator" className="hover:text-[#D4AF37] transition-colors">Generator</Link>
            <Link href="/pricing" className="hover:text-[#D4AF37] transition-colors">Pricing</Link>
            <Link href="/referral" className="text-[#D4AF37] font-medium">Referrals</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Referral Program</h1>
            <p className="text-muted-foreground">
              Earn 5 credits for every friend who makes their first purchase
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalReferrals || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Friends you've referred
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#D4AF37]">{stats?.totalCreditsEarned || 0}</div>
                <p className="text-xs text-muted-foreground">
                  From referrals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingRewards || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting first purchase
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>
                Share this link with friends to earn 5 credits when they make their first purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={referralCode?.referralCode ? `${window.location.origin}?ref=${referralCode.referralCode}` : "Loading..."}
                  readOnly
                  className="font-mono"
                />
                <Button onClick={copyReferralLink} disabled={!referralCode?.referralCode}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Your Referral Code:</p>
                <p className="text-2xl font-bold text-[#D4AF37]">{referralCode?.referralCode || "Loading..."}</p>
              </div>
            </CardContent>
          </Card>

          {/* Referrals List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>
                Track the friends you've referred and your earned rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referralsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading referrals...</div>
              ) : referrals && referrals.length > 0 ? (
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{referral.refereeName || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {referral.rewardClaimed ? (
                          <div>
                            <p className="font-bold text-[#D4AF37]">+{referral.creditsEarned} Credits</p>
                            <p className="text-xs text-muted-foreground">
                              Earned {referral.rewardedAt ? new Date(referral.rewardedAt).toLocaleDateString() : ""}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Pending first purchase</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No referrals yet</p>
                  <p className="text-sm text-muted-foreground">
                    Share your referral link to start earning credits!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
