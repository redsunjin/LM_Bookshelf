# LM Bookshelf

`LM Bookshelf` is a Manifest V3 browser extension for collecting, tagging, and searching `NotebookLM` links locally.

## What It Does

- Save the current `NotebookLM` tab into a personal library
- Organize links with folders, tags, and notes
- Search across title, URL, notes, folder, and tags
- Use local smart-tag suggestions to speed up classification
- Manage the full library from a dedicated dashboard

## Privacy Model

- Local-first
- No external API calls
- All data stored in `chrome.storage.local`

## Project Structure

- `src/manifest.json`: MV3 manifest
- `src/background/background.js`: install initialization
- `src/popup/*`: quick-save popup UI
- `src/manager/*`: full management dashboard
- `src/utils/storage.js`: persistent data layer
- `src/utils/smart_tags.js`: local smart-tag suggestion logic
- `src/_locales/*`: Korean and English strings

## Load In Browser

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click `Load unpacked`
4. Select [`src`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src)

## Current MVP Scope

- `NotebookLM` link library
- Tag and folder management
- Quick save from current tab
- Search and filtering
- JSON export and import

## Planned Next Step

- Optional AI enrichment such as summary extraction or semantic tag suggestions via a user-provided model or API
