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
