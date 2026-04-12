import { signup } from '../utils/api'
import { navigate } from '../utils/router'

export function renderSignup(): void {
  const app = document.getElementById('app') as HTMLDivElement
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6">회원가입</h1>
        <form id="signup-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input type="text" id="username" placeholder="4~20자 영문/숫자"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input type="password" id="password" placeholder="4~20자"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
            <input type="text" id="nickname" placeholder="2~20자"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div id="error-msg" class="text-red-500 text-sm hidden"></div>
          <div id="success-msg" class="text-green-500 text-sm hidden"></div>
          <button type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium">
            회원가입
          </button>
        </form>
        <p class="text-center text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요?
          <a href="#/login" class="text-blue-500 hover:underline">로그인</a>
        </p>
      </div>
    </div>
  `

  const form = document.getElementById('signup-form') as HTMLFormElement
  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault()
    const username = (document.getElementById('username') as HTMLInputElement).value.trim()
    const password = (document.getElementById('password') as HTMLInputElement).value.trim()
    const nickname = (document.getElementById('nickname') as HTMLInputElement).value.trim()
    const errorMsg = document.getElementById('error-msg') as HTMLDivElement
    const successMsg = document.getElementById('success-msg') as HTMLDivElement

    errorMsg.classList.add('hidden')
    successMsg.classList.add('hidden')

    if (!username || !password || !nickname) {
      errorMsg.textContent = '모든 항목을 입력하세요.'
      errorMsg.classList.remove('hidden')
      return
    }

    try {
      await signup(username, password, nickname)
      successMsg.textContent = '회원가입 완료! 로그인 페이지로 이동합니다.'
      successMsg.classList.remove('hidden')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      errorMsg.textContent = (err as Error).message
      errorMsg.classList.remove('hidden')
    }
  })
}
