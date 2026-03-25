import { bookshelfStorage } from '../utils/storage.js';
import { parseTagsInput, stringifyTags, suggestTags } from '../utils/smart_tags.js';

const searchInput = document.getElementById('searchInput');
const folderFilter = document.getElementById('folderFilter');
const tagFilterCloud = document.getElementById('tagFilterCloud');
const itemsGrid = document.getElementById('itemsGrid');
const resultMeta = document.getElementById('resultMeta');
const totalCount = document.getElementById('totalCount');
const folderCount = document.getElementById('folderCount');
const addItemBtn = document.getElementById('addItemBtn');
const exportBtn = document.getElementById('exportBtn');
const importInput = document.getElementById('importInput');
const smartTaggingToggle = document.getElementById('smartTaggingToggle');
const clearTagFilterBtn = document.getElementById('clearTagFilterBtn');

const editorDialog = document.getElementById('editorDialog');
const dialogTitle = document.getElementById('dialogTitle');
const editTitle = document.getElementById('editTitle');
const editUrl = document.getElementById('editUrl');
const editFolder = document.getElementById('editFolder');
const editTags = document.getElementById('editTags');
const editNotes = document.getElementById('editNotes');
const deleteBtn = document.getElementById('deleteBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeDialogBtn = document.getElementById('closeDialogBtn');
const dialogSmartTags = document.getElementById('dialogSmartTags');
const dialogFolderSuggestions = document.getElementById('dialogFolderSuggestions');
const STORAGE_KEY = 'lm_bookshelf_state';

let items = [];
let activeItemId = null;
let activeTagFilter = '';

function t(key, substitutions) {
  return chrome.i18n.getMessage(key, substitutions) || key;
}

function localize() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getDraft() {
  return {
    title: editTitle.value.trim(),
    url: editUrl.value.trim(),
    folder: editFolder.value.trim(),
    tags: parseTagsInput(editTags.value),
    notes: editNotes.value.trim()
  };
}

function renderDialogSuggestions() {
  const suggestions = suggestTags(getDraft());
  dialogSmartTags.innerHTML = '';

  if (!suggestions.length) {
    dialogSmartTags.innerHTML = `<span class="chip">${t('noSuggestions')}</span>`;
    return;
  }

  suggestions.forEach((tag) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.textContent = `+ ${tag}`;
    button.addEventListener('click', () => {
      const nextTags = [...new Set([...parseTagsInput(editTags.value), tag])];
      editTags.value = stringifyTags(nextTags);
      renderDialogSuggestions();
    });
    dialogSmartTags.appendChild(button);
  });
}

function filteredItems() {
  const query = searchInput.value.trim().toLowerCase();
  const folder = folderFilter.value;

  return items.filter((item) => {
    const matchesQuery = !query || [
      item.title,
      item.url,
      item.folder,
      item.notes,
      ...(item.tags || []),
      ...(item.smartTags || [])
    ].join(' ').toLowerCase().includes(query);

    const matchesFolder = folder === 'all' || item.folder === folder;
    const combinedTags = [...(item.tags || []), ...(item.smartTags || [])];
    const matchesTag = !activeTagFilter || combinedTags.includes(activeTagFilter);
    return matchesQuery && matchesFolder && matchesTag;
  });
}

function renderStats() {
  totalCount.textContent = String(items.length);
  folderCount.textContent = String(new Set(items.map((item) => item.folder).filter(Boolean)).size);
}

async function renderFilters() {
  const selectedFolder = folderFilter.value || 'all';
  const folders = await bookshelfStorage.getFolders();
  folderFilter.innerHTML = [
    `<option value="all">${t('allFolders')}</option>`,
    ...folders.map((folder) => `<option value="${escapeHtml(folder)}">${escapeHtml(folder)}</option>`)
  ].join('');
  folderFilter.value = folders.includes(selectedFolder) || selectedFolder === 'all' ? selectedFolder : 'all';

  dialogFolderSuggestions.innerHTML = folders.map((folder) => `<option value="${escapeHtml(folder)}"></option>`).join('');

  const allTags = await bookshelfStorage.getAllTags();
  if (activeTagFilter && !allTags.includes(activeTagFilter)) {
    activeTagFilter = '';
  }
  if (!allTags.length) {
    tagFilterCloud.innerHTML = `<span class="chip">${t('noTagsLabel')}</span>`;
    return;
  }

  tagFilterCloud.innerHTML = '';
  allTags.forEach((tag) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `chip ${activeTagFilter === tag ? 'filter-active' : ''}`;
    button.textContent = tag;
    button.addEventListener('click', async () => {
      activeTagFilter = activeTagFilter === tag ? '' : tag;
      await renderFilters();
      renderItems();
    });
    tagFilterCloud.appendChild(button);
  });
}

function renderItems() {
  const visibleItems = filteredItems();
  resultMeta.textContent = t('resultSummary', [String(visibleItems.length), String(items.length)]);

  if (!visibleItems.length) {
    itemsGrid.innerHTML = `<div class="empty-state">${t('emptyLibrary')}</div>`;
    return;
  }

  itemsGrid.innerHTML = '';
  visibleItems.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'item-card';
    const allTags = [...new Set([...(item.tags || []), ...(item.smartTags || [])])];
    card.innerHTML = `
      <h3>${escapeHtml(item.title || t('untitledItem'))}</h3>
      <a class="item-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.url)}</a>
      <div class="meta-row">
        <span class="chip">${escapeHtml(item.folder || t('uncategorizedFolder'))}</span>
        <span class="chip">${escapeHtml(item.source || 'manual')}</span>
      </div>
      <div class="tag-cloud">
        ${allTags.length ? allTags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join('') : `<span class="chip">${t('noTagsLabel')}</span>`}
      </div>
      <div class="item-notes">${escapeHtml(item.notes || t('noNotes'))}</div>
      <div class="item-actions">
        <button class="secondary-btn" data-action="open">${t('open')}</button>
        <button class="secondary-btn" data-action="edit">${t('edit')}</button>
      </div>
    `;

    card.querySelector('[data-action="open"]').addEventListener('click', async () => {
      await chrome.tabs.create({ url: item.url });
      await bookshelfStorage.touchItem(item.id);
      await refresh();
    });

    card.querySelector('[data-action="edit"]').addEventListener('click', () => openEditor(item.id));
    itemsGrid.appendChild(card);
  });
}

async function refresh() {
  items = await bookshelfStorage.getItems();
  const settings = await bookshelfStorage.getSettings();
  smartTaggingToggle.checked = settings.smartTagging;
  renderStats();
  await renderFilters();
  renderItems();
}

async function openEditor(itemId = null) {
  activeItemId = itemId;
  const item = itemId ? await bookshelfStorage.getItem(itemId) : null;

  dialogTitle.textContent = item ? t('editItem') : t('addItem');
  deleteBtn.hidden = !item;
  editTitle.value = item?.title || '';
  editUrl.value = item?.url || '';
  editFolder.value = item?.folder || '';
  editTags.value = stringifyTags(item?.tags || []);
  editNotes.value = item?.notes || '';
  renderDialogSuggestions();
  editorDialog.showModal();
}

async function saveEditor(event) {
  event.preventDefault();
  const draft = getDraft();

  if (!draft.title || !draft.url) {
    return;
  }

  const settings = await bookshelfStorage.getSettings();
  const smartTags = settings.smartTagging ? suggestTags(draft) : [];

  await bookshelfStorage.upsertItem({
    id: activeItemId,
    ...draft,
    smartTags,
    source: activeItemId ? 'manual_edit' : 'manual'
  });

  editorDialog.close();
  await refresh();
}

async function deleteCurrentItem() {
  if (!activeItemId) {
    return;
  }

  await bookshelfStorage.deleteItem(activeItemId);
  editorDialog.close();
  await refresh();
}

async function exportJson() {
  const state = await bookshelfStorage.exportState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'lm-bookshelf-export.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const text = await file.text();
  const payload = JSON.parse(text);
  await bookshelfStorage.importState(payload);
  event.target.value = '';
  await refresh();
}

function bindEvents() {
  [editTitle, editUrl, editFolder, editTags, editNotes].forEach((field) => {
    field.addEventListener('input', renderDialogSuggestions);
  });

  searchInput.addEventListener('input', renderItems);
  folderFilter.addEventListener('change', renderItems);
  addItemBtn.addEventListener('click', () => openEditor());
  clearTagFilterBtn.addEventListener('click', async () => {
    activeTagFilter = '';
    await renderFilters();
    renderItems();
  });
  smartTaggingToggle.addEventListener('change', async () => {
    await bookshelfStorage.updateSettings({ smartTagging: smartTaggingToggle.checked });
  });
  exportBtn.addEventListener('click', exportJson);
  importInput.addEventListener('change', importJson);
  deleteBtn.addEventListener('click', deleteCurrentItem);
  cancelBtn.addEventListener('click', () => editorDialog.close());
  closeDialogBtn.addEventListener('click', () => editorDialog.close());
  editorDialog.querySelector('form').addEventListener('submit', saveEditor);

  chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'local' && changes[STORAGE_KEY]) {
      await refresh();
    }
  });
}

async function init() {
  localize();
  bindEvents();
  await refresh();
}

document.addEventListener('DOMContentLoaded', init);
