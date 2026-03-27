import { motion } from "framer-motion";

function WelcomeCard({ user, ai }) {
  return (
    <motion.div
      className="col-span-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-2xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold">
        👋 Welcome back, {user.name}
      </h2>

      <p className="mt-2">🎯 Goal: {user.goal} TOEIC</p>
      <p>📌 AI Suggest: {ai.recommendation[0]}</p>
    </motion.div>
  );
}

export default WelcomeCard;