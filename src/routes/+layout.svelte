<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>CLI Cheatsheets</title>
</svelte:head>

{@render children()}

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(:root) {
    --bg: #0d1117;
    --surface: #161b22;
    --surface-hover: #1c2128;
    --border: #30363d;
    --text: #c9d1d9;
    --text-muted: #8b949e;
    --accent: #00d9ff;
    --accent-hover: #33e4ff;
    --green: #4ade80;
    --yellow: #ffd60a;
    --code-bg: #0d1117;
    --radius: 6px;
    --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  }

  :global(body) {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    min-height: 100vh;
  }
</style>
