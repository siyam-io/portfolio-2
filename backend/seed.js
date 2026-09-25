import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import Admin from "./models/Admin.js";
import Profile from "./models/Profile.js";
import Skill from "./models/Skill.js";
import Experience from "./models/Experience.js";
import Project from "./models/Project.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio";

const skills = [
  { name: "Node.js", iconName: "FaNodeJs", category: "backend" },
  { name: "Express.js", iconName: "SiExpress", category: "backend" },
  { name: "React.js", iconName: "FaReact", category: "frontend" },
  { name: "Next.js", iconName: "SiNextdotjs", category: "frontend" },
  { name: "React Native (Expo)", iconName: "FaMobileAlt", category: "frontend" },
  { name: "MongoDB", iconName: "SiMongodb", category: "backend" },
  { name: "JavaScript", iconName: "IoLogoJavascript", category: "frontend" },
  { name: "REST API", iconName: "FaNetworkWired", category: "backend" },
  { name: "Socket.io", iconName: "SiSocketdotio", category: "backend" },
  { name: "JWT Authentication", iconName: "FaLock", category: "backend" },
  { name: "Tailwind CSS", iconName: "RiTailwindCssFill", category: "frontend" },
  { name: "RBAC", iconName: "FaUserShield", category: "backend" },
  { name: "Vercel & Render", iconName: "FaCloud", category: "tools" },
  { name: "UI/UX Strategies", iconName: "FaPaintBrush", category: "frontend" },
  { name: "Database Management", iconName: "FaDatabase", category: "backend" },
  { name: "C#", iconName: "TbBrandCSharp", category: "backend" }
];

const experiences = [
  {
    job: "Full Stack Developer (Freelance)",
    company: "The Culinary Institute of Bangladesh",
    date: "17 Jan 2026 – 31 Aug 2026",
    responsibilities: [
      "Architected and developed the full-stack management system for the Culinary Institute of Bangladesh using React, Node.js, Express, and MongoDB.",
      "Built role-based access control (RBAC), vision scanning algorithms, batch scheduling workflows, and automated PDF certificate generation services.",
      "Designed and integrated secure RESTful APIs along with responsive frontend dashboards using modern UI/UX patterns."
    ]
  },
  {
    job: "Web Developer (Freelance)",
    company: "Savior Lifestyle",
    date: "01 Apr 2025 – 29 Nov 2025",
    responsibilities: [
      "Developed an end-to-end customized inventory management system.",
      "Maintained and upgraded existing digital architecture."
    ]
  }
];

const projects = [
  {
    name: "Chat Z — Real-Time Messaging",
    year: "2025",
    description: "Full-featured real-time chat application built with React, Node.js, Express, and Socket.io. Features instant bi-directional messaging, online user status tracking, room/group creation, media sharing, and JWT authentication. Optimized for low latency and smooth UI/UX responsiveness.",
    align: "right",
    image: "/images/chatz-app.jpg",
    link: "https://github.com/siyam-io/chatz",
    github: "https://github.com/siyam-io/chatz"
  },
  {
    name: "Multi-Vendor E-Commerce",
    year: "2025",
    description: "Multi-vendor apparel e-commerce platform with dynamic theme engine, real-time inventory management, and backend microservices. Built using Next.js, Node.js, Express, and MongoDB with integrated Pathao Courier service and payment flows.",
    align: "left",
    image: "/images/clothing-ecommerce.jpg",
    link: "https://clothing-e-commerce-web.vercel.app",
    github: "https://github.com"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Admin.deleteMany({});
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Project.deleteMany({});

    // 1. Create Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin123", salt);
    const admin = new Admin({
      username: "admin",
      passwordHash
    });
    await admin.save();
    console.log("Admin seeded successfully (User: admin, Pass: admin123)");

    // 2. Create Profile
    const profile = new Profile({
      name: "Esthyak Ahmmed Siyam",
      role: "Full Stack Software Engineer",
      bio: "Building scalable web and mobile solutions using the MERN Stack | React Native | Web Application Security.",
      about: "Full Stack Software Engineer with 1.3 years of experience building scalable web and mobile solutions using Node.js, Express, React, Next.js, MongoDB, and Expo (React Native). Proficient in RESTful API architecture, real-time data streaming via Socket.io, modern Tailwind CSS interfaces, and automated cloud deployments on Vercel and Render. Specializes in architecting scalable backend APIs and real-time applications with a strong emphasis on secure coding practices, database optimization, JWT authentication, and cross-platform mobile performance."
    });
    await profile.save();
    console.log("Profile seeded successfully");

    // 3. Create Skills
    await Skill.insertMany(skills);
    console.log("Skills seeded successfully");

    // 4. Create Experiences
    await Experience.insertMany(experiences);
    console.log("Experiences seeded successfully");

    // 5. Create Projects
    await Project.insertMany(projects);
    console.log("Projects seeded successfully");

    console.log("Database Seeding Completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
