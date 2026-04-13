import type { User, LoginResponse, Post, PostSummary, PageResponse, Comment, ApiResponse } from './types'

const BASE_URL = 'https://api.fullstackfamily.com/api/edu/ws-283fc1'

// === 토큰/유저 관리 ===

function getToken(): string | null {
  return localStorage.getItem('token')
}

function setToken(token: string): void {
  localStorage.setItem('token', token)
}

function removeToken(): void {
  localStorage.removeItem('token')
}

export function getUser(): User | null {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) as User : null
}

function setUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user))
}

function removeUser(): void {
  localStorage.removeItem('user')
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

// === HTTP 요청 ===

interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`
  const headers: Record<string, string> = { ...options.headers }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const fetchOptions: RequestInit = {
    method: options.method,
    headers,
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    fetchOptions.body = JSON.stringify(options.body)
  }

  const response = await fetch(url, fetchOptions)

  if (response.status === 204) {
    return null as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || `요청 실패 (${response.status})`
    throw new Error(message)
  }

  // API 응답이 { success, message, data } 래퍼로 감싸져 있으면 data만 반환
  if (data && (data as ApiResponse<T>).success !== undefined && (data as ApiResponse<T>).data !== undefined) {
    return (data as ApiResponse<T>).data
  }

  return data as T
}

// === Auth ===

export async function signup(username: string, password: string, nickname: string): Promise<User> {
  return request<User>('/auth/signup', {
    method: 'POST',
    body: { username, password, nickname },
  })
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const data = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { username, password },
  })
  setToken(data.token)
  setUser(data.user)
  return data
}

export function logout(): void {
  removeToken()
  removeUser()
}

// === Posts ===

export async function getPosts(page: number = 0, size: number = 5): Promise<PageResponse<PostSummary>> {
  return request<PageResponse<PostSummary>>(`/posts?page=${page}&size=${size}`)
}

export async function getPost(id: number | string): Promise<Post> {
  return request<Post>(`/posts/${id}`)
}

export async function createPost(title: string, content: string): Promise<Post> {
  // 1. Draft 생성
  const draft = await request<Post>('/posts', {
    method: 'POST',
    body: { title, content },
  })
  // 2. 바로 발행
  const published = await request<Post>(`/posts/${draft.id}/publish`, {
    method: 'PUT',
    body: { title, content },
  })
  return published
}

export async function updatePost(id: number | string, title: string, content: string): Promise<Post> {
  await request<Post>(`/posts/${id}`, {
    method: 'PUT',
    body: { title, content },
  })
  return request<Post>(`/posts/${id}/publish`, {
    method: 'PUT',
    body: { title, content },
  })
}

export async function deletePost(id: number | string): Promise<null> {
  return request<null>(`/posts/${id}`, { method: 'DELETE' })
}

// === Comments ===

export async function getComments(postId: number | string): Promise<Comment[]> {
  return request<Comment[]>(`/posts/${postId}/comments`)
}

export async function createComment(postId: number | string, content: string): Promise<Comment> {
  return request<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: { content },
  })
}

export async function updateComment(id: number | string, content: string): Promise<Comment> {
  return request<Comment>(`/comments/${id}`, {
    method: 'PUT',
    body: { content },
  })
}

export async function deleteComment(id: number | string): Promise<null> {
  return request<null>(`/comments/${id}`, { method: 'DELETE' })
}
