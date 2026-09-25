import React, { useEffect, useState } from "react";
import SingleExperience from "./SingleExperience";
import { motion } from "framer-motion";
import { fadeIn } from "../../framerMotion/variants";
import { getExperiences } from "../../api";

const AllExperiences = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    getExperiences()
      .then((data) => {
        if (data) setExperiences(data);
      })
      .catch((err) => console.error("Error loading experiences:", err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-5xl mx-auto">
      {experiences.map((experience, index) => {
        return (
          <React.Fragment key={experience._id || index}>
            <SingleExperience experience={experience} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default AllExperiences;
