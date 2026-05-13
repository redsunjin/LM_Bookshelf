# Task: LM Bookshelf MVP Delivery

## 1. Product Identity
- [x] 서비스명 `LM Bookshelf` 정의 <!-- id: 100 -->
- [x] `NotebookLM 링크 라이브러리` 제품 목적 정리 <!-- id: 101 -->
- [x] 로컬 우선 운영 원칙 정의 <!-- id: 102 -->

## 2. Core MVP
- [x] 빠른 저장 팝업 구현 <!-- id: 200 -->
- [x] 전체 관리자 화면 구현 <!-- id: 201 -->
- [x] 로컬 스토리지 CRUD 구현 <!-- id: 202 -->
- [x] 태그/폴더/메모 기반 검색 구현 <!-- id: 203 -->
- [x] JSON 내보내기/가져오기 구현 <!-- id: 204 -->
- [x] 규칙 기반 스마트 태그 구현 <!-- id: 205 -->
- [x] `NotebookLM` 페이지 원클릭 저장 구현 <!-- id: 206 -->
- [x] 저장 시 기본 폴더 자동 분류 구현 <!-- id: 207 -->

## 3. Documentation System
- [x] `README`를 제품 개요 중심으로 재정비 <!-- id: 300 -->
- [x] 작업 계획 문서를 구조/범위 중심으로 정리 <!-- id: 301 -->
- [x] 진행 상태 추적용 `task.md` 추가 <!-- id: 302 -->
- [x] 장기 계획용 `ROADMAP.md` 추가 <!-- id: 303 -->
- [x] 수동 검증용 `TEST_MANUAL.md` 추가 <!-- id: 304 -->
- [x] 운영 규칙용 `HARNESS.md` 추가 <!-- id: 305 -->

## 4. Verification Harness
- [x] 프로젝트 구조 검증 스크립트 추가 <!-- id: 400 -->
- [x] `manifest`/locale/핵심 파일 존재 확인 자동화 <!-- id: 401 -->
- [x] 검증 명령 `npm run verify` 구성 <!-- id: 402 -->

## 5. Next Work
- [x] NotebookLM 페이지 메타데이터 추출 고도화 <!-- id: 504 -->
- [ ] NotebookLM 저장 시 사용자 메모와 자동 메모를 분리하는 UX 설계 <!-- id: 505 -->
- [ ] 자동 메모/태그 생성 시 원본 컨텍스트 미리보기 추가 <!-- id: 506 -->
- [ ] 최근 저장 항목 정렬 UX 개선 <!-- id: 507 -->
- [ ] 항목 고정(pin) 기능 추가 <!-- id: 508 -->
- [ ] 중복 링크 병합 UX 정의 및 구현 <!-- id: 509 -->
- [ ] 스마트 태그 규칙 확장 및 사용자 편집 UX 추가 <!-- id: 510 -->
- [ ] 검색 결과 우선순위 정렬 규칙 추가 <!-- id: 511 -->
- [ ] AI 요약/자동 분류 연동 구조 설계 <!-- id: 512 -->

## 6. Next Sprint Plan

### Sprint A: Save UX Refinement
- [ ] 자동 메모와 사용자 메모를 분리 저장한다.
- [ ] NotebookLM 페이지 저장 전 추출된 제목/메모 미리보기를 제공한다.
- [ ] 저장 완료 후 최근 항목 카드에 `source`, `updatedAt`, `lastOpenedAt` 표시를 정리한다.

### Sprint B: Retrieval Quality
- [ ] 최근 저장 항목 정렬 기준을 `recent`, `updated`, `created`로 나눈다.
- [ ] 고정된 항목을 목록 상단에 유지한다.
- [ ] 동일 URL 저장 시 `덮어쓰기`, `병합`, `취소` 흐름을 정의한다.

### Sprint C: Classification Quality
- [ ] 스마트 태그 규칙을 실제 NotebookLM 사용 사례 기준으로 확장한다.
- [ ] 사용자 지정 태그 규칙 또는 폴더 선호값 저장 구조를 설계한다.
- [ ] 검색 결과 우선순위에 `pinned`, `lastOpenedAt`, 태그 일치도를 반영한다.

## 현재 진행 상태

- 현재 단계: `MVP 목적 적합성 보강`
- 다음 목표: `저장 UX 정교화 후 검색/분류 품질 개선`
- 릴리즈 기준: `핵심 저장/검색/관리/백업 흐름이 수동 테스트를 통과할 것`
