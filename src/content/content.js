(function () {
  if (window.top !== window) {
    return;
  }

  const ROOT_ID = 'lm-bookshelf-dock';

  function createDock() {
    if (document.getElementById(ROOT_ID)) {
      return;
    }

    const dock = document.createElement('div');
    dock.id = ROOT_ID;
    dock.innerHTML = `
      <div class="lm-bookshelf-card">
        <div class="lm-bookshelf-title">LM Bookshelf</div>
        <div class="lm-bookshelf-actions">
          <button type="button" data-action="save">Save Notebook</button>
          <button type="button" data-action="open">Open Shelf</button>
        </div>
        <div class="lm-bookshelf-status" aria-live="polite">Ready</div>
      </div>
    `;

    document.documentElement.appendChild(dock);

    const status = dock.querySelector('.lm-bookshelf-status');
    const setStatus = (message, kind = 'default') => {
      status.textContent = message;
      status.dataset.kind = kind;
    };

    dock.querySelector('[data-action="save"]').addEventListener('click', async () => {
      setStatus('Saving...', 'default');
      chrome.runtime.sendMessage({
        action: 'SAVE_NOTEBOOKLM_PAGE',
        payload: {
          title: document.title,
          url: window.location.href,
          notes: ''
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
