# GenEdu - AI-Powered Educational Material Generation Platform

## 🎯 Overview
GenEdu is a comprehensive platform that automatically generates educational materials from media content using artificial intelligence. The system processes audio/video files through multiple AI-powered stages to create professional educational content with presentations (pptx).

## ✨ Features

### 🔄 Complete Processing Pipeline
- **Media Input**: YouTube videos or file uploads
- **Audio Processing**: Automatic conversion to MP3
- **Transcription**: AI-powered speech-to-text using OpenAI Whisper
- **Content Generation**: Educational text creation using ChatGPT
- **Presentation Creation**: Professional PPTX slides using Gamma API

### 🎨 Customization Options
- **Themes**: Multiple presentation themes
- **Slide Count**: Configurable number of slides
- **Image Options**: AI-generated, Unsplash, or no images
- **Language Support**: Multi-language processing
- **Custom Prompts**: Personalized content generation

### 📊 Admin Dashboard
- Real-time processing status
- File management with metadata
- Download generated content
- User management and authentication
- Configuration management

## 🏗️ Architecture

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Prisma ORM
- **Processing**: Background bot service
- **APIs**: OpenAI (Whisper + ChatGPT) and Gamma
- **File Handling**: Local storage with metadata extraction

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **UI**: PrimeReact + Tailwind CSS
- **State**: React Hook Form + Context API
- **Auth**: JWT-based authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB with replica set
- FFmpeg installed
- OpenAI API key
- Gamma API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd genedu
```

2. **Backend Setup**
```bash
cd server
yarn install
cp .env.example .env
# Configure environment variables
yarn generate  # Generate Prisma client
yarn dev       # Start development server
```

3. **Frontend Setup**
```bash
cd client
yarn install
yarn dev       # Start development server
```

4. **Bot Service** (separate terminal)
```bash
cd server
yarn bot:dev   # Start background processing bot
```

### Environment Variables

#### Backend (.env)
```bash
DATABASE_URL=mongodb://localhost:27017/genedu
OPENAI_API_KEY=your_openai_api_key
GAMMA_API_KEY=your_gamma_api_key
JWT_SECRET=your_jwt_secret
```

## 📋 Processing Workflow

```
0. PENDING → 1. DOWNLOADING_MEDIA → 2. CONVERTING_AUDIO → 3. TRANSCRIBING_AUDIO → 4. GENERATING_TEXT → 5. REQUEST_PRESENTATION → 6. GENERATING_PRESENTATION → 7. DOWNLOADING_PRESENTATION → 8. COMPLETED
```


### Detailed Steps
1. **Media Input**: Insert YouTube link or upload media (video/audio) with prompts
2. **Download Media**: Download YouTube Video
3. **Convert Audio**: Extract audio from media and convert to optimized mp3
4. **Transcribe Audio**: Convert audio to text using AI (Whisper)
5. **Generate Text**: Create educational text from transcription with AI (ChatGPT)
6. **Generate Presentation**: Create professional slides from content (Gamma Api)
7. **Complete**: Make files available for download

## 🛠️ Development

### Project Structure
```
genedu/
├── server/                 # NestJS Backend
│   ├── src/modules/       # Feature modules
│   ├── prisma/            # Database schema
│   └── uploads/           # File storage
├── client/                # Next.js Frontend
│   ├── src/app/           # App router pages
│   └── public/            # Static assets
└── .cursorrules           # Cursor AI context
```

### Key Commands

#### Backend
```bash
yarn dev          # Development server
yarn bot:dev      # Background bot
yarn generate     # Update Prisma client
yarn build        # Production build
yarn start:prod   # Production server
```

#### Frontend
```bash
yarn dev          # Development server
yarn build        # Production build
yarn start        # Production server
```

### Database Management
```bash
# Generate Prisma client (safe)
yarn generate

# Create migration (development only)
yarn mongo-migrate:new -n migration_name

# Apply migrations
yarn mongo-migrate:up

# Rollback migrations
yarn mongo-migrate:down
```

## 🔧 Configuration

### MongoDB Setup
1. Install MongoDB
2. Configure replica set in `mongod.conf`:
```yaml
replication:
  replSetName: rs0
```
3. Restart MongoDB service
4. Initialize replica set in mongosh:
```javascript
rs.initiate()
```

### FFmpeg Installation
- **Windows**: Download from https://ffmpeg.org/
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg`

## 📚 API Documentation

### External APIs Used
- **OpenAI Whisper**: Audio transcription
- **OpenAI ChatGPT**: Text generation
- **Gamma API**: Presentation creation
- **YouTube**: Video downloading

### Internal APIs
- **Content**: CRUD operations for educational content
- **Media**: Media file processing and YouTube download
- **Transcription**: Audio transcription management
- **TextContent**: Educational text generation
- **Presentation**: Presentation creation and management
- **Users**: Authentication and user management
- **Config**: Dynamic configuration management

## 🎨 UI Components

### Key Components
- `ContentForm`: Create/edit contents with file upload
- `ContentDatatable`: List and manage contents
- `Documents`: View generated educational documents, presentations and download

### Styling
- **Framework**: Tailwind CSS
- **Components**: PrimeReact
- **Theme**: Dark/Light mode support
- **Responsive**: Mobile-first design

## 🔒 Security

### Authentication
- JWT-based authentication
- Role-based access control (USER/ADMIN)
- Secure password hashing with bcrypt

### File Security
- File type validation
- Size limits
- Secure file storage
- Input sanitization

## 📊 Monitoring

### Logs
- Colored console logs for debugging
- Error tracking and reporting
- Processing status monitoring

### Health Checks
- Database connectivity
- External API status
- File system health
- Bot service monitoring

## 🚀 Deployment

### Production Setup
1. Configure production environment variables
2. Build both frontend and backend
3. Set up MongoDB replica set
4. Configure PM2 for process management
5. Set up reverse proxy (nginx)
6. Configure SSL certificates

### PM2 Configuration
```bash
# Start services
pm2 start pm2.config.js    # Main server
pm2 start pm2-bot.config.js # Bot service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript strict mode
- Follow NestJS conventions
- Use Prettier for formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the UNLICENSED license.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the `.cursorrules` file for development context
- Open an issue on GitHub

## 🔄 Recent Updates

### v2.0.0 - Presentation Generation
- ✅ Added Gamma API integration
- ✅ New presentation generation workflow
- ✅ Enhanced UI with presentation viewer
- ✅ Media metadata extraction
- ✅ Improved file handling

### v1.0.0 - Core Features
- ✅ YouTube video processing
- ✅ Audio transcription
- ✅ Text generation
- ✅ Admin dashboard
- ✅ User authentication

---

**GenEdu** - Transforming media into educational excellence through AI 🚀
