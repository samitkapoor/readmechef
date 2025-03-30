# ReadmeChef 🍳

> Cooking the perfect README every single time

ReadmeChef is a web application that helps developers and organizations create beautiful, comprehensive README files for their GitHub repositories in minutes.

## Features

- **Template Library**: Choose from dozens of professionally designed README templates tailored for different project types
- **One-Click Import**: Import your project details directly from GitHub to automatically populate your README
- **Live Preview**: See your README changes in real-time with our live Markdown preview editor
- **Rate Limiting**: Protected API endpoints with rate limiting to ensure fair usage

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/readmechef-frontend.git
cd readmechef-frontend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for building the frontend
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) - Rate limiting for API endpoints

## Rate Limiting

The application implements rate limiting to protect API endpoints from abuse:

- All API endpoints: 100 requests per 15 minutes per IP

Rate limiting is implemented in a simple middleware that applies to all API routes. When the rate limit is exceeded, the API returns a 429 status code with a message to try again later.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
