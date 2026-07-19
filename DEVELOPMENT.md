# GenEdu Development Guide

## 🚀 Quick Development Setup

### Prerequisites
- Node.js 18+
- MongoDB with replica set
- FFmpeg installed
- OpenAI API key
- Gamma API key

### Environment Setup

#### Backend Environment (.env)
```bash
# Database
DATABASE_URL=mongodb://localhost:27017/genedu

# API Keys
OPENAI_API_KEY=your_openai_api_key_here
GAMMA_API_KEY=your_gamma_api_key_here

# JWT
JWT_SECRET=your_jwt_secret_here

# Server
PORT=3000
NODE_ENV=development
```

#### Frontend Environment (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🏗️ Development Workflow

### 1. Start Development Servers

#### Terminal 1 - Backend
```bash
cd server
yarn install
yarn generate  # Generate Prisma client
yarn dev       # Start NestJS server
```

#### Terminal 2 - Bot Service
```bash
cd server
yarn bot:dev   # Start background processing bot
```

#### Terminal 3 - Frontend
```bash
cd client
yarn install
yarn dev       # Start Next.js server
```

### 2. Database Setup

#### MongoDB Replica Set
```bash
# Start MongoDB
mongod --replSet rs0

# In mongosh
rs.initiate()
```

#### Prisma Operations
```bash
# Generate client (safe)
yarn generate

# NEVER use this (dangerous for MongoDB)
# yarn prisma db push

# Create migration
yarn mongo-migrate:new -n migration_name

# Apply migrations
yarn mongo-migrate:up

# Rollback
yarn mongo-migrate:down
```

## 🔧 Development Patterns

### Backend Service Pattern
```typescript
@Injectable()
export class ExampleService {
  constructor(
    private readonly repository: ExampleRepository,
    private readonly externalApi: ExternalApiService
  ) {}

  async processData(data: any) {
    try {
      coloredLog({ content: `[START_PROCESS]`, color: "yellow" })
      
      // Processing logic
      const result = await this.externalApi.process(data)
      
      coloredLog({ content: `[FINISHED_PROCESS]`, color: "green" })
      return result
    } catch (error: any) {
      const message_error = `[ERROR_PROCESS]: ${error.message}`
      coloredLog({ content: message_error, color: "red" })
      throw new Error(message_error)
    }
  }
}
```

### Frontend Component Pattern
```typescript
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Toast } from "primereact/toast"

export default function ExampleComponent() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const { control, handleSubmit } = useForm()
  const toast = useRef<Toast>(null)

  const handleSave = async (formData: any) => {
    setLoading(true)
    try {
      const result = await Service.save(formData)
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Data saved successfully",
        life: 3000,
      })
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Toast ref={toast} />
      {/* Component content */}
    </div>
  )
}
```

## 📁 File Organization

### Backend Structure
```
server/src/
├── modules/
│   ├── api/                 # External API integrations
│   │   └── services/
│   │       ├── openai/      # OpenAI API
│   │       └── gamma-api.service.ts
│   ├── content/               # Content management
│   │   ├── controllers/     # HTTP controllers
│   │   ├── dto/            # Data transfer objects
│   │   ├── entities/       # TypeScript entities
│   │   ├── enum/           # Enums
│   │   ├── repositories/   # Data access layer
│   │   └── services/       # Business logic
│   ├── media/                # Media management
│   ├── transcription/        # Transcription management
│   ├── text-content/         # Text content management
│   ├── presentation/         # Presentation management
│   └── ...
├── database/               # Database layer
├── common/                 # Shared utilities
└── prisma/                 # Database schema
```

### Frontend Structure
```
client/src/app/
├── (admin)/                # Admin panel
│   ├── panel/
│   │   ├── generation/contents/
│   │   │   ├── _components/    # Content components
│   │   │   ├── _services/      # API services
│   │   │   ├── text-generated/ # Text viewer
│   │   │   └── presentation-generated/ # Presentation viewer
│   │   └── ...
│   └── _configs/           # Configuration
├── (website)/              # Public website
└── _common/                # Shared components
    ├── components/         # Reusable components
    ├── models/            # TypeScript interfaces
    ├── utilities/         # Helper functions
    └── services/          # API services
```

## 🔄 Processing Workflow

### Content Processing States
```typescript
enum ContentStatus {
  PENDING = 0,                    // Initial state
  DOWNLOADING_MEDIA = 1,          // Downloading media
  CONVERTING_AUDIO = 2,           // Converting to audio
  TRANSCRIBING_AUDIO = 3,         // Transcribing audio
  GENERATING_TEXT = 4,            // Generating educational text
  REQUEST_PRESENTATION = 5,       // Request Create presentation
  GENERATING_PRESENTATION = 6,    // Check Status Creating presentation
  DOWNLOADING_PRESENTATION = 7,   // Download Presentation
  COMPLETED = 8,                  // Finished
  ERROR = 9,                      // Error occurred
  CANCELED = 10,                  // User canceled
  PARTIAL = 11,                   // Partial completion
}
```

### Bot Service Loop
```typescript
async startBot() {
  while (true) {
    try {
      await this.processingService.processDownloadMedia() //Step 1
      await this.processingService.processConversionAudio() //Step 2
      await this.processingService.processTranscription() //Step 3
      await this.processingService.processText() //Step 4
      await this.processingService.processRequestPresentation() //Step 5
      await this.processingService.processPresentationGeneration() //Step 6
      await this.processingService.processDownloadPresentation() //Step 7
      await delay(1) // 1 second delay
    } catch (error) {
      console.error("Error in startBot:", error)
    }
  }
}
```

## 🛠️ Common Development Tasks

### Adding New Status
1. Update `ContentStatus` enum
2. Add to `contentStatusArray` in frontend
3. Add styling in `contentStatusTemplate`
4. Update processing logic in `ContentService`

### Adding New API Integration
1. Create service in `modules/api/services/`
2. Add to `ApiModule` providers
3. Inject into `ContentService`
4. Implement error handling and logging

### Adding New Frontend Page
1. Create page in `app/(admin)/panel/`
2. Add route to `_routes.tsx`
3. Add menu item if needed
4. Create components in `_components/`

### Database Schema Changes
1. Update `schema.prisma`
2. Run `yarn generate` (NEVER `prisma db push`)
3. Update TypeScript entities
4. Update DTOs if needed

## 🐛 Debugging

### Backend Debugging
```typescript
// Use colored logs for debugging
coloredLog({ content: "Debug message", color: "cyan" })
coloredLog({ content: "Error message", color: "red" })
coloredLog({ content: "Success message", color: "green" })

// Check processing status
console.log("Current status:", content.status)
console.log("Last status:", content.lastStatus)
```

### Frontend Debugging
```typescript
// Use React DevTools
console.log("Component state:", state)
console.log("Form data:", formData)

// Check API responses
console.log("API response:", response)
```

### Database Debugging
```bash
# Connect to MongoDB
mongosh

# Check collections
show collections

# Query contents
db.Content.find().limit(5)

# Check specific content
db.Content.findOne({_id: ObjectId("content_id")})

# Query with relations
db.Content.findOne({_id: ObjectId("content_id")}).populate('media').populate('transcription').populate('textContent').populate('presentation')
```

## 🧪 Testing

### Backend Testing
```bash
# Run tests
yarn test

# Run with coverage
yarn test:cov

# Run e2e tests
yarn test:e2e
```

### Frontend Testing
```bash
# Run linting
yarn lint

# Check types
yarn tsc --noEmit
```

## 📦 Dependencies

### Key Backend Dependencies
- `@nestjs/core` - NestJS framework
- `@prisma/client` - Database ORM
- `openai` - OpenAI API client
- `@distube/ytdl-core` - YouTube downloader
- `fluent-ffmpeg` - Media processing
- `axios` - HTTP client

### Key Frontend Dependencies
- `next` - React framework
- `primereact` - UI components
- `tailwindcss` - CSS framework
- `react-hook-form` - Form management
- `axios` - HTTP client

## 🚀 Deployment

### Production Build
```bash
# Backend
cd server
yarn build
yarn start:prod

# Frontend
cd client
yarn build
yarn start
```

### PM2 Configuration
```bash
# Start with PM2
pm2 start pm2.config.js
pm2 start pm2-bot.config.js

# Monitor
pm2 monit

# Logs
pm2 logs
```

## 🔧 Configuration

### MongoDB Configuration
```yaml
# mongod.conf
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

replication:
  replSetName: rs0

net:
  port: 27017
  bindIp: 127.0.0.1
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📚 Resources

### Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PrimeReact Documentation](https://primereact.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### API References
- [OpenAI API](https://platform.openai.com/docs)
- [Gamma API](https://developers.gamma.app/docs)
- [YouTube Downloader](https://github.com/fent/node-ytdl-core)

### Tools
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Postman](https://www.postman.com/) - API testing
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [NestJS DevTools](https://docs.nestjs.com/cli/overview)

## 🆘 Troubleshooting

### Common Issues

#### MongoDB Connection
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check replica set status
mongosh --eval "rs.status()"
```

#### Prisma Issues
```bash
# Regenerate client
yarn generate

# Check schema
yarn prisma validate
```

#### FFmpeg Issues
```bash
# Check FFmpeg installation
ffmpeg -version

# Test conversion
ffmpeg -i input.mp4 -vn -acodec mp3 output.mp3
```

#### API Key Issues
```bash
# Check environment variables
echo $OPENAI_API_KEY
echo $GAMMA_API_KEY

# Test API connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

### Performance Optimization

#### Backend
- Use connection pooling for MongoDB
- Implement caching for frequently accessed data
- Optimize database queries
- Use compression for file uploads

#### Frontend
- Implement lazy loading for components
- Use React.memo for expensive components
- Optimize bundle size
- Implement proper error boundaries

---

**Happy Coding! 🚀**
