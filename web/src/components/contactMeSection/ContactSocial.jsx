import SingleContactSocial from "./SingleContactSocial";
import { FaLinkedinIn } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";

const ContactSocial = () => {
  return (
    <div className="flex gap-4">
      <SingleContactSocial link="https://www.linkedin.com/in/esthyak-ahmmed-siyam-34665a317/" Icon={FaLinkedinIn} />
      <SingleContactSocial link="https://github.com/siyam-io" Icon={FiGithub} />
      <SingleContactSocial link="https://www.instagram.com/hridoy_3.4/" Icon={FaInstagram} />
    </div>
  );
};

export default ContactSocial;
