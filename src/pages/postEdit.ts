import { getPost, updatePost, isLoggedIn } from '../utils/api'
import { navigate } from '../utils/router'
import type { RouteParams } from '../utils/types'

export async function renderPostEdit({ id }: RouteParams): Promise<void> {
  if (!isLoggedIn()) {
    navigate('/login')
    return
  }

  const app = document.getElementById('app') as HTMLDivElement
  app.innerHTML = '<div class="min-h-screen bg-gray-50 flex items-center justify-center"><p class="text-gray-400">불러오는 중...</p></div>'

  try {
    const post = await getPost(id)

    app.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow-sm">
          <div class="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="#/posts" class="text-xl font-bold text-gray-800">게시판</a>
            <a href="#/posts/${id}" class="text-sm text-gray-500 hover:text-gray-700">← 돌아가기</a>
          </div>
        </header>
        <main class="max-w-3xl mx-auto px-4 py-6">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h1 class="text-xl font-bold text-gray-800 mb-4">글 수정</h1>
            <form id="edit-form" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input type="text" id="title" value="${escapeAttr(post.title)}"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea id="content" rows="10"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y">${escapeHtml(post.content)}</textarea>
              </div>
              <div id="error-msg" class="text-red-500 text-sm hidden"></div>
              <div class="flex gap-2">
                <button type="submit"
                  class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium">수정 완료</button>
                <a href="#/posts/${id}"
                  class="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">취소</a>
              </div>
            </form>
          </div>
        </main>
      </div>
    `

    const form = document.getElementById('edit-form') as HTMLFormElement
    form.addEventListener('submit', async (e: Event) => {
      e.preventDefault()
      const title = (document.getElementById('title') as HTMLInputElement).value.trim()
      const content = (document.getElementById('content') as HTMLTextAreaElement).value.trim()
      const errorMsg = document.getElementById('error-msg') as HTMLDivElement

      if (!title) {
        errorMsg.textContent = '제목을 입력하세요.'
        errorMsg.classList.remove('hidden')
        return
      }

      try {
        await updatePost(id, title, content)
        navigate(`/posts/${id}`)
      } catch (err) {
        errorMsg.textContent = (err as Error).message
        errorMsg.classList.remove('hidden')
      }
    })
  } catch (err) {
    app.innerHTML = `
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <p class="text-red-500">${(err as Error).message}</p>
      </div>
    `
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text || ''
  return div.innerHTML
}

function escapeAttr(text: string): string {
  return (text || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
