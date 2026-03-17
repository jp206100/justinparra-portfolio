const youtube = {
  name: "youtube",
  title: "YouTube Video",
  type: "object",
  fields: [
    {
      name: "url",
      title: "YouTube URL",
      type: "url",
      description: "Paste a YouTube video URL (e.g. https://www.youtube.com/watch?v=...)",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
  ],
  preview: {
    select: { url: "url" },
    prepare({ url }: { url?: string }) {
      return {
        title: "YouTube Video",
        subtitle: url || "No URL set",
      };
    },
  },
};

export default youtube;
