const TAG_RULES = [
  { tag: 'research', keywords: ['research', 'paper', 'study', 'article', 'literature', 'benchmark'] },
  { tag: 'meeting', keywords: ['meeting', 'agenda', 'minutes', 'sync', 'standup', 'review'] },
  { tag: 'course', keywords: ['course', 'lecture', 'lesson', 'tutorial', 'class', 'syllabus'] },
  { tag: 'product', keywords: ['product', 'feature', 'roadmap', 'launch', 'prd', 'spec'] },
  { tag: 'engineering', keywords: ['api', 'architecture', 'bug', 'code', 'system', 'infra', 'design doc'] },
  { tag: 'content', keywords: ['blog', 'newsletter', 'script', 'post', 'video', 'youtube', 'podcast'] },
  { tag: 'sales', keywords: ['sales', 'lead', 'customer', 'pipeline', 'deal', 'proposal'] },
  { tag: 'legal', keywords: ['legal', 'policy', 'contract', 'compliance', 'privacy', 'terms'] },
  { tag: 'project', keywords: ['project', 'sprint', 'task', 'plan', 'backlog', 'milestone'] },
  { tag: 'analysis', keywords: ['analysis', 'insight', 'summary', 'report', 'comparison'] }
];

const FOLDER_RULES = [
  { folder: 'Research', keywords: ['research', 'paper', 'study', 'article', 'benchmark', 'analysis'] },
  { folder: 'Meetings', keywords: ['meeting', 'agenda', 'minutes', 'sync', 'standup', 'review'] },
  { folder: 'Courses', keywords: ['course', 'lecture', 'lesson', 'tutorial', 'class', 'syllabus'] },
  { folder: 'Product', keywords: ['product', 'feature', 'roadmap', 'prd', 'spec', 'launch'] },
  { folder: 'Engineering', keywords: ['api', 'architecture', 'bug', 'code', 'system', 'infra', 'design'] },
  { folder: 'Content', keywords: ['blog', 'newsletter', 'script', 'post', 'video', 'youtube', 'podcast'] },
  { folder: 'Sales', keywords: ['sales', 'lead', 'customer', 'pipeline', 'deal', 'proposal'] },
  { folder: 'Legal', keywords: ['legal', 'policy', 'contract', 'compliance', 'privacy', 'terms'] },
  { folder: 'Projects', keywords: ['project', 'sprint', 'task', 'plan', 'backlog', 'milestone'] }
];

export function normalizeTag(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_가-힣]/g, '');
}

export function parseTagsInput(value) {
  return String(value || '')
    .split(',')
    .map((tag) => normalizeTag(tag))
    .filter(Boolean);
}

export function stringifyTags(tags) {
  return [...new Set((tags || []).map((tag) => normalizeTag(tag)).filter(Boolean))].join(', ');
}

export function suggestTags({ title = '', notes = '', url = '', folder = '', tags = [] }) {
  const existingTags = new Set((tags || []).map((tag) => normalizeTag(tag)));
  const haystack = [title, notes, url, folder].join(' ').toLowerCase();
  const matches = new Set();

  TAG_RULES.forEach((rule) => {
    if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
      matches.add(rule.tag);
    }
  });

  if (url.includes('notebooklm.google.com')) {
    matches.add('notebooklm');
  }

  return [...matches].filter((tag) => !existingTags.has(tag));
}

export function suggestFolder({ title = '', notes = '', url = '', folder = '', tags = [], smartTags = [] }) {
  if (String(folder || '').trim()) {
    return String(folder).trim();
  }

  const haystack = [title, notes, url, ...(tags || []), ...(smartTags || [])].join(' ').toLowerCase();
  const match = FOLDER_RULES.find((rule) => rule.keywords.some((keyword) => haystack.includes(keyword)));
  return match ? match.folder : 'Inbox';
}

export function classifyDraft(draft) {
  const smartTags = suggestTags(draft);
  const folder = suggestFolder({ ...draft, smartTags });
  return {
    smartTags,
    folder
  };
}

export function looksLikeNotebookLm(url = '') {
  return /^https:\/\/notebooklm\.google\.com\/.+/i.test(String(url).trim());
}
