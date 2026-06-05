<script lang="ts">
  import { HelpCircle, Mail, Github, Book, Heart, Globe } from "lucide-svelte";
</script>

<div class="view-container">
  <header class="page-header">
      <h1>Support & Documentation</h1>
      <p class="text-secondary">Need help? We've got you covered.</p>
  </header>

  <div class="support-grid">
      <div class="support-card surface-1">
          <Book size="24" class="icon-primary" />
          <h3>Guides</h3>
          <p>Learn how to master your playlists and use advanced features.</p>
          <a href="https://github.com/neoOpus/youtube-playlist-helper" target="_blank" class="link">Read Documentation</a>
      </div>

      <div class="support-card surface-1">
          <Github size="24" class="icon-primary" />
          <h3>Source Code</h3>
          <p>Report bugs or contribute to the project on GitHub.</p>
          <a href="https://github.com/neoOpus/youtube-playlist-helper/issues" target="_blank" class="link">Open Issue</a>
      </div>

      <div class="support-card surface-1">
          <Mail size="24" class="icon-primary" />
          <h3>Contact</h3>
          <p>Get in touch for support or feedback.</p>
          <a href="mailto:support@yph.com" class="link">Send Email</a>
      </div>

      <div class="support-card surface-1">
          <Heart size="24" class="icon-primary" />
          <h3>Donate</h3>
          <p>Support the independent development of this tool.</p>
          <a href="https://paypal.me/neoOpus" target="_blank" class="link">Support Project</a>
      </div>
  </div>
</div>

<style>
  .page-header { margin-bottom: 2rem; }
  h1 { font-size: 1.75rem; font-weight: 800; }
  .text-secondary { font-size: 0.9rem; color: var(--text-secondary); }

  .support-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
  .support-card { padding: 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; }

  h3 { font-size: 1.1rem; font-weight: 700; margin: 0; }
  p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

  .link { color: var(--primary); font-weight: 700; font-size: 0.9rem; text-decoration: none; }
  .link:hover { text-decoration: underline; }

  :global(.icon-primary) { color: var(--primary); }
</style>
