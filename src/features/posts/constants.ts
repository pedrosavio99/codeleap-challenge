// ==================== API ====================
// export const API_BASE_URL = 'http://127.0.0.1:8000';
export const API_BASE_URL = 'https://codeleap-server.onrender.com';

export const POSTS_ENDPOINT = '/api/posts/';

// ==================== Polling Adaptativo ====================
export const POLLING_INTERVAL_ACTIVE = 8000;     // 8 segundos (quando usuário está olhando)
export const POLLING_INTERVAL_INACTIVE = 30000;  // 30 segundos (quando aba está em background)

// ==================== Paginação ====================
export const ITEMS_PER_PAGE = 3;

// ==================== Mensagens ====================
export const TOAST_MESSAGES = {
  POST_CREATED: 'Post criado com sucesso!',
  POST_UPDATED: 'Post editado com sucesso!',
  POST_DELETED: 'Post excluído com sucesso!',
  LIKE_SUCCESS: 'Post curtido!',
  COMMENT_SUCCESS: 'Comentário enviado!',
  ERROR_GENERIC: 'Algo deu errado. Tente novamente.',
} as const;