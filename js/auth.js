// js/auth.js

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. 로그인 비밀번호 보기 / 숨기기 기능
  // ==========================================
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const togglePasswordIcon = document.getElementById('togglePasswordIcon');

  if (passwordInput && togglePasswordBtn && togglePasswordIcon) {
    togglePasswordBtn.addEventListener('click', function () {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordIcon.textContent = '🙉';
        togglePasswordBtn.setAttribute('aria-label', '비밀번호 숨기기');
      } else {
        passwordInput.type = 'password';
        togglePasswordIcon.textContent = '🙈';
        togglePasswordBtn.setAttribute('aria-label', '비밀번호 보기');
      }
    });
  }

  // ==========================================
  // 1. 회원가입 로직 (signup.html)
  // ==========================================
  const signupForm = document.getElementById('signupForm');
  
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault(); 

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;
      const nickname = document.getElementById('nickname').value;
      const studentId = document.getElementById('studentId').value;

      if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
        return; 
      }

      if (localStorage.getItem(username)) {
        alert('이미 존재하는 아이디입니다. 다른 아이디를 사용해 주세요.');
        return;
      }

      const userData = {
        password: password,
        nickname: nickname,
        studentId: studentId
      };
      
      localStorage.setItem(username, JSON.stringify(userData));
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      window.location.href = 'login.html';
    });
  }

  // ==========================================
  // 2. 로그인 로직 (login.html)
  // ==========================================
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const storedUser = localStorage.getItem(username);

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        if (userData.password === password) {
          // 로그인 성공 시 currentUser에 유저 아이디 저장
          localStorage.setItem('currentUser', username);
          alert(`환영합니다, ${userData.nickname}님! 로그인이 완료되었습니다.`);
          window.location.href = 'index.html'; 
        } else {
          alert('비밀번호가 틀렸습니다. 다시 확인해 주세요.');
        }
      } else {
        alert('존재하지 않는 아이디입니다.');
      }
    });
  }

  // ==========================================
  // 3. 로그인 상태 유지 및 UI 동적 변경 (모든 페이지 공통 적용)
  // ==========================================
  const currentUser = localStorage.getItem('currentUser');
  
  const loginLink = document.querySelector('a[href="login.html"]'); 
  const loginBtnContainer = document.querySelector("header div[style*='position: absolute']");

  if (currentUser) {
    const userData = JSON.parse(localStorage.getItem(currentUser)) || { nickname: "사용자" };

    if (loginLink) {
      const authDiv = loginLink.parentElement;
      authDiv.innerHTML = `
        <span style="font-weight: bold; margin-right: 15px;">👤 ${userData.nickname}님 환영합니다!</span>
        <button id="logoutBtn" style="background: #ff4d4d; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">로그아웃 🚪</button>
      `;
    } else if (loginBtnContainer) {
      loginBtnContainer.innerHTML = `
        <button id="logoutBtn" style="background: #ff4d4d; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">로그아웃 🚪</button>
      `;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        alert('로그아웃 되었습니다. 로그인 페이지로 이동합니다.');
        window.location.href = 'login.html';
      });
    }

  } else {
    const mainButtons = document.querySelectorAll(".main-buttons .main-btn");
    mainButtons.forEach(button => {
      button.addEventListener("click", function (e) {
        e.preventDefault(); 
        alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
        window.location.href = "login.html";
      });
    });
  }
});