import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function WelcomeCard({ user, ai }) {
  return (
    <motion.div
      className="
      col-span-2
      bg-gradient-to-r from-blue-600 to-blue-500
      dark:from-blue-700 dark:to-indigo-700
      text-white
      p-6
      rounded-2xl
      shadow-sm
      space-y-2
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold">👋 Welcome back, {user.name}</h2>

      <p>🎯 Goal: {user.goal} TOEIC</p>

      <div className="flex items-center gap-2 text-sm mt-2">
        <Sparkles className="w-4 h-4" />
        AI Suggest: {ai.recommendation[0]}
      </div>
    </motion.div>
  );
}

export default WelcomeCard;
