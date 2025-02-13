import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export default function CurrentPlan() {
  return (
    <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-rose-400/20 via-purple-400/20 to-blue-400/20 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-300">CURRENT PLAN</span>
        <button className="text-blue-400 text-sm hover:text-blue-300">
          Manage Plan
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Researcher</h2>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-300">API Usage</span>
          <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400" />
        </div>
        <div className="h-2 w-full bg-gray-700 rounded-full">
          <div className="h-full w-[0%] bg-blue-500 rounded-full"></div>
        </div>
        <div className="text-sm text-gray-400 mt-1">0/1,000 Credits</div>
      </div>
    </div>
  );
}
