import React from "react";
import { FiTarget, FiAward, FiCode } from "react-icons/fi";

const ExperienceTopLeft = () => {
  return (
    <div className="flex flex-col gap-4 w-[280px] p-6 bg-white/5 border border-white/5 hover:border-cyan/30 rounded-2xl backdrop-blur-md shadow-xl transition-all duration-300 group">
      <p className="text-orange font-extrabold uppercase text-lg font-special text-center tracking-widest group-hover:text-cyan transition-colors duration-300">
        Full Stack Engineer
      </p>
      
      <div className="flex flex-col gap-3 my-2">
        <div className="flex items-center gap-3">
          <FiCode className="text-cyan text-xl" />
          <span className="text-white text-sm font-semibold tracking-wide">Scalable Architecture</span>
        </div>
        <div className="flex items-center gap-3">
          <FiTarget className="text-cyan text-xl" />
          <span className="text-white text-sm font-semibold tracking-wide">Performance Focused</span>
        </div>
        <div className="flex items-center gap-3">
          <FiAward className="text-cyan text-xl" />
          <span className="text-white text-sm font-semibold tracking-wide">Clean Code Practices</span>
        </div>
      </div>
      
      <p className="text-center text-xs text-slate-400 leading-relaxed mt-2 border-t border-white/10 pt-3">
        Delivering end-to-end solutions that drive business growth and user engagement.
      </p>
    </div>
  );
};

export default ExperienceTopLeft;
