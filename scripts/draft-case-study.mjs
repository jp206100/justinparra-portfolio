#!/usr/bin/env node
/**
 * Draft Case Study to Sanity
 *
 * Creates a draft work post in Sanity with uploaded images, ready for review.
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
 *   "heroImage": "./images/hero.jpg",
 *   "galleryImages": [
 *     { "path": "./images/img1.jpg", "alt": "Description", "caption": "Caption" },
 *     { "path": "./images/img2.jpg", "alt": "Description" }
 *   ]
 * }
 *
 * Images paths are resolved relative to the manifest file location.
 *
 * Environment:
 *   SANITY_API_TOKEN - Required. Write token for the Sanity project.
 */

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { createReadStream } from "node:fs";

const SANITY_PROJECT_ID = "hzqd03zv";
const SANITY_DATASET = "production";

const CATEGORY_IDS = {
  "Case Studies": "cat-case-studies",
  "Work in Progress": "cat-work-in-progress",
  Experiments: "cat-experiments",
  "Personal Projects": "cat-personal-projects",
};

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

  console.log(`Drafting case study: ${manifest.title}`);

  // Upload hero image
  let heroImageAsset = null;
  if (manifest.heroImage) {
    const heroPath = resolve(manifestDir, manifest.heroImage);
    console.log(`  Uploading hero image: ${manifest.heroImage}`);
    heroImageAsset = await client.assets.upload(
      "image",
      createReadStream(heroPath),
      { filename: manifest.heroImage.split("/").pop() }
    );
    console.log(`  -> ${heroImageAsset._id}`);
  }

  // Upload gallery images
  const galleryAssets = [];
  if (manifest.galleryImages?.length) {
    for (let i = 0; i < manifest.galleryImages.length; i++) {
      const img = manifest.galleryImages[i];
      const imgPath = resolve(manifestDir, img.path);
      console.log(
        `  Uploading gallery image ${i + 1}/${manifest.galleryImages.length}: ${img.path}`
      );
      const asset = await client.assets.upload(
        "image",
        createReadStream(imgPath),
        { filename: img.path.split("/").pop() }
      );
      console.log(`  -> ${asset._id}`);
      galleryAssets.push({
        _type: "image",
        _key: `gallery-${i}`,
        asset: { _type: "reference", _ref: asset._id },
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
  await client.createOrReplace(doc);

  console.log("");
  console.log("Draft created successfully!");
  console.log(`  Document ID: ${docId}`);
  console.log(`  Images uploaded: ${(heroImageAsset ? 1 : 0) + galleryAssets.length}`);
  console.log("");
  console.log(
    "Open Sanity Studio to review and publish:"
  );
  console.log(
    `  https://justinparra-portfolio.vercel.app/studio/structure/workPost;${docId.replace("drafts.", "work-cs-")}`
  );
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
