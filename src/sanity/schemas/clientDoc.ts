const clientDoc = {
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "order",
      title: "Order",
      type: "number",
    },
  ],
  preview: {
    select: { title: "name" },
  },
};

export default clientDoc;
