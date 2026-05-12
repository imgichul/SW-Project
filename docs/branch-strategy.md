# 브랜치 전략

## 1. 사용 전략

본 프로젝트는 GitHub Flow 전략을 사용한다.

교내 중고거래 플랫폼은 HTML, CSS, JavaScript 기반의 웹 프로젝트이며,
팀원들이 기능별로 나누어 작업한 뒤 Pull Request를 통해 main 브랜치에 병합하는 방식으로 협업한다.

## 2. 브랜치 구조

### main
최종 완성본을 관리하는 브랜치이다.

### feature/*
기능 개발을 위한 브랜치이다.

예시:
- feature/layout
- feature/auth
- feature/post-create
- feature/post-list
- feature/post-detail
- feature/search-filter
- feature/style

### docs/*
문서 작업을 위한 브랜치이다.

예시:
- docs/readme
- docs/branch-strategy

### fix/*
버그 수정을 위한 브랜치이다.

예시:
- fix/login-error
- fix/post-delete-error

## 3. 작업 흐름

1. Issue를 생성한다.
2. 담당자는 기능별 브랜치를 생성한다.
3. 기능을 구현한다.
4. commit 후 push한다.
5. Pull Request를 생성한다.
6. 팀장이 검토한다.
7. main 브랜치에 병합한다.

## 4. 협업 규칙

- main 브랜치에 직접 push하지 않는다.
- 기능별로 Issue를 생성한 뒤 작업한다.
- 하나의 브랜치에서는 하나의 기능만 작업한다.
- Pull Request에는 작업 내용, 관련 Issue 번호, 테스트 내용을 작성한다.
- 팀장의 검토 후 main 브랜치에 병합한다.
