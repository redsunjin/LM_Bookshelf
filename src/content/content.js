(function () {
  if (window.top !== window) {
    return;
  }

  const ROOT_ID = 'lm-bookshelf-dock';
  const UI_TEXT_BLOCKLIST = new Set([
    'share',
    'settings',
    'create',
    'discover',
    'chat',
    'studio',
    'save notebook',
    'open shelf',
    'ready',
    'sources',
    'add source',
    'notebook guide'
  ]);

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function uniqueTexts(values, maxItems = 6) {
    const seen = new Set();
    const result = [];

    values.forEach((value) => {
      const text = cleanText(value);
      if (!text) {
        return;
      }

      const key = text.toLowerCase();
      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      result.push(text);
    });

    return result.slice(0, maxItems);
  }

  function stripNotebookLmSuffix(value) {
    return cleanText(value).replace(/\s*[-|·]\s*NotebookLM.*$/i, '').trim();
  }

  function isUsefulContext(text) {
    const normalized = cleanText(text);
    if (normalized.length < 18 || normalized.length > 180) {
      return false;
    }

    return !UI_TEXT_BLOCKLIST.has(normalized.toLowerCase());
  }

  function getNotebookTitle() {
    const candidates = uniqueTexts([
      document.querySelector('meta[property="og:title"]')?.content,
      document.querySelector('h1')?.textContent,
      document.querySelector('[role="heading"][aria-level="1"]')?.textContent,
      document.title
    ], 4).map(stripNotebookLmSuffix).filter(Boolean);

    return candidates[0] || stripNotebookLmSuffix(document.title) || 'Untitled Notebook';
  }

  function collectContextBlocks() {
    const selectors = [
      'main h1',
      'main h2',
      'main h3',
      'main p',
      'main li',
      '[role="main"] h1',
      '[role="main"] h2',
      '[role="main"] h3',
      '[role="main"] p',
      '[role="main"] li'
    ];

    const nodes = Array.from(document.querySelectorAll(selectors.join(', ')));
    const texts = nodes
      .map((node) => cleanText(node.textContent))
      .filter(isUsefulContext);

    return uniqueTexts(texts, 4);
  }

  function collectSignalTags() {
    const selectors = [
      'main button',
      'main [role="button"]',
      'main a',
      'header button',
      'header a'
    ];

    const candidates = Array.from(document.querySelectorAll(selectors.join(', ')))
      .map((node) => cleanText(node.textContent))
      .filter((text) => text.length >= 3 && text.length <= 24)
      .filter((text) => text.split(' ').length <= 3)
      .filter((text) => !UI_TEXT_BLOCKLIST.has(text.toLowerCase()));

    return uniqueTexts(candidates, 5);
  }

  function buildCapturedNotes() {
    const contextBlocks = collectContextBlocks();
    const signalTags = collectSignalTags();
    const parts = [];

    if (contextBlocks.length) {
      parts.push(`Context: ${contextBlocks.join(' | ')}`);
    }

    if (signalTags.length) {
      parts.push(`Signals: ${signalTags.join(', ')}`);
    }

    return {
      notes: parts.join('\n'),
      tags: signalTags
    };
  }

  function createDock() {
    if (document.getElementById(ROOT_ID)) {
      return;
    }

    const dock = document.createElement('div');
    dock.id = ROOT_ID;
    dock.innerHTML = `
      <div class="lm-bookshelf-card">
        <div class="lm-bookshelf-title">LM Bookshelf</div>
        <div class="lm-bookshelf-preview"></div>
        <div class="lm-bookshelf-actions">
          <button type="button" data-action="save">Save Notebook</button>
          <button type="button" data-action="open">Open Shelf</button>
        </div>
        <div class="lm-bookshelf-status" aria-live="polite">Ready</div>
      </div>
    `;

    document.documentElement.appendChild(dock);

    const status = dock.querySelector('.lm-bookshelf-status');
    const preview = dock.querySelector('.lm-bookshelf-preview');
    const refreshPreview = () => {
      preview.textContent = getNotebookTitle();
    };
    const setStatus = (message, kind = 'default') => {
      status.textContent = message;
      status.dataset.kind = kind;
    };

    refreshPreview();

    dock.querySelector('[data-action="save"]').addEventListener('click', async () => {
      const captured = buildCapturedNotes();
      const title = getNotebookTitle();
      setStatus('Saving...', 'default');
      chrome.runtime.sendMessage({
        action: 'SAVE_NOTEBOOKLM_PAGE',
        payload: {
          title,
          url: window.location.href,
          notes: captured.notes,
          tags: captured.tags
        }
      }, (response) => {
        if (chrome.runtime.lastError || !response?.ok) {
          setStatus('Save failed', 'error');
          return;
        }

        const folder = response.item?.folder || 'Inbox';
        setStatus(`Saved to ${folder}`, 'success');
      });
    });

    dock.querySelector('[data-action="open"]').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'OPEN_MANAGER' });
      setStatus('Shelf opened', 'default');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDock, { once: true });
  } else {
    createDock();
  }
})();
