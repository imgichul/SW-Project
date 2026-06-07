# Campus Market

## 1. 프로젝트 소개

Campus Market은 교내 학생들을 위한 중고거래 웹 플랫폼이다.  
학생들이 사용하지 않는 물건을 판매글로 등록하고, 다른 학생들이 등록된 물품을 조회할 수 있도록 하는 것을 목표로 한다.

본 프로젝트는 오픈소스SW개론 최종 프로젝트로 진행되며, Git과 GitHub를 활용한 협업 과정을 중심으로 개발한다.  
HTML, CSS, JavaScript, Firebase Firestore를 사용하여 웹 페이지를 구현하고, GitHub Issues, Branch, Pull Request를 활용하여 팀원별 작업을 체계적으로 관리한다.

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
| Database | Firebase Firestore |
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
│   ├── firebase.js
│   └── storage.js
│
├── docs/
│   ├── branch-strategy.md
│   ├── meeting-log.md
│   └── roles.md
│
├── README.md
└── .gitignore

## 6. 코드의 용도 및 파일 설명

본 프로젝트는 별도의 프레임워크 없이 HTML, CSS, JavaScript를 기반으로 구현된 정적 웹 프로젝트이다. 각 파일의 주요 역할은 다음과 같다.

index.html: 메인 페이지로, 서비스 소개와 판매글 목록/등록 페이지로 이동하는 버튼을 제공한다.

login.html: 사용자 로그인 화면을 구성한다.

signup.html: 사용자 회원가입 화면을 구성한다.

posts.html: 등록된 판매글 목록을 조회하는 페이지이다. 검색, 카테고리 필터, 상세 필터 기능을 제공한다.

post-new.html: 판매글 등록 페이지이다. 제목, 가격, 카테고리, 설명, 거래 희망 장소, 연락처, 상품 사진을 입력할 수 있다.

post-detail.html: 판매글 상세 조회 페이지이다. 판매글 내용 확인, 거래 상태 변경, 수정, 삭제 기능을 제공한다.

css/style.css: 전체 웹 페이지의 공통 디자인, 버튼, 카드, 폼, 반응형 스타일을 정의한다.

js/auth.js: 회원가입, 로그인, 로그아웃, 로그인 상태 유지 기능을 담당한다.

js/posts.js: 판매글 등록, 목록 조회, 상세조회, 수정, 삭제, 검색 및 필터 기능을 담당한다.

js/firebase.js: Firebase Firestore 연결 설정을 담당한다.

js/storage.js: 기존 localStorage 기반 데이터 처리를 위해 사용된 파일이다. 현재 판매글 데이터는 Firebase Firestore 중심으로 관리된다.

---

## 7. 주요 기능 사용법

### 7.1 회원가입 및 로그인

1. 메인 페이지에서 로그인 페이지로 이동한다.
2. 계정이 없는 경우 `회원가입하기`를 눌러 회원가입 페이지로 이동한다.
3. 아이디, 비밀번호, 닉네임, 학번을 입력하여 회원가입한다.
4. 로그인 페이지에서 아이디와 비밀번호를 입력하여 로그인한다.

### 7.2 판매글 등록

1. 메인 페이지 또는 판매글 목록 페이지에서 `판매글 등록하기` 버튼을 클릭한다.
2. 판매글 제목, 가격, 카테고리, 거래 희망 장소, 연락처, 설명을 입력한다.
3. 필요한 경우 상품 사진을 선택한다.
4. `등록하기` 버튼을 클릭하면 판매글이 Firebase Firestore의 `posts` 컬렉션에 저장된다.
5. 등록이 완료되면 판매글 목록 페이지로 이동하며, 등록한 글이 목록에 표시된다.

### 7.3 판매글 조회

1. `posts.html` 페이지에서 등록된 판매글 목록을 확인할 수 있다.
2. 판매글 카드를 클릭하면 해당 판매글의 상세 페이지로 이동한다.
3. 상세 페이지에서는 제목, 가격, 카테고리, 작성자, 작성일, 거래 장소, 연락처, 설명, 상품 이미지를 확인할 수 있다.

### 7.4 판매글 수정 및 삭제

1. 로그인한 사용자가 본인이 작성한 판매글 상세 페이지에 접속하면 `수정`, `삭제`, `상태 변경` 버튼이 표시된다.
2. 다른 사용자가 작성한 판매글에는 수정 및 삭제 버튼이 표시되지 않는다.
3. 수정 버튼을 누르면 기존 판매글 정보를 수정할 수 있다.
4. 삭제 버튼을 누르면 확인창이 표시되고, 확인 시 해당 판매글이 Firestore에서 삭제된다.

### 7.5 검색 및 필터

판매글 목록 페이지에서는 다음 기능을 사용할 수 있다.

* 검색어를 입력하여 판매글 제목 또는 설명 기준으로 검색
* 카테고리별 필터
* 거래 상태별 필터
* 가격 범위 필터
* 업로드 기간 필터
* 최신순, 오래된순, 가격 높은 순, 가격 낮은 순 정렬

---

## 8. 컴파일 및 실행 방법

본 프로젝트는 HTML, CSS, JavaScript로 구성된 정적 웹 프로젝트이므로 별도의 컴파일 과정은 필요하지 않다.
다만 Firebase SDK를 JavaScript module 방식으로 불러오기 때문에, HTML 파일을 직접 더블클릭하여 `file:///` 방식으로 실행하면 일부 기능이 정상적으로 동작하지 않을 수 있다. 따라서 VS Code Live Server를 통해 실행하는 것을 권장한다.


### 8.1 로컬 환경에서 실행

로컬에서 프로젝트를 실행하려면 먼저 저장소를 clone한다.

```bash
git clone https://github.com/imgichul/SW-Project.git
cd SW-Project
```

이후 Visual Studio Code에서 프로젝트 폴더를 열고, Live Server 확장 프로그램을 사용하여 `index.html`을 실행한다.

실행 순서는 다음과 같다.

1. Visual Studio Code 실행
2. `SW-Project` 폴더 열기
3. 확장 프로그램에서 `Live Server` 설치
4. `index.html` 파일 우클릭
5. `Open with Live Server` 클릭
6. 브라우저에서 웹사이트 실행 확인

정상적으로 실행되면 주소가 다음과 같은 형태로 표시된다.

```text
http://127.0.0.1:5500/index.html
```

또는

```text
http://localhost:5500/index.html
```



```md
