"use client";

import dynamic from "next/dynamic";

const SmoothSkillUniverseMap = dynamic(
  () => import("../../components/SmoothSkillUniverseMap"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function Page() {
  return <SmoothSkillUniverseMap />;
}
