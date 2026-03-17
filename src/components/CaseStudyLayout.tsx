import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import type { SanityGalleryImage } from "@/lib/types";

const pagePad = "clamp(20px, 5vw, 80px)";

interface CaseStudyProps {
  title: string;
  desc: string;
  date: string;
  categories: string[];
  imageUrl: string | null;
  caseStudyWhat: string;
  caseStudyHow: string;
  caseStudyResults: string;
  caseStudyRole: string[];
  galleryImages: SanityGalleryImage[];
}

function SectionBlock({
  label,
  num,
  children,
}: {
  label: string;
  num: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="case-study-section"
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: "clamp(32px, 4vw, 80px)",
        padding: "clamp(48px, 6vh, 80px) 0",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-fg-secondary)",
            marginBottom: 8,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--color-accent)",
          }}
        >
          {num}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function GalleryImage({
  img,
  width,
  maxHeight,
}: {
  img: SanityGalleryImage;
  width: number;
  maxHeight?: number;
}) {
  const url = urlFor(img).width(width).url();
  return (
    <figure style={{ margin: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={img.alt || ""}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          maxHeight: maxHeight ?? "none",
          objectFit: maxHeight ? "contain" : undefined,
        }}
      />
      {img.caption && (
        <figcaption
          style={{
            fontSize: 11,
            color: "var(--color-fg-secondary)",
            letterSpacing: "0.02em",
            marginTop: 8,
          }}
        >
          {img.caption}
        </figcaption>
      )}
    </figure>
  );
}

function GalleryRow({ images }: { images: SanityGalleryImage[] }) {
  if (!images.length) return null;

  // Single image: constrain max height so vertical images don't dominate
  if (images.length === 1) {
    return (
      <div
        style={{
          margin: "clamp(40px, 6vh, 80px) 0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <GalleryImage img={images[0]} width={1200} maxHeight={720} />
      </div>
    );
  }

  // Multiple images: use equal-height row that respects natural proportions.
  // Vertical images get narrower columns, horizontal get wider, keeping
  // a uniform row height without cropping.
  return (
    <div
      className="case-study-gallery-row"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${images.length}, 1fr)`,
        gap: "clamp(8px, 1vw, 16px)",
        margin: "clamp(40px, 6vh, 80px) 0",
        alignItems: "end",
      }}
    >
      {images.map((img, i) => (
        <GalleryImage key={i} img={img} width={800} maxHeight={600} />
      ))}
    </div>
  );
}

export default function CaseStudyLayout({
  title,
  desc,
  date,
  categories,
  imageUrl,
  caseStudyWhat,
  caseStudyHow,
  caseStudyResults,
  caseStudyRole,
  galleryImages,
}: CaseStudyProps) {
  // Distribute gallery images across sections:
  // Image 1: hero (already handled), Image 2: after What, Image 3-4: after How, Image 5: after Results
  const afterWhat = galleryImages.slice(0, 1);
  const afterHow = galleryImages.slice(1, 3);
  const afterResults = galleryImages.slice(3, 5);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Back nav */}
      <nav
        style={{
          padding: `24px ${pagePad}`,
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/#work"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-fg-secondary)",
            textDecoration: "none",
          }}
        >
          &larr; Back to Work
        </Link>
      </nav>

      {/* Hero image — full bleed */}
      {imageUrl ? (
        <div
          style={{
            aspectRatio: "21/9",
            maxHeight: 560,
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            background: "linear-gradient(135deg, #E8E4DF 0%, #D4CFC8 100%)",
            aspectRatio: "21/9",
            maxHeight: 560,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "var(--color-fg-secondary)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Project Image
        </div>
      )}

      {/* Title block */}
      <div
        style={{
          padding: `clamp(48px, 8vh, 96px) ${pagePad}`,
          maxWidth: 1200,
          margin: "0 auto",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Category tags */}
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 24 }}>
          {categories.map((cat) => (
            <span
              key={cat}
              style={{
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                padding: "3px 8px",
                border: "1px solid rgba(200,65,43,0.2)",
                background: "rgba(200,65,43,0.04)",
                lineHeight: 1.4,
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            marginBottom: 24,
          }}
        >
          {title}
        </h1>

        <div
          className="case-study-meta"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <p
            style={{
              fontSize: "clamp(16px, 1.5vw, 20px)",
              fontWeight: 300,
              color: "var(--color-fg-secondary)",
              lineHeight: 1.6,
              maxWidth: 640,
            }}
          >
            {desc}
          </p>
          <span
            style={{
              fontSize: 11,
              color: "var(--color-fg-secondary)",
              letterSpacing: "0.02em",
              flexShrink: 0,
              marginLeft: 40,
            }}
          >
            {date}
          </span>
        </div>
      </div>

      {/* Case Study Content */}
      <article
        style={{
          padding: `0 ${pagePad}`,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* What */}
        <SectionBlock label="What" num="01">
          <p
            style={{
              fontSize: "clamp(16px, 1.3vw, 18px)",
              lineHeight: 1.8,
              color: "var(--color-fg-secondary)",
            }}
          >
            {caseStudyWhat}
          </p>
        </SectionBlock>

        {/* Gallery: after What */}
        <GalleryRow images={afterWhat} />

        {/* How */}
        <SectionBlock label="How" num="02">
          <p
            style={{
              fontSize: "clamp(16px, 1.3vw, 18px)",
              lineHeight: 1.8,
              color: "var(--color-fg-secondary)",
            }}
          >
            {caseStudyHow}
          </p>
        </SectionBlock>

        {/* Gallery: after How */}
        <GalleryRow images={afterHow} />

        {/* Results */}
        <SectionBlock label="Results" num="03">
          <p
            style={{
              fontSize: "clamp(16px, 1.3vw, 18px)",
              lineHeight: 1.8,
              color: "var(--color-fg-secondary)",
            }}
          >
            {caseStudyResults}
          </p>
        </SectionBlock>

        {/* Gallery: after Results */}
        <GalleryRow images={afterResults} />

        {/* My Role */}
        <SectionBlock label="My Role" num="04">
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {caseStudyRole.map((item, i) => (
              <li
                key={i}
                style={{
                  fontSize: "clamp(14px, 1.2vw, 16px)",
                  lineHeight: 1.8,
                  color: "var(--color-fg-secondary)",
                  paddingLeft: 20,
                  position: "relative",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "var(--color-accent)",
                    fontWeight: 500,
                  }}
                >
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </SectionBlock>
      </article>

      {/* Footer */}
      <footer
        className="flex items-center justify-between"
        style={{
          padding: `32px ${pagePad}`,
          borderTop: "1px solid var(--color-border)",
          marginTop: "clamp(48px, 8vh, 96px)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--color-fg-secondary)",
            letterSpacing: "0.05em",
          }}
        >
          &copy; 2026 Justin Parra
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--color-fg-secondary)",
            letterSpacing: "0.05em",
          }}
        >
          Seattle, WA
        </span>
      </footer>
    </div>
  );
}
