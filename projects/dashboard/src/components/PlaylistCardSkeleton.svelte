<svelte:options runes={true} />
<div class="skeleton-card surface-1">
  <div class="header">
      <div class="icon-pulse"></div>
      <div class="meta">
          <div class="line short"></div>
          <div class="line tiny"></div>
      </div>
  </div>
  <div class="body">
      <div class="line long"></div>
      <div class="line med"></div>
  </div>
  <div class="footer">
      <div class="circle"></div>
      <div class="circle"></div>
  </div>
</div>

<style>
  .skeleton-card { padding: 20px; display: flex; flex-direction: column; gap: 20px; height: 180px; }
  .header { display: flex; gap: 12px; align-items: center; }
  .icon-pulse { width: 32px; height: 32px; border-radius: 6px; background: var(--bg-surface-2); animation: pulse 1.5s infinite; }
  .meta { flex: 1; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
  .line { height: 10px; border-radius: 4px; background: var(--bg-surface-2); animation: pulse 1.5s infinite; }
  .line.short { width: 40px; }
  .line.tiny { width: 60px; }
  .line.med { width: 60%; }
  .line.long { width: 90%; }
  .body { flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .footer { display: flex; gap: 8px; }
  .circle { width: 28px; height: 28px; border-radius: 6px; background: var(--bg-surface-2); animation: pulse 1.5s infinite; }

  @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 0.8; } 100% { opacity: 0.5; } }
</style>
