import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Pricing() {
  const { user } = useAuth();
  const { data: creditPackages } = trpc.credits.getPurchaseOptions.useQuery();
  const { data: subscriptionPlans } = trpc.subscription.getPlans.useQuery();
  const { data: creditInfo } = trpc.credits.getBalance.useQuery(undefined, {
    enabled: !!user,
  });

  const checkoutMutation = trpc.credits.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create checkout session');
    },
  });

  const subscriptionCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create checkout session');
    },
  });

  const handleCreditPurchase = (priceId: string) => {
    if (!user) {
      toast.error('Please log in to purchase credits');
      return;
    }
    checkoutMutation.mutate({ priceId });
  };

  const handleSubscriptionPurchase = (planId: 'pro' | 'agency') => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }
    subscriptionCheckoutMutation.mutate({ planId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Simple, Transparent Pricing</h1>
          <p className="text-slate-300 mt-3 text-lg">Choose the plan that works best for you</p>
        </div>

        {/* Current Plan Info */}
        {user && creditInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-center">
            <p className="text-sm text-blue-900">
              <strong>Current Plan:</strong> {creditInfo.plan.toUpperCase()} •{' '}
              <strong>Credits Available:</strong> {creditInfo.credits}
            </p>
          </div>
        )}

        {/* Credit Packages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">One-Time Credit Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creditPackages?.map((pkg) => (
              <Card key={pkg.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-slate-800">
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>Use anytime</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      ${(pkg.price / 100).toFixed(2)}
                    </div>
                    <p className="text-sm text-slate-300 mt-1">{pkg.credits} credits</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-300">
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Use anytime
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      No expiration
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Affiliate links included
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleCreditPurchase(pkg.stripePriceId)}
                    disabled={checkoutMutation.isPending}
                  >
                    {checkoutMutation.isPending ? 'Processing...' : 'Buy Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptionPlans?.map((plan) => (
              <Card
                key={plan.id}
                className={`border-0 shadow-lg hover:shadow-xl transition-all bg-slate-800 ${
                  plan.id === 'pro' ? 'md:col-span-1' : 'md:col-span-1'
                } ${creditInfo?.plan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="capitalize">{plan.name}</CardTitle>
                      <CardDescription>Billed monthly</CardDescription>
                    </div>
                    {creditInfo?.plan === plan.id && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      ${(plan.price / 100).toFixed(2)}
                    </div>
                    <p className="text-sm text-slate-300 mt-1">/month, billed monthly</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-300">
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Unlimited script generation
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Affiliate links included
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Priority support
                    </div>
                    {plan.id === 'agency' && (
                      <>
                        <div className="flex items-center text-sm text-slate-300">
                          <Check className="w-4 h-4 mr-2 text-green-400" />
                          Team management
                        </div>
                        <div className="flex items-center text-sm text-slate-300">
                          <Check className="w-4 h-4 mr-2 text-green-400" />
                          Advanced analytics
                        </div>
                      </>
                    )}
                  </div>

                  {creditInfo?.plan === plan.id ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscriptionPurchase(plan.id as 'pro' | 'agency')}
                      disabled={subscriptionCheckoutMutation.isPending}
                    >
                      {subscriptionCheckoutMutation.isPending ? 'Processing...' : 'Subscribe Now'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 bg-slate-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white">Can I cancel my subscription anytime?</h3>
              <p className="text-slate-300 mt-2">Yes, you can cancel your subscription at any time. Your access continues until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">Do credits expire?</h3>
              <p className="text-slate-300 mt-2">No, one-time credits never expire. Use them whenever you want.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">What happens to my credits if I upgrade to a subscription?</h3>
              <p className="text-slate-300 mt-2">Your existing credits remain in your account and can be used alongside your subscription benefits.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
