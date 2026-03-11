import { API_BASE_URL, POSTS_ENDPOINT } from '../constants';

const API_URL = `${API_BASE_URL}${POSTS_ENDPOINT}`;

interface ApiOptions {
  username: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  isFormData?: boolean;
}

async function apiRequest(endpoint: string, options: ApiOptions) {
  const { username, method = 'GET', body, isFormData = false } = options;

  const headers: HeadersInit = {
    'X-Username': username,
  };

  if (!isFormData && body) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || 'Erro na API');
  }

  // DELETE retorna 204 (no content)
  if (response.status === 204) return null;

  return response.json();
}

// ==================== Funções públicas ====================

export const postsApi = {
  // Listagem com paginação + novos posts (cursor)
  getPosts: (username: string, page = 1, createdGt?: string) => {
    let url = `?username=${username}&page=${page}`;
    if (createdGt) url += `&created__gt=${createdGt}`;
    return apiRequest(url, { username, method: 'GET' });
  },

  // Criar post
  createPost: (username: string, data: { title: string; content: string }) => {
    return apiRequest('', { username, method: 'POST', body: data });
  },

  // Curtir / descurtir
  toggleLike: (username: string, postId: number) => {
    return apiRequest(`${postId}/like/`, { username, method: 'POST' });
  },

  // Comentar
    addComment: (username: string, postId: number, content: string) => {
    return apiRequest(`${postId}/comment/`, {
        username,
        method: 'POST',
        body: {
        author_username: username,
        content,
        },
    });
    },

  // Editar post
  updatePost: (username: string, postId: number, data: { title: string; content: string }) => {
    return apiRequest(`${postId}/`, { username, method: 'PUT', body: data });
  },

  // Excluir post
  deletePost: (username: string, postId: number) => {
    return apiRequest(`${postId}/`, { username, method: 'DELETE' });
  },
};