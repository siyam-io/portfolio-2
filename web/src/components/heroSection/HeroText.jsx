import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../framerMotion/variants";
import { getProfile } from "../../api";
import { Link } from "react-scroll";
import { FiArrowUpRight, FiMail } from "react-icons/fi";

const HeroText = () => {
  const [profile, setProfile] = useState({
    name: "Esthyak Ahmmed Siyam",
    role: "Full Stack Software Engineer",
    bio: "Transforming complex ideas into pixel-perfect, interactive web experiences with clean architecture and modern UI design."
  });

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (data && data.name) setProfile(data);
      })
      .catch((err) => console.error("Error loading hero profile:", err));
  }, []);

  const nameParts = (profile.name || "Esthyak Ahmmed Siyam").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="flex flex-col gap-5 h-full justify-center text-center md:text-left md:w-1/2 z-10">
      {/* Professional Role Badge */}
      <motion.div
        variants={fadeIn("down", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0 }}
        className="inline-flex items-center gap-2.5 self-center md:self-start px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.15)]"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
        </span>
        {profile.role || "Full-Stack Web Developer"}
      </motion.div>

      {/* Main Name Heading */}
      <motion.h1
        variants={fadeIn("right", 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[1.05] text-white"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange via-orange-400 to-amber-300">
          {firstName}
        </span>{" "}
        <br className="hidden md:block" />
        <span className="text-white drop-shadow-md">{lastName}</span>
      </motion.h1>

      {/* Professional Bio */}
      <motion.p
        variants={fadeIn("up", 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0 }}
        className="text-sm sm:text-base md:text-lg text-slate-300 max-w-lg mx-auto md:mx-0 leading-relaxed font-normal"
      >
        {profile.bio}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        variants={fadeIn("up", 0.8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0 }}
        className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2"
      >
        <Link
          to="projects"
          spy={true}
          smooth={true}
          duration={500}
          offset={-100}
          className="cursor-pointer"
        >
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange to-amber-500 text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-orange/25 hover:shadow-orange/40 hover:scale-105 transition-all duration-300">
            View Projects <FiArrowUpRight className="text-lg" />
          </button>
        </Link>

        <Link
          to="contact"
          spy={true}
          smooth={true}
          duration={500}
          offset={-100}
          className="cursor-pointer"
        >
          <button className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm sm:text-base flex items-center gap-2 hover:border-cyan/50 hover:text-cyan transition-all duration-300 backdrop-blur-sm">
            Contact Me <FiMail className="text-lg" />
          </button>
        </Link>

        {/* Download CV Button */}
        <a
          href={profile.cvUrl || "/Siyam_CV.pdf"}
          download="Siyam_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl border border-orange/40 bg-orange/10 hover:bg-orange hover:text-white text-orange font-semibold text-sm sm:text-base flex items-center gap-2 transition-all duration-300 backdrop-blur-sm cursor-pointer shadow-sm hover:shadow-orange/40"
        >
          Download CV <FiArrowUpRight className="text-lg rotate-90" />
        </a>
      </motion.div>
    </div>
  );
};

export default HeroText;
