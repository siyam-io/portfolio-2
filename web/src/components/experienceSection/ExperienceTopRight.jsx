import React from "react";

const ExperienceTopRight = () => {
  return (
    <div className="w-full max-w-[280px] lg:max-w-none lg:w-[30%] xl:w-[25%] bg-white/5 border border-white/5 hover:border-cyan/30 p-6 rounded-2xl backdrop-blur-md shadow-xl transition-all duration-300">
      <p className="text-sm text-left text-slate-300 leading-relaxed">
        Specialized in architecting <span className="font-bold text-white">Full-Stack MERN</span> and <span className="font-bold text-white">React Native</span> applications. <br className="my-3" />
        Passionate about writing secure, optimized backend microservices and creating highly interactive, seamless frontend experiences. <br className="my-3" />
        Always focused on <span className="text-cyan font-semibold">industry best practices</span> and delivering production-ready digital products.
      </p>
    </div>
  );
};

export default ExperienceTopRight;
