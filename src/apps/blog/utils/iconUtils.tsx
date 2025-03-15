import React from "react";
import { Database, Server, Code } from "lucide-react";

// Define available icons with correct types
const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Database,
  Server,
  Code,
};

// Define allowed colors for Tailwind classes
const colorMap: Record<string, string> = {
  blue: "text-blue-600",
  red: "text-red-600",
  green: "text-green-600",
  gray: "text-gray-600",
  yellow: "text-yellow-600",
  purple: "text-purple-600",
};

// Function to get the correct icon component
export const getIconComponent = (
  iconName: keyof typeof iconMap = "Code",
  colorClass: keyof typeof colorMap = "blue"
): JSX.Element => {
  // Get the icon component (fixing the TypeScript type issue)
  const IconComponent = iconMap[iconName] || Code;

  // Get the color class
  const textColor = colorMap[colorClass] || "text-blue-600";

  // Using React.createElement avoids JSX syntax issues in .ts files
  return React.createElement(IconComponent, {
    className: `w-6 h-6 ${textColor}`,
  });
};
