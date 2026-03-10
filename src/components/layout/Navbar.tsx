import { useUsernameStore } from "../../store/useUsernameStore";

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const username = useUsernameStore((state) => state.username);

  return (
    <nav className="bg-[#7695EC] text-white p-4 shadow">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <h1 className="font-bold text-lg text-[#FFFFFF]">CodeLeap Network</h1>

        <div className="flex items-center gap-4 text-sm">
          <span>
            Welcome, <b>{username}</b>
          </span>

          <button
            onClick={onLogout}
            className="bg-white text-indigo-500 px-3 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}