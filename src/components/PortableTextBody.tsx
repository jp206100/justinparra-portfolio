import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import type { SanityBlock } from "@/lib/types";

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2
        style={{
          fontSize: "clamp(22px, 3vw, 32px)",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
          marginTop: 48,
          marginBottom: 16,
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{
          fontSize: "clamp(18px, 2.5vw, 24px)",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          lineHeight: 1.4,
          marginTop: 40,
          marginBottom: 12,
        }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: "2px solid var(--color-accent)",
          paddingLeft: 24,
          margin: "32px 0",
          fontStyle: "italic",
          color: "var(--color-fg-secondary)",
        }}
      >
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p style={{ marginBottom: 20 }}>{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong style={{ fontWeight: 600, color: "var(--color-fg)" }}>
        {children}
      </strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--color-accent)",
          textDecoration: "none",
          borderBottom: "1px solid rgba(200,65,43,0.3)",
          transition: "border-color 0.3s",
        }}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul
        style={{
          paddingLeft: 24,
          marginBottom: 20,
          listStyleType: "disc",
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        style={{
          paddingLeft: 24,
          marginBottom: 20,
          listStyleType: "decimal",
        }}
      >
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li style={{ marginBottom: 8, lineHeight: 1.7 }}>{children}</li>
    ),
    number: ({ children }) => (
      <li style={{ marginBottom: 8, lineHeight: 1.7 }}>{children}</li>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(800).url();
      return (
        <figure style={{ margin: "40px 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={value.alt || ""}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
          {value.alt && (
            <figcaption
              style={{
                fontSize: 12,
                color: "var(--color-fg-secondary)",
                marginTop: 12,
                letterSpacing: "0.02em",
              }}
            >
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
    youtube: ({ value }) => {
      if (!value?.url) return null;
      const id = getYouTubeId(value.url);
      if (!id) return null;
      return (
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            margin: "40px 0",
            overflow: "hidden",
            borderRadius: 8,
          }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </div>
      );
    },
  },
};

interface PortableTextBodyProps {
  value: SanityBlock[];
}

export default function PortableTextBody({ value }: PortableTextBodyProps) {
  return (
    <div
      style={{
        fontSize: 16,
        lineHeight: 1.8,
        color: "var(--color-fg-secondary)",
      }}
    >
      <PortableText value={value} components={components} />
    </div>
  );
}
