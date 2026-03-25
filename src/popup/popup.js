import { bookshelfStorage } from '../utils/storage.js';
import { looksLikeNotebookLm, parseTagsInput, stringifyTags, suggestTags } from '../utils/smart_tags.js';

const titleInput = document.getElementById('titleInput');
const urlInput = document.getElementById('urlInput');
const folderInput = document.getElementById('folderInput');
const tagsInput = document.getElementById('tagsInput');
const notesInput = document.getElementById('notesInput');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const refreshTagsBtn = document.getElementById('refreshTagsBtn');
const smartTags = document.getElementById('smartTags');
const recentList = document.getElementById('recentList');
const searchInput = document.getElementById('searchInput');
const openManagerBtn = document.getElementById('openManagerBtn');
const tabStatus = document.getElementById('tabStatus');
const folderSuggestions = document.getElementById('folderSuggestions');
const toast = document.getElementById('toast');
const STORAGE_KEY = 'lm_bookshelf_state';

let activeTabInfo = null;
let recentItems = [];

function t(key) {
  return chrome.i18n.getMessage(key) || key;
}

function localize() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    const message = t(key);
    if (message) {
      element.textContent = message;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    const message = t(key);
    if (message) {
      element.placeholder = message;
    }
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.add('hidden'), 2200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderFolderSuggestions(folders) {
  folderSuggestions.innerHTML = folders.map((folder) => `<option value="${escapeHtml(folder)}"></option>`).join('');
}

function currentDraft() {
  return {
    title: titleInput.value.trim(),
    url: urlInput.value.trim(),
    folder: folderInput.value.trim(),
    tags: parseTagsInput(tagsInput.value),
    notes: notesInput.value.trim()
  };
}

function renderSmartTags() {
  const suggestions = suggestTags(currentDraft());
  if (!suggestions.length) {
    smartTags.innerHTML = `<span class="status-chip">${t('noSuggestions')}</span>`;
    return;
  }

  smartTags.innerHTML = '';
  suggestions.forEach((tag) => {
    const button = document.createElement('button');
    button.className = 'tag-chip';
    button.type = 'button';
    button.textContent = `+ ${tag}`;
    button.addEventListener('click', () => {
      const nextTags = [...new Set([...parseTagsInput(tagsInput.value), tag])];
      tagsInput.value = stringifyTags(nextTags);
      renderSmartTags();
    });
    smartTags.appendChild(button);
  });
}

function itemMatchesQuery(item, query) {
  const haystack = [
    item.title,
    item.url,
    item.folder,
    item.notes,
    ...(item.tags || []),
    ...(item.smartTags || [])
  ].join(' ').toLowerCase();
  return haystack.includes(query);
}

function renderRecentItems() {
  const query = searchInput.value.trim().toLowerCase();
  const items = query ? recentItems.filter((item) => itemMatchesQuery(item, query)) : recentItems;

  if (!items.length) {
    recentList.innerHTML = `<div class="empty-state">${t('emptyLibrary')}</div>`;
    return;
  }

  recentList.innerHTML = '';
  items.slice(0, 8).forEach((item) => {
    const card = document.createElement('article');
    card.className = 'item-card';
    card.innerHTML = `
      <h3>${escapeHtml(item.title || t('untitledItem'))}</h3>
      <div class="item-meta">
        <span>${escapeHtml(item.folder || t('uncategorizedFolder'))}</span>
        <span>${escapeHtml([...(item.tags || []), ...(item.smartTags || [])].slice(0, 3).join(', ') || t('noTagsLabel'))}</span>
      </div>
      <div class="item-notes">${escapeHtml(item.notes || item.url)}</div>
      <div class="item-actions">
        <button class="mini-btn" data-action="open">${t('open')}</button>
        <button class="mini-btn" data-action="reuse">${t('reuse')}</button>
        <button class="mini-btn" data-action="delete">${t('delete')}</button>
      </div>
    `;

    card.querySelector('[data-action="open"]').addEventListener('click', async () => {
      await chrome.tabs.create({ url: item.url });
      await bookshelfStorage.touchItem(item.id);
      await loadRecentItems();
    });

    card.querySelector('[data-action="reuse"]').addEventListener('click', () => {
      titleInput.value = item.title;
      urlInput.value = item.url;
      folderInput.value = item.folder;
      tagsInput.value = stringifyTags(item.tags);
      notesInput.value = item.notes;
      renderSmartTags();
    });

    card.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      await bookshelfStorage.deleteItem(item.id);
      await loadRecentItems();
      showToast(t('itemDeleted'));
    });

    recentList.appendChild(card);
  });
}

function resetForm({ keepTab = true } = {}) {
  titleInput.value = keepTab && activeTabInfo ? activeTabInfo.title : '';
  urlInput.value = keepTab && activeTabInfo ? activeTabInfo.url : '';
  folderInput.value = '';
  tagsInput.value = '';
  notesInput.value = '';
  renderSmartTags();
}

async function preloadActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  if (!tab) {
    tabStatus.textContent = t('tabUnavailable');
    return;
  }

  activeTabInfo = {
    title: tab.title || '',
    url: tab.url || ''
  };

  titleInput.value = activeTabInfo.title;
  urlInput.value = activeTabInfo.url;
  tabStatus.textContent = looksLikeNotebookLm(activeTabInfo.url) ? t('detectedNotebookLm') : t('manualMode');
  renderSmartTags();
}

async function loadRecentItems() {
  recentItems = await bookshelfStorage.getItems();
  renderRecentItems();
  const folders = await bookshelfStorage.getFolders();
  renderFolderSuggestions(folders);
}

async function saveCurrentItem() {
  const draft = currentDraft();

  if (!draft.title || !draft.url) {
    showToast(t('fillTitleAndUrl'));
    return;
  }

  const smartTagging = (await bookshelfStorage.getSettings()).smartTagging;
  const smartTagResults = smartTagging ? suggestTags(draft) : [];

  await bookshelfStorage.upsertItem({
    ...draft,
    smartTags: smartTagResults,
    source: activeTabInfo?.url === draft.url ? 'current_tab' : 'manual'
  });

  await loadRecentItems();
  showToast(t('itemSaved'));
  resetForm();
}

function bindEvents() {
  [titleInput, urlInput, folderInput, tagsInput, notesInput].forEach((field) => {
    field.addEventListener('input', renderSmartTags);
  });

  saveBtn.addEventListener('click', saveCurrentItem);
  resetBtn.addEventListener('click', () => resetForm());
  refreshTagsBtn.addEventListener('click', renderSmartTags);
  searchInput.addEventListener('input', renderRecentItems);
  openManagerBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('manager/manager.html') });
  });

  chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'local' && changes[STORAGE_KEY]) {
      await loadRecentItems();
      renderSmartTags();
    }
  });
}

async function init() {
  localize();
  bindEvents();
  await preloadActiveTab();
  await loadRecentItems();
}

document.addEventListener('DOMContentLoaded', init);
