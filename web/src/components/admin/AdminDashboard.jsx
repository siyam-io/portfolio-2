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
  getGithubRepos,
} from "../../api";

import {
  FaUser, FaTools, FaBriefcase, FaFolderOpen, FaEnvelope,
  FaSignOutAlt, FaPlus, FaTrash, FaEdit, FaSave, FaArrowLeft,
  FaKey, FaGithub, FaExternalLinkAlt, FaSearch, FaTimes,
  FaChevronLeft, FaChevronRight, FaEye, FaStar, FaCode,
  FaProjectDiagram, FaCog, FaHome, FaHandshake
} from "react-icons/fa";

/* ───────────────────────── Reusable Components ───────────────────────── */

const Card = ({ children, className = "" }) => (
  <div className={`bg-[#0d0d14]/80 backdrop-blur-sm border border-[#C9A84C]/10 rounded-xl ${className}`}>
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-[#8b8fa3] text-xs font-medium mb-1.5 uppercase tracking-wider">{label}</label>}
    <input
      className="w-full h-10 bg-[#0a0a12] border border-[#C9A84C]/15 rounded-lg px-3.5 text-sm text-[#e8e6e3] placeholder-[#3d3f4e] focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/20 transition-all duration-200"
      {...props}
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-[#8b8fa3] text-xs font-medium mb-1.5 uppercase tracking-wider">{label}</label>}
    <textarea
      className="w-full bg-[#0a0a12] border border-[#C9A84C]/15 rounded-lg p-3.5 text-sm text-[#e8e6e3] placeholder-[#3d3f4e] focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/20 transition-all duration-200 resize-none"
      {...props}
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    {label && <label className="block text-[#8b8fa3] text-xs font-medium mb-1.5 uppercase tracking-wider">{label}</label>}
    <select
      className="w-full h-10 bg-[#0a0a12] border border-[#C9A84C]/15 rounded-lg px-3.5 text-sm text-[#e8e6e3] focus:outline-none focus:border-[#C9A84C]/50 transition-all duration-200 appearance-none"
      {...props}
    >
      {children}
    </select>
  </div>
);

const BtnPrimary = ({ children, ...props }) => (
  <button
    className="h-10 bg-[#C9A84C] hover:bg-[#d4b65e] text-[#0a0a12] font-semibold rounded-lg px-5 text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#C9A84C]/10 hover:shadow-[#C9A84C]/20"
    {...props}
  >
    {children}
  </button>
);

const BtnSecondary = ({ children, ...props }) => (
  <button
    className="h-10 border border-[#C9A84C]/20 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 text-[#8b8fa3] hover:text-[#e8e6e3] rounded-lg px-5 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
    {...props}
  >
    {children}
  </button>
);

const BtnDanger = ({ children, ...props }) => (
  <button
    className="p-2 hover:bg-red-500/10 text-[#4a4e5e] hover:text-red-400 rounded-lg transition-all duration-200 cursor-pointer"
    {...props}
  >
    {children}
  </button>
);

const BtnIcon = ({ children, active, ...props }) => (
  <button
    className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
      active ? "bg-[#C9A84C]/15 text-[#C9A84C]" : "text-[#4a4e5e] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
    }`}
    {...props}
  >
    {children}
  </button>
);

const Badge = ({ children, variant = "default" }) => {
  const colors = {
    default: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${colors[variant]}`}>
      {children}
    </span>
  );
};

const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/5 border border-[#C9A84C]/10 flex items-center justify-center mb-4">
      <Icon className="text-[#C9A84C]/40 text-xl" />
    </div>
    <p className="text-[#e8e6e3] font-medium text-sm">{title}</p>
    <p className="text-[#4a4e5e] text-xs mt-1">{subtitle}</p>
  </div>
);

const Pagination = ({ page, setPage, total, perPage }) => {
  const totalPages = Math.ceil(total / perPage) || 1;
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#C9A84C]/5">
      <button
        onClick={() => setPage(p => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="flex items-center gap-1.5 text-xs font-medium text-[#8b8fa3] hover:text-[#C9A84C] disabled:opacity-30 disabled:hover:text-[#8b8fa3] transition cursor-pointer"
      >
        <FaChevronLeft className="text-[10px]" /> Prev
      </button>
      <span className="text-[11px] text-[#4a4e5e]">{page} / {totalPages}</span>
      <button
        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
        disabled={page >= totalPages}
        className="flex items-center gap-1.5 text-xs font-medium text-[#8b8fa3] hover:text-[#C9A84C] disabled:opacity-30 disabled:hover:text-[#8b8fa3] transition cursor-pointer"
      >
        Next <FaChevronRight className="text-[10px]" />
      </button>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color = "gold" }) => {
  const colors = {
    gold: "from-[#C9A84C]/20 to-transparent border-[#C9A84C]/15 text-[#C9A84C]",
    blue: "from-blue-500/20 to-transparent border-blue-500/15 text-blue-400",
    green: "from-emerald-500/20 to-transparent border-emerald-500/15 text-emerald-400",
    purple: "from-purple-500/20 to-transparent border-purple-500/15 text-purple-400",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4 flex items-center gap-3`}>
      <div className="w-10 h-10 rounded-lg bg-[#0a0a12]/60 flex items-center justify-center flex-shrink-0">
        <Icon className="text-lg" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#e8e6e3] leading-none">{value}</p>
        <p className="text-[11px] text-[#8b8fa3] mt-0.5">{label}</p>
      </div>
    </div>
  );
};

/* ───────────────────────── Main Component ───────────────────────── */

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);

  // Login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Data states
  const [profile, setProfile] = useState({ name: "", role: "", bio: "", about: "", heroImage: "", cvUrl: "", github: "", linkedin: "", whatsapp: "", email: "" });
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [messages, setMessages] = useState([]);

  // Pagination
  const [projectPage, setProjectPage] = useState(1);
  const [projectTab, setProjectTab] = useState("Featured");
  const [servicePage, setServicePage] = useState(1);
  const [skillPage, setSkillPage] = useState(1);
  const [expPage, setExpPage] = useState(1);
  const [msgPage, setMsgPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProjects = projects.filter(p => {
    if (projectTab === "Featured") return !p.category || p.category === "Featured";
    if (projectTab === "MoreProjects") return p.category === "MoreProjects" || p.category === "Minor";
    if (projectTab === "OpenSource") return p.category === "OpenSource";
    return true;
  });
  const paginatedProjects = filteredProjects.slice((projectPage - 1) * itemsPerPage, projectPage * itemsPerPage);
  const paginatedSkills = skills.slice((skillPage - 1) * itemsPerPage, skillPage * itemsPerPage);
  const paginatedExperiences = experiences.slice((expPage - 1) * itemsPerPage, expPage * itemsPerPage);
  const paginatedServices = services.slice((servicePage - 1) * itemsPerPage, servicePage * itemsPerPage);
  const paginatedMessages = messages.slice((msgPage - 1) * itemsPerPage, msgPage * itemsPerPage);

  // Credentials
  const [keysForm, setKeysForm] = useState({
    CLOUDINARY_CLOUD_NAME: "", CLOUDINARY_API_KEY: "", CLOUDINARY_API_SECRET: "",
    VITE_SERVICE_KEY: "", VITE_TEMPLATE_KEY: "", VITE_PUBLIC_KEY: "", MONGODB_URI: "", GITHUB_PAT: "",
  });

  // Form states
  const [skillForm, setSkillForm] = useState({ id: null, name: "", iconName: "FaHtml5", category: "frontend" });
  const [isSkillEditing, setIsSkillEditing] = useState(false);
  const [experienceForm, setExperienceForm] = useState({ id: null, job: "", company: "", date: "", responsibilitiesStr: "" });
  const [isExperienceEditing, setIsExperienceEditing] = useState(false);
  const [projectForm, setProjectForm] = useState({ id: null, name: "", year: "", link: "", github: "", description: "", category: "Featured" });
  const [isProjectEditing, setIsProjectEditing] = useState(false);
  const [serviceForm, setServiceForm] = useState({ id: null, title: "", description: "", iconSvg: "" });
  const [isServiceEditing, setIsServiceEditing] = useState(false);

  // GitHub
  const [githubRepos, setGithubRepos] = useState([]);
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [repoSearch, setRepoSearch] = useState("");

  const iconList = [
    { name: "HTML", val: "FaHtml5" }, { name: "CSS", val: "FaCss3Alt" },
    { name: "TailwindCSS", val: "RiTailwindCssFill" }, { name: "JavaScript", val: "IoLogoJavascript" },
    { name: "React", val: "FaReact" }, { name: "Redux", val: "SiRedux" },
    { name: "NodeJS", val: "FaNodeJs" }, { name: "Express", val: "SiExpress" },
    { name: "MongoDB", val: "SiMongodb" }, { name: "NextJS", val: "SiNextdotjs" },
    { name: "TypeScript", val: "SiTypescript" }, { name: "Git", val: "FaGitAlt" },
    { name: "GitHub", val: "FaGithub" }, { name: "Docker", val: "FaDocker" },
  ];

  /* ── Auth & Data Fetching ── */
  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setAuthLoading(false); return; }
    try {
      const data = await verifyToken();
      if (data.valid) { setIsLoggedIn(true); fetchDashboardData(); }
    } catch { localStorage.removeItem("token"); }
    finally { setAuthLoading(false); }
  };

  const fetchDashboardData = async () => {
    try {
      const [profData, skillsData, expData, projData, servicesData, msgData, keysData] = await Promise.all([
        getProfile(), getSkills(), getExperiences(), getProjects(), getServices(), getMessages(), getKeys(),
      ]);
      setProfile(profData); setSkills(skillsData); setExperiences(expData);
      setProjects(projData); setServices(servicesData || []); setMessages(msgData); if (keysData) setKeysForm(keysData);
    } catch (err) { console.error("Error fetching data", err); toast.error("Failed to load dashboard data"); }
  };

  /* ── Handlers ── */
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); setLoginLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token); setIsLoggedIn(true);
      toast.success("Welcome back!"); fetchDashboardData();
    } catch (err) { toast.error(err.response?.data?.msg || "Login failed"); }
    finally { setLoginLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); setIsLoggedIn(false); toast.success("Logged out"); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return; setUploading(true);
    try { const data = await uploadImage(file); if (data.success) { setProfile(prev => ({ ...prev, heroImage: data.url })); toast.success("Image uploaded!"); } }
    catch { toast.error("Failed to upload image"); } finally { setUploading(false); }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return; setCvUploading(true);
    try {
      const data = await uploadCV(file);
      if (data.success) {
        setProfile(prev => ({ ...prev, cvUrl: data.url }));
        toast.success("CV uploaded & saved to database!");
        const updated = await getProfile();
        if (updated) setProfile(updated);
      }
    }
    catch (err) {
      console.error(err);
      toast.error("Failed to upload CV");
    } finally {
      setCvUploading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try { const updated = await updateProfile(profile); setProfile(updated); toast.success("Profile saved!"); }
    catch { toast.error("Failed to update profile"); }
  };

  const handleKeysSave = async (e) => {
    e.preventDefault();
    try { const res = await saveKeys(keysForm); toast.success(res.msg || "Credentials saved!"); }
    catch { toast.error("Failed to save credentials"); }
  };

  // Skills
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSkillEditing) { const u = await updateSkill(skillForm.id, skillForm); setSkills(skills.map(s => s._id === skillForm.id ? u : s)); toast.success("Skill updated!"); }
      else { const a = await addSkill(skillForm); setSkills([...skills, a]); toast.success("Skill added!"); }
      setSkillForm({ id: null, name: "", iconName: "FaHtml5", category: "frontend" }); setIsSkillEditing(false);
    } catch { toast.error("Failed to save skill"); }
  };
  const startSkillEdit = (s) => { setSkillForm({ id: s._id, name: s.name, iconName: s.iconName, category: s.category }); setIsSkillEditing(true); };
  const handleSkillDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try { await deleteSkill(id); setSkills(skills.filter(s => s._id !== id)); toast.success("Skill deleted"); } catch { toast.error("Failed"); }
  };

  // Experience
  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    const responsibilities = experienceForm.responsibilitiesStr.split("\n").map(r => r.trim()).filter(r => r.length > 0);
    const payload = { job: experienceForm.job, company: experienceForm.company, date: experienceForm.date, responsibilities };
    try {
      if (isExperienceEditing) { const u = await updateExperience(experienceForm.id, payload); setExperiences(experiences.map(exp => exp._id === experienceForm.id ? u : exp)); toast.success("Experience updated!"); }
      else { const a = await addExperience(payload); setExperiences([a, ...experiences]); toast.success("Experience added!"); }
      setExperienceForm({ id: null, job: "", company: "", date: "", responsibilitiesStr: "" }); setIsExperienceEditing(false);
    } catch { toast.error("Failed to save experience"); }
  };
  const startExperienceEdit = (exp) => { setExperienceForm({ id: exp._id, job: exp.job, company: exp.company, date: exp.date, responsibilitiesStr: exp.responsibilities.join("\n") }); setIsExperienceEditing(true); };
  const handleExperienceDelete = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    try { await deleteExperience(id); setExperiences(experiences.filter(exp => exp._id !== id)); toast.success("Deleted"); } catch { toast.error("Failed"); }
  };

  // Projects
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isProjectEditing) { const u = await updateProject(projectForm.id, projectForm); setProjects(projects.map(p => p._id === projectForm.id ? u : p)); toast.success("Project updated!"); }
      else { const a = await addProject(projectForm); setProjects([...projects, a]); toast.success("Project added!"); }
      setProjectForm({ id: null, name: "", year: "", link: "", github: "", description: "", category: "Featured" }); setIsProjectEditing(false);
    } catch { toast.error("Failed to save project"); }
  };
  const startProjectEdit = (proj) => { setProjectForm({ id: proj._id, name: proj.name, year: proj.year, link: proj.link || "", github: proj.github || "", description: proj.description || "", category: proj.category || "Featured" }); setIsProjectEditing(true); };
  const handleProjectDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try { await deleteProject(id); setProjects(projects.filter(p => p._id !== id)); toast.success("Deleted"); } catch { toast.error("Failed"); }
  };

  // GitHub Sync
  const fetchGithubRepos = async () => {
    if (!profile.github) { toast.error("Add your GitHub URL in Profile first."); return; }
    const ghUsername = profile.github.split('/').filter(Boolean).pop();
    if (!ghUsername) { toast.error("Invalid GitHub URL."); return; }
    setFetchingRepos(true); setShowGithubModal(true); setRepoSearch("");
    try {
      const data = await getGithubRepos(ghUsername);
      if (Array.isArray(data)) setGithubRepos(data); else toast.error("Failed to fetch repos.");
    } catch (err) {
      console.error("fetchGithubRepos Error:", err);
      if (err.response?.status === 403) toast.error("GitHub rate limit. Add a PAT in Credentials.");
      else if (err.response?.data?.msg) toast.error(`GitHub: ${err.response.data.msg}`);
      else toast.error(`Error: ${err.message || String(err)}`);
    } finally { setFetchingRepos(false); }
  };

  const pinRepoToPortfolio = (repo) => {
    setProjectForm({ id: null, name: repo.name, year: new Date(repo.updated_at).getFullYear().toString(), link: repo.homepage || "", github: repo.html_url, description: repo.description || "", category: "OpenSource" });
    setIsProjectEditing(false); setShowGithubModal(false);
    toast.success("Repo loaded into form. Hit Add to save.");
  };

  // Services
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isServiceEditing) {
        const u = await updateService(serviceForm.id, serviceForm);
        setServices(services.map(s => s._id === serviceForm.id ? u : s));
        toast.success("Service updated!");
      } else {
        const a = await addService(serviceForm);
        setServices([...services, a]);
        toast.success("Service added!");
      }
      setServiceForm({ id: null, title: "", description: "", iconSvg: "" });
      setIsServiceEditing(false);
    } catch {
      toast.error("Failed to save service");
    }
  };

  const startServiceEdit = (s) => {
    setServiceForm({ id: s._id, title: s.title, description: s.description, iconSvg: s.iconSvg || "" });
    setIsServiceEditing(true);
  };

  const handleServiceDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      setServices(services.filter(s => s._id !== id));
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  // Messages
  const handleMessageDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try { await deleteMessage(id); setMessages(messages.filter(m => m._id !== id)); toast.success("Deleted"); } catch { toast.error("Failed"); }
  };

  /* ── Loading State ── */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#06060c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
          <span className="text-[#8b8fa3] text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  /* ── Login Page ── */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#06060c] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A84C]/5 via-transparent to-transparent" />
        <div className="relative w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 text-[#8b8fa3] hover:text-[#C9A84C] text-sm font-medium mb-6 transition">
            <FaArrowLeft className="text-xs" /> Back to site
          </Link>
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                  <path d="M 50 15 L 80 32.5 L 50 50 L 20 67.5 L 50 85" stroke="#C9A84C" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#e8e6e3]">Welcome back</h2>
              <p className="text-[#4a4e5e] text-sm mt-1">Sign in to your admin panel</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <Input label="Username" type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} required />
              <Input label="Password" type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required />
              <BtnPrimary type="submit" disabled={loginLoading} style={{ width: "100%", marginTop: "8px" }}>
                {loginLoading ? "Verifying..." : "Sign In"}
              </BtnPrimary>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  /* ── Navigation Items ── */
  const navItems = [
    { id: "overview", label: "Overview", icon: FaHome },
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "skills", label: "Skills", icon: FaTools },
    { id: "experience", label: "Experience", icon: FaBriefcase },
    { id: "projects", label: "Projects", icon: FaFolderOpen },
    { id: "services", label: "Services", icon: FaHandshake },
    { id: "keys", label: "Credentials", icon: FaKey },
    { id: "messages", label: "Inbox", icon: FaEnvelope, count: messages.length },
  ];

  const categoryLabels = { Featured: "Work That Matters", MoreProjects: "More Projects", OpenSource: "On GitHub" };

  /* ── Dashboard ── */
  return (
    <div className="min-h-screen bg-[#06060c] text-[#e8e6e3] flex">

      {/* ── Sidebar ── */}
      <aside className={`${sidebarCollapsed ? "w-16" : "w-60"} bg-[#0a0a12] border-r border-[#C9A84C]/8 flex flex-col transition-all duration-300 flex-shrink-0 sticky top-0 h-screen`}>
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-[#C9A84C]/8">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <path d="M 50 15 L 80 32.5 L 50 50 L 20 67.5 L 50 85" stroke="#e8e6e3" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
                <path d="M 50 15 L 20 32.5" stroke="#C9A84C" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
                <path d="M 50 85 L 80 67.5" stroke="#C9A84C" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
              </svg>
              <span className="font-bold text-sm tracking-tight">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                activeTab === item.id
                  ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                  : "text-[#5a5e70] hover:text-[#8b8fa3] hover:bg-[#0d0d14]"
              }`}
              title={item.label}
            >
              <item.icon className="text-sm flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count > 0 && (
                    <span className="text-[10px] bg-[#C9A84C]/15 text-[#C9A84C] px-1.5 py-0.5 rounded-full font-bold">{item.count}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-[#C9A84C]/8 flex flex-col gap-1">
          <Link to="/" target="_blank" className="w-full flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] font-medium text-[#5a5e70] hover:text-[#8b8fa3] hover:bg-[#0d0d14] transition cursor-pointer">
            <FaEye className="text-sm flex-shrink-0" />
            {!sidebarCollapsed && <span>Preview Site</span>}
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition cursor-pointer">
            <FaSignOutAlt className="text-sm flex-shrink-0" />
            {!sidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-14 border-b border-[#C9A84C]/8 flex items-center justify-between px-6 sticky top-0 bg-[#06060c]/95 backdrop-blur-sm z-10">
          <h1 className="text-sm font-semibold text-[#e8e6e3]">
            {navItems.find(n => n.id === activeTab)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#4a4e5e]">{profile.name || "Admin"}</span>
            <div className="w-7 h-7 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] text-xs font-bold">
              {(profile.name || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-6 max-w-5xl">

          {/* ════════════ OVERVIEW ════════════ */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Welcome back, {profile.name?.split(" ")[0] || "Admin"} 👋</h2>
                <p className="text-[#4a4e5e] text-sm">Here's a quick overview of your portfolio.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <StatCard icon={FaFolderOpen} label="Total Projects" value={projects.length} color="gold" />
                <StatCard icon={FaHandshake} label="Services" value={services.length} color="gold" />
                <StatCard icon={FaTools} label="Skills" value={skills.length} color="blue" />
                <StatCard icon={FaBriefcase} label="Experiences" value={experiences.length} color="green" />
                <StatCard icon={FaEnvelope} label="Messages" value={messages.length} color="purple" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaStar className="text-[#C9A84C] text-xs" />
                    <span className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider">Featured</span>
                  </div>
                  <p className="text-2xl font-bold">{projects.filter(p => !p.category || p.category === "Featured").length}</p>
                  <p className="text-[11px] text-[#4a4e5e] mt-0.5">Work That Matters</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaProjectDiagram className="text-blue-400 text-xs" />
                    <span className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider">More Work</span>
                  </div>
                  <p className="text-2xl font-bold">{projects.filter(p => p.category === "MoreProjects" || p.category === "Minor").length}</p>
                  <p className="text-[11px] text-[#4a4e5e] mt-0.5">More Projects</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaGithub className="text-emerald-400 text-xs" />
                    <span className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider">Open Source</span>
                  </div>
                  <p className="text-2xl font-bold">{projects.filter(p => p.category === "OpenSource").length}</p>
                  <p className="text-[11px] text-[#4a4e5e] mt-0.5">On GitHub</p>
                </Card>
              </div>

              {/* Quick actions */}
              <Card className="p-4">
                <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider mb-3">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  <BtnPrimary onClick={() => setActiveTab("projects")}><FaPlus className="text-xs" /> Add Project</BtnPrimary>
                  <BtnSecondary onClick={() => setActiveTab("services")}><FaHandshake className="text-xs" /> Manage Services</BtnSecondary>
                  <BtnSecondary onClick={() => setActiveTab("skills")}><FaTools className="text-xs" /> Manage Skills</BtnSecondary>
                  <BtnSecondary onClick={() => setActiveTab("profile")}><FaUser className="text-xs" /> Edit Profile</BtnSecondary>
                  <BtnSecondary onClick={() => setActiveTab("messages")}><FaEnvelope className="text-xs" /> View Inbox</BtnSecondary>
                </div>
              </Card>
            </div>
          )}

          {/* ════════════ PROFILE ════════════ */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
              <Card className="p-5">
                <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider mb-4">Basic Info</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Display Name" type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
                  <Input label="Professional Role" type="text" value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} required />
                </div>
              </Card>

              <Card className="p-5">
                <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider mb-4">Bio & About</p>
                <div className="flex flex-col gap-4">
                  <Textarea label="Short Bio (Hero section)" rows="3" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} required />
                  <Textarea label="About Paragraph" rows="5" value={profile.about} onChange={e => setProfile({ ...profile, about: e.target.value })} required />
                </div>
              </Card>

              <Card className="p-5">
                <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider mb-4">Media</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8b8fa3] text-xs font-medium mb-1.5 uppercase tracking-wider">Hero Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
                      className="w-full text-sm text-[#4a4e5e] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C9A84C]/10 file:text-[#C9A84C] hover:file:bg-[#C9A84C]/20 file:cursor-pointer"
                    />
                    {profile.heroImage && <img src={profile.heroImage} alt="Hero" className="mt-3 max-h-32 object-cover rounded-lg border border-[#C9A84C]/10" />}
                  </div>
                  <div>
                    <label className="block text-[#8b8fa3] text-xs font-medium mb-1.5 uppercase tracking-wider">Upload CV (PDF)</label>
                    <input type="file" accept="application/pdf" onChange={handleCvUpload} disabled={cvUploading}
                      className="w-full text-sm text-[#4a4e5e] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C9A84C]/10 file:text-[#C9A84C] hover:file:bg-[#C9A84C]/20 file:cursor-pointer"
                    />
                    {cvUploading && <p className="text-xs text-[#C9A84C] mt-2 animate-pulse">Uploading and saving to database...</p>}
                    {profile.cvUrl && (
                      <div className="mt-3 flex items-center gap-3">
                        <a 
                          href="/api/portfolio/cv" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          download="Esthyak_Ahmmed_Siyam_CV.pdf"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-medium rounded-lg transition"
                        >
                          <FaExternalLinkAlt className="text-[10px]" /> Download / Test Current CV
                        </a>
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1">✓ Active in Database</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider mb-4">Social & Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="GitHub URL" type="url" value={profile.github} onChange={e => setProfile({ ...profile, github: e.target.value })} placeholder="https://github.com/username" />
                  <Input label="LinkedIn URL" type="url" value={profile.linkedin} onChange={e => setProfile({ ...profile, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
                  <Input label="WhatsApp (with country code)" type="text" value={profile.whatsapp} onChange={e => setProfile({ ...profile, whatsapp: e.target.value })} placeholder="8801540115290" />
                  <Input label="Contact Email" type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} placeholder="you@example.com" />
                </div>
              </Card>

              <BtnPrimary type="submit"><FaSave /> Save Changes</BtnPrimary>
            </form>
          )}

          {/* ════════════ SKILLS ════════════ */}
          {activeTab === "skills" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Card className="p-5 h-fit">
                <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider mb-4 flex items-center gap-2">
                  {isSkillEditing ? <><FaEdit className="text-[#C9A84C]" /> Edit Skill</> : <><FaPlus className="text-[#C9A84C]" /> Add Skill</>}
                </p>
                <form onSubmit={handleSkillSubmit} className="flex flex-col gap-3">
                  <Input label="Skill Name" type="text" placeholder="e.g. ReactJS" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} required />
                  <Select label="Icon" value={skillForm.iconName} onChange={e => setSkillForm({ ...skillForm, iconName: e.target.value })}>
                    {iconList.map(ic => <option key={ic.val} value={ic.val}>{ic.name}</option>)}
                  </Select>
                  <Select label="Category" value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })}>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="tools">Tools / Git</option>
                  </Select>
                  <div className="flex gap-2 mt-1">
                    <BtnPrimary type="submit" style={{ flex: 1 }}>{isSkillEditing ? "Update" : "Add"}</BtnPrimary>
                    {isSkillEditing && <BtnSecondary type="button" onClick={() => { setIsSkillEditing(false); setSkillForm({ id: null, name: "", iconName: "FaHtml5", category: "frontend" }); }}>Cancel</BtnSecondary>}
                  </div>
                </form>
              </Card>

              <div className="lg:col-span-2">
                <Card className="p-5">
                  <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider mb-4">All Skills ({skills.length})</p>
                  {skills.length === 0 ? <EmptyState icon={FaTools} title="No skills yet" subtitle="Add your first skill badge" /> : (
                    <div className="flex flex-col gap-2">
                      {paginatedSkills.map(skill => (
                        <div key={skill._id} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a12]/60 border border-[#C9A84C]/5 hover:border-[#C9A84C]/15 transition group">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">{skill.name}</span>
                            <Badge>{skill.category}</Badge>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                            <BtnIcon onClick={() => startSkillEdit(skill)}><FaEdit className="text-xs" /></BtnIcon>
                            <BtnDanger onClick={() => handleSkillDelete(skill._id)}><FaTrash className="text-xs" /></BtnDanger>
                          </div>
                        </div>
                      ))}
                      <Pagination page={skillPage} setPage={setSkillPage} total={skills.length} perPage={itemsPerPage} />
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* ════════════ EXPERIENCE ════════════ */}
          {activeTab === "experience" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Card className="p-5 h-fit">
                <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider mb-4 flex items-center gap-2">
                  {isExperienceEditing ? <><FaEdit className="text-[#C9A84C]" /> Edit</> : <><FaPlus className="text-[#C9A84C]" /> Add Experience</>}
                </p>
                <form onSubmit={handleExperienceSubmit} className="flex flex-col gap-3">
                  <Input label="Job Title" type="text" placeholder="e.g. Lead Developer" value={experienceForm.job} onChange={e => setExperienceForm({ ...experienceForm, job: e.target.value })} required />
                  <Input label="Company" type="text" placeholder="e.g. Acme Corp" value={experienceForm.company} onChange={e => setExperienceForm({ ...experienceForm, company: e.target.value })} required />
                  <Input label="Duration" type="text" placeholder="e.g. 2022 - Present" value={experienceForm.date} onChange={e => setExperienceForm({ ...experienceForm, date: e.target.value })} required />
                  <Textarea label="Responsibilities (one per line)" placeholder={"Built reusable components\nOptimized API performance"} rows="5" value={experienceForm.responsibilitiesStr} onChange={e => setExperienceForm({ ...experienceForm, responsibilitiesStr: e.target.value })} required />
                  <div className="flex gap-2 mt-1">
                    <BtnPrimary type="submit" style={{ flex: 1 }}>{isExperienceEditing ? "Update" : "Add"}</BtnPrimary>
                    {isExperienceEditing && <BtnSecondary type="button" onClick={() => { setIsExperienceEditing(false); setExperienceForm({ id: null, job: "", company: "", date: "", responsibilitiesStr: "" }); }}>Cancel</BtnSecondary>}
                  </div>
                </form>
              </Card>

              <div className="lg:col-span-2">
                <Card className="p-5">
                  <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider mb-4">Timeline ({experiences.length})</p>
                  {experiences.length === 0 ? <EmptyState icon={FaBriefcase} title="No experience" subtitle="Add your work history" /> : (
                    <div className="flex flex-col gap-3">
                      {paginatedExperiences.map(exp => (
                        <div key={exp._id} className="p-4 rounded-lg bg-[#0a0a12]/60 border border-[#C9A84C]/5 hover:border-[#C9A84C]/15 transition group">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-sm text-[#C9A84C]">{exp.job}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-[#8b8fa3]">{exp.company}</span>
                                <Badge variant="blue">{exp.date}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                              <BtnIcon onClick={() => startExperienceEdit(exp)}><FaEdit className="text-xs" /></BtnIcon>
                              <BtnDanger onClick={() => handleExperienceDelete(exp._id)}><FaTrash className="text-xs" /></BtnDanger>
                            </div>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {exp.responsibilities.map((r, i) => <li key={i} className="text-xs text-[#5a5e70] flex items-start gap-2"><span className="text-[#C9A84C]/40 mt-1">•</span> {r}</li>)}
                          </ul>
                        </div>
                      ))}
                      <Pagination page={expPage} setPage={setExpPage} total={experiences.length} perPage={itemsPerPage} />
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* ════════════ PROJECTS ════════════ */}
          {activeTab === "projects" && (
            <div className="flex flex-col gap-5">
              {/* GitHub Sync Modal */}
              {showGithubModal && (
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FaGithub className="text-[#C9A84C]" />
                      <span className="font-semibold text-sm">Select Repository</span>
                    </div>
                    <button onClick={() => setShowGithubModal(false)} className="text-[#4a4e5e] hover:text-[#e8e6e3] transition cursor-pointer"><FaTimes /></button>
                  </div>
                  <div className="relative mb-4">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4e5e] text-xs" />
                    <input type="text" placeholder="Search repos..." className="w-full h-9 bg-[#0a0a12] border border-[#C9A84C]/15 rounded-lg pl-9 pr-3 text-sm text-[#e8e6e3] placeholder-[#3d3f4e] focus:outline-none focus:border-[#C9A84C]/40" value={repoSearch} onChange={e => setRepoSearch(e.target.value)} />
                  </div>
                  {fetchingRepos ? (
                    <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" /></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                      {githubRepos.filter(r => r.name.toLowerCase().includes(repoSearch.toLowerCase()) || (r.description && r.description.toLowerCase().includes(repoSearch.toLowerCase()))).map(repo => (
                        <button key={repo.id} onClick={() => pinRepoToPortfolio(repo)}
                          className="text-left p-3 rounded-lg border border-[#C9A84C]/5 hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 transition cursor-pointer group">
                          <p className="font-medium text-xs text-[#e8e6e3] truncate group-hover:text-[#C9A84C] transition">{repo.name}</p>
                          <p className="text-[11px] text-[#4a4e5e] truncate mt-0.5">{repo.description || "No description"}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Form */}
                <Card className="p-5 h-fit">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider flex items-center gap-2">
                      {isProjectEditing ? <><FaEdit className="text-[#C9A84C]" /> Edit</> : <><FaPlus className="text-[#C9A84C]" /> Add Project</>}
                    </p>
                    <button onClick={fetchGithubRepos} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C9A84C] hover:text-[#d4b65e] transition cursor-pointer">
                      <FaGithub /> Sync GitHub
                    </button>
                  </div>
                  <form onSubmit={handleProjectSubmit} className="flex flex-col gap-3">
                    <Input label="Project Name" type="text" placeholder="e.g. Brainwave" value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} required />
                    <Input label="Year" type="text" placeholder="e.g. 2025" value={projectForm.year} onChange={e => setProjectForm({ ...projectForm, year: e.target.value })} required />
                    <Input label="Live Demo Link" type="text" placeholder="https://domain.app" value={projectForm.link} onChange={e => setProjectForm({ ...projectForm, link: e.target.value })} />
                    <Input label="GitHub Link" type="text" placeholder="https://github.com/user/repo" value={projectForm.github} onChange={e => setProjectForm({ ...projectForm, github: e.target.value })} />
                    <Textarea label="Description" placeholder="Brief description..." rows="3" value={projectForm.description || ""} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
                    <Select label="Category" value={projectForm.category || "Featured"} onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}>
                      <option value="Featured">Work That Matters</option>
                      <option value="MoreProjects">More Projects</option>
                      <option value="OpenSource">On GitHub</option>
                    </Select>
                    <div className="flex gap-2 mt-1">
                      <BtnPrimary type="submit" style={{ flex: 1 }}>{isProjectEditing ? "Update" : "Add"}</BtnPrimary>
                      {isProjectEditing && <BtnSecondary type="button" onClick={() => { setIsProjectEditing(false); setProjectForm({ id: null, name: "", year: "", link: "", github: "", description: "", category: "Featured" }); }}>Cancel</BtnSecondary>}
                    </div>
                  </form>
                </Card>

                {/* List */}
                <div className="lg:col-span-2">
                  <Card className="p-5">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-1 mb-4 p-0.5 bg-[#0a0a12] rounded-lg border border-[#C9A84C]/5 w-fit">
                      {[
                        { key: "Featured", label: "Featured", icon: FaStar },
                        { key: "MoreProjects", label: "More", icon: FaProjectDiagram },
                        { key: "OpenSource", label: "GitHub", icon: FaGithub },
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => { setProjectTab(tab.key); setProjectPage(1); }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                            projectTab === tab.key ? "bg-[#C9A84C]/15 text-[#C9A84C]" : "text-[#4a4e5e] hover:text-[#8b8fa3]"
                          }`}
                        >
                          <tab.icon className="text-[10px]" /> {tab.label}
                          <span className={`ml-1 text-[10px] ${projectTab === tab.key ? "text-[#C9A84C]/60" : "text-[#3d3f4e]"}`}>
                            {tab.key === "Featured" ? projects.filter(p => !p.category || p.category === "Featured").length :
                             tab.key === "MoreProjects" ? projects.filter(p => p.category === "MoreProjects" || p.category === "Minor").length :
                             projects.filter(p => p.category === "OpenSource").length}
                          </span>
                        </button>
                      ))}
                    </div>

                    {filteredProjects.length === 0 ? (
                      <EmptyState icon={FaFolderOpen} title={`No ${categoryLabels[projectTab]} projects`} subtitle="Add one from the form or sync from GitHub" />
                    ) : (
                      <div className="flex flex-col gap-2">
                        {paginatedProjects.map(proj => (
                          <div key={proj._id} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a12]/60 border border-[#C9A84C]/5 hover:border-[#C9A84C]/15 transition group">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm text-[#e8e6e3] truncate">{proj.name}</h4>
                                <Badge>{proj.year}</Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                {proj.description && <p className="text-[11px] text-[#4a4e5e] truncate max-w-xs">{proj.description}</p>}
                                {proj.link && proj.link !== "#" && (
                                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#C9A84C]/60 hover:text-[#C9A84C] flex items-center gap-1"><FaExternalLinkAlt className="text-[8px]" /> Live</a>
                                )}
                                {proj.github && proj.github !== "#" && (
                                  <a href={proj.github} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#4a4e5e] hover:text-[#8b8fa3] flex items-center gap-1"><FaGithub className="text-[9px]" /> Repo</a>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition ml-2">
                              <BtnIcon onClick={() => startProjectEdit(proj)}><FaEdit className="text-xs" /></BtnIcon>
                              <BtnDanger onClick={() => handleProjectDelete(proj._id)}><FaTrash className="text-xs" /></BtnDanger>
                            </div>
                          </div>
                        ))}
                        <Pagination page={projectPage} setPage={setProjectPage} total={filteredProjects.length} perPage={itemsPerPage} />
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ SERVICES & COLLABORATION ════════════ */}
          {activeTab === "services" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Form */}
              <Card className="p-5 h-fit">
                <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider mb-4 flex items-center gap-2">
                  {isServiceEditing ? <><FaEdit className="text-[#C9A84C]" /> Edit Service</> : <><FaPlus className="text-[#C9A84C]" /> Add Service</>}
                </p>
                <form onSubmit={handleServiceSubmit} className="flex flex-col gap-3">
                  <Input 
                    label="Service Title" 
                    type="text" 
                    placeholder="e.g. Full-Stack Web Architecture" 
                    value={serviceForm.title} 
                    onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} 
                    required 
                  />
                  <Textarea 
                    label="Service Description" 
                    rows="4" 
                    placeholder="Describe your service, tech stack, and deliverable values..." 
                    value={serviceForm.description} 
                    onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} 
                    required 
                  />
                  <Textarea 
                    label="Custom SVG Icon (Optional)" 
                    rows="3" 
                    placeholder='<svg viewBox="0 0 24 24" ...>...</svg>' 
                    value={serviceForm.iconSvg} 
                    onChange={e => setServiceForm({ ...serviceForm, iconSvg: e.target.value })} 
                  />
                  
                  <div className="flex gap-2 mt-2">
                    <BtnPrimary type="submit" style={{ flex: 1 }}>
                      {isServiceEditing ? <><FaSave /> Update Service</> : <><FaPlus /> Add Service</>}
                    </BtnPrimary>
                    {isServiceEditing && (
                      <BtnSecondary type="button" onClick={() => { setIsServiceEditing(false); setServiceForm({ id: null, title: "", description: "", iconSvg: "" }); }}>
                        Cancel
                      </BtnSecondary>
                    )}
                  </div>
                </form>
              </Card>

              {/* List */}
              <div className="lg:col-span-2">
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-[#8b8fa3] uppercase tracking-wider">
                      Services &amp; Offerings ({services.length})
                    </p>
                  </div>
                  {services.length === 0 ? (
                    <EmptyState icon={FaHandshake} title="No services found" subtitle="Add your first service or collaboration offering" />
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {paginatedServices.map(service => (
                        <div key={service._id} className="p-4 bg-[#0a0a12] border border-[#C9A84C]/5 hover:border-[#C9A84C]/20 rounded-lg group transition">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div 
                                className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] flex-shrink-0 mt-0.5 p-2"
                                dangerouslySetInnerHTML={{ __html: service.iconSvg || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-[#e8e6e3] group-hover:text-[#C9A84C] transition">{service.title}</h4>
                                <p className="text-xs text-[#8b8fa3] mt-1.5 leading-relaxed whitespace-pre-wrap">{service.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0 ml-2">
                              <BtnIcon onClick={() => startServiceEdit(service)}><FaEdit className="text-xs" /></BtnIcon>
                              <BtnDanger onClick={() => handleServiceDelete(service._id)}><FaTrash className="text-xs" /></BtnDanger>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Pagination page={servicePage} setPage={setServicePage} total={services.length} perPage={itemsPerPage} />
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* ════════════ CREDENTIALS ════════════ */}
          {activeTab === "keys" && (
            <form onSubmit={handleKeysSave} className="flex flex-col gap-5">
              <Card className="p-5">
                <p className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wider mb-4">Cloudinary (Image Storage)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input label="Cloud Name" type="text" value={keysForm.CLOUDINARY_CLOUD_NAME || ""} onChange={e => setKeysForm({ ...keysForm, CLOUDINARY_CLOUD_NAME: e.target.value })} placeholder="Cloud Name" />
                  <Input label="API Key" type="text" value={keysForm.CLOUDINARY_API_KEY || ""} onChange={e => setKeysForm({ ...keysForm, CLOUDINARY_API_KEY: e.target.value })} placeholder="API Key" />
                  <Input label="API Secret" type="password" value={keysForm.CLOUDINARY_API_SECRET || ""} onChange={e => setKeysForm({ ...keysForm, CLOUDINARY_API_SECRET: e.target.value })} placeholder="API Secret" />
                </div>
              </Card>

              <Card className="p-5">
                <p className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wider mb-4">GitHub (Optional)</p>
                <Input label="Personal Access Token" type="password" value={keysForm.GITHUB_PAT || ""} onChange={e => setKeysForm({ ...keysForm, GITHUB_PAT: e.target.value })} placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
              </Card>

              <Card className="p-5">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4">EmailJS (Contact Form)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input label="Service Key" type="text" value={keysForm.VITE_SERVICE_KEY || ""} onChange={e => setKeysForm({ ...keysForm, VITE_SERVICE_KEY: e.target.value })} placeholder="Service Key" />
                  <Input label="Template Key" type="text" value={keysForm.VITE_TEMPLATE_KEY || ""} onChange={e => setKeysForm({ ...keysForm, VITE_TEMPLATE_KEY: e.target.value })} placeholder="Template Key" />
                  <Input label="Public Key" type="text" value={keysForm.VITE_PUBLIC_KEY || ""} onChange={e => setKeysForm({ ...keysForm, VITE_PUBLIC_KEY: e.target.value })} placeholder="Public Key" />
                </div>
              </Card>

              <Card className="p-5">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4">Database</p>
                <Input label="MongoDB URI" type="text" value={keysForm.MONGODB_URI || ""} onChange={e => setKeysForm({ ...keysForm, MONGODB_URI: e.target.value })} placeholder="mongodb://127.0.0.1:27017/portfolio" />
              </Card>

              <BtnPrimary type="submit"><FaSave /> Save Credentials</BtnPrimary>
            </form>
          )}

          {/* ════════════ MESSAGES ════════════ */}
          {activeTab === "messages" && (
            <div className="flex flex-col gap-3">
              {messages.length === 0 ? (
                <Card className="p-5">
                  <EmptyState icon={FaEnvelope} title="Inbox is empty" subtitle="No messages received yet" />
                </Card>
              ) : (
                <>
                  {paginatedMessages.map(msg => (
                    <Card key={msg._id} className="p-5 group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{msg.from_name}</h3>
                            <span className="text-[10px] text-[#4a4e5e]">{new Date(msg.createdAt).toLocaleDateString()}</span>
                          </div>
                          <a href={`mailto:${msg.from_email}`} className="text-[#C9A84C] text-xs hover:underline">{msg.from_email}</a>
                          <p className="mt-3 text-xs text-[#8b8fa3] whitespace-pre-wrap bg-[#0a0a12] p-3 rounded-lg border border-[#C9A84C]/5 leading-relaxed">{msg.message}</p>
                        </div>
                        <BtnDanger onClick={() => handleMessageDelete(msg._id)} className="opacity-0 group-hover:opacity-100 transition ml-3"><FaTrash className="text-xs" /></BtnDanger>
                      </div>
                    </Card>
                  ))}
                  <Pagination page={msgPage} setPage={setMsgPage} total={messages.length} perPage={itemsPerPage} />
                </>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
