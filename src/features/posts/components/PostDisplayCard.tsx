import { useState } from "react";
import { TrashIcon } from "../../../assets/icons/TrashIcon";
import { EditIcon } from "../../../assets/icons/EditIcon";
import { LikeIcon } from "../../../assets/icons/LikeIcon";
import { postsApi } from "../api/postsApi";
import type { Post, Comment } from "../types/post";

interface PostCardProps {
  post: Post;
  currentUsername: string;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export default function PostCard({
  post,
  currentUsername,
  onEdit,
  onDelete,
}: PostCardProps) {
  const isOwner = post.username === currentUsername;

  const [openComments, setOpenComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  // ================= LIKE =================
  const handleLike = async () => {
    try {
      await postsApi.toggleLike(currentUsername, post.id);

      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  };

  // ================= COMMENT =================
  const handleAddComment = async () => {
    if (!newComment.trim() || sendingComment) return;

    const content = newComment;

    // UI otimista
    const optimisticComment: Comment = {
      id: Date.now(),
      username: currentUsername,
      content,
    };

    setComments((prev) => [...prev, optimisticComment]);
    setNewComment("");
    setSendingComment(true);

    try {
      const response = await postsApi.addComment(
        currentUsername,
        post.id,
        content
      );

      // substituir comentário otimista pelo real
      setComments((prev) =>
        prev.map((c) =>
          c.id === optimisticComment.id
            ? {
                id: response.id,
                username: response.author_username,
                content: response.content,
              }
            : c
        )
      );
    } catch (err) {
      console.error("Erro ao comentar:", err);

      // rollback se falhar
      setComments((prev) =>
        prev.filter((c) => c.id !== optimisticComment.id)
      );
    } finally {
      setSendingComment(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#999999] overflow-hidden">
      {/* Header */}
      <div className="bg-[#7695EC] text-white p-4 flex justify-between items-center">
        <h3 className="font-bold text-lg">{post.title}</h3>

        <div className="flex gap-4 items-center">
          {isOwner && (
            <>
              <button
                onClick={() => onDelete(post.id)}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <TrashIcon />
              </button>

              <button
                onClick={() => onEdit(post)}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <EditIcon />
              </button>
            </>
          )}

          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition cursor-pointer ${
              liked ? "text-red-300" : "text-white"
            }`}
          >
            <LikeIcon />
            <span className="text-sm">{likes}</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>@{post.username}</span>
          <span>{post.createdAt}</span>
        </div>

        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Comments */}
      <div>
        <button
          onClick={() => setOpenComments(!openComments)}
          className="w-full cursor-pointer flex justify-between items-center p-4 text-sm font-semibold text-gray-700"
        >
          <span>Comments ({comments.length})</span>

          <span
            className={`transition-transform ${
              openComments ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {openComments && (
          <div className="px-4 pb-4 space-y-3">
            {comments.length === 0 && (
              <p className="text-sm text-gray-400 text-center">
                No comments yet
              </p>
            )}

            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3"
              >
                <p className="text-sm font-semibold text-gray-800">
                  @{comment.username}
                </p>

                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))}

            {/* Add comment */}
            <div className="flex gap-2 pt-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment..."
                className="flex-1 h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#7695EC]"
              />

              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || sendingComment}
                className="px-4 h-9 bg-[#7695EC] text-white text-sm rounded-lg disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}