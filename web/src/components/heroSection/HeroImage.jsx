import React, { useState, useEffect } from "react";
import { PiHexagonThin } from "react-icons/pi";
import { getProfile } from "../../api";

const HeroImage = () => {
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (data?.heroImage) setHeroImage(data.heroImage);
      })
      .catch(() => {});
  }, []);

  const defaultFallback = "/siyam.png";
  const imageSrc = heroImage ? heroImage : defaultFallback;

  return (
    <div className="relative self-end h-full w-full items-center justify-center">
      <div className="h-full w-full relative">
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Esthyak Ahmmed Siyam"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultFallback;
            }}
            className="w-auto h-auto md:max-w-[570px] sm:max-w-[380px] absolute bottom-[0px] z-10 left-[50%] -translate-x-[50%] object-contain"
          />
        )}
        <div className="w-full h-full absolute bottom-[-20%] -z-10 flex justify-center items-center rotate-90">
          <PiHexagonThin className="md:h-[90%] sm:h-[120%] min-h-[600px] w-auto text-orange opacity-70 animate-[spin_20s_linear_infinite]" />
        </div>
        <div className="w-full h-full absolute bottom-[-20%] -z-10 flex justify-center items-center rotate-90">
          <PiHexagonThin className="md:h-[90%] sm:h-[120%] blur-lg min-h-[600px] w-auto text-orange opacity-70 animate-[spin_20s_linear_infinite]" />
        </div>
        <div className="w-full h-full absolute bottom-[-20%] -z-10 flex justify-center items-center">
          <PiHexagonThin className="md:h-[90%] sm:h-[120%] min-h-[600px] w-auto text-cyan opacity-70 animate-[spin_20s_linear_infinite]" />
        </div>
        <div className="w-full h-full absolute bottom-[-20%] -z-10 flex justify-center items-center">
          <PiHexagonThin className="md:h-[90%] sm:h-[120%] min-h-[600px] w-auto text-cyan opacity-70 blur-lg animate-[spin_20s_linear_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
