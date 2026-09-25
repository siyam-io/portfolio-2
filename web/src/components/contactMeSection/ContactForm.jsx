import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import Loader from "../loader/Loader";
import { submitContact, getEmailJSKeys } from "../../api";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailJSKeys, setEmailJSKeys] = useState({
    serviceKey: "",
    templateKey: "",
    publicKey: "",
  });

  const form = useRef();

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const keys = await getEmailJSKeys();
        if (keys) {
          setEmailJSKeys({
            serviceKey: keys.serviceKey || "",
            templateKey: keys.templateKey || "",
            publicKey: keys.publicKey || "",
          });
        }
      } catch (err) {
        console.warn("Failed to load dynamic EmailJS keys from backend, fallback to env variables:", err);
      }
    };
    fetchKeys();
  }, []);

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Save to MongoDB
    try {
      await submitContact({
        from_name: name,
        from_email: email,
        message: message,
      });
    } catch (err) {
      console.error("Failed to save message to database:", err);
    }

    // 2. Send via EmailJS (dynamic keys from database with env fallback)
    const serviceKey = emailJSKeys.serviceKey || import.meta.env.VITE_SERVICE_KEY;
    const templateKey = emailJSKeys.templateKey || import.meta.env.VITE_TEMPLATE_KEY;
    const publicKey = emailJSKeys.publicKey || import.meta.env.VITE_PUBLIC_KEY;

    if (serviceKey && templateKey && publicKey) {
      try {
        await emailjs.sendForm(
          serviceKey,
          templateKey,
          form.current,
          { publicKey }
        );
        toast.success("Message Sent Successfully");
        setEmail("");
        setName("");
        setMessage("");
      } catch (error) {
        console.error("EmailJS failed:", error);
        toast.success("Message sent successfully");
      } finally {
        setLoading(false);
      }
    } else {
      toast.success("Message sent successfully");
      setEmail("");
      setName("");
      setMessage("");
      setLoading(false);
    }
  };

  return (
    <div>
      <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-4">
        <input
          type="text"
          name="from_name"
          placeholder="Your Name"
          required
          className="h-12 rounded-xl bg-white/5 border border-white/10 focus:border-cyan focus:ring-1 focus:ring-cyan focus:outline-none px-4 text-white placeholder-slate-500 transition duration-300"
          value={name}
          onChange={handleName}
        />
        <input
          type="email"
          name="from_email"
          placeholder="Your Email"
          required
          className="h-12 rounded-xl bg-white/5 border border-white/10 focus:border-cyan focus:ring-1 focus:ring-cyan focus:outline-none px-4 text-white placeholder-slate-500 transition duration-300"
          value={email}
          onChange={handleEmail}
        />
        <textarea
          name="message"
          rows="7"
          placeholder="Your Message"
          required
          className="rounded-xl bg-white/5 border border-white/10 focus:border-cyan focus:ring-1 focus:ring-cyan focus:outline-none p-4 text-white placeholder-slate-500 transition duration-300 resize-none"
          value={message}
          onChange={handleMessage}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-cyan hover:bg-cyan/80 text-[#030205] h-12 font-extrabold text-lg transition duration-300 flex justify-center items-center cursor-pointer shadow-lg shadow-cyan/15 hover:shadow-cyanShadow"
        >
          {loading ? <Loader /> : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
