import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import SiteHeader from "@/components/SiteHeader";

interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  tags?: string[];
  cover?: string;
  summary: string;
}

export default function BlogList() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/blog-index.json")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-16 text-center">Loading posts...</div>;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-4 py-16 pt-32">
        <h1
          className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center"
          style={{ color: "#1F3A5F" }}
        >
          {language === "en" ? "Blog" : "博客"}
        </h1>
        <div className="grid gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article
                className="border-l-4 p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                style={{ borderColor: "#D4A537" }}
              >
                {post.cover && (
                  <img
                    src={post.cover}
                    alt=""
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                )}
                <div className="text-sm mb-2" style={{ color: "#D4A537" }}>
                  {post.category} · {new Date(post.date).toLocaleDateString()}
                </div>
                <h2
                  className="text-2xl font-serif font-bold mb-3"
                  style={{ color: "#1F3A5F" }}
                >
                  {post.title}
                </h2>
                <p className="text-gray-700 mb-3">{post.summary}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-center text-gray-600">
            {language === "en" ? "No posts yet." : "暂无文章。"}
          </p>
        )}
      </div>
    </div>
  );
}