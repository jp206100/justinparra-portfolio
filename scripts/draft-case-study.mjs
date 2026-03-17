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
 * Environment:
 *   SANITY_API_TOKEN - Required. Write token for the Sanity project.
 */

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { resolve, dirname, basename, extname } from "node:path";
import sharp from "sharp";

const SANITY_PROJECT_ID = "hzqd03zv";
const SANITY_DATASET = "production";

// Image optimization settings
const HERO_MAX_WIDTH = 2400;
const GALLERY_MAX_WIDTH = 1600;
const JPEG_QUALITY = 82;

const CATEGORY_IDS = {
  "Case Studies": "cat-case-studies",
  "Work in Progress": "cat-work-in-progress",
  Experiments: "cat-experiments",
  "Personal Projects": "cat-personal-projects",
};

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
 * Upload an optimized image buffer to Sanity.
 */
async function uploadOptimized(client, inputPath, maxWidth) {
  const { buffer, originalKB, optimizedKB, width } = await optimizeImage(inputPath, maxWidth);
  const jpegFilename = basename(inputPath, extname(inputPath)) + ".jpg";

  const asset = await client.assets.upload("image", buffer, {
    filename: jpegFilename,
    contentType: "image/jpeg",
  });

  return { asset, originalKB, optimizedKB, width, jpegFilename };
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
      "Get a token from https://www.sanity.io/manage/project/hzqd03zv/api#tokens"
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

  console.log(`\nDrafting case study: ${manifest.title}\n`);

  // Upload hero image
  let heroImageAsset = null;
  if (manifest.heroImage) {
    const heroPath = resolve(manifestDir, manifest.heroImage);
    console.log(`  Hero image: ${manifest.heroImage}`);
    const result = await uploadOptimized(client, heroPath, HERO_MAX_WIDTH);
    heroImageAsset = result.asset;
    console.log(
      `    -> ${result.jpegFilename} (${result.width}px, ${result.originalKB}KB -> ${result.optimizedKB}KB)`
    );
  }

  // Upload gallery images
  const galleryAssets = [];
  if (manifest.galleryImages?.length) {
    console.log("");
    for (let i = 0; i < manifest.galleryImages.length; i++) {
      const img = manifest.galleryImages[i];
      const imgPath = resolve(manifestDir, img.path);
      console.log(
        `  Gallery ${i + 1}/${manifest.galleryImages.length}: ${img.path}`
      );
      const result = await uploadOptimized(client, imgPath, GALLERY_MAX_WIDTH);
      console.log(
        `    -> ${result.jpegFilename} (${result.width}px, ${result.originalKB}KB -> ${result.optimizedKB}KB)`
      );
      galleryAssets.push({
        _type: "image",
        _key: `gallery-${i}`,
        asset: { _type: "reference", _ref: result.asset._id },
        alt: img.alt || "",
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
      alt: manifest.heroImageAlt || manifest.title,
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
