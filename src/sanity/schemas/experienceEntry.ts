const experienceEntry = {
  name: "experienceEntry",
  title: "Experience Entry",
  type: "document",
  fields: [
    {
      name: "role",
      title: "Role",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "company",
      title: "Company",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "companyUrl",
      title: "Company URL",
      type: "url",
    },
    {
      name: "startYear",
      title: "Start Year",
      type: "number",
    },
    {
      name: "endYear",
      title: "End Year",
      type: "string",
      description: 'Use a year number or "Present"',
    },
    {
      name: "order",
      title: "Order",
      type: "number",
    },
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "role", subtitle: "company" },
  },
};

export default experienceEntry;
