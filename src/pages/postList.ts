import { getPosts, isLoggedIn, getUser, logout } from '../utils/api'
import { navigate } from '../utils/router'
import type { PostSummary } from '../utils/types'

export async function renderPostList(): Promise<void> {
  const app = document.getElementById('app') as HTMLDivElement
  const user = getUser()
  const loggedIn = isLoggedIn()

  app.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="#/posts" class="text-xl font-bold text-gray-800">게시판</a>
          <div class="flex items-center gap-3">
            ${loggedIn
              ? `<span class="text-sm text-gray-600">${user?.nickname}님</span>
                 <button id="logout-btn" class="text-sm text-blue-500 hover:underline cursor-pointer">로그아웃</button>`
              : `<a href="#/login" class="text-sm text-blue-500 hover:underline">로그인</a>`
            }
          </div>
        </div>
      </header>

      <main class="max-w-3xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">글 목록</h2>
          ${loggedIn
            ? `<button id="write-btn" class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">글쓰기</button>`
            : ''
          }
        </div>
        <div id="post-list" class="space-y-3">
          <p class="text-gray-400 text-center py-8">불러오는 중...</p>
        </div>
        <div id="pagination" class="flex justify-center gap-2 mt-6"></div>
      </main>
    </div>
  `

  if (loggedIn) {
    (document.getElementById('logout-btn') as HTMLButtonElement).addEventListener('click', () => {
      logout()
      navigate('/posts')
    });
    (document.getElementById('write-btn') as HTMLButtonElement).addEventListener('click', () => {
      navigate('/posts/write')
    })
  }

  await loadPosts(0)
}

async function loadPosts(page: number): Promise<void> {
  const listEl = document.getElementById('post-list') as HTMLDivElement
  const pagEl = document.getElementById('pagination') as HTMLDivElement

  try {
    const data = await getPosts(page, 5)

    if (data.content.length === 0) {
      listEl.innerHTML = '<p class="text-gray-400 text-center py-8">게시글이 없습니다.</p>'
      pagEl.innerHTML = ''
      return
    }

    listEl.innerHTML = data.content.map((post: PostSummary) => `
      <a href="#/posts/${post.id}" class="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
        <h3 class="font-medium text-gray-800 mb-1">${escapeHtml(post.title || '(제목 없음)')}</h3>
        <p class="text-sm text-gray-500 mb-2 line-clamp-2">${escapeHtml(post.contentPreview || '')}</p>
        <div class="flex gap-4 text-xs text-gray-400">
          <span>${post.authorNickname}</span>
          <span>조회 ${post.viewCount}</span>
          <span>댓글 ${post.commentCount}</span>
          <span>${formatDate(post.publishedAt || post.createdAt)}</span>
        </div>
      </a>
    `).join('')

    if (data.totalPages > 1) {
      let buttons = ''
      for (let i = 0; i < data.totalPages; i++) {
        const active = i === data.number
        buttons += `
          <button class="pagination-btn px-3 py-1 rounded text-sm ${active ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}" data-page="${i}">
            ${i + 1}
          </button>
        `
      }
      pagEl.innerHTML = buttons

      pagEl.querySelectorAll<HTMLButtonElement>('.pagination-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          loadPosts(Number(btn.dataset.page))
        })
      })
    } else {
      pagEl.innerHTML = ''
    }
  } catch (err) {
    listEl.innerHTML = `<p class="text-red-500 text-center py-8">${(err as Error).message}</p>`
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
