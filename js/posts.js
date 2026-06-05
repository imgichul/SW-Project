import {
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "./firebase.js";

// 거래 상태 값
const TRADE_STATUSES = ["판매중", "예약중", "거래완료"];

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
  if (category === "전자기기") return "💻 전자기기";
  if (category === "전공책") return "📚 전공책";
  if (category === "필기구") return "✏️ 필기구";
  if (category === "생활용품") return "🏠 생활용품";
  return "🎒 기타";
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

// Firestore Timestamp 또는 문자열 작성일을 화면 표시용으로 변환하는 함수
function formatCreatedAt(createdAt) {
  if (!createdAt) {
    return "작성일 없음";
  }

  if (createdAt.toDate) {
    return createdAt.toDate().toLocaleString("ko-KR");
  }

  return createdAt;
}

// 정렬 및 날짜 필터를 위해 작성일을 Date 객체로 변환하는 함수
function getPostDate(post) {
  if (post.createdAt && post.createdAt.toDate) {
    return post.createdAt.toDate();
  }

  if (post.createdDate) {
    return new Date(post.createdDate);
  }

  if (post.createdAt) {
    return new Date(post.createdAt);
  }

  return new Date(0);
}

// Firestore에서 판매글 목록을 최신순으로 가져오는 함수
async function getPostsFromFirestore() {
  const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(postsQuery);

  const posts = [];

  querySnapshot.forEach(function (docSnap) {
    posts.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  return posts;
}

// Firestore에서 id를 기준으로 판매글 하나를 가져오는 함수
async function getPostById(postId) {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) {
    return null;
  }

  return {
    id: postSnap.id,
    ...postSnap.data()
  };
}

// 판매글 등록 페이지에서 입력한 내용을 읽어 Firestore에 저장하는 함수
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

    const imageInput = document.getElementById("image");
    const imageFile = imageInput ? imageInput.files[0] : null;

    if (!title || !price || !category || !description || !location || !contact) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    let imageData = "";

    if (imageFile) {
      try {
        imageData = await readImageFile(imageFile);
      } catch (error) {
        alert(error);
        return;
      }
    }

    try {
      await addDoc(collection(db, "posts"), {
        title: title,
        price: Number(price),
        category: category,
        description: description,
        location: location,
        contact: contact,
        imageData: imageData,
        status: "판매중",
        createdAt: serverTimestamp(),
        createdDate: new Date().toISOString().slice(0, 10)
      });

      alert("판매글이 등록되었습니다.");
      window.location.href = "posts.html";
    } catch (error) {
      console.error(error);
      alert("판매글 등록 중 오류가 발생했습니다.");
    }
  });
}

// 판매글 목록 페이지에서 Firestore에 저장된 판매글을 카드 형태로 출력하는 함수
function initPostList() {
  const postList = document.getElementById("postList");

  if (!postList) {
    return;
  }

  const tabs = document.querySelectorAll(".tab");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const statusFilter = document.getElementById("statusFilter");

  const filterToggleBtn = document.getElementById("filterToggleBtn");
  const filterPanel = document.getElementById("filterPanel");
  const applyFilterBtn = document.getElementById("applyFilterBtn");
  const resetFilterBtn = document.getElementById("resetFilterBtn");

  const sortSelect = document.getElementById("sortSelect");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  let selectedCategory = "전체보기";

  async function renderPostList() {
    let posts = [];

    try {
      posts = await getPostsFromFirestore();
    } catch (error) {
      console.error(error);
      postList.innerHTML = `
        <div class="empty-message">
          판매글을 불러오는 중 오류가 발생했습니다.
        </div>
      `;
      return;
    }

    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedStatus = statusFilter ? statusFilter.value : "전체";

    const sortValue = sortSelect ? sortSelect.value : "latest";
    const minPrice = minPriceInput && minPriceInput.value ? Number(minPriceInput.value) : 0;
    const maxPrice = maxPriceInput && maxPriceInput.value ? Number(maxPriceInput.value) : Infinity;
    const startDate = startDateInput ? startDateInput.value : "";
    const endDate = endDateInput ? endDateInput.value : "";

    let filteredPosts = posts.filter(function (post) {
      const postStatus = getPostStatus(post);
      const postPrice = Number(post.price) || 0;
      const postDate = post.createdDate || getPostDate(post).toISOString().slice(0, 10);

      const matchCategory =
        selectedCategory === "전체보기" || post.category === selectedCategory;

      const matchKeyword =
        !keyword ||
        String(post.title || "").toLowerCase().includes(keyword) ||
        String(post.description || "").toLowerCase().includes(keyword) ||
        String(post.location || "").toLowerCase().includes(keyword);

      const matchStatus =
        selectedStatus === "전체" || postStatus === selectedStatus;

      const matchPrice =
        postPrice >= minPrice && postPrice <= maxPrice;

      let matchDate = true;

      if (startDate && postDate < startDate) {
        matchDate = false;
      }

      if (endDate && postDate > endDate) {
        matchDate = false;
      }

      return matchCategory && matchKeyword && matchStatus && matchPrice && matchDate;
    });

    if (sortValue === "latest") {
      filteredPosts.sort(function (a, b) {
        return getPostDate(b) - getPostDate(a);
      });
    } else if (sortValue === "oldest") {
      filteredPosts.sort(function (a, b) {
        return getPostDate(a) - getPostDate(b);
      });
    } else if (sortValue === "priceHigh") {
      filteredPosts.sort(function (a, b) {
        return Number(b.price) - Number(a.price);
      });
    } else if (sortValue === "priceLow") {
      filteredPosts.sort(function (a, b) {
        return Number(a.price) - Number(b.price);
      });
    }

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
            <span>${formatCreatedAt(post.createdAt)}</span>
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

  if (filterToggleBtn && filterPanel) {
    filterToggleBtn.addEventListener("click", function () {
      filterPanel.classList.toggle("hidden");
    });
  }

  if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", renderPostList);
  }

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", function () {
      if (sortSelect) sortSelect.value = "latest";
      if (minPriceInput) minPriceInput.value = "";
      if (maxPriceInput) maxPriceInput.value = "";
      if (startDateInput) startDateInput.value = "";
      if (endDateInput) endDateInput.value = "";
      renderPostList();
    });
  }

  renderPostList();
}

// 판매글 상세 페이지에서 URL의 id 값을 기준으로 해당 판매글을 찾아 출력하는 함수
async function initPostDetail() {
  const detailArea = document.getElementById("detailArea");

  if (!detailArea) {
    return;
  }

  const postId = getPostIdFromUrl();
  const post = await getPostById(postId);

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

        <p><strong>작성일</strong> ${formatCreatedAt(post.createdAt)}</p>
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
async function updateTradeStatus(postId) {
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

  try {
    await updateDoc(doc(db, "posts", postId), {
      status: selectedStatus
    });

    alert("거래 상태가 변경되었습니다.");
    window.location.href = "post-detail.html?id=" + postId;
  } catch (error) {
    console.error(error);
    alert("거래 상태 변경 중 오류가 발생했습니다.");
  }
}

// 판매글 수정 기능
function initPostEdit(post) {
  const editForm = document.getElementById("editForm");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  if (!editForm) {
    return;
  }

  editForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const editTitle = document.getElementById("editTitle").value.trim();
    const editPrice = document.getElementById("editPrice").value.trim();
    const editCategory = document.getElementById("editCategory").value;
    const editLocation = document.getElementById("editLocation").value.trim();
    const editContact = document.getElementById("editContact").value.trim();
    const editDescription = document.getElementById("editDescription").value.trim();
    const editStatus = document.getElementById("editStatus");
    const editImageInput = document.getElementById("editImage");
    const editImageFile = editImageInput ? editImageInput.files[0] : null;

    if (!editTitle || !editPrice || !editCategory || !editDescription || !editLocation || !editContact) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const updatedPost = {
      title: editTitle,
      price: Number(editPrice),
      category: editCategory,
      location: editLocation,
      contact: editContact,
      status: editStatus ? editStatus.value : getPostStatus(post),
      description: editDescription
    };

    if (editImageFile) {
      try {
        updatedPost.imageData = await readImageFile(editImageFile);
      } catch (error) {
        alert(error);
        return;
      }
    }

    try {
      await updateDoc(doc(db, "posts", post.id), updatedPost);

      alert("판매글이 수정되었습니다.");
      window.location.href = "post-detail.html?id=" + post.id;
    } catch (error) {
      console.error(error);
      alert("판매글 수정 중 오류가 발생했습니다.");
    }
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
async function deletePost(postId) {
  const confirmDelete = confirm("정말 이 판매글을 삭제하시겠습니까?");

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteDoc(doc(db, "posts", postId));

    alert("판매글이 삭제되었습니다.");
    window.location.href = "posts.html";
  } catch (error) {
    console.error(error);
    alert("판매글 삭제 중 오류가 발생했습니다.");
  }
}

// 페이지 로드가 완료되면 현재 페이지에 필요한 기능만 실행.
// 각 함수는 해당 HTML 요소가 없으면 바로 종료되므로 여러 페이지에서 같은 posts.js를 사용할 수 있습니다.
document.addEventListener("DOMContentLoaded", function () {
  initPostCreate();
  initPostList();
  initPostDetail();
});