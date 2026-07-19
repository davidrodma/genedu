export const transcriptionModels = [
  {
    code: "whisper-1",
    name: "Whisper-1",
    description:
      "The cheapest, good for multilingual and high volumes, but less accurate on difficult audio.",
  },
  {
    code: "gpt-4o-mini-transcribe",
    name: "GPT-4o Mini Transcribe",
    description:
      "If you want something more precise, pay a little more, deal with less favorable conditions, more varied audio.",
  },
  {
    code: "gpt-4o-transcribe",
    name: "GPT-4o Transcribe",
    description:
      "When maximum accuracy is crucial, or when dealing with difficult accents, noise, multiple languages/speakers; ideal for professional use.",
  },
  {
    code: "gpt-4o-transcribe-diarize",
    name: "GPT-4o Transcribe Diarize",
    description:
      "With speaker diarization.",
  },
]
