---
slug: scalable-saas-tech-stack
title: A Scalable Stack for Small Teams Who Build Big
excerpt: A deep dive into the architecture, tools, and philosophy behind building SaaS systems designed to scale—crafted by hands-on builders who live in the code and the cloud.
date: March 17, 2025
readTime: 9 min read
categories:
  - Software Architecture
  - Cloud
  - DevOps
  - SaaS
  - Engineering Craft
  - Django
icon: Server
iconColor: indigo
---

Building software is a delicate dance between vision and practicality. Some mornings, I'm an architect—floating above the system, painting abstractions in broad, confident strokes. By evening, I'm a craftsman deep within the gears, debugging reality line by line, resolving contradictions byte by byte.

And while some say software is built by armies, I’ve learned that small, focused teams can build systems that scale just as big. What you're about to see isn't just another tech stack list. It’s the living blueprint of an idea shaped into reality—architected with clarity, tempered by hands-on craftsmanship, and relentlessly optimized for the real world. Here's how one pair of hands keeps it all humming.

## Software Architecture & Design

My architecture revolves around clean, decoupled layers that interact exclusively through RESTful APIs. This separation allows each part of the application to evolve independently, making the system flexible, maintainable, and highly scalable.

- **REST APIs:** Divided clearly into read and write endpoints. Read APIs are optimized with caching strategies for swift data retrieval, ensuring rapid response times for users. Write APIs are strictly transactional, guaranteeing data integrity and consistency.
- **Domain-Driven Design (DDD):** Employed heavily in domain logic areas where business complexity is significant, ensuring clear boundaries and high cohesion.
- **Active Record for CRUD:** Utilized primarily for simpler operations such as user profile updates or straightforward data management tasks.

## Networking and Reverse Proxy

- **DNS Server (BIND in Docker):** For local development, I run a lightweight Alpine-based Docker container with BIND configured as a master DNS server. This provides a controlled DNS zone for testing service discovery and domain-based routing without external dependencies. Zones are crafted to resolve service domains to container IPs or localhost, supporting reproducible network behavior in test and CI environments.

- **NGINX / Nginx-Ingress:** NGINX acts as the reverse proxy in local setups, forwarding requests to services running inside Docker containers (e.g., `host.docker.internal:8000`). In production, `nginx-ingress` in Kubernetes manages external traffic routing, TLS termination, and load balancing across services.

- **mkcert:** For local HTTPS support, mkcert generates trusted self-signed certificates. This allows testing realistic HTTPS flows—cookies, SameSite, secure headers—without the headache of browser warnings.

## UI Layer and Presentation Logic

- **React, Next.js & TypeScript:** Back in the day, I leaned heavily on AngularJS for building UIs. Over time, I grew comfortable with React’s component model and flexibility. Today, I use React paired with Next.js and TypeScript for rendering, type safety, and routing—embracing a fully decoupled architecture that keeps the frontend snappy, predictable, and cleanly separated from the backend.

## Web Application Logic

- **Django & Django REST Framework:** I use Django and its ORM to model domain logic and services cleanly within the backend. These services are designed to be decoupled from the framework's request/response cycle, making them easy to test in isolation or invoke from Celery tasks without relying on framework objects like `request`. The domain logic is then surfaced through two main interfaces: Django Admin for internal management via HTTP forms, and DRF viewsets to expose a RESTful API for the UI and external integrations. This dual approach offers flexibility, enabling admin-driven workflows, API-first interactions, and direct programmatic use within the system.
- **Celery & Celery Beat:** Celery handles background jobs smoothly, helping offload compute-bound tasks and workflows that could block the main application. It's my go-to for sending emails, processing intensive commands, or running complex workflows asynchronously. Celery Beat orchestrates scheduled tasks effortlessly, making recurring jobs like report generation or periodic cleanups a breeze.

## Databases and Storage

- **PostgreSQL (OLTP):** Battle-tested, reliable, and wonderfully predictable. A staple for application data.
- **ClickHouse (OLAP):** Handling analytics with finesse. If you have to crunch millions of events without breaking the bank, ClickHouse is your friend.
- **Redis:** Multi-purpose powerhouse—for caching, sessions, rate-limiting, or quick key-value storage with TTL.
- **AWS S3:** Bulletproof object storage, ideal for backups, media files, or anything you can toss into a bucket.

## DevOps and Deployment

- **Kubernetes:** While some may call it overkill for solo projects, the ease of scaling, deployment, and fault-tolerance Kubernetes offers makes it worthwhile.
- **Python Fabric:** Simple, elegant deployment scripts wrapped neatly around my UI libraries. No manual SSH-ing or midnight firefighting.
- **GitHub Actions & Google Cloud Build Triggers:** CI/CD automation ensures smooth deployments without breaking a sweat—or my sleep schedule.

## Infrastructure

- **GCP & AWS:** Two clouds, one approach—leverage powerful managed services. I lean heavily on them, preferring less infrastructure babysitting.
- **Namecheap:** Solid registrar with no surprise fees—plus multi-factor authentication for that extra peace of mind.

## Monitoring & Observability

- **Sentry:** Quick to alert when something breaks; essential for restful nights.
- **Datadog APM:** Detailed performance insights keep my SaaS fast and responsive—because milliseconds matter.

## Command Line Heroes

- **kubectl:** Kubernetes management made easy.
- **wrk:** Rapid API load testing at your fingertips.

## Integrations

- **Email:** SendGrid, reliable and scalable email delivery.
- **SMS:** Twilio, seamless messaging capabilities.
- **Payments:** Stripe, because payment processing shouldn’t give you headaches.

## Project & Design Tools

- **Trello (small projects), JIRA (big projects):** Project tracking that fits the project's scale.
- **Figma:** Slick designs and quick prototyping—what's not to love?

## Development Environment

- **PyCharm:** Python refactoring magic in one powerful IDE.
- **PyEnv & NVM:** For smooth sailing across Python and Node.js versions.
- **GitHub & Bitbucket:** Because solid version control is non-negotiable.
- **PIP & NPM:** Dependency management made elegant and manageable.
- I bundle commands into Django’s manage.py for consistency (`python manage.py postpull` is my personal favorite).

That’s my stack, laid bare—engineered for productivity, reliability, and simplicity.

In the end, it’s not just the tools—it’s how they come together in service of building something real. Systems that scale, code that survives, and products that reach people. Whether it’s one person or ten, the craft stays the same.
