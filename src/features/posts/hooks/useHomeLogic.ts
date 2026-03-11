import { useState, useEffect, useRef, useCallback } from "react";
import { postsApi } from "../api/postsApi";
import {
  POLLING_INTERVAL_ACTIVE,
  POLLING_INTERVAL_INACTIVE,
} from "../constants";
import type { Post } from "../types/post";

export function useHomeLogic(username: string | null) {
  // ── Estados principais ───────────────────────────────────────
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState(POLLING_INTERVAL_ACTIVE);

  // Estados de modais
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  // Refs
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false);
  const postsCache = useRef<Map<number, Post>>(new Map());

  // ── Fetch paginado ───────────────────────────────────────────
  const fetchPosts = useCallback(
    async (pageNum: number) => {
      if (isFetchingRef.current || loading || !hasMore || !username) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const data = await postsApi.getPosts(username, pageNum);
        const results = data.results || data;

        const mapped: Post[] = results.map((p: any) => ({
          id: p.id,
          title: p.title,
          username: p.author_username,
          content: p.content,
          createdAt: p.created_datetime,
          likes_count: p.likes_count,
          is_owner: p.is_owner,
          comments: (p.comments || []).map((c: any) => ({
            id: c.id,
            username: c.author_username,
            content: c.content,
          })),
        }));

        mapped.forEach((p) => postsCache.current.set(p.id, p));

        const ordered = Array.from(postsCache.current.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(ordered);
        setPage(pageNum + 1);

        if (data.next === null) setHasMore(false);

        if (pageNum === 1 && mapped.length > 0) {
          setLastTimestamp(results[0].created_datetime);
        }
      } catch (err) {
        console.error("Erro ao carregar posts:", err);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [username, hasMore, loading]
  );

  // ── Carregamento inicial ─────────────────────────────────────
  useEffect(() => {
    if (!username) return;

    postsCache.current.clear();
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLastTimestamp(null);

    fetchPosts(1);
  }, [username, fetchPosts]);

  // ── Infinite Scroll ──────────────────────────────────────────
  useEffect(() => {
    if (!loadMoreRef.current) return;

    observer.current?.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetchingRef.current && hasMore) {
          fetchPosts(page);
        }
      },
      { threshold: 1 }
    );

    observer.current.observe(loadMoreRef.current);

    return () => observer.current?.disconnect();
  }, [page, hasMore, fetchPosts]);

  // ── Polling novos posts ──────────────────────────────────────
  const fetchNewPosts = useCallback(async () => {
    if (!username || !lastTimestamp) return;

    try {
      const data = await postsApi.getPosts(username, 1, lastTimestamp);
      const results = data.results || data;

      if (results.length > 0) {
        const mapped: Post[] = results.map((p: any) => ({
          id: p.id,
          title: p.title,
          username: p.author_username,
          content: p.content,
          createdAt: p.created_datetime,
          likes_count: p.likes_count,
          is_owner: p.is_owner,
        }));

        mapped.forEach((p) => postsCache.current.set(p.id, p));

        const ordered = Array.from(postsCache.current.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(ordered);
        setLastTimestamp(results[0].created_datetime);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  }, [username, lastTimestamp]);

  useEffect(() => {
    if (!username || !lastTimestamp) return;

    const intervalId = setInterval(fetchNewPosts, pollingInterval);

    const handleVisibility = () => {
      setPollingInterval(
        document.visibilityState === "visible"
          ? POLLING_INTERVAL_ACTIVE
          : POLLING_INTERVAL_INACTIVE
      );
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchNewPosts, pollingInterval, username, lastTimestamp]);

  // ── Criar post ───────────────────────────────────────────────
  const handleCreatePost = useCallback(
    async (title: string, content: string) => {
      if (!username) return;

      try {
        const created = await postsApi.createPost(username, { title, content });

        const newPost: Post = {
          id: created.id,
          title: created.title,
          username: created.author_username,
          content: created.content,
          createdAt: created.created_datetime,
          comments: [],
          likes_count: created.likes_count || 0,
          is_owner: true,
        };

        postsCache.current.set(newPost.id, newPost);

        const ordered = Array.from(postsCache.current.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(ordered);

        if (
          !lastTimestamp ||
          new Date(created.created_datetime).getTime() > new Date(lastTimestamp).getTime()
        ) {
          setLastTimestamp(created.created_datetime);
        }
      } catch {
        alert("Erro ao criar post");
      }
    },
    [username, lastTimestamp]
  );

  // ── Edição ───────────────────────────────────────────────────
  const openEditModal = useCallback((post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditModalOpen(true);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingPost || !username) return;

    try {
      await postsApi.updatePost(username, editingPost.id, {
        title: editTitle,
        content: editContent,
      });

      postsCache.current.set(editingPost.id, {
        ...editingPost,
        title: editTitle,
        content: editContent,
      });

      setPosts((currentPosts) =>
        currentPosts.map((p) =>
          p.id === editingPost.id ? { ...p, title: editTitle, content: editContent } : p
        )
      );

      setEditModalOpen(false);
      setEditingPost(null);
      setEditTitle("");
      setEditContent("");
    } catch (err) {
      console.error(err);
      alert("Erro ao editar post");
    }
  }, [editingPost, editTitle, editContent, username]);

  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setEditingPost(null);
    setEditTitle("");
    setEditContent("");
  }, []);

  // ── Deleção ──────────────────────────────────────────────────
  const openDeleteModal = useCallback((id: number) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (postToDelete === null || !username) return;

    try {
      await postsApi.deletePost(username, postToDelete);

      postsCache.current.delete(postToDelete);

      setPosts(Array.from(postsCache.current.values()));

      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch {
      alert("Erro ao excluir post");
    }
  }, [postToDelete, username]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  }, []);

  // ── Retorno ──────────────────────────────────────────────────
  return {
    // Dados / estados da timeline
    posts,
    loading,
    hasMore,
    loadMoreRef,

    // Criação
    handleCreatePost,

    // Edição
    editModalOpen,
    editingPost,
    editTitle,
    editContent,
    setEditTitle,
    setEditContent,
    openEditModal,
    saveEdit,
    closeEditModal,

    // Deleção
    deleteModalOpen,
    postToDelete,
    openDeleteModal,
    confirmDelete,
    closeDeleteModal,
  };
}

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minutes ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${Math.floor(diffHours / 24)} days ago`;
};