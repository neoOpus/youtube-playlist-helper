import type { Playlist, Video } from "../types/model";

function escapeCSV(str: string): string {
    if (!str) return "";
    const escaped = str.replace(/"/g, '""');
    return escaped.includes(",") || escaped.includes('"') || escaped.includes("\n")
      ? `"${escaped}"`
      : escaped;
}

export type ExportTemplate = 'minimal' | 'academic' | 'showcase';

export const formatExporter = {
  /**
   * Converts a list of playlists to CSV format with enhanced metadata.
   */
  toCSV(playlists: Playlist[]): string {
    const headers = ["Playlist Title", "Video Title", "Video URL", "Author", "Duration", "Views", "Date Added", "Rating", "Energy Vibe", "Tags"];
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
                v.dateAdded ? new Date(v.dateAdded).toLocaleDateString() : "",
                v.rating || "",
                v.energyVibe || "",
                escapeCSV((v.aiTags || []).join("; "))
            ];
            rows.push(row.join(","));
        }
    }

    return rows.join("\n");
  },

  /**
   * Converts a list of playlists to a high-fidelity Markdown Portfolio.
   */
  toMarkdown(playlists: Playlist[], template: ExportTemplate = 'showcase'): string {
    let output = `# Infrastructure Intelligence Portfolio\n`;
    output += `Generated on: ${new Date().toLocaleString()}\n\n`;
    output += `---\n\n`;

    for (const p of playlists) {
        output += `## ${p.title}\n\n`;

        if (template === 'showcase') {
            output += `> **Summary**: ${p.videos.length} infrastructure nodes curated in this sector.\n\n`;
        }

        if (template === 'academic' || template === 'showcase') {
            output += `| Intelligence Node | Origin | Metrics | Assessment |\n`;
            output += `| :--- | :--- | :--- | :--- |\n`;
        } else {
            output += `| Title | URL | Tags |\n`;
            output += `| :--- | :--- | :--- |\n`;
        }

        const videos = p.loadedVideos || [];
        for (const v of videos) {
            if (template === 'minimal') {
                output += `| ${v.title} | [${v.url}](${v.url}) | ${(v.aiTags || []).join(", ")} |\n`;
            } else {
                const metrics = `⏱️ ${v.duration || 'N/A'} • 👁️ ${v.views || 'N/A'}`;
                const assessment = `⭐ ${v.rating || 'Unrated'} • ⚡ ${v.energyVibe || 'Neutral'}`;
                output += `| [${v.title}](${v.url}) | ${v.author || v.channel || 'Unknown'} | ${metrics} | ${assessment} |\n`;
            }
        }
        output += `\n\n`;
    }

    return output;
  },

  /**
   * Standard JSON export for system-to-system migration.
   */
  toJSON(playlists: Playlist[]): string {
      return JSON.stringify(playlists, null, 2);
  },

  /**
   * Simple text summary for quick reviews.
   */
  toTXT(playlists: Playlist[]): string {
    let output = `Infrastructure Intelligence Summary\n`;
    output += `Generated on: ${new Date().toLocaleString()}\n\n`;

    for (const p of playlists) {
        output += `Playlist: ${p.title}\n`;
        const videos = p.loadedVideos || [];
        for (const v of videos) {
            output += `- ${v.title} (${v.url})\n`;
        }
        output += `\n`;
    }

    return output;
  }
};
