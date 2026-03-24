const workPost = {
  name: "workPost",
  title: "Work Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      description: "Short description for card preview",
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        { type: "youtube" },
      ],
    },
    {
      name: "date",
      title: "Date",
      type: "date",
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    },
    {
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "caseStudyWhat",
      title: "What",
      type: "array",
      of: [{ type: "block" }],
      description: "Case Study: What was the project about?",
      hidden: ({ document }: { document: { categories?: { _ref: string }[] } }) =>
        !document?.categories?.length,
    },
    {
      name: "caseStudyHow",
      title: "How",
      type: "array",
      of: [{ type: "block" }],
      description: "Case Study: How did you approach it?",
      hidden: ({ document }: { document: { categories?: { _ref: string }[] } }) =>
        !document?.categories?.length,
    },
    {
      name: "caseStudyResults",
      title: "Results",
      type: "array",
      of: [{ type: "block" }],
      description: "Case Study: What were the results?",
      hidden: ({ document }: { document: { categories?: { _ref: string }[] } }) =>
        !document?.categories?.length,
    },
    {
      name: "caseStudyRole",
      title: "My Role",
      type: "array",
      of: [{ type: "string" }],
      description: "Case Study: List of responsibilities",
      hidden: ({ document }: { document: { categories?: { _ref: string }[] } }) =>
        !document?.categories?.length,
    },
    {
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Alt Text", type: "string" },
            { name: "caption", title: "Caption", type: "string" },
          ],
        },
      ],
      description: "Case Study: Project images (recommended 5)",
    },
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
};

export default workPost;
