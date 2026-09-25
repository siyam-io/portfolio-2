import React from "react";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeIn } from "../../framerMotion/variants";

const SingleProject = ({ name, year, link, github, description }) => {
  return (
    <motion.div
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="flex w-full flex-col items-start gap-4 bg-white/5 border border-white/5 hover:border-cyan/35 rounded-3xl p-6 md:p-8 transition-all duration-500 hover:shadow-cyanShadow relative overflow-hidden group"
    >
      {/* Content Side */}
      <div className="flex flex-col gap-2 w-full text-left">
        <span className="text-xs text-orange uppercase tracking-wider font-extrabold">{year}</span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white group-hover:text-cyan transition duration-300">
          {name}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed my-3 max-w-3xl">
          {description || "A high-performance modern web application built using industry best practices. Features fully responsive designs, dynamic UI states, smooth animations, and optimized load performance."}
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {link && link !== "#" && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:text-orange font-bold text-sm tracking-wide uppercase transition duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              Live Demo <BsFillArrowUpRightCircleFill className="text-lg" />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-cyan font-bold text-sm tracking-wide uppercase transition duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              GitHub <FaGithub className="text-lg" />
            </a>
          )}
        </div>
      </div>

      {/* Background glow hover effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 -z-10"></div>
    </motion.div>
  );
};

export default SingleProject;
