import type { Playlist, Video } from "../types/model";

function escapeCSV(str: string): string {
    if (!str) return "";
    const escaped = str.replace(/"/g, '""');
    return escaped.includes(",") || escaped.includes('"') || escaped.includes("\n")
      ? `"${escaped}"`
      : escaped;
}

export const formatExporter = {
  /**
   * Converts a list of playlists to CSV format.
   */
  toCSV(playlists: Playlist[]): string {
    const headers = ["Playlist Title", "Video Title", "Video URL", "Author", "Duration", "Views", "Date Added"];
    const rows = [headers.join(",")];

    for (const p of playlists) {
        const videos = p.loadedVideos || [];
        for (const v of videos) {
            const row = [
                escapeCSV(p.title),
                escapeCSV(v.title),
                v.url,
                escapeCSV(v.author || v.channel || ""),
                v.duration || "",
                v.views || "",
                v.dateAdded ? new Date(v.dateAdded).toLocaleDateString() : ""
            ];
            rows.push(row.join(","));
        }
    }

    return rows.join("\n");
  },

  /**
   * Converts a list of playlists to a plain text summary.
   */
  toTXT(playlists: Playlist[]): string {
    let output = "YPH PLAYLIST EXPORT\n";
    output += "===================\n\n";

    for (const p of playlists) {
        output += `Playlist: ${p.title}\n`;
        output += `Videos: ${p.videos.length}\n`;
        output += "-------------------\n";

        const videos = p.loadedVideos || [];
        for (const v of videos) {
            output += `- ${v.title} (${v.url})\n`;
        }
        output += "\n";
    }

    return output;
  },

  /**
   * Converts a list of playlists to Markdown format.
   */
  toMarkdown(playlists: Playlist[]): string {
    let output = "# YPH Playlist Export\n\n";

    for (const p of playlists) {
        output += `## ${p.title}\n\n`;
        output += "| Title | Author | URL |\n";
        output += "|-------|--------|-----|\n";

        const videos = p.loadedVideos || [];
        for (const v of videos) {
            output += `| ${v.title} | ${v.author || v.channel} | [Link](${v.url}) |\n`;
        }
        output += "\n";
    }

    return output;
  }
};
