import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  tags?: string[];
  cover?: string;
  video?: string;
  summary: string;
  body: string;
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.slug) return;
    fetch(`/blog-posts/${params.slug}.json`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params?.slug]);

  if (loading) return <div className="p-16 text-center">Loading...</div>;
  if (!post) return <div className="p-16 text-center">Post not found</div>;

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    if (url.includes("bilibili.com")) return url;
    return url;
  };

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/blog">
          <a className="text-sm mb-8 inline-block" style={{ color: "#D4A537" }}>
            ← Back to blog
          </a>
        </Link>

        <div className="text-sm mb-3" style={{ color: "#D4A537" }}>
          {post.category} · {new Date(post.date).toLocaleDateString()}
        </div>
        <h1
          className="text-4xl md:text-5xl font-serif font-bold mb-6"
          style={{ color: "#1F3A5F" }}
        >
          {post.title}
        </h1>
        <p className="text-gray-600 mb-8">By {post.author}</p>

        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="w-full h-auto rounded mb-8"
          />
        )}

        {post.video && (
          <div className="mb-8 aspect-video">
            <iframe
              src={getEmbedUrl(post.video) || ""}
              className="w-full h-full rounded"
              allowFullScreen
              title={post.title}
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag}`}>
                <a className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
                  #{tag}
                </a>
              </Link>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}