import { diskStorage } from "multer"
import { Exception } from "../errors/Exception"
import { extname } from "path"
import * as fs from "fs"
import { loadEnv } from "src/load-env"
loadEnv()

export const FileInterceptorOptions = ({
  destination,
  maxMB = parseInt(process.env.MAX_MB_UPLOAD) || 10,
  checkMimeImage = false,
}: {
  destination: string
  maxMB?: number
  checkMimeImage?: boolean
}) => {
  return {
    storage: diskStorage({
      // Define o diretório de upload
      destination: destination, // Aqui você especifica o diretório de destino
      filename: (req, file, callback) => {
        // Gera um nome único para o arquivo
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = extname(file.originalname)
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
      },
    }),
    limits: { fileSize: maxMB * 1024 * 1024 }, // Limite de tamanho (5 MB)
    fileFilter: (req, file, callback) => {
      if (checkMimeImage) {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Exception("Only image files are allowed!"), false)
        }
      }
      callback(null, true) // Aceita o arquivo se for válido
    },
  }
}

export const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    console.log(`File deleted: ${filePath}`)
  } else {
    console.log(`Not Found File to Delete: ${filePath}`)
  }
}

export const formatFileName = (subject: string): string => {
  // Remove acentos e caracteres especiais
  const normalized = subject
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    // Substitui espaços e caracteres especiais por hífens
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    // Remove hífens duplos e no início/fim
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    // Limita o tamanho
    .substring(0, 50)

  return normalized || "document"
}

export const getUniqueFileName = (
  basePath: string,
  fileName: string,
  extension: string,
  contentId?: string
): string => {
  let finalFileName = fileName
  let counter = 1

  let fullPath = `${basePath}/${finalFileName}${extension}`

  // Se o arquivo já existe
  if (fs.existsSync(fullPath)) {
    if (contentId) {
      // Se temos contentId, usa apenas o ID como nome
      finalFileName += "-" + contentId
      fullPath = `${basePath}/${finalFileName}${extension}`
    } else {
      // Se não temos contentId, adiciona contador
      do {
        finalFileName = `${fileName}-${counter}`
        fullPath = `${basePath}/${finalFileName}${extension}`
        counter++
      } while (fs.existsSync(fullPath))
    }
  }

  return `${finalFileName}${extension}`
}
