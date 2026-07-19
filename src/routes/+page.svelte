<script lang="ts">
  import type { PageData } from './$types';
  import type { Command } from '$lib/types';

  let { data }: { data: PageData } = $props();

  let search = $state('');
  let activeCategory = $state('all');
  let copied = $state<string | null>(null);

  const categories = data.categories;

  const showHub = $derived(activeCategory === 'all' && search.trim() === '');

  const filtered = $derived.by(() => {
    const q = search.toLowerCase().trim();
    return categories
      .filter((cat) => activeCategory === 'all' || cat.category === activeCategory)
      .map((cat) => ({
        ...cat,
        commands: cat.commands.filter((cmd: Command) => {
          if (!q) return true;
          return (
            cmd.name.toLowerCase().includes(q) ||
            cmd.command.toLowerCase().includes(q) ||
            cmd.description.toLowerCase().includes(q) ||
            cmd.tags?.some((t) => t.toLowerCase().includes(q))
          );
        })
      }))
      .filter((cat) => cat.commands.length > 0);
  });

  async function copy(command: string, id: string) {
    await navigator.clipboard.writeText(command);
    copied = id;
    setTimeout(() => (copied = null), 1500);
  }
</script>

<div class="layout">
  <header>
    <div class="header-inner">
      <div class="logo">
        <span class="logo-icon">$_</span>
        <span class="logo-text">CLI Cheatsheets</span>
      </div>
      <p class="tagline">Quick reference for curl, grep, kubectl, pipes and more</p>
      <div class="search-wrap">
        <input
          class="search"
          type="search"
          placeholder="Search commands..."
          bind:value={search}
        />
      </div>
    </div>
  </header>

  <div class="content">
    <nav class="sidebar">
      <p class="sidebar-label">Categories</p>
      <button
        class="cat-btn"
        class:active={activeCategory === 'all'}
        onclick={() => (activeCategory = 'all')}
      >
        <span class="cat-icon">⊞</span>
        <span class="cat-name">All</span>
        <span class="cat-count">{categories.reduce((n, c) => n + c.commands.length, 0)}</span>
      </button>
      {#each categories as cat}
        <button
          class="cat-btn"
          class:active={activeCategory === cat.category}
          onclick={() => (activeCategory = cat.category)}
        >
          <span class="cat-icon">{cat.icon}</span>
          <span class="cat-name">{cat.category}</span>
          <span class="cat-count">{cat.commands.length}</span>
        </button>
      {/each}
    </nav>

    <main>
      {#if showHub}
        <div class="hub-grid">
          {#each categories as cat}
            <button class="hub-card" onclick={() => (activeCategory = cat.category)}>
              <div class="hub-icon-wrap">
                <span class="hub-icon">{cat.icon}</span>
              </div>
              <div class="hub-body">
                <h3 class="hub-name">{cat.category}</h3>
                <p class="hub-desc">{cat.description}</p>
              </div>
              <span class="hub-count">{cat.commands.length} commands</span>
            </button>
          {/each}
        </div>
      {:else if filtered.length === 0}
        <div class="empty">No commands found for <strong>"{search}"</strong></div>
      {:else}
        {#each filtered as cat}
          <section class="category-section">
            <div class="category-header">
              <span class="category-icon">{cat.icon}</span>
              <div>
                <h2>{cat.category}</h2>
                <p class="category-desc">{cat.description}</p>
              </div>
            </div>
            <div class="commands-grid">
              {#each cat.commands as cmd, i}
                {@const id = `${cat.category}-${i}`}
                <div class="command-card">
                  <div class="command-top">
                    <span class="command-name">{cmd.name}</span>
                    <button
                      class="copy-btn"
                      class:copied={copied === id}
                      onclick={() => copy(cmd.command, id)}
                    >
                      {copied === id ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre class="command-code"><code>{cmd.command}</code></pre>
                  <p class="command-desc">{cmd.description}</p>
                  {#if cmd.tags?.length}
                    <div class="tags">
                      {#each cmd.tags as tag}
                        <span class="tag">{tag}</span>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </section>
        {/each}
      {/if}
    </main>
  </div>
</div>

<style>
  .layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 2rem 1.5rem;
    text-align: center;
  }

  .header-inner {
    max-width: 800px;
    margin: 0 auto;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .logo-icon {
    font-family: var(--font-mono);
    font-size: 1.5rem;
    color: var(--accent);
    font-weight: 700;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .tagline {
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .search {
    width: 100%;
    max-width: 500px;
    padding: 0.75rem 1rem;
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .search:focus {
    border-color: var(--accent);
  }

  .content {
    display: flex;
    flex: 1;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    width: 180px;
    min-width: 180px;
    position: sticky;
    top: 1.5rem;
    align-self: flex-start;
    max-height: calc(100vh - 3rem);
    overflow-y: auto;
  }

  .sidebar-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    padding: 0 0.75rem;
    margin-bottom: 0.35rem;
  }

  .cat-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: var(--radius);
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.85rem;
    text-align: left;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
    width: 100%;
    position: relative;
  }

  .cat-btn::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 2px;
    border-radius: 2px;
    background: var(--accent);
    opacity: 0;
    transition: opacity 0.15s;
  }

  .cat-btn:hover {
    background: var(--surface-hover);
    color: var(--text);
  }

  .cat-btn.active {
    background: var(--surface-hover);
    color: var(--accent);
  }

  .cat-btn.active::before {
    opacity: 1;
  }

  .cat-icon {
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
  }

  .cat-name {
    flex: 1;
    text-transform: capitalize;
  }

  .cat-count {
    font-size: 0.7rem;
    color: var(--text-muted);
    background: var(--surface-hover);
    padding: 0.1rem 0.4rem;
    border-radius: 10px;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }

  .cat-btn.active .cat-count {
    background: rgba(124, 111, 255, 0.15);
    color: var(--accent);
  }

  main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .category-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .category-icon {
    font-size: 1.75rem;
  }

  .category-header h2 {
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .category-desc {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .commands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1rem;
  }

  .command-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    transition: border-color 0.15s;
  }

  .command-card:hover {
    border-color: var(--accent);
  }

  .command-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .command-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
  }

  .copy-btn {
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
    background: var(--surface-hover);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .copy-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .copy-btn.copied {
    border-color: var(--green);
    color: var(--green);
  }

  .command-code {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.6rem 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: #67e8f9;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .command-desc {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .tag {
    font-size: 0.7rem;
    padding: 0.15rem 0.45rem;
    background: var(--surface-hover);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-muted);
  }

  .hub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  .hub-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    position: relative;
    overflow: hidden;
  }

  .hub-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(124, 111, 255, 0.06) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .hub-card:hover {
    border-color: var(--accent);
    background: var(--surface-hover);
    box-shadow: 0 0 0 1px rgba(124, 111, 255, 0.15), 0 4px 24px rgba(0, 0, 0, 0.3);
  }

  .hub-card:hover::before {
    opacity: 1;
  }

  .hub-icon-wrap {
    width: 2.75rem;
    height: 2.75rem;
    background: var(--surface-hover);
    border: 1px solid var(--border);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s;
  }

  .hub-card:hover .hub-icon-wrap {
    border-color: rgba(124, 111, 255, 0.4);
  }

  .hub-icon {
    font-size: 1.4rem;
    line-height: 1;
  }

  .hub-body {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    flex: 1;
  }

  .hub-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text);
    text-transform: capitalize;
  }

  .hub-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.45;
  }

  .hub-count {
    font-size: 0.72rem;
    color: var(--accent);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .empty {
    text-align: center;
    color: var(--text-muted);
    padding: 4rem;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .content {
      flex-direction: column;
      padding: 1rem;
    }

    .sidebar {
      flex-direction: row;
      flex-wrap: wrap;
      position: static;
      max-height: none;
      width: 100%;
      min-width: unset;
    }

    .sidebar-label {
      display: none;
    }

    .cat-count {
      display: none;
    }

    .commands-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
