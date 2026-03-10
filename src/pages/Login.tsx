import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsernameStore } from "../store/useUsernameStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Login() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const setUsername = useUsernameStore((state) => state.setUsername);
  const navigate = useNavigate();

  const isValid = inputValue.trim().length >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setError("");
    setUsername(inputValue.trim());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="font-roboto font-bold text-[22px] leading-none text-black text-left mb-6">
          Welcome to CodeLeap network!
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-end">
          <Input
            label="Please enter your username"
            placeholder="Your username..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            error={error}
            autoFocus
          />

          <Button type="submit" disabled={!isValid}>
            ENTER
          </Button>
        </form>
      </div>
    </div>
  );
}