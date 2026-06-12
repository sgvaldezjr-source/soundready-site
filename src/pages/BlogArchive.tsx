import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRoute, Link, useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags?: string[];
  summary: string;
}

export default function BlogArchive() {
  const [, catParams] = useRoute("/blog/category/:category");
  const [, tagParams] = useRoute("/blog/tag/:tag");
  const [posts, setPosts] = useState<Post[]>([]);

  const [location] = useLocation();
  const filterType = catParams ? "category" : "tag";
  const filterValue = catParams?.category || tagParams?.tag || "";

  useEffect(() => {
    fetch("/blog-index.json")
      .then((r) => r.json())
      .then((data: Post[]) => {
        const filtered = data.filter((p) =>
          filterType === "category"
            ? p.category.toLowerCase() === filterValue.toLowerCase()
            : p.tags?.some((t) => t.toLowerCase() === filterValue.toLowerCase())
        );
        setPosts(filtered);
      });
  }, [filterType, filterValue]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet><link rel="canonical" href={`https://sound-ready.com${location}`} /></Helmet>
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-4 py-16 pt-32">
        <Link href="/blog">
          <a className="text-sm mb-4 inline-block" style={{ color: "#D4A537" }}>
            ← All posts
          </a>
        </Link>
        <h1
          className="text-3xl md:text-4xl font-serif font-bold mb-12"
          style={{ color: "#1F3A5F" }}
        >
          {filterType === "category" ? "Category:" : "Tag:"} {filterValue}
        </h1>
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article
                className="border-l-4 p-6 hover:bg-gray-50 cursor-pointer"
                style={{ borderColor: "#D4A537" }}
              >
                <div className="text-sm mb-2" style={{ color: "#D4A537" }}>
                  {post.category} · {new Date(post.date).toLocaleDateString()}
                </div>
                <h2
                  className="text-xl font-serif font-bold mb-2"
                  style={{ color: "#1F3A5F" }}
                >
                  {post.title}
                </h2>
                <p className="text-gray-700">{post.summary}</p>
              </article>
            </Link>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-center text-gray-600">
            No posts in this {filterType} yet.
          </p>
        )}
      </div>
    </div>
  );
}