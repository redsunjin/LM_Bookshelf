# LM Bookshelf Implementation Plan

## 1. 제품 목적

`NotebookLM` 링크가 계속 쌓일 때, 사용자가 나중에 빠르게 다시 찾고 재사용할 수 있도록 `저장`, `태깅`, `분류`, `검색`을 제공하는 로컬 중심 웹익스텐션을 만든다.

## 2. 해결하려는 문제

- `NotebookLM` 링크가 탭, 메신저, 북마크에 흩어진다.
- 링크만 남고 맥락이 사라져 다시 찾기 어렵다.
- 어떤 링크가 어떤 프로젝트/주제에 속하는지 관리가 어렵다.
- AI 보조는 유용하지만, 기본 저장과 검색이 먼저 안정적이어야 한다.

## 3. 현재 제품 원칙

- 로컬 우선
- 최소 권한
- 빠른 저장 우선
- 구조화된 재탐색 지원
- AI는 선택적 고도화 레이어로 분리

## 4. MVP 범위

1. 현재 탭의 링크를 빠르게 저장
2. 제목, URL, 폴더, 태그, 메모 수정
3. 최근 저장 항목 확인
4. 전체 관리자 화면 제공
5. 제목/URL/태그/메모 검색
6. 폴더/태그 필터링
7. JSON 내보내기/가져오기
8. 규칙 기반 스마트 태그 제안

## 5. 현재 구현 상태

- 완료: 팝업 저장 UI
- 완료: 관리자 UI
- 완료: `chrome.storage.local` 기반 CRUD
- 완료: 로컬 스마트 태그 로직
- 완료: JSON 백업/복원
- 완료: README/계획/작업/검증 문서 체계
- 완료: 기본 구조 검증 하네스
- 예정: `NotebookLM` 페이지 원클릭 저장

## 6. 아키텍처

- `popup`
  현재 탭 저장, 최근 항목 확인, 빠른 재사용
- `manager`
  전체 라이브러리 조회, 검색, 필터, 편집, 백업/복원
- `storage service`
  `chrome.storage.local` 기반 상태 보존
- `smart tag engine`
  제목/메모/URL 키워드 기반 분류 보조
- `background`
  초기 스토리지 상태 보장

## 7. 데이터 모델

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
      "source": "current_tab",
      "createdAt": "2026-03-25T10:00:00.000Z",
      "updatedAt": "2026-03-25T10:00:00.000Z",
      "lastOpenedAt": null
    }
  ],
  "settings": {
    "smartTagging": true
  }
}
```

## 8. 검증 기준

- `manifest`와 locale JSON이 파싱 가능할 것
- 핵심 엔트리 파일이 모두 존재할 것
- 저장 후 팝업과 관리자 화면이 동기화될 것
- 검색/필터/수정/삭제/백업/복원 흐름이 수동 테스트를 통과할 것

## 9. 다음 설계 포인트

- `NotebookLM` 페이지 원클릭 저장을 어디에 붙일지
- 저장 시 자동 폴더 분류를 어떤 규칙으로 할지
- `NotebookLM` 페이지에서 URL/제목을 더 자연스럽게 캡처하는 방법
- 중복 링크가 있을 때 병합할지 갱신할지에 대한 UX
- 스마트 태그 규칙 확장 또는 AI 보조로 넘어가는 기준
