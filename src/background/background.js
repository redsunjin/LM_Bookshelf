import { bookshelfStorage } from '../utils/storage.js';
import { classifyDraft } from '../utils/smart_tags.js';

const STORAGE_KEY = 'lm_bookshelf_state';

const defaultState = () => ({
  version: 1,
  items: [],
  settings: {
    smartTagging: true
  }
});

async function ensureState() {
  const result = await chrome.storage.local.get([STORAGE_KEY]);
  if (!result[STORAGE_KEY]) {
    await chrome.storage.local.set({ [STORAGE_KEY]: defaultState() });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  ensureState().catch((error) => {
    console.error('LM Bookshelf install initialization failed', error);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.action === 'SAVE_NOTEBOOKLM_PAGE') {
    (async () => {
      try {
        const draft = {
          title: String(message.payload?.title || '').trim(),
          url: String(message.payload?.url || '').trim(),
          notes: String(message.payload?.notes || '').trim(),
          folder: String(message.payload?.folder || '').trim(),
          tags: Array.isArray(message.payload?.tags) ? message.payload.tags : []
        };

        const classified = classifyDraft(draft);
        const item = await bookshelfStorage.upsertItem({
          ...draft,
          folder: draft.folder || classified.folder,
          smartTags: classified.smartTags,
          source: 'notebooklm_page'
        });

        sendResponse({
          ok: true,
          item
        });
      } catch (error) {
        console.error('LM Bookshelf page save failed', error);
        sendResponse({
          ok: false,
          error: String(error)
        });
      }
    })();
    return true;
  }

  if (message?.action === 'OPEN_MANAGER') {
    chrome.tabs.create({ url: chrome.runtime.getURL('manager/manager.html') });
    sendResponse({ ok: true });
  }
});
