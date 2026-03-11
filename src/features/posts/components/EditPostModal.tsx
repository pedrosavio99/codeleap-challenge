import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">Edit post</h2>

        <div className="space-y-4">

          <Input
            label="Title"
            placeholder="Hello world"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            autoFocus
          />
          <Textarea
            label="Content"
            placeholder="Content here"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="h-8 px-8 bg-transparent border rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="h-8 px-8 bg-[#47B960] text-white rounded hover:bg-[#3aa850] disabled:opacity-50 disabled:cursor-not-allowed"
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