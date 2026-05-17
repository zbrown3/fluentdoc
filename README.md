# FluentDoc

FluentDoc is a open-source, desktop-first platform for creating, documenting, and managing constructed languages (conlangs).

It is designed for linguists, writers, worldbuilders, and creators who want a structured, powerful way to build languages locally with full control over their data.

---

## 🚫 AI-Free by Design

FluentDoc is, and will remain, **AI-free as a product**.

Constructing a language is a deeply human act — one of creativity, intention, and craft. FluentDoc exists to give creators powerful tools to express that process, not to automate or assist it with AI. There are no AI suggestions, no auto-generated vocabulary, no grammar inference, and no "smart" completion features. Every word, rule, and structure in a language built with FluentDoc comes from its creator.

**AI in development is permitted. AI as a feature is not.**

Contributors may use AI tools to write code, improve infrastructure, or assist with documentation. These are acceptable uses that make the platform better. However, **no AI-driven functionality may be introduced as a user-facing feature** — regardless of how it is framed or how optional it appears. This line is firm and non-negotiable.

If you are considering contributing an AI-powered feature, do not open a pull request. The answer will be no.

---

## ✨ Vision

FluentDoc aims to become the standard tool for language creation.

By combining structured linguistic tooling with creative worldbuilding, FluentDoc empowers users to:

- Build complete languages from scratch
- Organize vocabulary, grammar, and phonology
- Develop cultures and worlds around their languages
- Work fully offline with local data ownership

---

## 🖥️ Project Structure

```text
fluentdoc/
├── apps/
│   └── client/        # Angular frontend
├── services/
│   └── api/           # Spring Boot backend
├── desktop/           # Electron desktop wrapper (in progress)
├── scripts/           # Build and packaging scripts
├── docs/              # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Java 17+

---

### Run the API

```bash
cd services/api
./mvnw spring-boot:run
```

---

### Run the Client

```bash
cd apps/client
npm install
npm start
```

---

## 🧱 Current Direction

FluentDoc is being developed as a desktop-first, local application.

- No required cloud services
- No required accounts
- Full local data ownership
- Export/import for portability

---

## 🤝 Contributing

Contributions are welcome.

If you’d like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please keep changes focused and well-documented.

---

## 👥 Authors

FluentDoc is created and maintained by:

- Patrick Gaston (Owner)
- Judy Switzer
- Jessica Yuan
- Johnny Bui

---

## 📄 License

MIT

---

## 🌐 About

FluentDoc is part of a broader vision to support language creation, creativity, and expression through powerful, accessible tools.