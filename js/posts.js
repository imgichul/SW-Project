// localStorage에 저장할 판매글 데이터의 key 값
const STORAGE_KEY = "campusMarketPosts";

// localStorage에서 판매글 목록을 가져오는 함수
function getPosts() {
  const posts = localStorage.getItem(STORAGE_KEY);
  return posts ? JSON.parse(posts) : [];
}

// localStorage에 판매글 목록 저장하는 함수
function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// 가격 표시 형식 변환하는 함수
function formatPrice(price) {
  return Number(price).toLocaleString("ko-KR") + "원";
}

// URL에서 판매글 id 가져오는 함수
function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// 카테고리별 이미지 문구 반환
function getCategoryImageText(category) {
  if (category === "전자기기") return "💻 전자기기 이미지";
  if (category === "전공책") return "📚 전공책 이미지";
  if (category === "필기구") return "✏️ 필기구 이미지";
  if (category === "생활용품") return "🏠 생활용품 이미지";
  return "🎒 기타 이미지";
}

// 카테고리별 배지 클래스 반환
function getBadgeClass(category) {
  if (category === "전자기기") return "badge-electronic";
  if (category === "전공책") return "badge-book";
  if (category === "필기구") return "badge-pencil";
  return "badge-etc";
}

// 이미지 파일을 base64 문자열로 변환하는 함수
function readImageFile(file) {
  return new Promise(function (resolve, reject) {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      reject("이미지 파일을 읽는 중 오류가 발생했습니다.");
    };

    reader.readAsDataURL(file);
  });
}

// 판매글 등록 페이지에서 입력한 내용을 읽어 localStorage에 저장하는 함수
function initPostCreate() {
  const postForm = document.getElementById("postForm");

  if (!postForm) {
    return;
  }

  postForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const price = document.getElementById("price").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();
    const imageFile = document.getElementById("image").files[0];

    if (!title || !price || !category || !description) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    let imageData = "";

    try {
      imageData = await readImageFile(imageFile);
    } catch (error) {
      alert(error);
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      title: title,
      price: price,
      category: category,
      description: description,
      imageData: imageData,
      status: "판매중",
      createdAt: new Date().toLocaleString("ko-KR")
    };

    const posts = getPosts();
    posts.unshift(newPost);
    savePosts(posts);

    alert("판매글이 등록되었습니다.");
    window.location.href = "posts.html";
  });
}

// 판매글 목록 페이지에서 localStorage에 저장된 판매글을 카드 형태로 출력하는 함수
// 카테고리 탭을 클릭하면 선택한 카테고리에 해당하는 판매글만 보여줌
function initPostList() {
  const postList = document.getElementById("postList");

  if (!postList) {
    return;
  }

  const tabs = document.querySelectorAll(".tab");
  let selectedCategory = "전체보기";

  function renderPostList() {
    const posts = getPosts();

    const filteredPosts = posts.filter(function (post) {
      return selectedCategory === "전체보기" || post.category === selectedCategory;
    });

    postList.innerHTML = "";

    if (filteredPosts.length === 0) {
      postList.innerHTML = `
        <div class="empty-message">
          등록된 판매글이 없습니다.
        </div>
      `;
      return;
    }

    filteredPosts.forEach(function (post) {
      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-category", post.category);

      card.innerHTML = `
        <div class="product-image">
          ${
            post.imageData
              ? `<img src="${post.imageData}" alt="${post.title}" class="product-img">`
              : getCategoryImageText(post.category)
            }
        </div>
        <div class="product-info">
          <span class="category-badge ${getBadgeClass(post.category)}">${post.category}</span>
          <span class="status-badge">${post.status}</span>
          <h3 class="product-title">${post.title}</h3>
          <div class="product-price">${formatPrice(post.price)}</div>
          <div class="product-meta">
            <span>${post.createdAt}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", function () {
        window.location.href = "post-detail.html?id=" + post.id;
      });

      postList.appendChild(card);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (item) {
        item.classList.remove("active");
      });

      tab.classList.add("active");
      selectedCategory = tab.dataset.category;
      renderPostList();
    });
  });

  renderPostList();
}

// 판매글 상세 페이지에서 URL의 id 값을 기준으로 해당 판매글을 찾아 출력하는 함수
function initPostDetail() {
  const detailArea = document.getElementById("detailArea");

  if (!detailArea) {
    return;
  }

  const postId = getPostIdFromUrl();
  const posts = getPosts();

  const post = posts.find(function (item) {
    return item.id === postId;
  });

  if (!post) {
    detailArea.innerHTML = `
      <div class="empty-message">
        존재하지 않는 판매글입니다.
        <br><br>
        <a href="posts.html" class="back-link">목록으로 돌아가기</a>
      </div>
    `;
    return;
  }

  renderPostDetail(post);
  initPostEdit(post);
}

// 상세 화면 출력
function renderPostDetail(post) {
  const detailArea = document.getElementById("detailArea");

  detailArea.innerHTML = `
    <div class="detail-box">
      <div class="detail-image">
        ${
          post.imageData
             ? `<img src="${post.imageData}" alt="${post.title}" class="detail-img">`
             : getCategoryImageText(post.category)
        }
      </div>
      <div class="detail-info">
        <span class="category-badge ${getBadgeClass(post.category)}">${post.category}</span>
        <span class="status-badge">${post.status}</span>

        <h2>${post.title}</h2>
        <div class="detail-price">${formatPrice(post.price)}</div>

        <p><strong>작성일</strong> ${post.createdAt}</p>

        <div class="detail-description">
          <h3>상품 설명</h3>
          <p>${post.description}</p>
        </div>

        <div class="detail-buttons">
          <button id="editBtn" class="submit-btn">수정</button>
          <button id="deleteBtn" class="delete-btn">삭제</button>
          <a href="posts.html" class="back-link">목록으로</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("editBtn").addEventListener("click", function () {
    showEditForm(post);
  });

  document.getElementById("deleteBtn").addEventListener("click", function () {
    deletePost(post.id);
  });
}

// 판매글 수정 기능
// 상세 페이지의 수정 폼에서 입력한 내용으로 기존 판매글 데이터를 갱신하는 함수
function initPostEdit(post) {
  const editForm = document.getElementById("editForm");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  if (!editForm) {
    return;
  }

  editForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const posts = getPosts();

    const postIndex = posts.findIndex(function (item) {
      return item.id === post.id;
    });

    if (postIndex === -1) {
      alert("수정할 판매글을 찾을 수 없습니다.");
      return;
    }

    posts[postIndex].title = document.getElementById("editTitle").value.trim();
    posts[postIndex].price = document.getElementById("editPrice").value.trim();
    posts[postIndex].category = document.getElementById("editCategory").value;
    posts[postIndex].status = document.getElementById("editStatus").value;
    posts[postIndex].description = document.getElementById("editDescription").value.trim();
    const editImageFile = document.getElementById("editImage").files[0];

    if (editImageFile) {
      try {
        posts[postIndex].imageData = await readImageFile(editImageFile);
      } catch (error) {
        alert(error);
        return;
      }
    }
    savePosts(posts);

    alert("판매글이 수정되었습니다.");
    window.location.href = "post-detail.html?id=" + post.id;
  });

  cancelEditBtn.addEventListener("click", function () {
    document.getElementById("editArea").classList.add("hidden");
    document.getElementById("detailArea").classList.remove("hidden");
  });
}

// 수정 폼 보여주기
function showEditForm(post) {
  document.getElementById("detailArea").classList.add("hidden");
  document.getElementById("editArea").classList.remove("hidden");

  document.getElementById("editTitle").value = post.title;
  document.getElementById("editPrice").value = post.price;
  document.getElementById("editCategory").value = post.category;
  document.getElementById("editStatus").value = post.status;
  document.getElementById("editDescription").value = post.description;
}

// 판매글 삭제 기능
// 선택한 판매글을 localStorage에서 삭제하는 함수
function deletePost(postId) {
  const confirmDelete = confirm("정말 이 판매글을 삭제하시겠습니까?");

  if (!confirmDelete) {
    return;
  }

  const posts = getPosts();

  const updatedPosts = posts.filter(function (post) {
    return post.id !== postId;
  });

  savePosts(updatedPosts);

  alert("판매글이 삭제되었습니다.");
  window.location.href = "posts.html";
}

// 페이지 로드가 완료되면 현재 페이지에 필요한 기능만 실행.
// 각 함수는 해당 HTML 요소가 없으면 바로 종료되므로 여러 페이지에서 같은 posts.js를 사용할 수 있습니다.
document.addEventListener("DOMContentLoaded", function () {
  initPostCreate();
  initPostList();
  initPostDetail();
});

// DOM 요소 가져오기
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// 예시: 필터링 및 렌더링을 담당하는 함수가 있다면
function filterAndRenderPosts() {
  const activeCategory = document.querySelector('.tab.active').dataset.category;
  const keyword = searchInput.value.trim().toLowerCase(); // 대소문자 구분 없이 검색

  // 전체 데이터(모든 판매글)에서 필터링
  const filtered = allPosts.filter(post => {
    // 1. 카테고리 매칭 확인
    const matchCategory = (activeCategory === '전체보기' || post.category === activeCategory);
    
    // 2. 직접 입력 검색어 매칭 확인 (제목이나 내용에 키워드가 포함되는지)
    const matchKeyword = post.title.toLowerCase().includes(keyword) || 
                         post.content.toLowerCase().includes(keyword);

    return matchCategory && matchKeyword;
  });

  // 필터링된 데이터로 화면 그리거나 기존 렌더링 함수 호출
  displayPosts(filtered); 
}

// 이벤트 리스너 등록
searchBtn.addEventListener('click', filterAndRenderPosts);

// 엔터키를 눌러도 검색되도록 처리
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    filterAndRenderPosts();
  }
});

// 기존 카테고리 탭 클릭 이벤트가 있다면, 클릭 시 searchInput.value = '' 로 초기화해주면 더 깔끔합니다!