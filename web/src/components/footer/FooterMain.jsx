import React from "react";
import { Link } from "react-scroll";

const FooterMain = () => {
  const footerLinks = [
    {
      name: "About Me",
      section: "about",
    },
    {
      name: "Skills",
      section: "skills",
    },
    {
      name: "Experience",
      section: "experience",
    },
    {
      name: "Projects",
      section: "projects",
    },
  ];
  return (
    <footer className="px-6 py-8 mt-20 border-t border-white/5 bg-[#030205]/40 backdrop-blur-md">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-6">
        <p className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white font-special">
          ESTHYAK AHMMED SIYAM
        </p>
        <ul className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">
          {footerLinks.map((item, index) => {
            return (
              <li key={index}>
                <Link
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-120}
                  to={item.section}
                  className="hover:text-cyan transition-all duration-300 cursor-pointer"
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="text-center mt-6 text-xs text-slate-500 tracking-wide">
        © 2026 Siyam | All Rights Reserved.
      </p>
    </footer>
  );
};

export default FooterMain;
