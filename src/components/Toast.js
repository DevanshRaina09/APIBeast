import { CheckIcon } from "@heroicons/react/24/outline";

export default function Toast({ message, type = "success" }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div
        className={`${bgColor} text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg`}
      >
        <CheckIcon className="w-5 h-5" />
        {message}
      </div>
    </div>
  );
}
