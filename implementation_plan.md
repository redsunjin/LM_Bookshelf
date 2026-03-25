# LM Bookshelf Implementation Plan

## Product Goal

`NotebookLM` 링크가 계속 쌓일 때, 사용자가 나중에 다시 찾을 수 있도록 `저장`, `태깅`, `분류`, `검색`을 빠르게 수행하는 로컬 중심 웹익스텐션을 만든다.

## User Problem

- `NotebookLM` 링크가 브라우저 북마크나 탭에 흩어진다.
- 어떤 주제였는지 기억이 흐려져 다시 찾기 어렵다.
- 태그, 폴더, 메모를 붙여 구조화하고 싶다.
- 필요하면 AI 보조를 붙이되, 기본은 가볍고 바로 써야 한다.

## MVP Scope

1. 현재 탭의 `NotebookLM` 링크 저장
2. 수동 링크/제목 수정
3. 태그, 폴더, 메모 관리
4. 전체 검색과 필터링
5. 전체 관리자 대시보드
6. 로컬 스마트 태그 제안
7. JSON 내보내기/가져오기

## Architecture

- `popup`: 빠른 저장과 최근 항목 확인
- `manager`: 전체 라이브러리 관리
- `storage service`: `chrome.storage.local` 기반 CRUD
- `smart tag engine`: 제목/메모/URL의 키워드 기반 분류 보조
- `background`: 최초 설치 초기 데이터 보장

## Data Model

```json
{
  "version": 1,
  "items": [
    {
      "id": "item_xxx",
      "title": "Quarterly Research Notes",
      "url": "https://notebooklm.google.com/notebook/...",
      "folder": "Research",
      "tags": ["research", "q1"],
      "smartTags": ["analysis"],
      "notes": "경쟁사 정리",
      "createdAt": "2026-03-25T10:00:00.000Z",
      "updatedAt": "2026-03-25T10:00:00.000Z",
      "source": "current_tab"
    }
  ]
}
```

## Product Direction After MVP

- 사용자 정의 AI API 연결
- 자동 요약 생성
- 제목/메모 임베딩 기반 유사 노트북 추천
- NotebookLM 페이지 컨텍스트에서 원클릭 저장
