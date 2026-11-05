"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const group: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.08 } } };
const child: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/** Contêiner que faz os filhos <RevealItem> entrarem em sequência quando chegam na tela. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={group} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.15 }}>
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={child}>
      {children}
    </motion.div>
  );
}
