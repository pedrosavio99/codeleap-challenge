import { useState } from "react";

interface CreatePostCardProps {
  username: string;
  onCreate: (title: string, content: string) => void;
}

export default function CreatePostCard({ onCreate }: CreatePostCardProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onCreate(title, content);
    setTitle("");
    setContent("");
  };

  const isDisabled = !title.trim() || !content.trim();

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h2 className="font-bold text-lg mb-4">What's on your mind?</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Title</label>
          <input
            placeholder="Hello world"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Content</label>
          <textarea
            placeholder="Content here"
            className="w-full border rounded p-2 h-24 resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}