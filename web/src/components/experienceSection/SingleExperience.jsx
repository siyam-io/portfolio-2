import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../framerMotion/variants";

const SingleExperience = ({ experience }) => {
  return (
    <motion.div
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="bg-white/5 border border-white/5 hover:border-cyan/30 rounded-2xl p-6 md:p-8 w-full max-w-4xl mx-auto transition-all duration-300 hover:-translate-y-2 hover:shadow-cyanShadow relative overflow-hidden flex flex-col group"
    >
      {/* Premium Top Gradient Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan to-orange opacity-40 group-hover:opacity-100 transition duration-500"></div>

      <div className="flex flex-col gap-1 mb-4">
        <h4 className="font-extrabold text-lg text-white group-hover:text-cyan transition duration-300">
          {experience.job}
        </h4>
        <span className="text-orange text-sm font-semibold">{experience.company}</span>
        <span className="text-slate-400 text-xs mt-0.5">{experience.date}</span>
      </div>

      <ul className="list-disc pl-4 text-sm text-slate-300 space-y-2 flex-grow">
        {experience.responsibilities.map((resp, index) => (
          <li key={index} className="leading-relaxed">{resp}</li>
        ))}
      </ul>

      {/* Decorative background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
    </motion.div>
  );
};

export default SingleExperience;
