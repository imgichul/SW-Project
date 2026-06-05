document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. 회원가입 로직 (signup.html)
  // ==========================================
  const signupForm = document.getElementById('signupForm');
  
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault(); // 기본 제출 동작(새로고침) 차단

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;
      const nickname = document.getElementById('nickname').value;
      const studentId = document.getElementById('studentId').value;

      // 비밀번호 일치 여부 확인
      if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
        return; 
      }

      // 아이디 중복 확인 (localStorage 조회)
      if (localStorage.getItem(username)) {
        alert('이미 존재하는 아이디입니다. 다른 아이디를 사용해 주세요.');
        return;
      }

      // 저장할 회원 정보 객체 생성
      const userData = {
        password: password,
        nickname: nickname,
        studentId: studentId
      };
      
      // localStorage에 문자열 형태로 저장
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
        
        // 비밀번호 일치 확인
        if (userData.password === password) {
          // 🎉 로그인 성공 시, 현재 로그인한 사용자의 아이디를 'currentUser'라는 키로 임시 저장
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
// index.html에 새로 만든 authArea 박스를 바로 찾습니다.
const authArea = document.getElementById('authArea'); 

// 로그인 상태이고, 화면에 authArea 박스가 존재한다면 UI 변경
if (currentUser && authArea) {
  const userData = JSON.parse(localStorage.getItem(currentUser));

  // 부모를 찾을 필요 없이 authArea 박스의 내부를 환영 메시지와 버튼으로 교체합니다.
  authArea.innerHTML = `
    <span style="font-weight: bold; margin-right: 15px; color: #fff;">👤 ${userData.nickname}님 환영합니다!</span>
    <button id="logoutBtn" style="background: #ff4d4d; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">로그아웃</button>
  `;

  // 로그아웃 버튼 이벤트 연결
  document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    alert('로그아웃 되었습니다.');
    window.location.reload();
  });
}
});