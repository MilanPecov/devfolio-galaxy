
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-8">
            Feel free to reach out through any of these channels.
          </p>

          {/* Contact List */}
          <div className="max-w-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="mailto:milan.pecov91@gmail.com"
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Mail className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">E-mail</span>
            </a>

            <a
              href="https://www.linkedin.com/in/milan-pecov/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Linkedin className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">LinkedIn</span>
            </a>

            <a
              href="https://github.com/milanpecov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Github className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">GitHub</span>
            </a>

            <a
              href="https://twitter.com/milanpecov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Twitter className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
