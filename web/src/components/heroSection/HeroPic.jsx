import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../framerMotion/variants";
import { getProfile } from "../../api";

const HeroPic = () => {
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (data?.heroImage) setHeroImage(data.heroImage);
      })
      .catch(() => {});
  }, []);

  // Use uploaded DB heroImage or fallback to user image /siyam.png
  const defaultFallback = "/siyam.png";
  const imageSrc = heroImage ? heroImage : defaultFallback;

  return (
    <motion.div
      variants={fadeIn("left", 0.3)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.1 }}
      className="relative flex items-center justify-center lg:w-1/2 w-full mt-10 lg:mt-0"
    >
      {/* Glowing ambient background orbs */}
      <div className="absolute w-[250px] h-[250px] md:w-[380px] md:h-[380px] bg-cyan/15 rounded-full blur-3xl -left-10 -top-10 -z-10 animate-pulse" />
      <div
        className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-orange/15 rounded-full blur-3xl -right-10 -bottom-10 -z-10 animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Fixed portrait frame */}
      <div className="relative group w-[260px] h-[320px] sm:w-[300px] sm:h-[370px] md:w-[360px] md:h-[440px] rounded-[40px] overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {/* Gradient shimmer overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan/20 via-transparent to-orange/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />

        {/* Inner border ring */}
        <div className="absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/10 z-10 pointer-events-none" />

        {/* Render image with && conditional check and onError fallback */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Esthyak Ahmmed Siyam"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultFallback;
            }}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
      </div>
    </motion.div>
  );
};

export default HeroPic;
