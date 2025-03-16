
import { useEffect, useState } from "react";
import { CheckCircle, Code, Database, Server, BrainCircuit, Users, Layout, Cloud, LineChart, Layers, MessageSquareCode, Share, Network } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

// Group skills by higher-level categories
const skillGroups = [
  {
    name: "Leadership & Architecture",
    categories: ["Engineering Leadership", "Software Design", "Domain Knowledge"],
    icon: <Layers className="h-5 w-5 text-indigo-600" />,
  },
  {
    name: "Development",
    categories: ["Backend", "Frontend", "Other Technologies"],
    icon: <Code className="h-5 w-5 text-indigo-600" />,
  },
  {
    name: "Infrastructure",
    categories: ["Databases & Cache", "Cloud Services", "Observability & Monitoring"],
    icon: <Server className="h-5 w-5 text-indigo-600" />,
  },
  {
    name: "AI & Emerging",
    categories: ["AI & Data"],
    icon: <BrainCircuit className="h-5 w-5 text-indigo-600" />,
  },
];

// Skills data structure
const skills = [
  {
    category: "Engineering Leadership",
    icon: <Users className="h-5 w-5 text-indigo-500" />,
    items: [
      "Technical Vision",
      "Team Leadership",
      "Mentoring & Coaching",
      "Agile Methodologies",
      "Security & Compliance (PCI)",
      "Cross-Functional Collaboration",
    ],
  },
  {
    category: "Software Design",
    icon: <Network className="h-5 w-5 text-indigo-500" />,
    items: [
      "Clean Code",
      "Domain-Driven Design",
      "Design Patterns",
      "Event-Driven Architectures",
      "Service-Oriented Architecture",
      "Multi-Tenancy Architecture",
      "Modular Monolith Design",
      "Test-Driven Development",
    ],
  },
  {
    category: "Domain Knowledge",
    icon: <MessageSquareCode className="h-5 w-5 text-indigo-500" />,
    items: [
      "Enterprise Systems",
      "E-commerce Platforms",
      "Booking Systems",
      "Payments & Financial Systems",
      "Data Pipelines & ETL Workflows",
      "Geospatial Data & PostGIS",
      "High-Performance Caching Strategies",
      "Real-Time Data Processing",
    ],
  },
  {
    category: "Backend",
    icon: <Server className="h-5 w-5 text-indigo-500" />,
    items: [
      "Python",
      "Django",
      "Celery",
      "FastAPI",
      "Flask",
      "Node.js",
      "Go",
    ],
  },
  {
    category: "Frontend",
    icon: <Layout className="h-5 w-5 text-indigo-500" />,
    items: [
      "JavaScript",
      "TypeScript",
      "ReactJS",
      "NextJS",
      "AngularJS",
    ],
  },
  {
    category: "Databases & Cache",
    icon: <Database className="h-5 w-5 text-indigo-500" />,
    items: [
      "PostgreSQL",
      "MySQL",
      "BigQuery",
      "ClickHouse",
      "MongoDB",
      "Cassandra",
      "Redis",
      "Memcached",
    ],
  },
  {
    category: "Cloud Services",
    icon: <Cloud className="h-5 w-5 text-indigo-500" />,
    items: ["GCP", "Kubernetes", "AWS", "Heroku", "Linode"],
  },
  {
    category: "AI & Data",
    icon: <BrainCircuit className="h-5 w-5 text-indigo-500" />,
    items: [
      "Agent Design",
      "RAG",
      "LangChain",
      "Pinecone",
      "Prompt Engineering",
    ],
  },
  {
    category: "Observability & Monitoring",
    icon: <LineChart className="h-5 w-5 text-indigo-500" />,
    items: [
      "Datadog",
      "Grafana",
      "Prometheus",
      "Sentry",
      "Elastic Stack",
    ],
  },
  {
    category: "Other Technologies",
    icon: <Code className="h-5 w-5 text-indigo-500" />,
    items: [
      "Nginx",
      "Apache Server",
      "Docker",
      "RabbitMQ",
      "Kafka",
      "Git",
      "Linux/Debian",
    ],
  },
];

const Skills = () => {
  const [activeGroup, setActiveGroup] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleItems, setVisibleItems] = useState<{ [key: string]: number }>({});
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Initialize with 5 items per category
  useEffect(() => {
    const initialVisibleItems: { [key: string]: number } = {};
    skills.forEach(skill => {
      initialVisibleItems[skill.category] = 5;
    });
    setVisibleItems(initialVisibleItems);
  }, []);

  const handleShowMore = (category: string) => {
    setVisibleItems(prev => ({
      ...prev,
      [category]: skills.find(s => s.category === category)?.items.length || 0
    }));
  };

  const handleShowLess = (category: string) => {
    setVisibleItems(prev => ({
      ...prev,
      [category]: 5
    }));
  };

  const categories = ["all", ...skills.map(s => s.category)];
  const groups = ["all", ...skillGroups.map(g => g.name)];

  // Filter skills based on active group
  const filteredSkills = activeGroup === "all" 
    ? skills 
    : skills.filter(skill => {
        const group = skillGroups.find(g => g.name === activeGroup);
        return group ? group.categories.includes(skill.category) : false;
      });

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-2 bg-primary rounded-full text-sm font-medium mb-4">
            Skills
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Technology Proficiency
          </h2>
          <p className="text-gray-600">
            Expertise across system design, domain knowledge, backend, frontend, cloud, and leadership.
          </p>
        </div>

        <div className="mb-10">
          {/* Main tabs for skill groups */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="flex flex-wrap justify-center mb-8 bg-transparent h-auto">
              {groups.map((group) => (
                <TabsTrigger
                  key={group}
                  value={group}
                  onClick={() => {
                    setActiveGroup(group);
                    setActiveCategory("all");
                  }}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white m-1 rounded-full px-5 py-2 text-sm transition-all duration-200 hover:opacity-90"
                >
                  {group === "all" ? "All Skills" : group}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Secondary tabs for individual categories, only shown when not in "all" group view */}
            {activeGroup !== "all" && (
              <div className="flex flex-wrap justify-center mb-8 gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                    activeCategory === "all" 
                      ? "bg-indigo-100 text-indigo-700 font-medium" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All {activeGroup} Skills
                </button>
                
                {skillGroups.find(g => g.name === activeGroup)?.categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                      activeCategory === cat 
                        ? "bg-indigo-100 text-indigo-700 font-medium" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Content tab for "all" group or group + "all" category */}
            <TabsContent value={activeGroup} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills
                  .filter(skill => activeCategory === "all" || skill.category === activeCategory)
                  .map((skill, index) => (
                    <div
                      key={index}
                      className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-3 rounded-full bg-indigo-50 mr-3">
                          {skill.icon}
                        </div>
                        <h3 className="text-xl font-semibold">{skill.category}</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {skill.items.slice(0, visibleItems[skill.category] || 5).map((item) => (
                          <span
                            key={item}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                              hoveredSkill === item 
                                ? "bg-primary text-white scale-105" 
                                : "bg-secondary hover:bg-indigo-100"
                            }`}
                            onMouseEnter={() => setHoveredSkill(item)}
                            onMouseLeave={() => setHoveredSkill(null)}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      
                      {skill.items.length > 5 && (
                        <div className="mt-4 text-right">
                          {visibleItems[skill.category] === 5 ? (
                            <button 
                              onClick={() => handleShowMore(skill.category)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              Show all ({skill.items.length})
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleShowLess(skill.category)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              Show less
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </TabsContent>

            {/* Individual category view - only rendered when directly selecting a category from the main tabs */}
            {activeGroup === "all" && skills.map((skill) => (
              <TabsContent key={skill.category} value={skill.category} className="mt-6">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-full bg-indigo-50 mr-4">
                      {skill.icon}
                    </div>
                    <h3 className="text-2xl font-semibold">{skill.category}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skill.items.map((item) => (
                      <div 
                        key={item}
                        className="flex items-center p-3 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                      >
                        <CheckCircle className="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" />
                        <span className="text-left">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Skills;
