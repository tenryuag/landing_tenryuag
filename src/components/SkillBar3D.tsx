import { motion } from "motion/react";
import { useState } from "react";

interface SkillBar3DProps {
  skill: string;
  level: number;
  index: number;
}

export function SkillBar3D({ skill, level, index }: SkillBar3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
    >
      <div className="flex justify-between mb-2">
        <motion.span 
          className="font-medium"
          animate={{ 
            color: isHovered ? "rgb(61, 112, 104)" : "inherit",
            x: isHovered ? 5 : 0
          }}
        >
          {skill}
        </motion.span>
        <motion.span 
          className="text-muted-foreground"
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            color: isHovered ? "rgb(61, 112, 104)" : "inherit"
          }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden relative">
        {/* Fondo con efecto 3D */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        
        {/* Barra de progreso */}
        <motion.div
          className="h-full relative overflow-hidden rounded-full"
          style={{
            background: "linear-gradient(90deg, rgb(61, 112, 104), rgb(91, 138, 159))"
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 1, ease: "easeOut" }}
        >
          {/* Efecto de brillo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: isHovered ? ["0%", "100%"] : "0%",
            }}
            transition={{
              duration: 1,
              repeat: isHovered ? Infinity : 0,
              ease: "linear"
            }}
            style={{ width: "50%" }}
          />
          
          {/* Highlight superior */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>

        {/* Efecto de pulso cuando hover */}
        {isHovered && (
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-1 bg-primary"
            style={{ left: `${level}%` }}
            animate={{
              opacity: [0.5, 1, 0.5],
              boxShadow: [
                "0 0 5px rgba(61, 112, 104, 0.5)",
                "0 0 20px rgba(61, 112, 104, 0.8)",
                "0 0 5px rgba(61, 112, 104, 0.5)"
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
