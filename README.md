# Pastebox

Pastebox is a modern local-first paste management app built with React and Vite.

It allows users to create, edit, organize, search, favorite, copy, import, and export text or code snippets directly in the browser.

## Live Demo

https://dainty-klepon-bfef4d.netlify.app/

## Features

- Create and edit pastes
- Search by title, content, or tags
- Add tags and programming languages
- Mark pastes as favorites
- Sort by newest, oldest, or title
- Dark mode
- Auto-save drafts
- Word and character count
- Copy content to clipboard
- Import and export JSON backups
- Code-friendly preview
- Delete confirmation
- Responsive design
- Keyboard shortcut: `Ctrl + Enter` or `Cmd + Enter` to save

## Tech Stack

- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- React Hot Toast
- LocalStorage

## Getting Started

Clone the repository:

```bash
git clone https://github.com/kamaldeepyt2/pastebox.git
cd pastebox
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Available Commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Data Storage

Pastebox uses browser localStorage for saving data.

Data is stored separately in each browser and is not shared automatically between users or devices.

## Author

Created by [Kamaldeep](https://github.com/kamaldeepyt2)

## License

This project is for learning and personal use.
