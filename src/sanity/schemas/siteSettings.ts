const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    {
      name: "heroLabel",
      title: "Hero Label",
      type: "string",
    },
    {
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
    },
    {
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "string",
    },
    {
      name: "aboutStatement",
      title: "About Statement",
      type: "text",
    },
    {
      name: "aboutBody",
      title: "About Body",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "seekingText",
      title: "Currently Seeking Text",
      type: "text",
    },
    {
      name: "contactHeading",
      title: "Contact Heading",
      type: "string",
    },
    {
      name: "contactSubtext",
      title: "Contact Subtext",
      type: "string",
    },
    {
      name: "githubUsername",
      title: "GitHub Username",
      type: "string",
    },
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
};

export default siteSettings;
