# Campus Market

## 1. 프로젝트 소개

Campus Market은 교내 학생들을 위한 중고거래 웹 플랫폼이다.  
학생들이 사용하지 않는 물건을 판매글로 등록하고, 다른 학생들이 등록된 물품을 조회할 수 있도록 하는 것을 목표로 한다.

본 프로젝트는 오픈소스SW개론 최종 프로젝트로 진행되며, Git과 GitHub를 활용한 협업 과정을 중심으로 개발한다.  
HTML, CSS, JavaScript를 사용하여 웹 페이지를 구현하고, GitHub Issues, Branch, Pull Request를 활용하여 팀원별 작업을 체계적으로 관리한다.

## 2. 프로젝트 주제 선정 이유

기존 중고거래 플랫폼은 지역 기반으로 운영되는 경우가 많아 교내 학생 간 거래에 최적화되어 있지 않다.  
교내 학생들은 전공책, 기숙사 물품, 전자기기, 생활용품 등을 자주 사고팔기 때문에 학교 구성원을 대상으로 한 중고거래 플랫폼이 필요하다고 판단하였다.

따라서 본 프로젝트에서는 교내 학생들이 물품을 쉽게 등록하고 조회할 수 있는 간단한 중고거래 플랫폼을 구현하고자 한다.

## 3. 주요 기능

### 3.1 회원 관련 기능

- 회원가입 화면
- 로그인 화면
- 사용자 정보 저장
- 로그인 여부 확인

### 3.2 판매글 기능

- 판매글 등록
- 판매글 목록 조회
- 판매글 상세 조회
- 판매글 수정
- 판매글 삭제

### 3.3 거래 상태 관리

판매글의 거래 상태를 다음과 같이 관리한다.

- 판매중
- 예약중
- 거래완료

### 3.4 검색 및 필터 기능

- 물품명 검색
- 카테고리별 필터
- 거래 상태별 필터

## 4. 개발 환경

| 구분 | 사용 기술 |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Version Control | Git |
| Collaboration | GitHub |
| Project Management | GitHub Issues, GitHub Projects |
| Deployment | GitHub Pages |
| Editor | Visual Studio Code |

## 5. 프로젝트 구조

```text
campus-market/
│
├── index.html
├── login.html
├── signup.html
├── posts.html
├── post-detail.html
├── post-new.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── common.js
│   ├── auth.js
│   ├── posts.js
│   └── storage.js
│
├── docs/
│   ├── branch-strategy.md
│   ├── meeting-log.md
│   └── roles.md
│
├── README.md
└── .gitignore
