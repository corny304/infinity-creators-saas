import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { DollarSign, FileText, TrendingUp, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, loading } = useAuth();
  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery();
  const { data: recentTransactions } = trpc.admin.getRecentTransactions.useQuery();
  const { data: topUsers } = trpc.admin.getTopUsers.useQuery();

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  const [, setLocation] = useLocation();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1A1A1A]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#D4AF37]">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">Infinity Creators Analytics</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Back to App
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
              <Users className="h-4 w-4 text-[#D4AF37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                +{stats?.newUsersThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[#D4AF37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${((stats?.totalRevenue || 0) / 100).toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ${((stats?.revenueThisMonth || 0) / 100).toFixed(2)} this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Scripts Generated</CardTitle>
              <FileText className="h-4 w-4 text-[#D4AF37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalGenerations || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.generationsThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Subscriptions</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.activeSubscriptions || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                MRR: ${((stats?.monthlyRecurringRevenue || 0) / 100).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-[#1A1A1A] border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <CardDescription className="text-gray-400">
              Latest payments and credit purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Amount</TableHead>
                  <TableHead className="text-gray-400">Credits</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions?.map((tx) => (
                  <TableRow key={tx.id} className="border-gray-800">
                    <TableCell className="text-white">{tx.userEmail}</TableCell>
                    <TableCell className="text-gray-300">{tx.type}</TableCell>
                    <TableCell className="text-[#D4AF37]">
                      ${(tx.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-gray-300">{tx.credits}</TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card className="bg-[#1A1A1A] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Top Users</CardTitle>
            <CardDescription className="text-gray-400">
              Users with most script generations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Plan</TableHead>
                  <TableHead className="text-gray-400">Credits</TableHead>
                  <TableHead className="text-gray-400">Generations</TableHead>
                  <TableHead className="text-gray-400">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topUsers?.map((user) => (
                  <TableRow key={user.id} className="border-gray-800">
                    <TableCell className="text-white">{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.plan === 'agency'
                            ? 'bg-purple-500/20 text-purple-400'
                            : user.plan === 'pro'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {user.plan}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">{user.credits}</TableCell>
                    <TableCell className="text-gray-300">{user.totalGenerations}</TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
