export interface Comment {
  id: number
  username: string
  content: string
}

export interface Post {
  id: number
  title: string
  username: string
  content: string
  createdAt: string
  likes_count: number
  comments: Comment[]
  is_owner: boolean
}