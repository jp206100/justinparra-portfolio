import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "justinparra-portfolio",
  title: "Justin Parra Portfolio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            S.listItem()
              .title("Work Posts")
              .schemaType("workPost")
              .child(S.documentTypeList("workPost").title("Work Posts")),
            S.listItem()
              .title("Categories")
              .schemaType("category")
              .child(S.documentTypeList("category").title("Categories")),
            S.divider(),
            S.listItem()
              .title("Experience")
              .schemaType("experienceEntry")
              .child(
                S.documentTypeList("experienceEntry").title("Experience")
              ),
            S.listItem()
              .title("Clients")
              .schemaType("client")
              .child(S.documentTypeList("client").title("Clients")),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
