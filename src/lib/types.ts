export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface SanityCategory {
  title: string;
  slug: SanitySlug;
}

export interface SanityGalleryImage {
  asset: { _ref: string };
  alt?: string;
  caption?: string;
}

export interface SanityWorkPost {
  _id: string;
  title: string;
  slug: SanitySlug;
  description: string;
  date: string;
  image?: SanityImage;
  featured: boolean;
  categories: SanityCategory[];
  body?: SanityBlock[];
  caseStudyWhat?: string;
  caseStudyHow?: string;
  caseStudyResults?: string;
  caseStudyRole?: string[];
  galleryImages?: SanityGalleryImage[];
}

export interface SanityImage {
  asset: { _ref: string };
  alt?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SanityBlock = any;

export interface SanityExperienceEntry {
  _id: string;
  role: string;
  company: string;
  companyUrl?: string;
  startYear: number;
  endYear: string;
  order: number;
}

export interface SanityClient {
  _id: string;
  name: string;
  order: number;
}

export interface SanitySettings {
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutStatement: string;
  aboutBody?: SanityBlock[];
  seekingText: string;
  contactHeading: string;
  contactSubtext: string;
  githubUsername: string;
}
