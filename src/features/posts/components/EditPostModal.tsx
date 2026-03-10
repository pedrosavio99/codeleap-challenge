type Post = {
  id: number;
  title: string;
  username: string;
  content: string;
  createdAt: string;
};

interface EditPostModalProps {
  isOpen: boolean;
  post: Post | null;
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditPostModal({
  isOpen,
  post,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
}: EditPostModalProps) {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">Edit post</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Title</label>
            <input
              className="w-full border rounded p-2 mt-1"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Content</label>
            <textarea
              className="w-full border rounded p-2 mt-1 h-32"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title.trim() || !content.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}