document.addEventListener('DOMContentLoaded', () => {

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

      // 비밀번호 확인
      if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
        return; 
      }

      // 아이디 중복 확인
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
          // 🎉 로그인 성공 시, 현재 로그인한 사용자의 아이디를 'currentUser'라는 키로 저장
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
  // 3. 로그인 상태 유지 및 화면 변경 (index.html)
  // ==========================================
  const currentUser = localStorage.getItem('currentUser');
  // index.html에 있는 '로그인하기' 링크 요소를 찾습니다.
  const loginLink = document.querySelector('a[href="login.html"]'); 

  // currentUser가 존재하고(로그인 상태), 화면에 로그인 링크가 있다면 UI를 변경합니다.
  if (currentUser && loginLink) {
    const userData = JSON.parse(localStorage.getItem(currentUser));
    const authDiv = loginLink.parentElement; // 로그인 버튼을 감싸고 있는 <div> 요소

    // 기존 로그인 버튼을 지우고 환영 메시지와 로그아웃 버튼으로 교체
    authDiv.innerHTML = `
      <span style="font-weight: bold; margin-right: 15px;">👤 ${userData.nickname}님 환영합니다!</span>
      <button id="logoutBtn" style="background: #ff4d4d; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">로그아웃</button>
    `;

    // 로그아웃 버튼에 클릭 이벤트 추가
    document.getElementById('logoutBtn').addEventListener('click', function() {
      localStorage.removeItem('currentUser'); // 현재 세션 기록 삭제
      alert('로그아웃 되었습니다.');
      window.location.reload(); // 페이지 새로고침하여 원래 화면(로그인 버튼)으로 복구
    });
  }
});