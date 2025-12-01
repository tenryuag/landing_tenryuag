import { motion } from "motion/react";
import { ReactNode, useState } from "react";

interface FloatingIconProps {
  children: ReactNode;
  position: "top-right" | "bottom-left";
  delay?: number;
}

export function FloatingIcon({ children, position, delay = 0 }: FloatingIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    "top-right": "-top-6 -right-6",
    "bottom-left": "-bottom-6 -left-6"
  };

  return (
    <motion.div
      className={`absolute ${positionClasses[position]} bg-card p-4 rounded-xl shadow-lg border border-border cursor-pointer overflow-hidden`}
      animate={{ 
        y: isHovered ? 0 : position === "top-right" ? [0, -10, 0] : [0, 10, 0],
        scale: isHovered ? 1.1 : 1,
        rotate: isHovered ? [0, 5, -5, 0] : 0
      }}
      transition={{ 
        y: { duration: 3, repeat: Infinity },
        scale: { duration: 0.3 },
        rotate: { duration: 0.5, repeat: isHovered ? Infinity : 0 }
      }}
      whileHover={{ 
        boxShadow: "0 20px 40px rgba(61, 112, 104, 0.3)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Efecto de brillo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Partículas */}
      {isHovered && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              initial={{ 
                x: 24, 
                y: 24, 
                scale: 0,
                opacity: 1 
              }}
              animate={{
                x: 24 + Math.cos((i * Math.PI) / 4) * 40,
                y: 24 + Math.sin((i * Math.PI) / 4) * 40,
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </>
      )}
      
      <motion.div
        animate={{
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.2 : 1
        }}
        transition={{ 
          rotate: { duration: 0.6 },
          scale: { duration: 0.3 }
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
