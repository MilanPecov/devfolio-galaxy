
const skills = [
  {
    category: "Engineering Leadership",
    items: [
      "Team Leadership",
      "Technical Vision",
      "Architecture Design",
      "Mentoring & Coaching",
      "Agile Methodologies",
      "Security & Compliance (PCI)",
      "Cross-Functional Collaboration",
    ],
  },
  {
    category: "Software Design",
    items: [
      "Clean Code",
      "Domain-Driven Design",
      "Design Patterns",
      "Event-Driven & Service-Oriented Architectures",
      "Modular Monolith Design",
      "Test-Driven Development",
    ],
  },
  {
    category: "Backend",
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
    items: ["GCP", "Kubernetes", "AWS", "Heroku", "Linode"],
  },
  {
    category: "AI & Data",
    items: [
      "LangChain",
      "Pinecone",
      "LLM Prompt Engineering",
      "RAG Approach",
    ],
  },
  {
    category: "Observability & Monitoring",
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
  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-2 bg-primary rounded-full text-sm font-medium mb-4">
            Skills
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Technology Proficiency
          </h2>
          <p className="text-gray-600">
            Expertise across software design, backend, frontend, cloud, data, and leadership.
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
