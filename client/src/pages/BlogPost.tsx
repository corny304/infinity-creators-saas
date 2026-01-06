import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { getBlogPost } from "@/data/blog-posts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

export default function BlogPost() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/blog/:slug");
  
  const post = match && params?.slug ? getBlogPost(params.slug) : null;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Infinity Creators Blog`;
    }
  }, [post]);

  if (!match || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <Button onClick={() => navigate("/blog")}><ArrowLeft className="w-4 h-4 mr-2" />Back to Blog</Button>
        </div>
      </div>
    );
  }

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-bold text-white mt-12 mb-6">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-bold text-white mt-10 mb-4">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-bold text-white mt-8 mb-3">{line.slice(4)}</h3>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-white font-semibold mb-4">{line.slice(2, -2)}</p>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-slate-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')}} />;
    });
  };

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
            <button onClick={() => navigate("/blog")} className="text-white font-medium">Blog</button>
            <Button size="sm" onClick={() => navigate("/pricing")}>Pricing</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-3xl px-4 pt-8">
        <Button variant="ghost" className="text-slate-300 hover:text-white mb-8" onClick={() => navigate("/blog")}>
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Blog
        </Button>
      </div>

      <article className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-blue-400 font-medium mb-4">
            <span>{post.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
          <p className="text-xl text-slate-300 mb-6">{post.description}</p>
          <div className="flex items-center gap-6 text-sm text-slate-400 pb-8 border-b border-slate-700">
            <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{post.date}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.readTime}</span>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          {renderContent(post.content)}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Generate Your Perfect Hook in 30 Seconds</h3>
          <p className="text-xl text-blue-100 mb-6">Stop guessing. Let AI do the heavy lifting.</p>
          <Button size="lg" className="text-lg px-8 bg-white text-blue-600 hover:bg-slate-100" onClick={() => navigate("/")}>✨ Generate Your Script Now (Free)</Button>
        </div>
      </article>
      <div className="h-20"></div>
    </div>
  );
}
