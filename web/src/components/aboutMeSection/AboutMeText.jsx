import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { getProfile } from "../../api";
import { FiCheckCircle, FiCode, FiZap, FiLayout } from "react-icons/fi";

const AboutMeText = () => {
  const [profile, setProfile] = useState({
    about: "Full Stack Software Engineer with 1.3 years of experience building scalable web and mobile solutions using Node.js, Express, React, Next.js, MongoDB, and Expo (React Native). Proficient in RESTful API architecture, real-time data streaming via Socket.io, modern Tailwind CSS interfaces, and automated cloud deployments on Vercel and Render. Specializes in architecting scalable backend APIs and real-time applications with a strong emphasis on secure coding practices, database optimization, JWT authentication, and cross-platform mobile performance."
  });

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (data && data.about) setProfile(data);
      })
      .catch((err) => console.error("Error loading about profile:", err));
  }, []);

  const highlights = [
    { icon: <FiZap className="text-orange" />, text: "High Performance & Speed" },
    { icon: <FiCode className="text-cyan" />, text: "Clean & Maintainable Code" },
    { icon: <FiLayout className="text-orange" />, text: "Responsive UI/UX Design" },
    { icon: <FiCheckCircle className="text-cyan" />, text: "Robust API Integration" },
  ];

  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-xl mx-auto md:mx-0">
      {/* Section Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-cyan mb-4 md:mb-6 font-extrabold uppercase tracking-wider">
        About Me
      </h2>

      {/* Main Professional Pitch */}
      <p className="text-base sm:text-lg leading-relaxed text-slate-300 mb-6 font-normal">
        {profile.about}
      </p>

      {/* Recruiter Highlight Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs sm:text-sm font-medium"
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button className="border border-orange/40 hover:border-orange bg-orange/10 hover:bg-orange text-white font-semibold rounded-xl py-3 px-8 text-sm sm:text-base flex gap-2 items-center transition-all duration-300 cursor-pointer shadow-lg shadow-orange/15 hover:scale-105">
        <Link
          spy={true}
          smooth={true}
          duration={500}
          offset={-120}
          to="projects"
          className="cursor-pointer"
        >
          Explore Projects
        </Link>
      </button>
    </div>
  );
};

export default AboutMeText;
