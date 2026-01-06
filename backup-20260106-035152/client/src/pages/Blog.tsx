import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts } from "@/data/blog-posts";
import { useLocation } from "wouter";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function Blog() {
  const [, navigate] = useLocation();
  const posts = getAllBlogPosts();

  useEffect(() => {
    document.title = "Blog - Viral Content Tips & Strategies | Infinity Creators";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-2xl">✨</span>
            <span className="text-xl font-bold text-white">Infinity Creators</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/")} className="text-slate-300 hover:text-white transition-colors">Home</button>
            <button onClick={() => navigate("/dashboard")} className="text-slate-300 hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => navigate("/generator")} className="text-slate-300 hover:text-white transition-colors">Generator</button>
            <button onClick={() => navigate("/blog")} className="text-white font-medium">Blog</button>
            <Button size="sm" onClick={() => navigate("/pricing")}>Pricing</Button>
          </div>
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Content Creation Insights</h1>
          <p className="text-xl text-slate-300 mb-8">Learn the strategies, hooks, and monetization tactics that turn viral videos into real income.</p>
        </div>
      </section>

      <section className="py-12 px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.slug} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all cursor-pointer group" onClick={() => navigate(`/blog/${post.slug}`)}>
                <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-t-lg flex items-center justify-center">
                  <span className="text-6xl">🎬</span>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime}</span>
                  </div>
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors">{post.title}</CardTitle>
                  <CardDescription className="text-slate-400 mt-2">{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-400 font-medium">{post.category}</span>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Create Viral Content?</h2>
          <p className="text-xl text-blue-100 mb-8">Stop reading. Start creating. Generate your first viral script in 30 seconds.</p>
          <Button size="lg" className="text-lg px-8 bg-white text-blue-600 hover:bg-slate-100" onClick={() => navigate("/")}>✨ Try Free Now</Button>
        </div>
      </section>
    </div>
  );
}
