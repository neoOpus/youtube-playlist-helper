import { describe, it, expect } from "vitest";
import { aiService } from "./ai-service";
import type { Video, Playlist } from "../types/model";

describe("aiService", () => {
  describe("calculateVideoRelevance", () => {
    it("should calculate basic relevance score", () => {
      const video = {
        title: "Amazing Music Video",
        aiSummary: "A great music video for testing",
        aiTags: ["music", "test"],
      } as Video;
      const keywords = ["music", "test"];

      const score = aiService.calculateVideoRelevance(video, keywords);

      // 'music' matches title (10) and summary (5) and tags (15) = 30
      // 'test' matches summary (5) and tags (15) = 20
      // Total = 50
      expect(score).toBe(50);
    });

    it("should be case-insensitive", () => {
      const video = {
        title: "ROCK MUSIC",
        aiSummary: "Classic Rock",
        aiTags: ["Rock"],
      } as Video;
      const keywords = ["rock"];

      const score = aiService.calculateVideoRelevance(video, keywords);
      // 'rock' matches title (10) and summary (5) and tags (15) = 30
      expect(score).toBe(30);
    });
  });

  describe("calculatePlaylistRelevance", () => {
    it("should calculate basic relevance score for playlist", () => {
      const playlist = {
        title: "My Favorite Songs",
        groups: ["Music", "2024"],
        loadedVideos: [],
      } as Playlist;
      const keywords = ["music", "songs"];

      const score = aiService.calculatePlaylistRelevance(playlist, keywords);
      // 'music' matches groups (10)
      // 'songs' matches title (20)
      // Total = 30
      expect(score).toBe(30);
    });
  });

  describe("summarizePlaylist", () => {
    it("should generate a valid summary string", async () => {
        const playlist = { title: "Test Playlist" } as Playlist;
        const videos = [{}, {}] as Video[];
        const summary = await aiService.summarizePlaylist(playlist, videos);
        expect(summary).toContain("2 videos");
        expect(summary).toContain("Test Playlist");
    });
  });

  describe("sortByRelevance", () => {
    const mockVideos: Video[] = [
      {
        id: "1",
        videoId: "v1",
        title: "React Tutorial 2024",
        url: "",
        channel: "C1",
        thumbnailUrl: "",
      } as any,
      {
        id: "2",
        videoId: "v2",
        title: "Favorite Music Mix",
        url: "",
        channel: "C2",
        thumbnailUrl: "",
      } as any,
    ];

    it("should correctly calculate video relevance with semantic expansion", () => {
      const keywords = ["coding"]; // Should match 'tutorial' in title via expansion
      const score = aiService.calculateVideoRelevance(
        mockVideos[0],
        aiService.expandKeywords(keywords)
      );
      expect(score).toBeGreaterThan(0);
    });

    it("should sort videos by relevance", () => {
      const keywords = ["music"];
      const sorted = aiService.sortByRelevance(mockVideos, keywords);
      expect(sorted[0].title).toContain("Music");
    });
  });
});
