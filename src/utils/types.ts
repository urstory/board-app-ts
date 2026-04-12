// 사용자
export interface User {
  id: number
  username: string
  nickname: string
  createdAt: string
}

// 로그인 응답
export interface LoginResponse {
  token: string
  user: User
}

// API 래퍼 응답
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// 게시글 목록 항목
export interface PostSummary {
  id: number
  title: string
  contentPreview: string
  authorNickname: string
  viewCount: number
  commentCount: number
  thumbnailUrl: string | null
  publishedAt: string | null
  createdAt: string
}

// 게시글 상세
export interface Post {
  id: number
  title: string
  content: string
  status: 'DRAFT' | 'PUBLISHED'
  authorId: number | null
  authorNickname: string
  viewCount: number
  commentCount: number
  images: PostImage[]
  publishedAt: string | null
  createdAt: string
}

// 게시글 이미지
export interface PostImage {
  id: number
  imageUrl: string
  originalFilename: string
  fileSize: number
  createdAt: string
}

// 페이지네이션 응답
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// 댓글
export interface Comment {
  id: number
  content: string
  authorId: number
  authorNickname: string
  createdAt: string
  updatedAt: string
}

// 라우터 파라미터
export interface RouteParams {
  [key: string]: string
}

// 라우트 핸들러
export type RouteHandler = (params: RouteParams) => void | Promise<void>
