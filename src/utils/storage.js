import { normalizeTag } from './smart_tags.js';

const STORAGE_KEY = 'lm_bookshelf_state';

function defaultState() {
  return {
    version: 1,
    items: [],
    settings: {
      smartTagging: true
    }
  };
}

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return `item_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeItem(item) {
  return {
    id: item.id || makeId(),
    title: String(item.title || '').trim(),
    url: String(item.url || '').trim(),
    folder: String(item.folder || '').trim(),
    tags: [...new Set((item.tags || []).map((tag) => normalizeTag(tag)).filter(Boolean))],
    smartTags: [...new Set((item.smartTags || []).map((tag) => normalizeTag(tag)).filter(Boolean))],
    notes: String(item.notes || '').trim(),
    source: item.source || 'manual',
    createdAt: item.createdAt || nowIso(),
    updatedAt: nowIso(),
    lastOpenedAt: item.lastOpenedAt || null
  };
}

class BookshelfStorage {
  constructor() {
    this.cache = null;
  }

  async getState() {
    if (this.cache) {
      return structuredClone(this.cache);
    }

    const result = await chrome.storage.local.get([STORAGE_KEY]);
    const state = result[STORAGE_KEY] || defaultState();
    this.cache = state;
    return structuredClone(state);
  }

  async saveState(state) {
    const nextState = {
      version: state.version || 1,
      items: Array.isArray(state.items) ? state.items.map((item) => normalizeItem(item)) : [],
      settings: {
        smartTagging: state.settings?.smartTagging !== false
      }
    };

    this.cache = nextState;
    await chrome.storage.local.set({ [STORAGE_KEY]: nextState });
    return structuredClone(nextState);
  }

  async getItems() {
    const state = await this.getState();
    return [...state.items].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async getItem(id) {
    const items = await this.getItems();
    return items.find((item) => item.id === id) || null;
  }

  async upsertItem(item) {
    const state = await this.getState();
    const existingIndex = state.items.findIndex((entry) => entry.id === item.id || (!item.id && entry.url === item.url));
    const normalized = normalizeItem(existingIndex >= 0 ? { ...state.items[existingIndex], ...item } : item);

    if (existingIndex >= 0) {
      state.items[existingIndex] = normalized;
    } else {
      state.items.push(normalized);
    }

    await this.saveState(state);
    return normalized;
  }

  async deleteItem(id) {
    const state = await this.getState();
    state.items = state.items.filter((item) => item.id !== id);
    await this.saveState(state);
  }

  async touchItem(id) {
    const state = await this.getState();
    const target = state.items.find((item) => item.id === id);
    if (!target) {
      return null;
    }

    target.lastOpenedAt = nowIso();
    target.updatedAt = nowIso();
    await chrome.storage.local.set({ [STORAGE_KEY]: state });
    this.cache = state;
    return structuredClone(target);
  }

  async getSettings() {
    const state = await this.getState();
    return structuredClone(state.settings);
  }

  async updateSettings(partial) {
    const state = await this.getState();
    state.settings = {
      ...state.settings,
      ...partial
    };
    await this.saveState(state);
    return structuredClone(state.settings);
  }

  async exportState() {
    return this.getState();
  }

  async importState(payload) {
    const importedItems = Array.isArray(payload?.items) ? payload.items : [];
    const state = {
      version: 1,
      items: importedItems.map((item) => normalizeItem(item)),
      settings: {
        smartTagging: payload?.settings?.smartTagging !== false
      }
    };
    return this.saveState(state);
  }

  async getFolders() {
    const items = await this.getItems();
    return [...new Set(items.map((item) => item.folder).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  async getAllTags() {
    const items = await this.getItems();
    const tags = new Set();
    items.forEach((item) => {
      [...item.tags, ...item.smartTags].forEach((tag) => {
        if (tag) {
          tags.add(tag);
        }
      });
    });
    return [...tags].sort((a, b) => a.localeCompare(b));
  }
}

export const bookshelfStorage = new BookshelfStorage();
