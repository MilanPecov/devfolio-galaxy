import React from "react";
import { Database, Server, Code } from "lucide-react";

/**
 * Service responsible for handling icons in the application.
 */
export class IconService {
  /**
   * Get the correct icon component with the appropriate color
   * @param iconName Name of the icon (default: "Code")
   * @param colorClass Color of the icon (default: "blue")
   * @returns JSX.Element representing the icon
   */
  public getIcon(iconName: keyof typeof IconService.iconMap = "Code", colorClass: keyof typeof IconService.colorMap = "blue"): JSX.Element {
    const IconComponent = IconService.iconMap[iconName] || Code;
    const textColor = IconService.colorMap[colorClass] || "text-blue-600";

    return React.createElement(IconComponent, {
      className: `w-6 h-6 ${textColor}`,
    });
  }

  // Define available icons with correct types
  private static iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    Database,
    Server,
    Code,
  };

  // Define allowed colors for Tailwind classes
  private static colorMap: Record<string, string> = {
    blue: "text-blue-600",
    red: "text-red-600",
    green: "text-green-600",
    gray: "text-gray-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
  };

}
