import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-beige text-charcoal font-display flex flex-col items-center justify-center px-6 text-center overflow-hidden">

      {/* 👇 ANIMATED BACKGROUND BLOBS */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-charcoal rounded-full blur-[120px] opacity-20"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, 80, -80, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-charcoal rounded-full blur-[140px] opacity-10"
          animate={{
            x: [0, -120, 120, 0],
            y: [0, -100, 100, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* 👇 CONTENT */}
      <motion.h1 
        className="text-6xl sm:text-7xl font-bold mb-6"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        AboutYou
      </motion.h1>

      <motion.p 
        className="text-lg sm:text-xl max-w-xl font-body mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Reflect on your story. <br />
        Craft interview answers and essays, powered by AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link 
          to="/questions" 
          className="px-8 py-3 bg-charcoal text-beige text-lg font-medium rounded-full shadow hover:shadow-md hover:bg-opacity-90 transition duration-300"
        >
          Get Started →
        </Link>
      </motion.div>
    </div>
  );
}
