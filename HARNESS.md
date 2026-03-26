# LM Bookshelf Harness

## 목적

이 하네스는 `문서`, `진행 상태`, `검증`을 한 흐름으로 유지하기 위한 운영 규칙이다.

## 기본 원칙

- 기능 범위가 바뀌면 먼저 `implementation_plan.md`를 수정한다.
- 실제 작업 단위는 `task.md`에서 체크한다.
- 다음 단계 방향은 `ROADMAP.md`에 남긴다.
- 기능 완료 후에는 `TEST_MANUAL.md`와 `npm run verify`를 같이 실행한다.
- 사용자에게 보여줄 현재 상태는 `README.md`에 반영한다.

## 작업 흐름

1. 목표 정의: `implementation_plan.md`
2. 작업 분해: `task.md`
3. 구현
4. 자동 검증: `npm run verify`
5. 수동 검증: `TEST_MANUAL.md`
6. 진행 상태 반영: `README.md`, `task.md`, `ROADMAP.md`

## 문서 업데이트 기준

- 목적/문제 정의가 바뀌면 `implementation_plan.md`
- 현재 완료 상태가 바뀌면 `README.md`
- 체크 가능한 일이 끝나면 `task.md`
- 다음 분기 계획이 바뀌면 `ROADMAP.md`
- 테스트 절차가 바뀌면 `TEST_MANUAL.md`

## 하네스 구성요소

- 문서 하네스: `README.md`, `implementation_plan.md`, `task.md`, `ROADMAP.md`
- 검증 하네스: `scripts/verify_project.mjs`, `TEST_MANUAL.md`
- 코드 하네스: `src/manifest.json`, `src/utils/storage.js`, `src/utils/smart_tags.js`
- 페이지 통합 하네스: `src/content/content.js`, `src/background/background.js`

## 최소 완료 기준

- `manifest`와 locale이 파싱 가능해야 한다.
- 핵심 엔트리 파일이 모두 존재해야 한다.
- `README`와 `task.md` 상태가 현재 구현과 일치해야 한다.
- 수동 테스트 체크리스트 기준 핵심 흐름이 통과해야 한다.
