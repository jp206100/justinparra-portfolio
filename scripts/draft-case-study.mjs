#!/usr/bin/env node
/**
 * Draft Case Study to Sanity
 *
 * Creates a draft work post in Sanity with optimized, uploaded images,
 * ready for review and publish in Studio.
 *
 * Usage:
 *   node scripts/draft-case-study.mjs <manifest.json>
 *
 * The manifest JSON should have this shape:
 * {
 *   "title": "Katzman Produce Brand Overhaul",
 *   "slug": "katzman-produce-brand-overhaul",
 *   "description": "Short card description",
 *   "date": "2024-06-15",
 *   "categories": ["Case Studies"],
 *   "caseStudyWhat": "The full What section text...",
 *   "caseStudyHow": "The full How section text...",
 *   "caseStudyResults": "The full Results section text...",
 *   "caseStudyRole": [
 *     "Art direction of the photo and video shoot",
 *     "Build user personas..."
 *   ],
 *   "heroImage": "./images/hero.png",
 *   "galleryImages": [
 *     { "path": "./images/img1.png", "alt": "Description", "caption": "Caption" },
 *     { "path": "./images/img2.tiff", "alt": "Description" }
 *   ]
 * }
 *
 * Images paths are resolved relative to the manifest file location.
 * All images are converted to JPEG and optimized for web before upload.
 *
 * SEO: Image filenames are auto-generated from the slug + alt text.
 *   e.g. "katzman-produce-brand-overhaul-user-persona-development.jpg"
 * All gallery images MUST have an "alt" field (the script will error without it).
 *
 * Environment:
 *   SANITY_API_TOKEN - Required. Write token for the Sanity project.
 */

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { resolve, dirname, basename, extname } from "node:path";
import sharp from "sharp";

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!SANITY_PROJECT_ID) {
  console.error("Error: NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is required.");
  process.exit(1);
}

// Image optimization settings
const HERO_MAX_WIDTH = 2400;
const GALLERY_MAX_WIDTH = 1600;
const JPEG_QUALITY = 92;

const CATEGORY_IDS = {
  "Case Studies": "cat-case-studies",
  "Work in Progress": "cat-work-in-progress",
  Experiments: "cat-experiments",
  "Personal Projects": "cat-personal-projects",
};

/**
 * Generate an SEO-friendly filename from the project slug and a label.
 * e.g. ("katzman-produce-brand-overhaul", "hero") -> "katzman-produce-brand-overhaul-hero.jpg"
 * e.g. ("katzman-produce-brand-overhaul", "stakeholder interviews") -> "katzman-produce-brand-overhaul-stakeholder-interviews.jpg"
 */
function seoFilename(slug, label) {
  const suffix = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${suffix}.jpg`;
}

/**
 * Optimize an image: convert to JPEG, resize to maxWidth, compress.
 * Returns a Buffer ready for upload.
 */
async function optimizeImage(inputPath, maxWidth) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const pipeline = image
    .rotate() // auto-rotate based on EXIF
    .resize({
      width: Math.min(metadata.width || maxWidth, maxWidth),
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });

  const buffer = await pipeline.toBuffer();
  const originalKB = Math.round((metadata.size || 0) / 1024);
  const optimizedKB = Math.round(buffer.length / 1024);

  return { buffer, originalKB, optimizedKB, width: Math.min(metadata.width || maxWidth, maxWidth) };
}

/**
 * Upload an optimized image buffer to Sanity with an SEO filename.
 */
async function uploadOptimized(client, inputPath, maxWidth, filename) {
  const { buffer, originalKB, optimizedKB, width } = await optimizeImage(inputPath, maxWidth);

  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: "image/jpeg",
  });

  return { asset, originalKB, optimizedKB, width, filename };
}

async function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    console.error("Usage: node scripts/draft-case-study.mjs <manifest.json>");
    process.exit(1);
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.error("Error: SANITY_API_TOKEN environment variable is required.");
    console.error(
      "Get a token from https://www.sanity.io/manage → your project → API → Tokens"
    );
    process.exit(1);
  }

  // Read manifest
  const absManifest = resolve(manifestPath);
  const manifestDir = dirname(absManifest);
  const manifest = JSON.parse(await readFile(absManifest, "utf-8"));

  // Validate required fields
  const required = [
    "title",
    "slug",
    "description",
    "date",
    "caseStudyWhat",
    "caseStudyHow",
    "caseStudyResults",
    "caseStudyRole",
  ];
  for (const field of required) {
    if (!manifest[field]) {
      console.error(`Error: Missing required field "${field}" in manifest.`);
      process.exit(1);
    }
  }

  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });

  // Validate alt tags on all gallery images
  if (manifest.galleryImages?.length) {
    const missingAlt = manifest.galleryImages
      .map((img, i) => (!img.alt ? i + 1 : null))
      .filter(Boolean);
    if (missingAlt.length) {
      console.error(
        `Error: Gallery images ${missingAlt.join(", ")} are missing "alt" text (required for SEO/accessibility).`
      );
      process.exit(1);
    }
  }

  console.log(`\nDrafting case study: ${manifest.title}\n`);

  const slug = manifest.slug;

  // Upload hero image with SEO filename
  let heroImageAsset = null;
  if (manifest.heroImage) {
    const heroPath = resolve(manifestDir, manifest.heroImage);
    const heroFilename = seoFilename(slug, "hero");
    console.log(`  Hero image: ${manifest.heroImage}`);
    const result = await uploadOptimized(client, heroPath, HERO_MAX_WIDTH, heroFilename);
    heroImageAsset = result.asset;
    console.log(
      `    -> ${result.filename} (${result.width}px, ${result.originalKB}KB -> ${result.optimizedKB}KB)`
    );
  }

  // Upload gallery images with SEO filenames derived from alt text
  const galleryAssets = [];
  if (manifest.galleryImages?.length) {
    console.log("");
    for (let i = 0; i < manifest.galleryImages.length; i++) {
      const img = manifest.galleryImages[i];
      const imgPath = resolve(manifestDir, img.path);
      // Derive SEO filename from alt text: "User persona development" -> "katzman-produce-brand-overhaul-user-persona-development.jpg"
      const imgFilename = seoFilename(slug, img.alt);
      console.log(
        `  Gallery ${i + 1}/${manifest.galleryImages.length}: ${img.path}`
      );
      const result = await uploadOptimized(client, imgPath, GALLERY_MAX_WIDTH, imgFilename);
      console.log(
        `    -> ${result.filename} (${result.width}px, ${result.originalKB}KB -> ${result.optimizedKB}KB)`
      );
      galleryAssets.push({
        _type: "image",
        _key: `gallery-${i}`,
        asset: { _type: "reference", _ref: result.asset._id },
        alt: img.alt,
        caption: img.caption || "",
      });
    }
  }

  // Build category references
  const categories = (manifest.categories || ["Case Studies"]).map(
    (cat, i) => ({
      _type: "reference",
      _ref: CATEGORY_IDS[cat] || CATEGORY_IDS["Case Studies"],
      _key: `cat-${i}`,
    })
  );

  // Build the draft document
  // Sanity drafts use "drafts." prefix - visible in Studio but not published
  const docId = `drafts.work-cs-${manifest.slug}`;

  const doc = {
    _id: docId,
    _type: "workPost",
    title: manifest.title,
    slug: { _type: "slug", current: manifest.slug },
    description: manifest.description,
    date: manifest.date,
    featured: manifest.featured || false,
    categories,
    caseStudyWhat: manifest.caseStudyWhat,
    caseStudyHow: manifest.caseStudyHow,
    caseStudyResults: manifest.caseStudyResults,
    caseStudyRole: manifest.caseStudyRole,
  };

  if (heroImageAsset) {
    doc.image = {
      _type: "image",
      asset: { _type: "reference", _ref: heroImageAsset._id },
      alt: manifest.heroImageAlt || `${manifest.title} project hero image`,
    };
  }

  if (galleryAssets.length) {
    doc.galleryImages = galleryAssets;
  }

  // Create or replace the draft
  console.log("\n  Creating draft in Sanity...");
  await client.createOrReplace(doc);

  const totalImages = (heroImageAsset ? 1 : 0) + galleryAssets.length;
  console.log("\n  Draft created successfully!");
  console.log(`  Document ID: ${docId}`);
  console.log(`  Images uploaded: ${totalImages}`);
  console.log(
    "\n  Open Sanity Studio to review and publish:"
  );
  console.log(
    `  https://justinparra-portfolio.vercel.app/studio/structure/workPost;${docId.replace("drafts.", "work-cs-")}\n`
  );
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
