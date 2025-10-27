import { motion } from 'framer-motion';

interface ComponentLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const ComponentLoader = ({ size = 'md', text }: ComponentLoaderProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}
      />
      {text && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground"
        >
          {text}
        </motion.span>
      )}
    </div>
  );
};

export default ComponentLoader;