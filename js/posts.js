// localStorage에 저장할 판매글 데이터의 key 값
const STORAGE_KEY = "campusMarketPosts";

// 거래 상태 값
const TRADE_STATUSES = ["판매중", "예약중", "거래완료"];

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

// 판매글 거래 상태 기본값 반환
function getPostStatus(post) {
  return post.status || "판매중";
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
    const location = document.getElementById("location").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const imageFile = document.getElementById("image").files[0];

    if (!title || !price || !category || !description || !location || !contact) {
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
function initPostList() {
  const postList = document.getElementById("postList");

  if (!postList) {
    return;
  }

  const tabs = document.querySelectorAll(".tab");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const statusFilter = document.getElementById("statusFilter");

  let selectedCategory = "전체보기";

  function renderPostList() {
    const posts = getPosts();
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedStatus = statusFilter ? statusFilter.value : "전체";

    const filteredPosts = posts.filter(function (post) {
      const postStatus = getPostStatus(post);

      const matchCategory =
        selectedCategory === "전체보기" || post.category === selectedCategory;

      const matchKeyword =
        !keyword ||
        post.title.toLowerCase().includes(keyword) ||
        post.description.toLowerCase().includes(keyword);

      const matchStatus =
        selectedStatus === "전체" || postStatus === selectedStatus;

      return matchCategory && matchKeyword && matchStatus;
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
          <span class="status-badge">${getPostStatus(post)}</span>
          <h3 class="product-title">${post.title}</h3>
          <div class="product-price">${formatPrice(post.price)}</div>
          <div class="product-meta">
            <span>${post.createdAt}</span>
            <span>${post.location || "장소 미정"}</span>
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

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", renderPostList);

    searchInput.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        renderPostList();
      }
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", renderPostList);
  }

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
        <span class="status-badge">${getPostStatus(post)}</span>

        <h2>${post.title}</h2>
        <div class="detail-price">${formatPrice(post.price)}</div>

        <p><strong>작성일</strong> ${post.createdAt}</p>
        <p><strong>거래 장소</strong> ${post.location || "장소 미정"}</p>
        <p><strong>연락처</strong> ${post.contact || "연락처 미입력"}</p>

        <div class="status-change-box">
          <label for="tradeStatus"><strong>거래 상태</strong></label>
          <select id="tradeStatus">
            <option value="판매중" ${getPostStatus(post) === "판매중" ? "selected" : ""}>판매중</option>
            <option value="예약중" ${getPostStatus(post) === "예약중" ? "selected" : ""}>예약중</option>
            <option value="거래완료" ${getPostStatus(post) === "거래완료" ? "selected" : ""}>거래완료</option>
          </select>
          <button id="statusUpdateBtn" class="submit-btn">상태 변경</button>
        </div>

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

  document.getElementById("statusUpdateBtn").addEventListener("click", function () {
    updateTradeStatus(post.id);
  });

  document.getElementById("editBtn").addEventListener("click", function () {
    showEditForm(post);
  });

  document.getElementById("deleteBtn").addEventListener("click", function () {
    deletePost(post.id);
  });
}

// 거래 상태 변경 기능
function updateTradeStatus(postId) {
  const tradeStatus = document.getElementById("tradeStatus");

  if (!tradeStatus) {
    alert("거래 상태 선택창을 찾을 수 없습니다.");
    return;
  }

  const selectedStatus = tradeStatus.value;

  if (!TRADE_STATUSES.includes(selectedStatus)) {
    alert("올바르지 않은 거래 상태입니다.");
    return;
  }

  const posts = getPosts();

  const postIndex = posts.findIndex(function (post) {
    return post.id === postId;
  });

  if (postIndex === -1) {
    alert("판매글을 찾을 수 없습니다.");
    return;
  }

  posts[postIndex].status = selectedStatus;
  savePosts(posts);

  alert("거래 상태가 변경되었습니다.");
  window.location.href = "post-detail.html?id=" + postId;
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

    const editTitle = document.getElementById("editTitle").value.trim();
    const editPrice = document.getElementById("editPrice").value.trim();
    const editCategory = document.getElementById("editCategory").value;
    const editLocation = document.getElementById("editLocation").value.trim();
    const editContact = document.getElementById("editContact").value.trim();
    const editDescription = document.getElementById("editDescription").value.trim();
    const editStatus = document.getElementById("editStatus");
    const editImageFile = document.getElementById("editImage").files[0];

    if (!editTitle || !editPrice || !editCategory || !editDescription || !editLocation || !editContact) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    posts[postIndex].title = editTitle;
    posts[postIndex].price = editPrice;
    posts[postIndex].category = editCategory;
    posts[postIndex].location = editLocation;
    posts[postIndex].contact = editContact;
    posts[postIndex].status = editStatus ? editStatus.value : getPostStatus(posts[postIndex]);
    posts[postIndex].description = editDescription;

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

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", function () {
      document.getElementById("editArea").classList.add("hidden");
      document.getElementById("detailArea").classList.remove("hidden");
    });
  }
}

// 수정 폼 보여주기
function showEditForm(post) {
  document.getElementById("detailArea").classList.add("hidden");
  document.getElementById("editArea").classList.remove("hidden");

  document.getElementById("editTitle").value = post.title;
  document.getElementById("editPrice").value = post.price;
  document.getElementById("editCategory").value = post.category;
  document.getElementById("editLocation").value = post.location || "";
  document.getElementById("editContact").value = post.contact || "";

  const editStatus = document.getElementById("editStatus");
  if (editStatus) {
    editStatus.value = getPostStatus(post);
  }

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

// DOM 요소 연결
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterPanel = document.getElementById('filterPanel');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const resetFilterBtn = document.getElementById('resetFilterBtn');

// 1. 상세 검색 패널 토글 (열고 닫기)
filterToggleBtn.addEventListener('click', () => {
  filterPanel.classList.toggle('hidden');
});

// 2. 필터를 적용해서 렌더링하는 핵심 로직 확장
function filterAndRenderPosts() {
  const activeCategory = document.querySelector('.tab.active').dataset.category;
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  
  // 상세 필터 값 가져오기
  const sortValue = document.getElementById('sortSelect').value;
  const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
  const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  // [조건 필터링] 카테고리 + 키워드 + 금액 + 날짜 범위
  let filtered = allPosts.filter(post => {
    // 카테고리 & 키워드 매칭
    const matchCategory = (activeCategory === '전체보기' || post.category === activeCategory);
    const matchKeyword = post.title.toLowerCase().includes(keyword) || post.content.toLowerCase().includes(keyword);
    
    // 금액 범위 매칭 (post.price가 있다고 가정)
    const postPrice = parseInt(post.price) || 0;
    const matchPrice = (postPrice >= minPrice && postPrice <= maxPrice);
    
    // 날짜 범위 매칭 (post.date가 '2026-06-03' 같은 문자열 형태라고 가정)
    let matchDate = true;
    if (startDate && post.date < startDate) matchDate = false;
    if (endDate && post.date > endDate) matchDate = false;

    return matchCategory && matchKeyword && matchPrice && matchDate;
  });

  // [정렬 필터링] 가격순, 날짜순 정렬 처리
  if (sortValue === 'latest') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortValue === 'oldest') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortValue === 'priceHigh') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'priceLow') {
    filtered.sort((a, b) => a.price - b.price);
  }

  // 화면에 그리기
  displayPosts(filtered);
}

// 3. 버튼 이벤트 리스너 연결
applyFilterBtn.addEventListener('click', filterAndRenderPosts);

// 초기화 버튼 클릭 시 모든 필터 초기 상태로 리셋
resetFilterBtn.addEventListener('click', () => {
  document.getElementById('sortSelect').value = 'latest';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  filterAndRenderPosts(); // 필터 리셋 후 재렌더링
});