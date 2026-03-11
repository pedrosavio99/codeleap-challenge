import { useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";

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
        <div className="bg-white p-6 rounded-lg shadow border border-[#999999]">
            <h2 className="font-bold text-lg mb-4">What's on your mind?</h2>

            <div className="space-y-4">
                <Input
                    label="Title"
                    placeholder="Hello world"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />
                <Textarea
                    label="Content"
                    placeholder="Content here"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={isDisabled}>
                        Create
                    </Button>
                </div>
            </div>
        </div>
    );
}