import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRoute, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SiteHeader from "@/components/SiteHeader";

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

  const components = {
    table: ({ children }: any) => (
      <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9375rem" }}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead style={{ backgroundColor: "#1F3A5F" }}>{children}</thead>
    ),
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => (
      <tr style={{ borderBottom: "1px solid #E5E7EB" }}>{children}</tr>
    ),
    th: ({ children }: any) => (
      <th style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#FFFFFF", fontWeight: "700", fontSize: "0.875rem" }}>
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td style={{ padding: "0.75rem 1rem", color: "#222", verticalAlign: "top", borderBottom: "1px solid #E5E7EB" }}>
        {children}
      </td>
    ),
    h2: ({ children }: any) => (
      <h2 style={{ color: "#1F3A5F", fontSize: "1.5rem", fontWeight: "800", marginTop: "2.5rem", marginBottom: "0.75rem", fontFamily: "Georgia, serif" }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{ color: "#1F3A5F", fontSize: "1.25rem", fontWeight: "700", marginTop: "2rem", marginBottom: "0.5rem" }}>
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p style={{ marginBottom: "1.25rem", lineHeight: "1.8", fontSize: "1.0625rem", color: "#222" }}>
        {children}
      </p>
    ),
    strong: ({ children }: any) => (
      <strong style={{ color: "#1F3A5F", fontWeight: "700" }}>{children}</strong>
    ),
    blockquote: ({ children }: any) => (
      <blockquote style={{ borderLeft: "4px solid #D4A537", paddingLeft: "1.25rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", margin: "1.75rem 0", background: "#FAF7F0", fontStyle: "italic", color: "#444" }}>
        {children}
      </blockquote>
    ),
    ul: ({ children }: any) => (
      <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.25rem", listStyleType: "disc" }}>
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol style={{ paddingLeft: "1.5rem", marginBottom: "1.25rem", listStyleType: "decimal" }}>
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li style={{ marginBottom: "0.4rem", lineHeight: "1.7", color: "#222" }}>
        {children}
      </li>
    ),
    a: ({ href, children }: any) => (
      <a href={href} style={{ color: "#D4A537", fontWeight: "600", textDecoration: "underline" }}>
        {children}
      </a>
    ),
    hr: () => (
      <hr style={{ margin: "2.5rem 0", borderColor: "#E5E5E5" }} />
    ),
  };

  const slug = params?.slug;

  return (
    <div className="min-h-screen bg-white">
      <Helmet><link rel="canonical" href={`https://sound-ready.com/blog/${slug}`} /></Helmet>
      <SiteHeader />
      <article className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <Link href="/blog">
          <a className="text-sm mb-10 inline-block hover:underline" style={{ color: "#D4A537" }}>
            ← Back to blog
          </a>
        </Link>

        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: "#D4A537" }}>
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-5" style={{ color: "#1F3A5F" }}>
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="font-medium">{post.author}</span>
            <span>·</span>
            <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        {post.cover && (
          <img src={post.cover} alt="" className="w-full h-auto rounded-lg mb-10 shadow-sm" />
        )}

        {post.video && (
          <div className="mb-10 aspect-video">
            <iframe src={getEmbedUrl(post.video) || ""} className="w-full h-full rounded-lg" allowFullScreen title={post.title} />
          </div>
        )}

        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {post.body}
        </ReactMarkdown>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-16 pt-8 border-t border-gray-100">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag}`}>
                <a className="text-xs uppercase tracking-wider px-3 py-1.5 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-600">
                  {tag}
                </a>
              </Link>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
