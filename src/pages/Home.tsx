import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUsernameStore } from "../store/useUsernameStore";
import Navbar from "../components/layout/Navbar";
import EditPostModal from "../features/posts/components/EditPostModal";
import DeletePostModal from "../features/posts/components/DeletePostModal";
import CreatePostCard from "../features/posts/components/PostCreator";
import PostCard from "../features/posts/components/PostDisplayCard";

import { postsApi } from "../features/posts/api/postsApi";
import {
  POLLING_INTERVAL_ACTIVE,
  POLLING_INTERVAL_INACTIVE,
} from "../features/posts/constants";
import type { Post } from "../features/posts/types/post";

const formatTimeAgo = (dateString: string): string => {
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

export default function Home() {
  const username = useUsernameStore((s) => s.username);
  const setUsername = useUsernameStore((s) => s.setUsername);

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState(
    POLLING_INTERVAL_ACTIVE
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false);

  // CACHE DE POSTS
  const postsCache = useRef<Map<number, Post>>(new Map());

  // ====================== FETCH PAGINADO ======================
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
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
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

  // ====================== CARREGAMENTO INICIAL ======================
  useEffect(() => {
    if (!username) return;

    postsCache.current.clear();
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLastTimestamp(null);

    fetchPosts(1);
  }, [username]);

  // ====================== INFINITE SCROLL ======================
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

  // ====================== POLLING POSTS NOVOS ======================
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
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
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

  // ====================== CRIAR POST ======================
  const handleCreatePost = async (title: string, content: string) => {
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
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setPosts(ordered);

      if (
        !lastTimestamp ||
        new Date(created.created_datetime) > new Date(lastTimestamp)
      ) {
        setLastTimestamp(created.created_datetime);
      }
    } catch {
      alert("Erro ao criar post");
    }
  };

  // ====================== EDIT ======================
  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editingPost) return;

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
          p.id === editingPost.id
            ? { ...p, title: editTitle, content: editContent }
            : p
        )
      );

      closeEditModal();
    } catch (err) {
      console.error(err);
      alert("Erro ao editar post");
    }
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingPost(null);
    setEditTitle("");
    setEditContent("");
  };

  // ====================== DELETE ======================
  const openDeleteModal = (id: number) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (postToDelete === null) return;

    try {
      await postsApi.deletePost(username, postToDelete);

      postsCache.current.delete(postToDelete);

      setPosts(Array.from(postsCache.current.values()));

      closeDeleteModal();
    } catch {
      alert("Erro ao excluir post");
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const handleLogout = () => setUsername("");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />

      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-0 space-y-6">
        <CreatePostCard username={username} onCreate={handleCreatePost} />

        <AnimatePresence mode="popLayout" initial={false}>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 24,
                duration: 0.45,
              }}
              layout
              whileHover={{
                y: -4,
                scale: 1.015,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.995 }}
              className="transform-gpu"
            >
              <PostCard
                post={{
                  ...post,
                  createdAt: formatTimeAgo(post.createdAt),
                }}
                currentUsername={username}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {hasMore ? (
          <div
            ref={loadMoreRef}
            className="h-20 flex items-center justify-center text-gray-500 text-sm"
          >
            {loading ? (
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                Loading more posts...
              </motion.span>
            ) : (
              "Scroll down to load more"
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-12 flex items-center justify-center text-gray-400 text-sm"
          >
           You have reached the end of the posts
          </motion.div>
        )}
      </main>

      {/* Mantive exatamente como estava */}
      <EditPostModal
        isOpen={editModalOpen}
        post={editingPost}
        title={editTitle}
        content={editContent}
        onTitleChange={setEditTitle}
        onContentChange={setEditContent}
        onSave={saveEdit}
        onCancel={closeEditModal}
      />

      <DeletePostModal
        isOpen={deleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}