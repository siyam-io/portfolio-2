import fs from "fs";
import path from "path";
import express from "express";
import auth from "../middleware/auth.js";
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import Experience from "../models/Experience.js";
import Project from "../models/Project.js";
import Service from "../models/Service.js";
import { getDecryptedKey } from "../utils/keys.js";

const router = express.Router();

/* =========================================================================
   PROFILE
   ========================================================================= */

// @route   GET api/portfolio/cv
// @desc    Download or view CV reliably on all devices
router.get("/cv", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).send("Profile not found");
    }

    // 1. If stored as Base64 in database
    if (profile.cvData) {
      const fileBuffer = Buffer.from(profile.cvData, "base64");
      const filename = profile.cvName || "Esthyak_Ahmmed_Siyam_CV.pdf";
      res.setHeader("Content-Type", profile.cvContentType || "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", fileBuffer.length);
      return res.send(fileBuffer);
    }

    // 2. If stored as a local file in uploads
    if (profile.cvUrl && profile.cvUrl.startsWith("/uploads/")) {
      const localPath = path.resolve(root, "web/public", profile.cvUrl.replace(/^\//, ""));
      if (fs.existsSync(localPath)) {
        return res.download(localPath, profile.cvName || "Esthyak_Ahmmed_Siyam_CV.pdf");
      }
    }

    // 3. Fallback: check web/public/uploads/Esthyak_Ahmmed_Siyam_CV.pdf
    const defaultLocal = path.resolve(root, "web/public/uploads/Esthyak_Ahmmed_Siyam_CV.pdf");
    if (fs.existsSync(defaultLocal)) {
      return res.download(defaultLocal, "Esthyak_Ahmmed_Siyam_CV.pdf");
    }

    // 4. Remote URL fallback
    if (profile.cvUrl && profile.cvUrl.startsWith("http")) {
      return res.redirect(profile.cvUrl);
    }

    return res.status(404).send("No CV uploaded yet. Please upload your CV from Admin Panel.");
  } catch (err) {
    console.error("CV download error:", err);
    res.status(500).send("Error downloading CV");
  }
});

router.get("/download-cv", (req, res) => res.redirect("/api/portfolio/cv"));

// @route   GET api/portfolio/profile
// @desc    Get profile details
router.get("/profile", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Fallback fallback if no profile exists
      profile = new Profile({
        name: "Esthiyak Ahmmed",
        role: "Frontend Web Developer",
        bio: "Transforming complex ideas into pixel-perfect, interactive web experiences with clean architecture and modern UI design.",
        about: "I am a dedicated Frontend & Full-Stack Engineer focused on building high-performance, modern web applications. Specialized in React.js, Next.js, Node.js, and MongoDB, I transform complex business requirements into intuitive, lightning-fast user interfaces. I take pride in writing clean, maintainable code, optimizing web performance, and delivering seamless digital experiences."
      });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/portfolio/profile
// @desc    Update profile details (Admin only)
router.put("/profile", auth, async (req, res) => {
  const { name, role, bio, about, heroImage, cvUrl, cvData, cvName, cvContentType, github, linkedin, whatsapp, email } = req.body;
  try {
    let profile = await Profile.findOne();
    if (profile) {
      if (name !== undefined) profile.name = name;
      if (role !== undefined) profile.role = role;
      if (bio !== undefined) profile.bio = bio;
      if (about !== undefined) profile.about = about;
      if (heroImage !== undefined) profile.heroImage = heroImage;
      if (cvUrl !== undefined) profile.cvUrl = cvUrl;
      if (cvData !== undefined) profile.cvData = cvData;
      if (cvName !== undefined) profile.cvName = cvName;
      if (cvContentType !== undefined) profile.cvContentType = cvContentType;
      if (github !== undefined) profile.github = github;
      if (linkedin !== undefined) profile.linkedin = linkedin;
      if (whatsapp !== undefined) profile.whatsapp = whatsapp;
      if (email !== undefined) profile.email = email;
      await profile.save();
      return res.json(profile);
    }
    profile = new Profile(req.body);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


/* =========================================================================
   SKILLS
   ========================================================================= */

// @route   GET api/portfolio/skills
// @desc    Get all skills
router.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/portfolio/skills
// @desc    Add a new skill (Admin only)
router.post("/skills", auth, async (req, res) => {
  const { name, iconName, category } = req.body;
  try {
    const newSkill = new Skill({ name, iconName, category });
    await newSkill.save();
    res.json(newSkill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/portfolio/skills/:id
// @desc    Update a skill (Admin only)
router.put("/skills/:id", auth, async (req, res) => {
  const { name, iconName, category } = req.body;
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ msg: "Skill not found" });

    skill.name = name || skill.name;
    skill.iconName = iconName || skill.iconName;
    skill.category = category || skill.category;

    await skill.save();
    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/portfolio/skills/:id
// @desc    Delete a skill (Admin only)
router.delete("/skills/:id", auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ msg: "Skill not found" });

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ msg: "Skill removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/* =========================================================================
   EXPERIENCE
   ========================================================================= */

// @route   GET api/portfolio/experience
// @desc    Get all experiences
router.get("/experience", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/portfolio/experience
// @desc    Add a new experience (Admin only)
router.post("/experience", auth, async (req, res) => {
  const { job, company, date, responsibilities } = req.body;
  try {
    const newExp = new Experience({ job, company, date, responsibilities });
    await newExp.save();
    res.json(newExp);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/portfolio/experience/:id
// @desc    Update an experience (Admin only)
router.put("/experience/:id", auth, async (req, res) => {
  const { job, company, date, responsibilities } = req.body;
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ msg: "Experience not found" });

    exp.job = job || exp.job;
    exp.company = company || exp.company;
    exp.date = date || exp.date;
    exp.responsibilities = responsibilities || exp.responsibilities;

    await exp.save();
    res.json(exp);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/portfolio/experience/:id
// @desc    Delete an experience (Admin only)
router.delete("/experience/:id", auth, async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ msg: "Experience not found" });

    await Experience.findByIdAndDelete(req.params.id);
    res.json({ msg: "Experience removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/* =========================================================================
   PROJECTS
   ========================================================================= */

// @route   GET api/portfolio/projects
// @desc    Get all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/portfolio/projects
// @desc    Add a new project (Admin only)
router.post("/projects", auth, async (req, res) => {
  const { name, year, link, github, description, category } = req.body;
  try {
    const newProj = new Project({ name, year, link, github, description, category });
    await newProj.save();
    res.json(newProj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/portfolio/projects/:id
// @desc    Update a project (Admin only)
router.put("/projects/:id", auth, async (req, res) => {
  const { name, year, link, github, description, category } = req.body;
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ msg: "Project not found" });

    proj.name = name || proj.name;
    proj.year = year || proj.year;
    
    proj.link = link || proj.link;
    if (github !== undefined) proj.github = github;
    if (description !== undefined) proj.description = description;
    
    if (category !== undefined) proj.category = category;

    await proj.save();
    res.json(proj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/portfolio/projects/:id
// @desc    Delete a project (Admin only)
router.delete("/projects/:id", auth, async (req, res) => {
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ msg: "Project not found" });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: "Project removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/portfolio/emailjs-keys
// @desc    Get decrypted EmailJS keys (Public)
router.get("/emailjs-keys", async (req, res) => {
  try {
    const serviceKey = await getDecryptedKey("VITE_SERVICE_KEY");
    const templateKey = await getDecryptedKey("VITE_TEMPLATE_KEY");
    const publicKey = await getDecryptedKey("VITE_PUBLIC_KEY");
    res.json({ serviceKey, templateKey, publicKey });
  } catch (err) {
    console.error("Error retrieving EmailJS keys:", err);
    res.status(500).send("Server error");
  }
});
/* =========================================================================
   SERVICES
   ========================================================================= */

// @route   GET api/portfolio/services
// @desc    Get all services
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/portfolio/services
// @desc    Add a new service
router.post("/services", auth, async (req, res) => {
  const { title, description, iconSvg } = req.body;
  try {
    const newService = new Service({ title, description, iconSvg });
    await newService.save();
    res.json(newService);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/portfolio/services/:id
// @desc    Update a service
router.put("/services/:id", auth, async (req, res) => {
  const { title, description, iconSvg } = req.body;
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    service.title = title || service.title;
    service.description = description || service.description;
    service.iconSvg = iconSvg || service.iconSvg;

    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/portfolio/services/:id
// @desc    Delete a service
router.delete("/services/:id", auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    await service.deleteOne();
    res.json({ msg: "Service removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// @route   GET api/portfolio/github-repos/:username
// @desc    Fetch GitHub repos using backend proxy (Public/No auth required)
router.get("/github-repos/:username", async (req, res) => {
  try {
    const { username } = req.params;
    let pat = null;
    try {
      pat = await getDecryptedKey("GITHUB_PAT");
    } catch (e) {
      console.warn("Could not get GITHUB_PAT:", e.message);
    }

    const headers = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-Admin-App"
    };
    
    if (pat && pat.trim()) {
      headers["Authorization"] = `Bearer ${pat.trim()}`;
    }

    let response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers });
    
    // If PAT is invalid (401), retry without PAT
    if (response.status === 401 && pat) {
      console.warn("GitHub PAT returned 401, retrying without PAT...");
      delete headers["Authorization"];
      response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers });
    }

    if (response.status === 403) {
      return res.status(403).json({ msg: "GitHub API rate limit exceeded. Please add or update your GitHub PAT in API Credentials." });
    }
    
    if (!response.ok) {
      console.error("GitHub API Error:", response.status, response.statusText, await response.text());
      return res.status(response.status).json({ msg: "Failed to fetch repos from GitHub" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("GitHub Proxy Error:", err);
    res.status(500).send("Server error");
  }
});

export default router;
