# FluentDoc

FluentDoc is a open-source, desktop-first platform for creating, documenting, and managing constructed languages (conlangs).

It is designed for linguists, writers, worldbuilders, and creators who want a structured, powerful way to build languages locally with full control over their data.

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