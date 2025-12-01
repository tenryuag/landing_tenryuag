import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function InteractiveCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") !== null ||
        target.closest("a") !== null
      );
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border-2 border-primary"
          animate={{
            scale: isPointer ? 1.5 : 1,
            backgroundColor: isPointer ? "rgba(61, 112, 104, 0.1)" : "transparent"
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-primary"
          animate={{
            scale: isPointer ? 0 : 1,
          }}
          style={{
            translateX: "15px",
            translateY: "15px"
          }}
        />
      </motion.div>
    </>
  );
}
