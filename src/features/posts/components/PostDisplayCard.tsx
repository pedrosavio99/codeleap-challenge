import { TrashIcon } from "../../../assets/icons/TrashIcon";
import { EditIcon } from "../../../assets/icons/EditIcon";

interface Post {
  id: number;
  title: string;
  username: string;
  content: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  currentUsername: string;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export default function PostCard({ post, currentUsername, onEdit, onDelete }: PostCardProps) {
  const isOwner = post.username === currentUsername;

  return (
    <div className="bg-white rounded-2xl border border-[#999999] overflow-hidden">
      {/* Header */}
      <div className="bg-[#7695EC] text-white p-4 flex justify-between items-center">
        <h3 className="font-bold text-lg">{post.title}</h3>

        {isOwner && (
          <div className="flex gap-4">
            <button
              onClick={() => onDelete(post.id)}
              className="hover:opacity-80 transition-opacity"
              aria-label="Delete post"
            >
              <TrashIcon />
            </button>
            <button
              onClick={() => onEdit(post)}
              className="hover:opacity-80 transition-opacity"
              aria-label="Edit post"
            >
              <EditIcon />
            </button>
          </div>
        )}
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
    </div>
  );
}