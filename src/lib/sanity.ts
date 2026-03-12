import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Queries
export const workPostsQuery = `*[_type == "workPost"] | order(date desc) {
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
  "categories": categories[]->{ title, slug }
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
