"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
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
import { Stage, Layer, Circle, Line, Text } from "react-konva";
import DesktopSidebar from "@/components/navigation/desktop-sidebar";
import MobileNavigation from "@/components/navigation/mobile-navigation";
import { skillsData } from "@/lib/skills";

export default function SmoothSkillUniverseMap() {
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef(null);
  const containerRef = useRef(null);

  // Premium gradient colors optimized for white text
  const gradientColors = [
    { from: "#3a7bd5", to: "#00d2ff" },
    { from: "#834d9b", to: "#d04ed6" },
    { from: "#009245", to: "#fcee21" },
    { from: "#f12711", to: "#f5af19" },
    { from: "#654ea3", to: "#eaafc8" },
    { from: "#1488cc", to: "#2b32b2" },
    { from: "#bbd2c5", to: "#536976" },
    { from: "#9796f0", to: "#fbc7d4" },
    { from: "#b79891", to: "#94716b" },
    { from: "#acb6e5", to: "#86fde8" },
    { from: "#36d1dc", to: "#5b86e5" },
    { from: "#cb356b", to: "#bd3f32" },
    { from: "#283c86", to: "#45a247" },
    { from: "#8e0e00", to: "#1f1c18" },
    { from: "#1e3c72", to: "#2a5298" },
  ];

  // Generate skills data
  useEffect(() => {
    const generateSkillsData = () => {
      return skillsData.map((skill, index) => ({
        id: index + 1,
        name: skill.name,
        totalUsers: Math.floor(Math.random() * 5000) + 1000,
        avgEndorsements: skill.endorsements,
        connections: skill.connections,
        gradient: gradientColors[index % gradientColors.length],
        x: Math.random() * 800,
        y: Math.random() * 600,
      }));
    };

    setTimeout(() => {
      setSkills(generateSkillsData());
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [skills, searchTerm]);

  const getSkillSize = useCallback((skill) => {
    const baseSize = 50;
    const endorsementFactor = Math.log10(skill.avgEndorsements + 1) * 8;
    return Math.min(120, Math.max(40, baseSize + endorsementFactor));
  }, []);

  const handleZoom = useCallback((direction, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    setTransform((prev) => {
      const factor = direction === "in" ? 1.2 : 1 / 1.2;
      const newScale = Math.max(0.5, Math.min(2.5, prev.scale * factor));

      // Get center of the container for zooming
      const container = containerRef.current;
      if (!container) return { ...prev, scale: newScale };

      const center = {
        x: container.clientWidth / 2,
        y: container.clientHeight / 2,
      };

      const mousePointTo = {
        x: (center.x - prev.x) / prev.scale,
        y: (center.y - prev.y) / prev.scale,
      };

      return {
        x: center.x - mousePointTo.x * newScale,
        y: center.y - mousePointTo.y * newScale,
        scale: newScale,
      };
    });
  }, []);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  const handleDragMove = useCallback(
    (id, e) => {
      const updatedSkills = skills.map((skill) => {
        if (skill.id === id) {
          return {
            ...skill,
            x: e.target.x(),
            y: e.target.y(),
          };
        }
        return skill;
      });
      setSkills(updatedSkills);
    },
    [skills]
  );

  const handleStageWheel = useCallback(
    (e) => {
      e.evt.preventDefault();
      const scaleBy = 1.1;
      const stage = e.target.getStage();
      const oldScale = transform.scale;
      const pointer = stage.getPointerPosition();

      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - transform.x) / oldScale,
        y: (pointer.y - transform.y) / oldScale,
      };

      const newScale =
        e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      setTransform({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
        scale: Math.max(0.5, Math.min(2.5, newScale)),
      });
    },
    [transform]
  );

  const handleStageDragStart = useCallback((e) => {
    if (e.evt.button === 0 || e.evt.type === "touchstart") {
      setIsDragging(true);
      e.target.setAttrs({
        offsetX: e.target.x(),
        offsetY: e.target.y(),
      });
    }
  }, []);

  const handleStageDragMove = useCallback(
    (e) => {
      if (isDragging) {
        setTransform((prev) => ({
          ...prev,
          x: e.target.x(),
          y: e.target.y(),
        }));
      }
    },
    [isDragging]
  );

  const handleStageDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const renderConnections = useMemo(() => {
    const connections = [];
    const connectionMap = new Set();

    filteredSkills.forEach((skill) => {
      skill.connections?.forEach((connectionName) => {
        const connectedSkill = filteredSkills.find(
          (s) => s.name === connectionName
        );
        if (!connectedSkill) return;

        const connectionKey = `${Math.min(
          skill.id,
          connectedSkill.id
        )}-${Math.max(skill.id, connectedSkill.id)}`;
        if (connectionMap.has(connectionKey)) return;
        connectionMap.add(connectionKey);

        const isHighlighted =
          hoveredSkill === skill.id || hoveredSkill === connectedSkill.id;

        connections.push(
          <Line
            key={connectionKey}
            points={[skill.x, skill.y, connectedSkill.x, connectedSkill.y]}
            stroke={isHighlighted ? "#8b5cf6" : "#64748b"}
            strokeWidth={isHighlighted ? 2.5 : 1}
            opacity={isHighlighted ? 0.9 : 0.3}
            dash={isHighlighted ? null : [2, 2]}
            perfectDrawEnabled={false}
            listening={false}
          />
        );
      });
    });

    return connections;
  }, [filteredSkills, hoveredSkill]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (stageRef.current && containerRef.current) {
        stageRef.current.width(containerRef.current.clientWidth);
        stageRef.current.height(containerRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <div className="flex">
        {/* Sidebar - fixed width */}
        <div className="w-64 fixed h-full">
          <DesktopSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 ml-0 md:ml-64">
          <div className="p-4 lg:p-8 pb-20 lg:pb-8">
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
            ref={containerRef}
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

            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Loading skill universe...</p>
                </div>
              </div>
            ) : (
              <Stage
                ref={stageRef}
                width={containerRef.current?.clientWidth || 800}
                height={containerRef.current?.clientHeight || 600}
                scaleX={transform.scale}
                scaleY={transform.scale}
                x={transform.x}
                y={transform.y}
                onWheel={handleStageWheel}
                onDragStart={handleStageDragStart}
                onDragMove={handleStageDragMove}
                onDragEnd={handleStageDragEnd}
                onTouchStart={handleStageDragStart}
                onTouchMove={handleStageDragMove}
                onTouchEnd={handleStageDragEnd}
                draggable
              >
                <Layer>
                  {renderConnections}
                  {filteredSkills.map((skill) => {
                    const size = getSkillSize(skill);
                    const isActive =
                      hoveredSkill === skill.id || selectedSkill === skill.id;

                    return (
                      <Circle
                        key={skill.id}
                        x={skill.x}
                        y={skill.y}
                        radius={size / 2}
                        fillLinearGradientStartPoint={{
                          x: -size / 2,
                          y: -size / 2,
                        }}
                        fillLinearGradientEndPoint={{
                          x: size / 2,
                          y: size / 2,
                        }}
                        fillLinearGradientColorStops={[
                          0,
                          skill.gradient.from,
                          1,
                          skill.gradient.to,
                        ]}
                        shadowColor="black"
                        shadowBlur={10}
                        shadowOpacity={0.5}
                        shadowOffsetX={0}
                        shadowOffsetY={0}
                        draggable
                        onDragMove={(e) => handleDragMove(skill.id, e)}
                        onMouseEnter={() => setHoveredSkill(skill.id)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        onClick={() => {
                          if (!isDragging) {
                            setSelectedSkill(
                              selectedSkill === skill.id ? null : skill.id
                            );
                          }
                        }}
                        onTap={() => {
                          if (!isDragging) {
                            setSelectedSkill(
                              selectedSkill === skill.id ? null : skill.id
                            );
                          }
                        }}
                        scaleX={isActive ? 1.1 : 1}
                        scaleY={isActive ? 1.1 : 1}
                      />
                    );
                  })}
                </Layer>
              </Stage>
            )}
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
                {/* Modal content */}
              </div>
            </div>
          )}

          {/* Stats Footer */}
          <div className="px-4 pb-4">{/* Stats content */}</div>
        </div>
      </div>
      <MobileNavigation />
    </div>
  );
}
