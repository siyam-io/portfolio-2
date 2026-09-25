import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  login,
  verifyToken,
  getProfile,
  updateProfile,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getMessages,
  deleteMessage,
  uploadImage,
  uploadCV,
  getKeys,
  saveKeys,
} from "../../api";

// Icons
import {
  FaUser,
  FaTools,
  FaBriefcase,
  FaFolderOpen,
  FaEnvelope,
  FaSignOutAlt,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaChevronRight,
  FaArrowLeft,
  FaKey,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadImage(file);
      if (data.success) {
        setProfile((prev) => ({ ...prev, heroImage: data.url }));
        toast.success(`Image uploaded successfully to ${data.source}!`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const [cvUploading, setCvUploading] = useState(false);

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCvUploading(true);
    try {
      const data = await uploadCV(file);
      if (data.success) {
        setProfile((prev) => ({ ...prev, cvUrl: data.url }));
        toast.success(`CV uploaded successfully!`);
      }
    } catch (err) {
      console.error("CV Upload failed:", err);
      toast.error("Failed to upload CV");
    } finally {
      setCvUploading(false);
    }
  };

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Portfolio data states
  const [profile, setProfile] = useState({ name: "", role: "", bio: "", about: "", heroImage: "" });
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);

  const [keysForm, setKeysForm] = useState({
    CLOUDINARY_CLOUD_NAME: "",
    CLOUDINARY_API_KEY: "",
    CLOUDINARY_API_SECRET: "",
    VITE_SERVICE_KEY: "",
    VITE_TEMPLATE_KEY: "",
    VITE_PUBLIC_KEY: "",
    MONGODB_URI: "",
  });

  // Form states for items
  const [skillForm, setSkillForm] = useState({ id: null, name: "", iconName: "FaHtml5", category: "frontend" });
  const [isSkillEditing, setIsSkillEditing] = useState(false);

  const [experienceForm, setExperienceForm] = useState({
    id: null,
    job: "",
    company: "",
    date: "",
    responsibilitiesStr: "",
  });
  const [isExperienceEditing, setIsExperienceEditing] = useState(false);

  const [projectForm, setProjectForm] = useState({
    id: null,
    name: "",
    year: "",
    image: "",
    link: "",
    github: "",
    align: "left",
  });
  const [isProjectEditing, setIsProjectEditing] = useState(false);

  // Popular icons list for dropdown selection
  const iconList = [
    { name: "HTML", val: "FaHtml5" },
    { name: "CSS", val: "FaCss3Alt" },
    { name: "TailwindCSS", val: "RiTailwindCssFill" },
    { name: "JavaScript", val: "IoLogoJavascript" },
    { name: "React", val: "FaReact" },
    { name: "Redux", val: "SiRedux" },
    { name: "NodeJS", val: "FaNodeJs" },
    { name: "Express", val: "SiExpress" },
    { name: "MongoDB", val: "SiMongodb" },
    { name: "NextJS", val: "SiNextdotjs" },
    { name: "TypeScript", val: "SiTypescript" },
    { name: "Git", val: "FaGitAlt" },
    { name: "GitHub", val: "FaGithub" },
    { name: "Docker", val: "FaDocker" },
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthLoading(false);
      return;
    }
    try {
      const data = await verifyToken();
      if (data.valid) {
        setIsLoggedIn(true);
        fetchDashboardData();
      }
    } catch (err) {
      localStorage.removeItem("token");
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [profData, skillsData, expData, projData, msgData, keysData] = await Promise.all([
        getProfile(),
        getSkills(),
        getExperiences(),
        getProjects(),
        getMessages(),
        getKeys(),
      ]);
      setProfile(profData);
      setSkills(skillsData);
      setExperiences(expData);
      setProjects(projData);
      setMessages(msgData);
      if (keysData) setKeysForm(keysData);
    } catch (err) {
      console.error("Error fetching data", err);
      toast.error("Failed to load dashboard data");
    }
  };

  const handleKeysSave = async (e) => {
    e.preventDefault();
    try {
      const res = await saveKeys(keysForm);
      toast.success(res.msg || "Credentials saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save credentials");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      toast.success("Successfully logged in!");
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };

  // Profile Save
  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(profile);
      setProfile(updated);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  // Skill Handlers
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSkillEditing) {
        const updated = await updateSkill(skillForm.id, skillForm);
        setSkills(skills.map((s) => (s._id === skillForm.id ? updated : s)));
        toast.success("Skill updated!");
      } else {
        const added = await addSkill(skillForm);
        setSkills([...skills, added]);
        toast.success("Skill added!");
      }
      setSkillForm({ id: null, name: "", iconName: "FaHtml5", category: "frontend" });
      setIsSkillEditing(false);
    } catch (err) {
      toast.error("Failed to save skill");
    }
  };

  const startSkillEdit = (skill) => {
    setSkillForm({
      id: skill._id,
      name: skill.name,
      iconName: skill.iconName,
      category: skill.category,
    });
    setIsSkillEditing(true);
  };

  const handleSkillDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteSkill(id);
      setSkills(skills.filter((s) => s._id !== id));
      toast.success("Skill deleted");
    } catch (err) {
      toast.error("Failed to delete skill");
    }
  };

  // Experience Handlers
  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    const responsibilities = experienceForm.responsibilitiesStr
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const payload = {
      job: experienceForm.job,
      company: experienceForm.company,
      date: experienceForm.date,
      responsibilities,
    };

    try {
      if (isExperienceEditing) {
        const updated = await updateExperience(experienceForm.id, payload);
        setExperiences(experiences.map((exp) => (exp._id === experienceForm.id ? updated : exp)));
        toast.success("Experience updated!");
      } else {
        const added = await addExperience(payload);
        setExperiences([added, ...experiences]);
        toast.success("Experience added!");
      }
      setExperienceForm({ id: null, job: "", company: "", date: "", responsibilitiesStr: "" });
      setIsExperienceEditing(false);
    } catch (err) {
      toast.error("Failed to save experience");
    }
  };

  const startExperienceEdit = (exp) => {
    setExperienceForm({
      id: exp._id,
      job: exp.job,
      company: exp.company,
      date: exp.date,
      responsibilitiesStr: exp.responsibilities.join("\n"),
    });
    setIsExperienceEditing(true);
  };

  const handleExperienceDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter((exp) => exp._id !== id));
      toast.success("Experience deleted");
    } catch (err) {
      toast.error("Failed to delete experience");
    }
  };

  // Project Handlers
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isProjectEditing) {
        const updated = await updateProject(projectForm.id, projectForm);
        setProjects(projects.map((p) => (p._id === projectForm.id ? updated : p)));
        toast.success("Project updated!");
      } else {
        const added = await addProject(projectForm);
        setProjects([...projects, added]);
        toast.success("Project added!");
      }
      setProjectForm({ id: null, name: "", year: "", image: "", link: "", github: "", align: "left" });
      setIsProjectEditing(false);
    } catch (err) {
      toast.error("Failed to save project");
    }
  };

  const startProjectEdit = (proj) => {
    setProjectForm({
      id: proj._id,
      name: proj.name,
      year: proj.year,
      image: proj.image,
      link: proj.link || "",
      github: proj.github || "",
      align: proj.align || "left",
    });
    setIsProjectEditing(true);
  };

  const handleProjectDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  // Contact Message Handlers
  const handleMessageDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteMessage(id);
      setMessages(messages.filter((m) => m._id !== id));
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-darkBrown flex items-center justify-center text-white text-xl">
        Loading Admin System...
      </div>
    );
  }

  // --- LOGIN INTERFACE ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#030205] to-[#0d0b13] flex flex-col justify-center items-center p-4">
        <Link
          to="/"
          className="mb-8 flex items-center gap-2 text-cyan hover:text-white transition duration-300 font-bold"
        >
          <FaArrowLeft /> View Portfolio Site
        </Link>
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan/10 rounded-full blur-3xl"></div>

          <h2 className="text-3xl font-extrabold text-white text-center mb-2 uppercase tracking-widest">
            Portfolio <span className="text-orange">Admin</span>
          </h2>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Log in to manage your site configuration.
          </p>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition duration-300"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition duration-300"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-12 rounded-xl bg-orange hover:bg-orange/80 text-white font-bold text-lg transition duration-300 flex items-center justify-center cursor-pointer shadow-lg shadow-orange/20"
            >
              {loginLoading ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD INTERFACE ---
  return (
    <div className="min-h-screen bg-[#030205] text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-black/40 border-r border-white/5 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-8 text-center md:text-left">
            Admin <span className="text-orange">Control</span>
          </h2>

          <nav className="flex flex-col gap-2">
            {[
              { id: "profile", label: "Profile Info", icon: <FaUser /> },
              { id: "skills", label: "Manage Skills", icon: <FaTools /> },
              { id: "experience", label: "Experience", icon: <FaBriefcase /> },
              { id: "projects", label: "Projects", icon: <FaFolderOpen /> },
              { id: "keys", label: "Credentials", icon: <FaKey /> },
              { id: "messages", label: `Inbox (${messages.length})`, icon: <FaEnvelope /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-left cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-cyan text-[#030205] shadow-lg shadow-cyan/25"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 md:mt-0 flex flex-col gap-3">
          <Link
            to="/"
            target="_blank"
            className="w-full h-11 border border-white/10 rounded-xl hover:bg-white/5 flex items-center justify-center font-semibold text-sm transition"
          >
            Preview Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full h-11 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition cursor-pointer"
          >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold uppercase text-white">
              {activeTab === "profile" && "Profile Information"}
              {activeTab === "skills" && "Skills Inventory"}
              {activeTab === "experience" && "Work Experience"}
              {activeTab === "projects" && "Portfolio Projects"}
              {activeTab === "keys" && "API Credentials"}
              {activeTab === "messages" && "User Messages"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {activeTab === "profile" && "Manage your hero text, about details and roles."}
              {activeTab === "skills" && "Add, update, or remove skill badges."}
              {activeTab === "experience" && "Log your career timeline and responsibilities."}
              {activeTab === "projects" && "Upload, customize, and direct project links."}
              {activeTab === "keys" && "Manage Cloudinary and EmailJS encrypted keys."}
              {activeTab === "messages" && "Review client contact forms saved in database."}
            </p>
          </div>
        </header>

        {/* Tab Components */}

        {/* --- PROFILE TAB --- */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSave} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Display Name</label>
                <input
                  type="text"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Professional Role</label>
                <input
                  type="text"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Short Bio (Hero section)</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                rows="3"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">About Paragraph</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                rows="6"
                value={profile.about}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                required
              />
            </div>
            {/* Hero Image Upload */}
            <div className="mt-4">
              <label className="block text-gray-300 text-sm font-semibold mb-2">Hero Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
              />
              {profile.heroImage && (
                <img src={profile.heroImage} alt="Hero" className="mt-2 max-h-40 object-cover rounded" />
              )}
            </div>

            {/* CV Upload */}
            <div className="mt-4">
              <label className="block text-gray-300 text-sm font-semibold mb-2">Upload CV (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleCvUpload}
                disabled={cvUploading}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
              />
              {profile.cvUrl && (
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-cyan text-sm mt-2 block hover:underline">
                  View Current CV
                </a>
              )}
            </div>

            <button
              type="submit"
              className="h-12 bg-cyan text-[#030205] font-bold rounded-xl px-6 self-start hover:bg-cyan/80 transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan/15"
            >
              <FaSave /> Save Changes
            </button>
          </form>
        )}

        {/* --- SKILLS TAB --- */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="text-xl font-bold mb-6 text-orange flex items-center gap-2">
                {isSkillEditing ? <FaEdit /> : <FaPlus />} {isSkillEditing ? "Edit Skill" : "Add New Skill"}
              </h3>
              <form onSubmit={handleSkillSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Skill Name</label>
                  <input
                    type="text"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    placeholder="e.g. ReactJS"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Icon Representation</label>
                  <select
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    value={skillForm.iconName}
                    onChange={(e) => setSkillForm({ ...skillForm, iconName: e.target.value })}
                  >
                    {iconList.map((ic) => (
                      <option key={ic.val} value={ic.val} className="bg-[#030205]">
                        {ic.name} ({ic.val})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Category</label>
                  <select
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  >
                    <option value="frontend" className="bg-[#030205]">Frontend</option>
                    <option value="backend" className="bg-[#030205]">Backend</option>
                    <option value="tools" className="bg-[#030205]">Tools/Git</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-cyan text-[#110A05] font-bold rounded-xl hover:bg-cyan/80 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSkillEditing ? "Update" : "Add"}
                  </button>
                  {isSkillEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSkillEditing(false);
                        setSkillForm({ id: null, name: "", iconName: "FaHtml5", category: "frontend" });
                      }}
                      className="flex-1 h-11 border border-white/10 hover:bg-white/5 font-bold rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Current Badges</h3>
                <div className="flex flex-col gap-3">
                  {skills.length === 0 ? (
                    <p className="text-gray-400 text-sm">No skills found. Add some!</p>
                  ) : (
                    skills.map((skill) => (
                      <div
                        key={skill._id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
                      >
                        <div>
                          <span className="font-semibold text-lg">{skill.name}</span>
                          <span className="ml-3 text-xs bg-orange/20 text-orange border border-orange/30 px-2 py-0.5 rounded-full uppercase">
                            {skill.category}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startSkillEdit(skill)}
                            className="p-2 hover:bg-cyan/20 hover:text-cyan rounded-lg transition text-gray-400 cursor-pointer"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleSkillDelete(skill._id)}
                            className="p-2 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition text-gray-400 cursor-pointer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- EXPERIENCE TAB --- */}
        {activeTab === "experience" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit lg:col-span-1">
              <h3 className="text-xl font-bold mb-6 text-orange flex items-center gap-2">
                {isExperienceEditing ? <FaEdit /> : <FaPlus />} {isExperienceEditing ? "Edit Work" : "Add Experience"}
              </h3>
              <form onSubmit={handleExperienceSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Job Title</label>
                  <input
                    type="text"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    placeholder="e.g. Lead Developer"
                    value={experienceForm.job}
                    onChange={(e) => setExperienceForm({ ...experienceForm, job: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Company Name</label>
                  <input
                    type="text"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    placeholder="e.g. Acme Corp"
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Dates Duration</label>
                  <input
                    type="text"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    placeholder="e.g. 2022 - Present"
                    value={experienceForm.date}
                    onChange={(e) => setExperienceForm({ ...experienceForm, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Responsibilities (One per line)
                  </label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    placeholder="Implementing reusable components&#10;Working on performance of web apps"
                    rows="6"
                    value={experienceForm.responsibilitiesStr}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, responsibilitiesStr: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-cyan text-[#030205] font-bold rounded-xl hover:bg-cyan/80 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isExperienceEditing ? "Update" : "Add"}
                  </button>
                  {isExperienceEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsExperienceEditing(false);
                        setExperienceForm({ id: null, job: "", company: "", date: "", responsibilitiesStr: "" });
                      }}
                      className="flex-1 h-11 border border-white/10 hover:bg-white/5 font-bold rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Experience Timeline</h3>
                <div className="flex flex-col gap-4">
                  {experiences.length === 0 ? (
                    <p className="text-gray-400 text-sm">No work experience logged. Add one!</p>
                  ) : (
                    experiences.map((exp) => (
                      <div
                        key={exp._id}
                        className="p-5 bg-white/5 rounded-xl border border-white/5 flex justify-between items-start"
                      >
                        <div>
                          <h4 className="font-extrabold text-xl text-cyan">{exp.job}</h4>
                          <span className="text-gray-300 font-semibold">{exp.company}</span>
                          <span className="ml-3 text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">
                            {exp.date}
                          </span>
                          <ul className="list-disc list-inside mt-3 text-sm text-gray-400 space-y-1">
                            {exp.responsibilities.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startExperienceEdit(exp)}
                            className="p-2 hover:bg-cyan/20 hover:text-cyan rounded-lg transition text-gray-400 cursor-pointer"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleExperienceDelete(exp._id)}
                            className="p-2 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition text-gray-400 cursor-pointer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PROJECTS TAB --- */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="text-xl font-bold mb-6 text-orange flex items-center gap-2">
                {isProjectEditing ? <FaEdit /> : <FaPlus />} {isProjectEditing ? "Edit Project" : "Add Project"}
              </h3>
              <form onSubmit={handleProjectSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Project Name</label>
                  <input
                    type="text"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    placeholder="e.g. Brainwave"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Project Date / Year</label>
                  <input
                    type="text"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    placeholder="e.g. Feb 2025"
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Image (URL or Upload File)</label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                      placeholder="Image URL (populated automatically on upload)"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      required
                    />
                    <div className="relative border-2 border-dashed border-white/10 hover:border-cyan/30 rounded-xl p-4 bg-white/0 flex flex-col items-center justify-center cursor-pointer transition duration-300 group">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      <span className="text-sm font-semibold text-gray-400 group-hover:text-cyan transition duration-300">
                        {uploading ? "Uploading image..." : "Click or Drag to Upload Image File"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Live Demo Link</label>
                  <input
                    type="text"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    placeholder="e.g. https://domain.app"
                    value={projectForm.link}
                    onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">GitHub Repository Link</label>
                  <input
                    type="text"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    placeholder="e.g. https://github.com/siyam-io/repo"
                    value={projectForm.github}
                    onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Layout Alignment</label>
                  <select
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                    value={projectForm.align}
                    onChange={(e) => setProjectForm({ ...projectForm, align: e.target.value })}
                  >
                    <option value="left" className="bg-[#030205]">Left</option>
                    <option value="right" className="bg-[#030205]">Right</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-cyan text-[#030205] font-bold rounded-xl hover:bg-cyan/80 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProjectEditing ? "Update" : "Add"}
                  </button>
                  {isProjectEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProjectEditing(false);
                        setProjectForm({ id: null, name: "", year: "", image: "", link: "", github: "", align: "left" });
                      }}
                      className="flex-1 h-11 border border-white/10 hover:bg-white/5 font-bold rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Showcased Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.length === 0 ? (
                    <p className="text-gray-400 text-sm md:col-span-2">No projects showcased yet. Create one!</p>
                  ) : (
                    projects.map((proj) => (
                      <div
                        key={proj._id}
                        className="bg-white/5 rounded-xl border border-white/5 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="p-4">
                          <h4 className="font-extrabold text-lg text-cyan">{proj.name}</h4>
                          <p className="text-xs text-gray-400 mt-1">Year: {proj.year}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate">Image: {proj.image}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate">Live: {proj.link}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate">GitHub: {proj.github}</p>
                          <p className="text-xs text-gray-400 mt-1">Align: {proj.align}</p>
                        </div>
                        <div className="flex border-t border-white/5">
                          <button
                            onClick={() => startProjectEdit(proj)}
                            className="flex-1 py-3 text-sm text-gray-400 hover:bg-cyan/10 hover:text-cyan border-r border-white/5 transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleProjectDelete(proj._id)}
                            className="flex-1 py-3 text-sm text-gray-400 hover:bg-red-600/10 hover:text-red-400 transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CREDENTIALS KEYS TAB --- */}
        {activeTab === "keys" && (
          <form onSubmit={handleKeysSave} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-xl font-bold text-cyan">Cloudinary Configuration</h3>
              <p className="text-xs text-slate-400 mt-1">Used for storing project images in the cloud.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Cloud Name</label>
                <input
                  type="text"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                  value={keysForm.CLOUDINARY_CLOUD_NAME || ""}
                  onChange={(e) => setKeysForm({ ...keysForm, CLOUDINARY_CLOUD_NAME: e.target.value })}
                  placeholder="Cloud Name"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">API Key</label>
                <input
                  type="text"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                  value={keysForm.CLOUDINARY_API_KEY || ""}
                  onChange={(e) => setKeysForm({ ...keysForm, CLOUDINARY_API_KEY: e.target.value })}
                  placeholder="API Key"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">API Secret</label>
                <input
                  type="password"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                  value={keysForm.CLOUDINARY_API_SECRET || ""}
                  onChange={(e) => setKeysForm({ ...keysForm, CLOUDINARY_API_SECRET: e.target.value })}
                  placeholder="API Secret"
                />
              </div>
            </div>

            <div className="border-b border-white/5 pb-4 mt-4">
              <h3 className="text-xl font-bold text-orange">EmailJS Configuration</h3>
              <p className="text-xs text-slate-400 mt-1">Used for sending contact notifications directly from the client.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Service Key</label>
                <input
                  type="text"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                  value={keysForm.VITE_SERVICE_KEY || ""}
                  onChange={(e) => setKeysForm({ ...keysForm, VITE_SERVICE_KEY: e.target.value })}
                  placeholder="Service Key"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Template Key</label>
                <input
                  type="text"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                  value={keysForm.VITE_TEMPLATE_KEY || ""}
                  onChange={(e) => setKeysForm({ ...keysForm, VITE_TEMPLATE_KEY: e.target.value })}
                  placeholder="Template Key"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Public Key</label>
                <input
                  type="text"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                  value={keysForm.VITE_PUBLIC_KEY || ""}
                  onChange={(e) => setKeysForm({ ...keysForm, VITE_PUBLIC_KEY: e.target.value })}
                  placeholder="Public Key"
                />
              </div>
            </div>

            <div className="border-b border-white/5 pb-4 mt-4">
              <h3 className="text-xl font-bold text-emerald-400">Database Configuration</h3>
              <p className="text-xs text-slate-400 mt-1">Used for connecting the backend server to MongoDB.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">MongoDB Connection URI</label>
                <input
                  type="text"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-cyan transition duration-300"
                  value={keysForm.MONGODB_URI || ""}
                  onChange={(e) => setKeysForm({ ...keysForm, MONGODB_URI: e.target.value })}
                  placeholder="mongodb://127.0.0.1:27017/portfolio"
                />
              </div>
            </div>

            <button
              type="submit"
              className="h-12 bg-cyan text-[#030205] font-bold rounded-xl px-6 self-start hover:bg-cyan/80 transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan/15 mt-4"
            >
              <FaSave /> Save Credentials
            </button>
          </form>
        )}

        {/* --- INBOX MESSAGES TAB --- */}
        {activeTab === "messages" && (
          <div className="flex flex-col gap-6">
            {messages.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
                No submissions received. Your inbox is clean!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
                >
                  <button
                    onClick={() => handleMessageDelete(msg._id)}
                    className="absolute top-4 right-4 p-3 bg-red-600/15 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-xl transition cursor-pointer"
                    title="Delete Message"
                  >
                    <FaTrash />
                  </button>

                  <div className="flex flex-col gap-1 md:w-[85%]">
                    <h3 className="font-extrabold text-xl text-white">{msg.from_name}</h3>
                    <a
                      href={`mailto:${msg.from_email}`}
                      className="text-cyan text-sm hover:underline font-semibold"
                    >
                      {msg.from_email}
                    </a>
                    <span className="text-xs text-gray-400 mt-1">
                      Received: {new Date(msg.createdAt).toLocaleString()}
                    </span>
                    <p className="mt-4 text-gray-300 whitespace-pre-wrap bg-black/25 p-4 rounded-xl border border-white/5 text-sm leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
