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

export function looksLikeNotebookLm(url = '') {
  return /^https:\/\/notebooklm\.google\.com\/.+/i.test(String(url).trim());
}
