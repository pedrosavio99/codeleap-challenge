import { useState, useEffect, useRef, useCallback } from "react";
import { postsApi } from "../api/postsApi";
import {
  POLLING_INTERVAL_ACTIVE,
  POLLING_INTERVAL_INACTIVE,
} from "../constants";
import type { Post } from "../types/post";
import { useUsernameStore } from "../../../store/useUsernameStore";


export function usePosts() {
  const username = useUsernameStore((s) => s.username);

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState(
    POLLING_INTERVAL_ACTIVE
  );

  const postsCache = useRef<Map<number, Post>>(new Map());
  const isFetchingRef = useRef(false);

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

        setPage((prev) => pageNum + 1);

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

  useEffect(() => {
    if (!username) return;

    postsCache.current.clear();
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLastTimestamp(null);

    fetchPosts(1);
  }, [username, fetchPosts]);

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
          comments: [],
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

  return {
    posts,
    setPosts,
    postsCache,
    loading,
    hasMore,
    fetchNextPage: () => fetchPosts(page),
  };
}