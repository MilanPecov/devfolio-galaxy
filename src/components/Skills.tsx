
const skills = [
  {
    category: "Engineering Leadership",
    items: [
      "Team Leadership",
      "Technical Vision",
      "Architecture Design",
      "Mentoring",
      "PCI Compliance",
    ],
  },
  {
    category: "Backend & Infrastructure",
    items: [
      "Python",
      "Django",
      "Node.js",
      "PostgreSQL",
      "ClickHouse",
      "Kubernetes",
    ],
  },
  {
    category: "Frontend & Tools",
    items: [
      "React.js",
      "TypeScript",
      "Next.js",
      "Angular.js",
      "CI/CD",
      "Docker",
    ],
  },
  {
    category: "Cloud & Databases",
    items: [
      "Google Cloud",
      "AWS",
      "MongoDB",
      "Redis",
      "Cassandra",
      "RabbitMQ",
    ],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-2 bg-primary rounded-full text-sm font-medium mb-4">
            Skills
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Technical Expertise
          </h2>
          <p className="text-gray-600">
            Over a decade of experience in building and scaling enterprise systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-xl font-semibold mb-4">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 bg-secondary rounded-lg text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
