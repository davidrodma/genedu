import React, { useState, useEffect, useCallback } from "react"
import YouTube from "react-youtube"

interface YouTubePlayerProps {
  url: string
  onTitleExtracted?: (title: string) => void
}

const YouTubePlayer = ({ url, onTitleExtracted }: YouTubePlayerProps) => {
  const [videoTitle, setVideoTitle] = useState<string>("")

  // YOUTUBE VIDEO FUNCTION
  const opts = {
    width: "100%",
    borderRadius: "2rem",
    playerVars: { autoplay: 0 },
  }

  const videoReady = (event: any) => {
    event.target.pauseVideo()
  }

  const getVideoId = (url: string) => {
    try {
      // Verifica se é uma URL válida do YouTube
      if (!url || typeof url !== "string") {
        return null
      }

      // Remove espaços em branco
      const cleanUrl = url.trim()

      // Verifica se contém domínio do YouTube
      if (!cleanUrl.includes("youtube.com") && !cleanUrl.includes("youtu.be")) {
        return null
      }

      let videoId = null

      // Tenta extrair ID de diferentes formatos de URL do YouTube
      if (cleanUrl.includes("/shorts/")) {
        const parts = cleanUrl.split("/shorts/")
        if (parts.length >= 2 && parts[1]) {
          videoId = parts[1].split("&")[0].split("?")[0]
        }
      } else if (cleanUrl.includes("?v=")) {
        const parts = cleanUrl.split("?v=")
        if (parts.length >= 2 && parts[1]) {
          videoId = parts[1].split("&")[0].split("?")[0]
        }
      } else if (cleanUrl.includes("youtu.be/")) {
        const parts = cleanUrl.split("youtu.be/")
        if (parts.length >= 2 && parts[1]) {
          videoId = parts[1].split("&")[0].split("?")[0]
        }
      } else if (cleanUrl.includes("/watch?v=")) {
        const parts = cleanUrl.split("/watch?v=")
        if (parts.length >= 2 && parts[1]) {
          videoId = parts[1].split("&")[0].split("?")[0]
        }
      }

      // Valida se o ID tem formato correto (11 caracteres alfanuméricos)
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId
      }

      return null
    } catch (error) {
      console.warn("Erro ao extrair ID do vídeo:", error)
      return null
    }
  }

  // Função para extrair título do vídeo usando YouTube Data API
  const extractVideoTitle = useCallback(
    async (videoId: string) => {
      try {
        // Usando uma API pública para obter informações do vídeo
        const response = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        )
        if (response.ok) {
          const data = await response.json()
          const title = data.title || `YouTube Video - ${videoId}`
          setVideoTitle(title)
          onTitleExtracted?.(title)
          return title
        }
      } catch (error) {
        console.warn("Erro ao extrair título do YouTube:", error)
      }

      // Fallback: usar ID do vídeo
      const fallbackTitle = `YouTube Video - ${videoId}`
      setVideoTitle(fallbackTitle)
      onTitleExtracted?.(fallbackTitle)
      return fallbackTitle
    },
    [onTitleExtracted]
  )

  useEffect(() => {
    if (url) {
      const videoId = getVideoId(url)
      if (videoId) {
        extractVideoTitle(videoId)
      } else {
        // URL inválida - define título de erro
        const errorTitle = "URL do YouTube inválida"
        setVideoTitle(errorTitle)
        onTitleExtracted?.(errorTitle)
      }
    }
  }, [url, extractVideoTitle, onTitleExtracted])

  const videoId = getVideoId(url)

  return (
    <>
      <div>
        <div
          style={{
            maxWidth: "800px",
            margin: "auto",
            marginTop: "12px",
            minHeight: "30vh",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {videoId ? (
            <YouTube videoId={videoId} opts={opts} onReady={videoReady} />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                backgroundColor: "#f8f9fa",
                border: "2px dashed #dee2e6",
                borderRadius: "12px",
                color: "#6c757d",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              URL do YouTube inválida ou malformada
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default YouTubePlayer
