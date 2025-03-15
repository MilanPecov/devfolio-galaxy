
import React from 'react';
import { Database, Server, Code } from 'lucide-react';

// Function to get icon component based on name from frontmatter
export const getIconComponent = (iconName: string = 'Code', colorClass: string = 'blue'): React.ReactNode => {
  switch (iconName) {
    case 'Database':
      return <Database className={`w-6 h-6 text-${colorClass}-600`} />;
    case 'Server':
      return <Server className={`w-6 h-6 text-${colorClass}-600`} />;
    case 'Code':
      return <Code className={`w-6 h-6 text-${colorClass}-600`} />;
    default:
      return <Code className="w-6 h-6 text-blue-600" />;
  }
};
