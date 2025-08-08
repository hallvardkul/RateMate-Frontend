# RateMate Frontend

RateMate is a modern web application for product reviews and ratings. This repository contains the frontend implementation built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 User Authentication
  - Login and Registration
  - Protected Routes
  - User Profile Management

- 🛍️ Product Management
  - Product Grid Display
  - Product Details
  - Product Search and Filtering

- ⭐ Review System
  - Product Reviews
  - Rating System
  - Review Comments
  - Like/Unlike Reviews

- 👤 User Features
  - Profile Management
  - Review History
  - Personal Settings

## Tech Stack

- **Framework**: React with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **State Management**: React Context
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Authentication**: JWT

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   └── reviews/
│       ├── ReviewForm.tsx
│       └── ReviewList.tsx
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProfilePage.tsx
│   ├── ProductsPage.tsx
│   └── ProductDetailPage.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
└── App.tsx
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:7071/api
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The application communicates with a backend API through the following services:

- `authService`: Authentication operations
- `userService`: User profile management
- `productService`: Product-related operations
- `reviewService`: Review management
- `commentService`: Comment operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)
- [Heroicons](https://heroicons.com/)
