import { getPost, deletePost, getComments, createComment, updateComment, deleteComment, isLoggedIn, getUser } from '../utils/api'
import { navigate } from '../utils/router'
import type { RouteParams, Comment, User } from '../utils/types'

export async function renderPostDetail({ id }: RouteParams): Promise<void> {
  const app = document.getElementById('app') as HTMLDivElement
  const user = getUser()
  const loggedIn = isLoggedIn()

  app.innerHTML = '<div class="min-h-screen bg-gray-50 flex items-center justify-center"><p class="text-gray-400">불러오는 중...</p></div>'

  try {
    const post = await getPost(id)
    const comments = await getComments(id)
    const isAuthor = user !== null && user.nickname === post.authorNickname

    app.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow-sm">
          <div class="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="#/posts" class="text-xl font-bold text-gray-800">게시판</a>
            <a href="#/posts" class="text-sm text-gray-500 hover:text-gray-700">← 목록으로</a>
          </div>
        </header>

        <main class="max-w-3xl mx-auto px-4 py-6">
          <article class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-3">${escapeHtml(post.title)}</h1>
            <div class="flex gap-4 text-sm text-gray-400 mb-4 pb-4 border-b">
              <span>${post.authorNickname}</span>
              <span>조회 ${post.viewCount}</span>
              <span>${formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
            <div class="text-gray-700 whitespace-pre-wrap leading-relaxed">${escapeHtml(post.content)}</div>
            ${isAuthor ? `
              <div class="flex gap-2 mt-6 pt-4 border-t">
                <button id="edit-btn" class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">수정</button>
                <button id="delete-btn" class="px-4 py-2 text-sm bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">삭제</button>
              </div>
            ` : ''}
          </article>

          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">댓글 (${comments.length})</h2>
            ${loggedIn ? `
              <form id="comment-form" class="flex gap-2 mb-4">
                <input type="text" id="comment-input" placeholder="댓글을 입력하세요"
                  class="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">등록</button>
              </form>
            ` : '<p class="text-sm text-gray-400 mb-4">댓글을 쓰려면 <a href="#/login" class="text-blue-500 hover:underline">로그인</a>하세요.</p>'}
            <div id="comment-list" class="space-y-3">
              ${comments.length === 0
                ? '<p class="text-gray-400 text-sm text-center py-4">댓글이 없습니다.</p>'
                : comments.map((c: Comment) => renderComment(c, user)).join('')
              }
            </div>
          </section>
        </main>
      </div>
    `

    if (isAuthor) {
      (document.getElementById('edit-btn') as HTMLButtonElement).addEventListener('click', () => {
        navigate(`/posts/${id}/edit`)
      });
      (document.getElementById('delete-btn') as HTMLButtonElement).addEventListener('click', async () => {
        if (confirm('정말 삭제하시겠습니까?')) {
          await deletePost(id)
          navigate('/posts')
        }
      })
    }

    if (loggedIn) {
      (document.getElementById('comment-form') as HTMLFormElement).addEventListener('submit', async (e: Event) => {
        e.preventDefault()
        const input = document.getElementById('comment-input') as HTMLInputElement
        const content = input.value.trim()
        if (!content) return
        await createComment(id, content)
        renderPostDetail({ id })
      })
    }

    (document.getElementById('comment-list') as HTMLDivElement).addEventListener('click', async (e: Event) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]')
      if (!btn) return

      const commentId = btn.dataset.commentId as string
      const action = btn.dataset.action as string

      if (action === 'delete') {
        if (confirm('댓글을 삭제하시겠습니까?')) {
          await deleteComment(commentId)
          renderPostDetail({ id })
        }
      } else if (action === 'edit') {
        const contentEl = document.getElementById(`comment-content-${commentId}`) as HTMLParagraphElement
        const currentText = contentEl.textContent || ''
        const newText = prompt('댓글을 수정하세요:', currentText)
        if (newText !== null && newText.trim()) {
          await updateComment(commentId, newText.trim())
          renderPostDetail({ id })
        }
      }
    })
  } catch (err) {
    app.innerHTML = `
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <p class="text-red-500 mb-4">${(err as Error).message}</p>
          <a href="#/posts" class="text-blue-500 hover:underline">목록으로 돌아가기</a>
        </div>
      </div>
    `
  }
}

function renderComment(comment: Comment, user: User | null): string {
  const isAuthor = user !== null && user.nickname === comment.authorNickname
  return `
    <div class="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
      <div class="flex-1">
        <div class="flex gap-2 items-center mb-1">
          <span class="text-sm font-medium text-gray-700">${escapeHtml(comment.authorNickname)}</span>
          <span class="text-xs text-gray-400">${formatDate(comment.createdAt)}</span>
        </div>
        <p id="comment-content-${comment.id}" class="text-sm text-gray-600">${escapeHtml(comment.content)}</p>
      </div>
      ${isAuthor ? `
        <div class="flex gap-1 ml-2">
          <button data-action="edit" data-comment-id="${comment.id}" class="text-xs text-gray-400 hover:text-blue-500">수정</button>
          <button data-action="delete" data-comment-id="${comment.id}" class="text-xs text-gray-400 hover:text-red-500">삭제</button>
        </div>
      ` : ''}
    </div>
  `
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
