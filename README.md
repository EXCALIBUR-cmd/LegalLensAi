# LegalLens AI

An AI-assisted platform for simplifying legal document analysis, offering summarized insights and identifying key clauses for non-legal professionals.

## Problem it Solves

Demystifies complex legal jargon, making legal documents more accessible and understandable for individuals and small businesses who may not have immediate access to legal counsel.

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Prisma** - Modern ORM for database management
- **PostgreSQL** - Robust relational database
- **Grok AI (Llama model)** - Natural language processing, summarization, and key phrase extraction
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth** - Authentication (ready for implementation)

## Features

- 📄 **Document Upload** - Easy drag-and-drop interface for legal documents
- 🤖 **AI-Powered Analysis** - Powered by Grok AI with Llama model
- 📝 **Clear Summaries** - Plain language summaries of complex legal text
- 🔍 **Key Clause Identification** - Automatically identifies important clauses
- 📚 **Legal Term Explanation** - Simplified definitions of legal terminology
- ⚠️ **Risk Assessment** - Identifies potential risks and considerations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Grok AI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LegalLens
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- `DATABASE_URL` - Your PostgreSQL connection string
- `GROK_API_KEY` - Your Grok AI API key
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for development)

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
LegalLens/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── analyze/       # Document analysis endpoint
│   │   │   └── documents/     # Document management
│   │   ├── dashboard/         # Dashboard page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── AnalysisResult.tsx # Analysis display component
│   │   └── DocumentUpload.tsx # Document upload component
│   └── lib/
│       ├── grok-ai.ts         # Grok AI service
│       ├── prisma.ts          # Prisma client
│       └── utils.ts           # Utility functions
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## API Routes

### POST /api/documents
Upload a new legal document.

### GET /api/documents?userId={userId}
Retrieve all documents for a user.

### POST /api/analyze
Analyze a document with Grok AI.

### GET /api/analyze?documentId={documentId}
Retrieve analysis results for a document.

## Database Schema

- **User** - User accounts
- **Document** - Uploaded legal documents
- **Analysis** - AI-generated analysis results

## Grok AI Integration

The platform uses Grok AI (Llama model) for:
- Document summarization
- Key clause extraction
- Legal term simplification
- Risk factor identification

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

## Deployment

This is a Next.js app that can be deployed to:
- Vercel (recommended)
- AWS
- Google Cloud
- Any Node.js hosting platform

Ensure environment variables are properly configured in your deployment platform.

## Future Enhancements

- [ ] User authentication with NextAuth
- [ ] Document history and management
- [ ] Export analysis results to PDF
- [ ] Support for more document formats
- [ ] Collaborative features
- [ ] Advanced search and filtering
- [ ] Multi-language support

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
