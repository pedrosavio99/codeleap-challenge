import { useCallback } from "react";
import { postsApi } from "../api/postsApi";
import type { Post } from "../types/post";
import { useUsernameStore } from "../../../store/useUsernameStore";

export function usePostMutations(setPosts: (posts: Post[]) => void, postsCache: React.MutableRefObject<Map<number, Post>>) {
  const username = useUsernameStore((s) => s.username);

  const createPost = useCallback(
    async (title: string, content: string): Promise<Post | null> => {
      if (!username) return null;

      try {
        const created = await postsApi.createPost(username, { title, content });

        const newPost: Post = {
          id: created.id,
          title: created.title,
          username: created.author_username,
          content: created.content,
          createdAt: created.created_datetime,
          likes_count: created.likes_count || 0,
          is_owner: true,
          comments: [],
        };

        postsCache.current.set(newPost.id, newPost);

        const ordered = Array.from(postsCache.current.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(ordered);

        return newPost;
      } catch {
        alert("Erro ao criar post");
        return null;
      }
    },
    [username, setPosts, postsCache]
  );

  const updatePost = useCallback(
    async (postId: number, title: string, content: string): Promise<boolean> => {
      if (!username) return false;

      try {
        await postsApi.updatePost(username, postId, { title, content });

        const post = postsCache.current.get(postId);
        if (post) {
          const updated = { ...post, title, content };
          postsCache.current.set(postId, updated);

          setPosts(Array.from(postsCache.current.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ));
        }

        return true;
      } catch (err) {
        console.error(err);
        alert("Erro ao editar post");
        return false;
      }
    },
    [username, setPosts, postsCache]
  );

  const deletePost = useCallback(
    async (postId: number): Promise<boolean> => {
      if (!username) return false;

      try {
        await postsApi.deletePost(username, postId);

        postsCache.current.delete(postId);

        setPosts(Array.from(postsCache.current.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));

        return true;
      } catch {
        alert("Erro ao excluir post");
        return false;
      }
    },
    [username, setPosts, postsCache]
  );

  return { createPost, updatePost, deletePost };
}