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
    --bg: #08090c;
    --surface: #111318;
    --surface-hover: #1c1f2e;
    --border: #1e2235;
    --text: #f1f5ff;
    --text-muted: #7c8aaa;
    --accent: #7c6fff;
    --accent-hover: #a78bfa;
    --green: #22d3a3;
    --code-bg: #060709;
    --radius: 8px;
    --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  }

  :global(body) {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    min-height: 100vh;
  }
</style>
