import type { Video } from "../types/model";

export const aiService = {
  async analyzeVideo(video: Video): Promise<Partial<Video>> {
    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock AI response based on title
    const tags = ["YouTube", "Video"];
    if (video.title.toLowerCase().includes("music")) tags.push("Music");
    if (video.title.toLowerCase().includes("tutorial")) tags.push("Education");
    if (video.title.toLowerCase().includes("rick")) tags.push("Meme", "Classic");

    return {
      aiSummary: `This is an AI-generated summary for "${video.title}". It appears to be a ${tags.join(", ")} related video.`,
      aiTags: tags,
    };
  },
};
