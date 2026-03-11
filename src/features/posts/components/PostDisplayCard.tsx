import { useState } from "react";
import { TrashIcon } from "../../../assets/icons/TrashIcon";
import { EditIcon } from "../../../assets/icons/EditIcon";
import { LikeIcon } from "../../../assets/icons/LikeIcon";

interface Post {
  id: number;
  title: string;
  username: string;
  content: string;
  createdAt: string;
}

interface Comment {
  id: number;
  username: string;
  content: string;
}

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
  const [newComment, setNewComment] = useState("");

  // MOCK COMMENTS
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      username: "joao",
      content: "Muito bom esse post!",
    },
    {
      id: 2,
      username: "maria",
      content: "Concordo totalmente 👏",
    },
    {
      id: 3,
      username: "carlos",
      content: "Isso me ajudou bastante.",
    },
  ]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      username: currentUsername,
      content: newComment,
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
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
                aria-label="Delete post"
              >
                <TrashIcon />
              </button>

              <button
                onClick={() => onEdit(post)}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Edit post"
              >
                <EditIcon />
              </button>
            </>
          )}

          {/* Like */}
          <button
            onClick={() => setLiked(!liked)}
            className={`transition cursor-pointer ${
              liked ? "text-red-300" : "text-white"
            }`}
            aria-label="Like post"
          >
            <LikeIcon />
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

      {/* Comments Accordion */}
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
                disabled={!newComment.trim()}
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