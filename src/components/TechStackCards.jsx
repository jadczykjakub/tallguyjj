import { motion } from "framer-motion";
import {
  showHoverAnimation,
  removeHoverAnimation,
} from "../lib/windowAnimation";
import { FadeContainer, popUp } from "../lib/FramerMotionVariants";

import {
  SiReact,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiTailwindcss,
  SiRedux,
  SiFirebase,
  SiGit,
} from "react-icons/si";
const TechStackCard = () => {
  const stackCards = [
    {
      name: "TypeScript",
      logo: SiTypescript,
    },
    {
      name: "HTML",
      logo: SiHtml5,
    },
    {
      name: "CSS",
      logo: SiCss3,
    },
    {
      name: "JavaScript",
      logo: SiJavascript,
    },
    {
      name: "React",
      logo: SiReact,
    },
    {
      name: "Tailwind CSS",
      logo: SiTailwindcss,
    },
    {
      name: "Nextjs",
      logo: SiNextdotjs,
    },
    {
      name: "Node.js",
      logo: SiNodedotjs,
    },
    {
      name: "PostgreSQL",
      logo: SiPostgresql,
    },
    {
      name: "Redux",
      logo: SiRedux,
    },

    {
      name: "Firebase",
      logo: SiFirebase,
    },
    {
      name: "Git",
      logo: SiGit,
    },
  ];

  return (
    <div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="grid grid-cols-3 gap-4 "
      >
        {stackCards.map((card) => {
          return (
            <motion.div
              title={card.name}
              variants={popUp}
              key={card.name}
              onMouseMove={(e) => showHoverAnimation(e)}
              onMouseLeave={(e) => removeHoverAnimation(e)}
            >
              <div className="pointer-events-none relative border border-primary p-4 grid justify-items-center gap-2">
                <p className="hidden md:block">{card.name}</p>
                <div>
                  <card.logo className="h-8 w-8" fill="var(--color-primary)" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TechStackCard;
