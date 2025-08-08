"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Search,
  Maximize2,
  Minimize2,
  Users,
  TrendingUp,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  X,
  Award,
  Star,
} from "lucide-react";
import DesktopSidebar from "@/components/navigation/desktop-sidebar";

export default function SmoothSkillUniverseMap() {
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedSkill, setDraggedSkill] = useState(null);
  const [skillDragOffset, setSkillDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // Premium gradient colors optimized for white text
  const gradientColors = [
    { from: "#3a7bd5", to: "#00d2ff" }, // Blue gradient
    { from: "#834d9b", to: "#d04ed6" }, // Purple gradient
    { from: "#009245", to: "#fcee21" }, // Green-Yellow
    { from: "#f12711", to: "#f5af19" }, // Red-Orange
    { from: "#654ea3", to: "#eaafc8" }, // Purple-Pink
    { from: "#1488cc", to: "#2b32b2" }, // Dark Blue
    { from: "#bbd2c5", to: "#536976" }, // Cool Grey
    { from: "#9796f0", to: "#fbc7d4" }, // Soft Purple-Pink
    { from: "#b79891", to: "#94716b" }, // Earthy Brown
    { from: "#acb6e5", to: "#86fde8" }, // Light Blue-Cyan
    { from: "#36d1dc", to: "#5b86e5" }, // Cyan-Blue
    { from: "#cb356b", to: "#bd3f32" }, // Deep Red
    { from: "#283c86", to: "#45a247" }, // Navy-Green
    { from: "#8e0e00", to: "#1f1c18" }, // Dark Red-Black
    { from: "#1e3c72", to: "#2a5298" }, // Royal Blue
  ];

  // Optimized skill positions using force-directed layout with better spacing
  const [skillPositions, setSkillPositions] = useState(new Map());

  const calculatePositions = useCallback((skills) => {
    if (skills.length === 0) return new Map();

    const positions = new Map();
    const centerX = 400;
    const centerY = 300;
    const radius = 250;

    // Create clusters based on skill categories
    const categories = {
      Frontend: [
        "JavaScript",
        "React",
        "Vue.js",
        "Angular",
        "TypeScript",
        "HTML",
        "CSS",
        "Sass",
        "Tailwind CSS",
      ],
      Backend: ["Node.js", "Python", "Java", "C#", "PHP", "Ruby", "Go", "Rust"],
      Mobile: ["React Native", "Flutter", "Swift", "Kotlin"],
      Data: [
        "Machine Learning",
        "Data Science",
        "TensorFlow",
        "PyTorch",
        "SQL",
        "Tableau",
        "Power BI",
      ],
      Design: [
        "UI/UX Design",
        "Figma",
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Sketch",
      ],
      DevOps: [
        "Docker",
        "Kubernetes",
        "AWS",
        "DevOps",
        "Terraform",
        "Jenkins",
        "Git",
      ],
      Database: ["MongoDB", "PostgreSQL", "Redis", "GraphQL"],
    };

    const categoryPositions = {
      Frontend: { x: centerX - 150, y: centerY - 150 },
      Backend: { x: centerX + 150, y: centerY - 150 },
      Mobile: { x: centerX - 200, y: centerY + 100 },
      Data: { x: centerX + 200, y: centerY + 100 },
      Design: { x: centerX, y: centerY - 200 },
      DevOps: { x: centerX, y: centerY + 200 },
      Database: { x: centerX + 100, y: centerY },
    };

    // First pass - assign to categories
    skills.forEach((skill, index) => {
      let category = "Other";
      let categoryCenter = { x: centerX, y: centerY };

      // Find skill category
      for (const [cat, skillNames] of Object.entries(categories)) {
        if (skillNames.includes(skill.name)) {
          category = cat;
          categoryCenter = categoryPositions[cat] || { x: centerX, y: centerY };
          break;
        }
      }

      // Position within category cluster
      const angle = index * 0.618033988749895 * 2 * Math.PI; // Golden angle
      const clusterRadius = 100 + (skill.avgEndorsements / 2000) * 50; // Increased radius for better spacing

      const x = categoryCenter.x + Math.cos(angle) * clusterRadius;
      const y = categoryCenter.y + Math.sin(angle) * clusterRadius;

      positions.set(skill.id, { x, y });
    });

    // Second pass - adjust for overlaps
    const adjustedPositions = new Map(positions);
    const minDistance = 80; // Minimum distance between bubbles

    for (let i = 0; i < skills.length; i++) {
      const skill1 = skills[i];
      const pos1 = adjustedPositions.get(skill1.id);

      for (let j = i + 1; j < skills.length; j++) {
        const skill2 = skills[j];
        const pos2 = adjustedPositions.get(skill2.id);

        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          // Adjust positions to maintain minimum distance
          const adjustX = (minDistance - distance) * (dx / distance) * 0.5;
          const adjustY = (minDistance - distance) * (dy / distance) * 0.5;

          adjustedPositions.set(skill1.id, {
            x: pos1.x + adjustX,
            y: pos1.y + adjustY,
          });

          adjustedPositions.set(skill2.id, {
            x: pos2.x - adjustX,
            y: pos2.y - adjustY,
          });
        }
      }
    }

    return adjustedPositions;
  }, []);

  // Fix 2: Improved drag handlers
  const handleSkillDragStart = useCallback(
    (skillId, clientX, clientY) => {
      const position = skillPositions.get(skillId);
      if (!position) return;

      setDraggedSkill(skillId);
      setSkillDragOffset({
        x: clientX - position.x * transform.scale - transform.x,
        y: clientY - position.y * transform.scale - transform.y,
      });
    },
    [skillPositions, transform]
  );

  const handleSkillDragMove = useCallback(
    (clientX, clientY) => {
      if (!draggedSkill) return;

      const newX =
        (clientX - transform.x - skillDragOffset.x) / transform.scale;
      const newY =
        (clientY - transform.y - skillDragOffset.y) / transform.scale;

      setSkillPositions((prev) => {
        const newPositions = new Map(prev);
        newPositions.set(draggedSkill, { x: newX, y: newY });
        return newPositions;
      });
    },
    [draggedSkill, skillDragOffset, transform]
  );

  const handleSkillDragEnd = useCallback(() => {
    setDraggedSkill(null);
  }, []);

  // Fix 3: Enhanced touch event handlers
  const handleTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (target?.closest(".skill-bubble")) {
        const skillId = parseInt(
          target.closest(".skill-bubble").dataset.skillId
        );
        handleSkillDragStart(skillId, touch.clientX, touch.clientY);
        e.preventDefault();
        return;
      }

      setIsDragging(true);
      setDragStart({
        x: touch.clientX - transform.x,
        y: touch.clientY - transform.y,
      });
      e.preventDefault();
    },
    [transform, handleSkillDragStart]
  );

  const handleTouchMove = useCallback(
    (e) => {
      const touch = e.touches[0];

      if (draggedSkill) {
        handleSkillDragMove(touch.clientX, touch.clientY);
        e.preventDefault();
        return;
      }

      if (!isDragging) return;

      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;

      setTransform((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
      e.preventDefault();
    },
    [isDragging, dragStart, draggedSkill, handleSkillDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    handleSkillDragEnd();
  }, [handleSkillDragEnd]);

  // Fix 4: Enhanced mouse event handlers
  const handleMouseDown = useCallback(
    (e) => {
      if (e.target.closest(".skill-bubble")) {
        const skillId = parseInt(
          e.target.closest(".skill-bubble").dataset.skillId
        );
        handleSkillDragStart(skillId, e.clientX, e.clientY);
        return;
      }

      // Only start dragging if clicking on empty space
      if (
        e.target === containerRef.current ||
        e.target.closest(".map-container")
      ) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - transform.x,
          y: e.clientY - transform.y,
        });
      }
    },
    [transform, handleSkillDragStart]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (draggedSkill) {
        handleSkillDragMove(e.clientX, e.clientY);
        return;
      }

      if (!isDragging) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      setTransform((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    },
    [isDragging, dragStart, draggedSkill, handleSkillDragMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    handleSkillDragEnd();
  }, [handleSkillDragEnd]);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse events
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);

    // Touch events
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  useEffect(() => {
    const generateSkillsData = () => {
      const skillsData = [
        // Technology Skills
        {
          name: "JavaScript",
          endorsements: 1543,
          connections: ["React", "Node.js", "TypeScript", "Vue.js"],
        },
        {
          name: "React",
          endorsements: 1287,
          connections: ["JavaScript", "Next.js", "TypeScript", "Redux"],
        },
        {
          name: "Python",
          endorsements: 1856,
          connections: ["Machine Learning", "Data Science", "Django", "Flask"],
        },
        {
          name: "Node.js",
          endorsements: 956,
          connections: ["JavaScript", "Express.js", "MongoDB", "PostgreSQL"],
        },
        {
          name: "TypeScript",
          endorsements: 845,
          connections: ["JavaScript", "React", "Angular", "Vue.js"],
        },
        {
          name: "Angular",
          endorsements: 734,
          connections: ["TypeScript", "JavaScript", "RxJS", "NgRx"],
        },
        {
          name: "Vue.js",
          endorsements: 623,
          connections: ["JavaScript", "Nuxt.js", "Vuex", "TypeScript"],
        },
        {
          name: "Docker",
          endorsements: 892,
          connections: ["Kubernetes", "DevOps", "CI/CD", "AWS"],
        },
        {
          name: "Kubernetes",
          endorsements: 567,
          connections: ["Docker", "DevOps", "Helm", "AWS"],
        },
        {
          name: "AWS",
          endorsements: 1234,
          connections: ["Cloud Computing", "Docker", "Terraform", "Lambda"],
        },

        // Data & AI Skills
        {
          name: "Machine Learning",
          endorsements: 987,
          connections: ["Python", "TensorFlow", "PyTorch", "Data Science"],
        },
        {
          name: "Data Science",
          endorsements: 1156,
          connections: ["Python", "R", "SQL", "Machine Learning"],
        },
        {
          name: "TensorFlow",
          endorsements: 456,
          connections: ["Machine Learning", "Python", "Deep Learning", "Keras"],
        },
        {
          name: "PyTorch",
          endorsements: 423,
          connections: [
            "Machine Learning",
            "Python",
            "Deep Learning",
            "Computer Vision",
          ],
        },
        {
          name: "SQL",
          endorsements: 1445,
          connections: [
            "PostgreSQL",
            "MySQL",
            "Data Analysis",
            "Database Design",
          ],
        },
        {
          name: "Tableau",
          endorsements: 678,
          connections: [
            "Data Visualization",
            "Power BI",
            "Data Analysis",
            "SQL",
          ],
        },
        {
          name: "Power BI",
          endorsements: 589,
          connections: ["Tableau", "Data Visualization", "Excel", "SQL Server"],
        },

        // Design Skills
        {
          name: "UI/UX Design",
          endorsements: 876,
          connections: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
        },
        {
          name: "Figma",
          endorsements: 765,
          connections: [
            "UI/UX Design",
            "Prototyping",
            "Design Systems",
            "Adobe XD",
          ],
        },
        {
          name: "Adobe Photoshop",
          endorsements: 934,
          connections: [
            "Graphic Design",
            "Adobe Illustrator",
            "Digital Art",
            "Photo Editing",
          ],
        },
        {
          name: "Adobe Illustrator",
          endorsements: 723,
          connections: [
            "Graphic Design",
            "Adobe Photoshop",
            "Vector Art",
            "Logo Design",
          ],
        },
        {
          name: "Sketch",
          endorsements: 445,
          connections: ["UI/UX Design", "Figma", "Prototyping", "Adobe XD"],
        },

        // Business & Marketing
        {
          name: "Digital Marketing",
          endorsements: 1123,
          connections: ["SEO", "SEM", "Social Media Marketing", "Google Ads"],
        },
        {
          name: "SEO",
          endorsements: 867,
          connections: [
            "Digital Marketing",
            "Google Analytics",
            "Content Marketing",
            "SEM",
          ],
        },
        {
          name: "Project Management",
          endorsements: 1345,
          connections: ["Scrum", "Agile", "Jira", "Leadership"],
        },
        {
          name: "Scrum",
          endorsements: 789,
          connections: [
            "Agile",
            "Project Management",
            "Jira",
            "Sprint Planning",
          ],
        },
        {
          name: "Leadership",
          endorsements: 1567,
          connections: [
            "Team Management",
            "Strategic Planning",
            "Communication",
            "Project Management",
          ],
        },

        // Mobile Development
        {
          name: "React Native",
          endorsements: 567,
          connections: ["React", "Mobile Development", "iOS", "Android"],
        },
        {
          name: "Flutter",
          endorsements: 445,
          connections: ["Dart", "Mobile Development", "iOS", "Android"],
        },
        {
          name: "Swift",
          endorsements: 534,
          connections: ["iOS", "Xcode", "Objective-C", "SwiftUI"],
        },
        {
          name: "Kotlin",
          endorsements: 423,
          connections: ["Android", "Java", "Spring Boot", "IntelliJ IDEA"],
        },

        // DevOps & Cloud
        {
          name: "DevOps",
          endorsements: 923,
          connections: ["Docker", "Kubernetes", "CI/CD", "Jenkins"],
        },
        {
          name: "Terraform",
          endorsements: 345,
          connections: ["AWS", "Infrastructure as Code", "DevOps", "Azure"],
        },
        {
          name: "Jenkins",
          endorsements: 456,
          connections: ["CI/CD", "DevOps", "Git", "Docker"],
        },
        {
          name: "Git",
          endorsements: 1678,
          connections: ["GitHub", "GitLab", "Version Control", "Bitbucket"],
        },

        // Database & Backend
        {
          name: "MongoDB",
          endorsements: 567,
          connections: ["NoSQL", "Node.js", "Express.js", "Database Design"],
        },
        {
          name: "PostgreSQL",
          endorsements: 678,
          connections: ["SQL", "Database Design", "Python", "Node.js"],
        },
        {
          name: "Redis",
          endorsements: 234,
          connections: ["Caching", "Database", "Node.js", "Performance"],
        },
        {
          name: "GraphQL",
          endorsements: 345,
          connections: ["API", "React", "Node.js", "Apollo"],
        },

        // Additional Popular Skills
        {
          name: "Java",
          endorsements: 1234,
          connections: ["Spring Boot", "Maven", "Gradle", "Hibernate"],
        },
        {
          name: "C#",
          endorsements: 876,
          connections: [".NET", "ASP.NET", "Entity Framework", "Visual Studio"],
        },
        {
          name: "PHP",
          endorsements: 789,
          connections: ["Laravel", "Symfony", "WordPress", "MySQL"],
        },
        {
          name: "Ruby",
          endorsements: 445,
          connections: ["Ruby on Rails", "Gem", "Bundler", "Sinatra"],
        },

        // Web Technologies
        {
          name: "HTML",
          endorsements: 1445,
          connections: [
            "CSS",
            "JavaScript",
            "Web Development",
            "Semantic HTML",
          ],
        },
        {
          name: "CSS",
          endorsements: 1334,
          connections: ["HTML", "Sass", "Less", "Responsive Design"],
        },
        {
          name: "Sass",
          endorsements: 456,
          connections: ["CSS", "SCSS", "Web Development", "Bootstrap"],
        },
        {
          name: "Tailwind CSS",
          endorsements: 567,
          connections: ["CSS", "Utility-first", "Responsive Design", "PostCSS"],
        },
      ];

      return skillsData.map((skill, index) => ({
        id: index + 1,
        name: skill.name,
        totalUsers: Math.floor(Math.random() * 5000) + 1000,
        avgEndorsements: skill.endorsements,
        connections: skill.connections,
        gradient: gradientColors[index % gradientColors.length],
      }));
    };

    setTimeout(() => {
      const skillsData = generateSkillsData();
      setSkills(skillsData);
      setSkillPositions(calculatePositions(skillsData));
      setIsLoading(false);
    }, 500);
  }, [calculatePositions]);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [skills, searchTerm]);

  const handleZoom = useCallback((direction, e) => {
    e?.preventDefault();
    setTransform((prev) => {
      const factor = direction === "in" ? 1.2 : 1 / 1.2;
      const newScale = Math.max(0.5, Math.min(2.5, prev.scale * factor));
      return { ...prev, scale: newScale };
    });
  }, []);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  const getSkillSize = useCallback((skill) => {
    const baseSize = 50;
    const endorsementFactor = Math.log10(skill.avgEndorsements + 1) * 8;
    return Math.min(120, Math.max(40, baseSize + endorsementFactor));
  }, []);

  // Optimized connection rendering with better spacing
  const renderConnections = useMemo(() => {
    if (!skillPositions.size) return [];

    const connections = [];
    const connectionMap = new Set();

    filteredSkills.forEach((skill) => {
      const pos = skillPositions.get(skill.id);
      if (!pos) return;

      skill.connections?.forEach((connectionName) => {
        const connectedSkill = filteredSkills.find(
          (s) => s.name === connectionName
        );
        if (!connectedSkill) return;

        const connectedPos = skillPositions.get(connectedSkill.id);
        if (!connectedPos) return;

        // Avoid duplicate connections
        const connectionKey = `${Math.min(
          skill.id,
          connectedSkill.id
        )}-${Math.max(skill.id, connectedSkill.id)}`;
        if (connectionMap.has(connectionKey)) return;
        connectionMap.add(connectionKey);

        const isHighlighted =
          hoveredSkill === skill.id || hoveredSkill === connectedSkill.id;
        const distance = Math.sqrt(
          Math.pow(pos.x - connectedPos.x, 2) +
            Math.pow(pos.y - connectedPos.y, 2)
        );

        // Only render connections for nearby skills to reduce clutter
        if (distance < 250 || isHighlighted) {
          connections.push(
            <line
              key={connectionKey}
              x1={pos.x}
              y1={pos.y}
              x2={connectedPos.x}
              y2={connectedPos.y}
              stroke={isHighlighted ? "#8b5cf6" : "#64748b"}
              strokeWidth={isHighlighted ? 2.5 : 1}
              opacity={isHighlighted ? 0.9 : 0.3}
              className="transition-all duration-200 ease-in-out"
              strokeDasharray={isHighlighted ? "none" : "2,2"}
            />
          );
        }
      });
    });

    return connections;
  }, [filteredSkills, skillPositions, hoveredSkill]);

  const SkillBubble = ({ skill }) => {
    const position = skillPositions.get(skill.id);
    if (!position) return null;

    const size = getSkillSize(skill);
    const isActive = hoveredSkill === skill.id || selectedSkill === skill.id;
    const isBeingDragged = draggedSkill === skill.id;

    return (
      <div
        className="skill-bubble absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-move select-none"
        style={{
          left: position.x,
          top: position.y,
          width: size,
          height: size,
          willChange: "transform",
          zIndex: isBeingDragged ? 100 : isActive ? 10 : 1,
        }}
        data-skill-id={skill.id}
        onMouseEnter={() => setHoveredSkill(skill.id)}
        onMouseLeave={() => setHoveredSkill(null)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedSkill(selectedSkill === skill.id ? null : skill.id);
        }}
        // Remove onMouseDown from here since we're handling it at container level
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-center text-white font-semibold shadow-xl transition-all duration-200 ease-out relative overflow-hidden ${
            isActive ? "scale-110 shadow-2xl" : "hover:scale-105"
          } ${isBeingDragged ? "ring-2 ring-white/50" : ""}`}
          style={{
            background: `linear-gradient(135deg, ${skill.gradient.from} 0%, ${skill.gradient.to} 100%)`,
            fontSize: size > 70 ? "11px" : "9px",
            border: isActive ? "2px solid rgba(255,255,255,0.5)" : "none",
          }}
        >
          <span className="text-center leading-tight px-1 z-10 relative drop-shadow-sm">
            {skill.name.length > 10
              ? skill.name.substring(0, 8) + "..."
              : skill.name}
          </span>

          {/* Animated shine effect */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-transform duration-700 ${
              isActive
                ? "translate-x-full"
                : "-translate-x-full group-hover:translate-x-full"
            }`}
          />

          {/* Pulse effect for active skill */}
          {isActive && (
            <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
          )}
        </div>

        {/* Hover tooltip */}
        {hoveredSkill === skill.id && (
          <div className="skill-tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-3 opacity-100 pointer-events-none z-30">
            <div className="bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-2xl p-3 min-w-[200px] border border-gray-700/50">
              <h4 className="font-bold text-center mb-2 text-sm">
                {skill.name}
              </h4>
              <div className="flex items-center justify-center text-xs text-gray-300 mb-1">
                <Award size={12} className="mr-1 text-yellow-400" />
                <span>
                  {skill.avgEndorsements.toLocaleString()} endorsements
                </span>
              </div>
              <div className="flex items-center justify-center text-xs text-gray-300">
                <Users size={12} className="mr-1 text-blue-400" />
                <span>{skill.totalUsers.toLocaleString()} users</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Add viewport meta tag for mobile responsiveness
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content =
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <div className="flex">
        {/* Sidebar - fixed width */}
        <div className="w-64 fixed h-full">
          <DesktopSidebar />
        </div>

        {/* Header */}
        <div className="flex-1 ml-64">
          <div className="p-4 pb-2">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  Skill Universe Map
                </h1>
                <p className="text-gray-400 text-sm lg:text-base">
                  Explore the interconnected galaxy of professional skills
                </p>
              </div>

              <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-700">
                <button
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => handleZoom("out", e)}
                  disabled={transform.scale <= 0.5}
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs text-gray-300 min-w-[50px] text-center font-mono px-1">
                  {Math.round(transform.scale * 100)}%
                </span>
                <button
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => handleZoom("in", e)}
                  disabled={transform.scale >= 2.5}
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <div className="w-px h-6 bg-gray-600 mx-1"></div>
                <button
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={resetView}
                  title="Reset View"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 size={16} />
                  ) : (
                    <Maximize2 size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 pb-4">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Universe Visualization */}
          <div
            className={`${
              isFullscreen
                ? "fixed inset-4 z-50"
                : "h-[calc(100vh-200px)] mx-4 mb-4"
            } bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700`}
          >
            <div className="p-3 border-b border-gray-700 bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-white" size={16} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white text-sm">
                      Global Skill Network
                    </h2>
                    <p className="text-xs text-gray-400">
                      {filteredSkills.length} skills • Drag to explore • Tap to
                      select
                    </p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400">
                  <Move size={14} />
                  <span>Drag to pan</span>
                </div>
              </div>
            </div>

            <div
              ref={containerRef}
              className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 map-container ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{ touchAction: "none" }}
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Loading skill universe...</p>
                  </div>
                </div>
              ) : (
                <div
                  className="absolute inset-0 transition-transform duration-100 ease-out"
                  style={{
                    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
                    transformOrigin: "50% 50%",
                    willChange: "transform",
                  }}
                >
                  {/* SVG Connections */}
                  <svg
                    ref={svgRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ width: "1000px", height: "800px" }}
                  >
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {renderConnections}
                  </svg>

                  {/* Skill Bubbles */}
                  {filteredSkills.map((skill) => (
                    <SkillBubble key={skill.id} skill={skill} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Skill Modal */}
          {selectedSkill && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedSkill(null)}
            >
              <div
                className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[70vh] overflow-hidden border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-700 bg-gray-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {skills.find((s) => s.id === selectedSkill)?.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {skills
                          .find((s) => s.id === selectedSkill)
                          ?.totalUsers.toLocaleString()}{" "}
                        users •{" "}
                        {skills
                          .find((s) => s.id === selectedSkill)
                          ?.avgEndorsements.toLocaleString()}{" "}
                        avg endorsements
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSkill(null)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4 overflow-y-auto max-h-96">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          background: `linear-gradient(135deg, ${
                            skills.find((s) => s.id === selectedSkill)?.gradient
                              .from
                          }, ${
                            skills.find((s) => s.id === selectedSkill)?.gradient
                              .to
                          })`,
                        }}
                      />
                      Connected Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills
                        .find((s) => s.id === selectedSkill)
                        ?.connections?.slice(0, 6)
                        .map((connection, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs border border-gray-600 hover:bg-gray-600 transition-colors"
                          >
                            {connection}
                          </span>
                        ))}
                      {skills.find((s) => s.id === selectedSkill)?.connections
                        ?.length > 6 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs border border-gray-600">
                          +
                          {skills.find((s) => s.id === selectedSkill)
                            ?.connections?.length - 6}{" "}
                          more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-sm text-gray-300">
                          Average Rating
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < 4
                                ? "text-yellow-500 fill-current"
                                : "text-gray-600"
                            }
                          />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">
                          (4.2)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-green-500" size={16} />
                        <span className="text-sm text-gray-300">Trend</span>
                      </div>
                      <span className="text-sm text-green-400 font-medium">
                        ↗ Growing
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2">
                        <Award className="text-purple-500" size={16} />
                        <span className="text-sm text-gray-300">
                          Skill Level
                        </span>
                      </div>
                      <span className="text-sm text-purple-400 font-medium">
                        {skills.find((s) => s.id === selectedSkill)
                          ?.avgEndorsements > 1000
                          ? "Expert"
                          : skills.find((s) => s.id === selectedSkill)
                              ?.avgEndorsements > 500
                          ? "Advanced"
                          : "Intermediate"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Footer */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Active Users</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">
                      {skills
                        .reduce((sum, skill) => sum + skill.totalUsers, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Users className="text-white" size={16} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Connections</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">
                      {skills
                        .reduce(
                          (sum, skill) =>
                            sum + (skill.connections?.length || 0),
                          0
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="text-white"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 6v6" />
                      <path d="m21 12-6-3-6 3-6-3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-700 col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Skills</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">
                      {skills.length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-white" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
