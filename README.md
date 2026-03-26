# LM Bookshelf

`LM Bookshelf`는 `NotebookLM` 링크를 로컬에 저장하고, 태그/폴더/메모 기준으로 다시 찾기 쉽게 만드는 Manifest V3 웹익스텐션입니다.

## 목적

- 흩어진 `NotebookLM` 링크를 한곳에 모은다.
- 링크를 `태그`, `폴더`, `메모`로 구조화한다.
- 나중에 다시 찾기 쉽게 `검색`과 `필터`를 제공한다.
- 기본은 로컬 우선으로 유지하고, 이후 필요한 지점에만 AI 보조를 붙인다.

## 현재 상태

- MVP 기본 구조 완료
- 팝업 저장 UI 완료
- 관리자 화면 완료
- `chrome.storage.local` 기반 데이터 계층 완료
- 규칙 기반 스마트 태그 추천 완료
- `NotebookLM` 페이지 원클릭 저장 완료
- 저장 시 기본 폴더 자동 분류 완료
- 페이지 문맥 텍스트 기반 메타데이터 캡처 완료
- JSON 가져오기/내보내기 완료
- 수동 검증 문서 및 자동 검증 하네스 추가

## 핵심 기능

- 현재 탭의 `NotebookLM` 링크 빠른 저장
- `NotebookLM` 페이지 우측 하단 원클릭 저장
- 제목, URL, 폴더, 태그, 메모 관리
- 페이지 문맥 텍스트를 메모로 캡처
- 최근 저장 항목 조회
- 전체 라이브러리 검색 및 태그/폴더 필터
- 스마트 태그 추천 및 기본 폴더 자동 분류
- JSON 백업 및 복원

## 문서 맵

- [`implementation_plan.md`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/implementation_plan.md): 제품 목적, 범위, 구조
- [`task.md`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/task.md): 현재 작업 체크리스트와 진행 상태
- [`ROADMAP.md`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/ROADMAP.md): 단계별 확장 계획
- [`TEST_MANUAL.md`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/TEST_MANUAL.md): 수동 검증 절차
- [`HARNESS.md`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/HARNESS.md): 프로젝트 진행에 맞춘 운영/검증 하네스 사용법

## 프로젝트 구조

- [`src/manifest.json`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src/manifest.json): MV3 설정
- [`src/background/background.js`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src/background/background.js): 초기 스토리지 상태 보장
- [`src/popup/popup.html`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src/popup/popup.html): 빠른 저장 팝업
- [`src/popup/popup.js`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src/popup/popup.js): 팝업 로직
- [`src/manager/manager.html`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src/manager/manager.html): 전체 관리 화면
- [`src/manager/manager.js`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src/manager/manager.js): 검색/필터/편집 로직
- [`src/content/content.js`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src/content/content.js): NotebookLM 페이지 원클릭 저장 UI
- [`src/utils/storage.js`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src/utils/storage.js): 로컬 저장 계층
- [`src/utils/smart_tags.js`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src/utils/smart_tags.js): 스마트 태그 규칙 엔진
- [`scripts/verify_project.mjs`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/scripts/verify_project.mjs): 구조/설정 검증 하네스

## 로드 방법

1. `chrome://extensions`로 이동
2. `개발자 모드` 활성화
3. `압축해제된 확장 프로그램을 로드합니다` 클릭
4. [`src`](/c:/Users/sunji/workspace/Browser-Extension-Framework/LM_Bookshelf/src) 폴더 선택

## 검증 하네스

1. `npm run verify`
2. `TEST_MANUAL.md` 순서대로 수동 확인
3. 완료된 항목을 `task.md`에 반영
4. 범위 변경 시 `implementation_plan.md`와 `ROADMAP.md` 동기화

## 다음 우선순위

- 중복 링크 병합 UX 개선
- 태그 추천 품질 고도화
- 사용자 선택형 AI 요약 연동
