import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Build an image URL that preserves GIF animation.
 * Sanity's CDN converts animated GIFs to static images when resize
 * transforms (width/height) are applied, so we skip those for GIFs.
 */
export function getImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number,
): string {
  const ref: string = source?.asset?._ref ?? "";
  const isGif = ref.endsWith("-gif");

  if (isGif) {
    return builder.image(source).url();
  }

  let img = builder.image(source);
  if (width) img = img.width(width);
  if (height) img = img.height(height);
  return img.url();
}

// Queries
export const workPostsQuery = `*[_type == "workPost" && !(_id in path("drafts.**"))] | order(date desc) {
  _id,
  title,
  slug,
  description,
  date,
  image,
  featured,
  "categories": categories[]->{ title, slug }
}`;

export const workPostBySlugQuery = `*[_type == "workPost" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  body,
  date,
  image,
  featured,
  "categories": categories[]->{ title, slug },
  caseStudyWhat,
  caseStudyHow,
  caseStudyResults,
  caseStudyRole,
  galleryImages
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;

export const experienceQuery = `*[_type == "experienceEntry"] | order(order asc) {
  _id,
  role,
  company,
  companyUrl,
  startYear,
  endYear,
  order
}`;

export const clientsQuery = `*[_type == "client"] | order(order asc) {
  _id,
  name,
  order
}`;

export const categoriesQuery = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug
}`;
