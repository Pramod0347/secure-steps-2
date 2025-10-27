import { motion } from 'framer-motion';

const FullScreenLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="relative flex flex-col items-center gap-2">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
        />
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground"
        >
          Loading...
        </motion.span>
      </div>
    </motion.div>
  );
};

export default FullScreenLoader;