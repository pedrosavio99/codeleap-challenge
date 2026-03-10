import { useState } from "react";
import { useUsernameStore } from "../store/useUsernameStore";
import Navbar from "../components/layout/Navbar";
import EditPostModal from "../features/posts/components/EditPostModal";
import DeletePostModal from "../features/posts/components/DeletePostModal";
import CreatePostCard from "../features/posts/components/PostCreator";
import PostCard from "../features/posts/components/PostDisplayCard";

type Post = {
  id: number;
  title: string;
  username: string;
  content: string;
  createdAt: string;
};

const mockPosts: Post[] = [
  {
    id: 1,
    title: "My First Post at CodeLeap Network!",
    username: "Victor",
    content:
      "Curabitur suscipit suscipit tellus. Phasellus consectetur vestibulum elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    createdAt: "25 minutes ago",
  },
  {
    id: 2,
    title: "My Second Post at CodeLeap Network!",
    username: "Vini",
    content:
      "Duis lobortis massa imperdiet quam. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc.",
    createdAt: "45 minutes ago",
  },
];

export default function Home() {
  const username = useUsernameStore((s) => s.username);
  const setUsername = useUsernameStore((s) => s.setUsername);

  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  function handleLogout() {
    setUsername("");
  }

  function handleCreatePost(title: string, content: string) {
    const newPost: Post = {
      id: Date.now(),
      title,
      username,
      content,
      createdAt: "Just now",
    };
    setPosts([newPost, ...posts]);
  }

  function openEditModal(post: Post) {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditModalOpen(true);
  }

  function saveEdit() {
    if (!editingPost) return;
    setPosts(
      posts.map((p) =>
        p.id === editingPost.id ? { ...p, title: editTitle, content: editContent } : p
      )
    );
    closeEditModal();
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditingPost(null);
    setEditTitle("");
    setEditContent("");
  }

  function openDeleteModal(id: number) {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  }

  function confirmDelete() {
    if (postToDelete === null) return;
    setPosts(posts.filter((p) => p.id !== postToDelete));
    closeDeleteModal();
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />

      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-0 space-y-6">
        <CreatePostCard username={username} onCreate={handleCreatePost} />

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUsername={username}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        ))}
      </main>

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