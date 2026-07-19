import {
  InputNumber,
  InputText,
  TextArea,
} from "@/app/_common/components/inputs"
import { Col, Row } from "@/app/_common/components/grid-layout"
import { Content } from "@/app/_common/models/content/content.model"
import { ReactNode, RefObject, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { handleError } from "@/app/_common/errors/handleError"
import { Toast } from "primereact/toast"
import { useDataTableCustomContext } from "@/app/_common/components/datatable"
import { ContentService } from "../../_services/content.service"
import { Select } from "@/app/_common/components/inputs/select.component.orig"
import { LanguagesArray } from "@/app/_common/models"
import {
  defaultThemeOption,
  GammaTheme,
} from "@/app/(admin)/panel/generation/contents/_data/gamma-themes"
import YouTubePlayer from "@/app/_common/components/youtube/youtube.player.component"
import InputFileSingle from "@/app/_common/components/inputs/input-file-single.component"
import { convertJsonToFormData } from "@/app/_common/utilities/form.utility"
import { MessageError } from "@/app/_common/components/message/error-message.component"
import { CircleButton } from "@/app/_common/components/button/circle-button.component"
import { imageModels } from "@/app/(admin)/panel/generation/contents/_data/image-models"
import { imageOptions } from "@/app/(admin)/panel/generation/contents/_data/image-options"
import { textModels } from "@/app/(admin)/panel/generation/contents/_data/text-models"
import { transcriptionModels } from "@/app/(admin)/panel/generation/contents/_data/transcription-models"
import { GammaService } from "../../_services/gamma.service"

type Model = Partial<Content>

const emptyModel: Partial<Model> = {
  id: "",
  subject: "",
  language: "pt",
  mediaDescription: "",
  media: {
    contentId: "",
    sourceType: "YOUTUBE",
    youtubeLink: "",
    mediaFile: "",
    mediaDescription: "",
    audioFilenames: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  transcription: {
    id: "",
    contentId: "",
    transcriptionText: "",
    transcriptFile: "",
    transcriptionModel: "whisper-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  textContent: {
    id: "",
    contentId: "",
    promptText: `Você é um professor especialista.  
Sua tarefa é transformar a transcrição de áudio em um conteúdo didático para alunos.  

Instruções:
- Identifique qual é o assunto principal da transcrição.  
- Estruture o conteúdo de forma clara e organizada, como se fosse uma aula.  
- Explique os conceitos de maneira simples, mas mantendo a precisão.  
- Use títulos, subtítulos e listas para facilitar a leitura.  
- Destaque definições, exemplos práticos e pontos importantes.  
- Elimine repetições, falas informais e partes irrelevantes.  
- Adapte o tom para ser didático, como um professor explicando em sala de aula.`,
    generatedText: "",
    textFile: "",
    textModel: "gpt-5.4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  presentation: {
    id: "",
    contentId: "",
    promptPresentation:
      "Transforme o texto em uma apresentação de slides didática e educacional. Combine textos com imagens e diagramas quando possível, além disso aplique princípios de carga cognitiva baixa (segmentação, coerência, contiguidade) para a apresentação.",
    presentationId: "",
    presentationFile: "",
    themeId: "gamma",
    themeName: "Gamma",
    numCards: 20,
    imageOptions: "aiGenerated",
    imageModel: "",
    imageStyle: "", //vector-style illustration
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

const steps = [
  {
    id: 1,
    title: "Media",
    description:
      "Upload media files or provide YouTube links for content processing",
    fields: ["media.youtubeLink", "media.mediaDescription"],
  },
  {
    id: 2,
    title: "Identification",
    description:
      "Define the basic information about your educational content and transcription",
    fields: ["subject", "language", "transcription.transcriptionModel"],
  },
  {
    id: 3,
    title: "Textual Content",
    description:
      "Configure how AI will generate educational material from the transcription",
    fields: [, "textContent.promptText", "textContent.textModel"],
  },
  {
    id: 4,
    title: "Presentation",
    description:
      "Customize the presentation generation with themes and visual options",
    fields: [
      "presentation.promptPresentation",
      "presentation.themeName",
      "presentation.numCards",
      "presentation.imageOptions",
      "presentation.imageModel",
      "presentation.imageStyle",
    ],
  },
]

export const ContentForm = ({
  setFormDialog,
  model = emptyModel,
  toast,
  ...props
}: {
  setFormDialog: (open: boolean) => void
  model?: Model
  toast?: RefObject<Toast | null>
}) => {
  const { rows, setRows } = useDataTableCustomContext<Model>()
  const { control, reset, setValue, getValues, register } = useForm<Model>()
  const [error, setError] = useState<string | ReactNode>("")
  const [linkYouTube, setLinkYouTube] = useState<string>("")
  const [formData, setFormData] = useState({ ...model })
  const [gammaThemesOptions, setGammaThemesOptions] = useState<GammaTheme[]>([
    defaultThemeOption,
  ])
  const [loadingThemes, setLoadingThemes] = useState<boolean>(true)
  const [themesError, setThemesError] = useState<string>("")

  const [loading, setLoading] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [currentImageOptions, setCurrentImageOptions] = useState<string>(
    formData.presentation?.imageOptions || "aiGenerated"
  )
  const [youtubeTitle, setYoutubeTitle] = useState<string>("")
  const modelInit = useRef<Model>(model)

  useEffect(() => {
    let isMounted = true
    const fetchThemes = async () => {
      setLoadingThemes(true)
      setThemesError("")
      try {
        const themes = await GammaService.listThemes()
        if (!isMounted) return
        const mappedThemes: GammaTheme[] = [
          defaultThemeOption,
          ...themes
            .filter((theme) => theme?.id && theme?.name)
            .map((theme) => ({
              value: theme.id,
              label: theme.name,
              description: theme.description,
            })),
        ]
        setGammaThemesOptions(mappedThemes)
      } catch (err) {
        if (!isMounted) return
        setThemesError(
          "Não foi possível carregar os temas do Gamma. Usaremos o tema padrão do workspace."
        )
        setGammaThemesOptions([defaultThemeOption])
        console.error(err)
      } finally {
        if (isMounted) {
          setLoadingThemes(false)
        }
      }
    }
    fetchThemes()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    reset()
    setError("")
    setCurrentStep(1)
    if (modelInit.current?.id) {
      setFormData({
        ...modelInit.current,
        presentation: {
          ...emptyModel.presentation,
          ...modelInit.current.presentation,
        },
      })
      setCurrentImageOptions(
        modelInit.current.presentation?.imageOptions || "aiGenerated"
      )
      // Set all form values for editing
      setValue("id", modelInit.current.id, { shouldValidate: true })
      setValue("subject", modelInit.current.subject, { shouldValidate: true })
      setValue("language", modelInit.current.language, { shouldValidate: true })
      setValue(
        "media.youtubeLink",
        modelInit.current.media?.youtubeLink || "",
        { shouldValidate: true }
      )
      setValue(
        "media.mediaDescription",
        modelInit.current.media?.mediaDescription || "",
        { shouldValidate: true }
      )
      setValue(
        "transcription.transcriptionModel",
        modelInit.current.transcription?.transcriptionModel || "",
        { shouldValidate: true }
      )
      setValue(
        "textContent.promptText",
        modelInit.current.textContent?.promptText || "",
        { shouldValidate: true }
      )
      setValue(
        "textContent.textModel",
        modelInit.current.textContent?.textModel || "",
        { shouldValidate: true }
      )
      setValue(
        "presentation.promptPresentation",
        modelInit.current.presentation?.promptPresentation || "",
        { shouldValidate: true }
      )
      setValue(
        "presentation.themeId",
        modelInit.current.presentation?.themeId || "",
        { shouldValidate: true }
      )
      setValue(
        "presentation.themeName",
        modelInit.current.presentation?.themeName || defaultThemeOption.label,
        { shouldValidate: true }
      )
      setValue(
        "presentation.numCards",
        modelInit.current.presentation?.numCards || 10,
        { shouldValidate: true }
      )
      setValue(
        "presentation.imageOptions",
        modelInit.current.presentation?.imageOptions || "aiGenerated",
        { shouldValidate: true }
      )
      setValue(
        "presentation.imageModel",
        modelInit.current.presentation?.imageModel || "",
        { shouldValidate: true }
      )
      setValue(
        "presentation.imageStyle",
        modelInit.current.presentation?.imageStyle || "",
        { shouldValidate: true }
      )
    } else {
      setFormData({ ...emptyModel })
      setCurrentImageOptions("aiGenerated")
    }
  }, [reset, setValue, modelInit.current?.id])

  const validateStep = async (stepNumber: number): Promise<boolean> => {
    const step = steps.find((s) => s.id === stepNumber)
    if (!step) return false

    const currentValues = getValues()

    // Validação manual para cada etapa
    switch (stepNumber) {
      case 1: // Media
        if (
          !file &&
          !currentValues.media?.youtubeLink &&
          !currentValues.media?.mediaFile &&
          !formData.media?.mediaFile
        ) {
          setError("Either a media file or YouTube link is required")
          return false
        }
        break
      case 2: // Identification
        if (!currentValues.subject || !currentValues.language) {
          setError("Subject and Language are required")
          return false
        }
        break
      case 3: // Textual Content
        //if (!currentValues.textContent?.promptText) {
        //setError("Prompt for text generation is required")
        //return false
        //}
        break
      case 4: // Presentation
        // Não há campos obrigatórios na etapa 4
        break
    }

    setError("")
    return true
  }

  const nextStep = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < steps.length) {
      // Se está avançando do step 1 para o step 2, preencher automaticamente o subject
      if (currentStep === 1) {
        await autoFillSubject()
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber)
  }

  // Função para extrair título do vídeo do YouTube
  const extractYouTubeTitle = async (url: string): Promise<string> => {
    try {
      // Se já temos o título extraído pelo componente YouTube, usar ele
      if (youtubeTitle && youtubeTitle.trim() !== "") {
        return youtubeTitle
      }

      // Fallback: extrair ID do vídeo
      const videoIdMatch = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
      )
      if (videoIdMatch) {
        const videoId = videoIdMatch[1]
        return `YouTube Video - ${videoId}`
      }
      return "YouTube Video"
    } catch (error) {
      return "YouTube Video"
    }
  }

  // Função para extrair nome do arquivo sem extensão
  const extractFileNameWithoutExtension = (fileName: string): string => {
    if (!fileName) return ""
    const lastDotIndex = fileName.lastIndexOf(".")
    if (lastDotIndex === -1) return fileName
    return fileName.substring(0, lastDotIndex)
  }

  // Função para preencher automaticamente o campo subject
  const autoFillSubject = async () => {
    const currentValues = getValues()
    const currentSubject = currentValues.subject || formData.subject

    // Se o subject já estiver preenchido, não fazer nada
    if (currentSubject && currentSubject.trim() !== "") {
      return
    }

    let newSubject = ""

    // Verificar se é um link do YouTube
    if (
      currentValues.media?.youtubeLink &&
      currentValues.media.youtubeLink.trim() !== ""
    ) {
      newSubject = await extractYouTubeTitle(currentValues.media.youtubeLink)
    }
    // Verificar se é um arquivo
    else if (file && file.name) {
      newSubject = extractFileNameWithoutExtension(file.name)
    }
    // Verificar se há um arquivo já existente no formData
    else if (
      formData.media?.mediaFile &&
      formData.media.mediaFile.trim() !== ""
    ) {
      newSubject = extractFileNameWithoutExtension(formData.media.mediaFile)
    }

    // Atualizar o campo subject se encontrou um valor
    if (newSubject) {
      setValue("subject", newSubject, { shouldValidate: true })
      setFormData({ ...formData, subject: newSubject })
    }
  }

  async function save(params: Model) {
    setError("")
    setLoading(true)
    const data = {
      subject: params.subject,
      language: params.language,
      youtubeLink: params.media?.youtubeLink,
      mediaFile: file
        ? file
        : params.id
        ? formData.media?.mediaFile
        : undefined,
      mediaDescription: params.media?.mediaDescription,
      transcriptionModel: params.transcription?.transcriptionModel,
      textModel: params.textContent?.textModel,
      promptText: params.textContent?.promptText,
      promptPresentation: params.presentation?.promptPresentation,
      themeId: params.presentation?.themeId,
      themeName: params.presentation?.themeName,
      numCards: params.presentation?.numCards,
      imageOptions: params.presentation?.imageOptions,
      imageModel: params.presentation?.imageModel,
      imageStyle: params.presentation?.imageStyle,
    }
    const form = convertJsonToFormData(data)
    const saved = await ContentService.save(form, params.id).catch((res) =>
      handleError(res)
    )
    if ("error" in saved) {
      setError("error" in saved ? saved.error : "no results")
    } else {
      toast?.current?.show({
        severity: "success",
        summary: "Successful",
        detail: `Record Saved`,
        life: 3000,
      })
      if (params?.id) {
        const index = rows.findIndex((obj) => obj.id == saved.id)
        rows[index] = saved
        setRows([...rows])
      } else {
        setRows([saved, ...rows])
      }
      setFormDialog(false)
    }
    setLoading(false)
  }

  const eventDeleteFile = () => {
    setFile(undefined)
    setFormData({
      ...formData,
      media: {
        ...formData.media!,
        contentId: formData.media?.contentId || "",
        mediaFile: "",
      },
    })
  }

  const renderStepIndicator = () => (
    <div className="mb-4 pt-1">
      <div className="flex items-center justify-between w-full">
        {/* Círculo 1 */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => goToStep(1)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep === 1
                ? "bg-black text-white  scale-110"
                : currentStep > 1
                ? "bg-success-300 text-white "
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {currentStep > 1 ? "✓" : "1"}
          </button>
          <p
            className={`text-xs font-medium mt-2 text-center ${
              currentStep >= 1 ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {steps[0].title}
          </p>
        </div>

        {/* Linha 1 */}
        <div className="flex-1 mx-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                currentStep > 1 ? "bg-success-300" : "bg-gray-200"
              }`}
              style={{
                width: currentStep > 1 ? "100%" : "0%",
              }}
            />
          </div>
        </div>

        {/* Círculo 2 */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => goToStep(2)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep === 2
                ? "bg-black text-white  scale-110"
                : currentStep > 2
                ? "bg-success-300 text-white "
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {currentStep > 2 ? "✓" : "2"}
          </button>
          <p
            className={`text-xs font-medium mt-2 text-center ${
              currentStep >= 2 ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {steps[1].title}
          </p>
        </div>

        {/* Linha 2 */}
        <div className="flex-1 mx-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                currentStep > 2 ? "bg-success-300" : "bg-gray-200"
              }`}
              style={{
                width: currentStep > 2 ? "100%" : "0%",
              }}
            />
          </div>
        </div>

        {/* Círculo 3 */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => goToStep(3)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep === 3
                ? "bg-black text-white  scale-110"
                : currentStep > 3
                ? "bg-success-300 text-white "
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {currentStep > 3 ? "✓" : "3"}
          </button>
          <p
            className={`text-xs font-medium mt-2 text-center ${
              currentStep >= 3 ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {steps[2].title}
          </p>
        </div>

        {/* Linha 3 */}
        <div className="flex-1 mx-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                currentStep > 3 ? "bg-success-300" : "bg-gray-200"
              }`}
              style={{
                width: currentStep > 3 ? "100%" : "0%",
              }}
            />
          </div>
        </div>

        {/* Círculo 4 */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => goToStep(4)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep === 4
                ? "bg-black text-white  scale-110"
                : currentStep > 4
                ? "bg-success-300 text-white "
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {currentStep > 4 ? "✓" : "4"}
          </button>
          <p
            className={`text-xs font-medium mt-2 text-center ${
              currentStep >= 4 ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {steps[3].title}
          </p>
        </div>
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div>
      <p className="text-gray-600 mb-4 text-sm font-urbanist">
        Upload media files or provide YouTube links for content processing. The
        system will convert and transcribe the audio content.
      </p>
      <Row>
        <Col addClassName="sm:col-span-12 border p-5 rounded-lg border-slate-200">
          <Row>
            <Col addClassName="sm:col-span-12">
              <InputFileSingle
                setFile={setFile}
                label="Media File"
                previewFile={
                  formData.media?.mediaFile
                    ? {
                        name: formData.media.mediaFile,
                        size: formData.media.sizeBytes || 0,
                        duration: formData.media.duration || 0,
                      }
                    : undefined
                }
                eventDelete={(e) => eventDeleteFile()}
                accept="audio/*,video/*"
              />
            </Col>
          </Row>

          <div className="sm:col-span-12 text-center text-bgray-400 my-2">
            OR
          </div>

          <Row>
            <Col addClassName="sm:col-span-12">
              <InputText
                label="YouTube Link"
                name="media.youtubeLink"
                value={formData.media?.youtubeLink || ""}
                defaultValue={formData.media?.youtubeLink || ""}
                control={control}
                onBlur={(e) => setLinkYouTube(e.currentTarget.value)}
              />
              {linkYouTube && (
                <YouTubePlayer
                  url={linkYouTube}
                  onTitleExtracted={(title) => setYoutubeTitle(title)}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col addClassName="sm:col-span-12">
          <TextArea
            label="Media Description"
            name="media.mediaDescription"
            defaultValue={formData.media?.mediaDescription || ""}
            value={formData.media?.mediaDescription || ""}
            control={control}
            placeholder="Describe the content of your media file..."
            onChange={(e) => {
              setValue("media.mediaDescription", e.currentTarget.value, {
                shouldValidate: true,
              })
            }}
          />
        </Col>
      </Row>
    </div>
  )

  const renderStep2 = () => (
    <div className="mb-6">
      <p className="mb-4 text-sm font-urbanist">
        Define the basic information about your educational content. This will
        help identify and categorize your material.
      </p>
      <Row>
        <Col addClassName="sm:col-span-12">
          <InputText
            label="Subject"
            name="subject"
            value={formData.subject}
            defaultValue={formData.subject}
            control={control}
          />
        </Col>
        <Col addClassName="sm:col-span-6">
          <Select
            label="Transcription Model"
            name="transcription.transcriptionModel"
            defaultValue={formData.transcription?.transcriptionModel}
            value={formData.transcription?.transcriptionModel}
            control={control}
            propertyLabel="name"
            propertyKey="code"
            optionLabel="name"
            optionValue="code"
            items={transcriptionModels}
            placeholder="Select AI model for transcription"
          />
        </Col>
        <Col addClassName="sm:col-span-6">
          <Select
            items={LanguagesArray}
            control={control}
            propertyKey="code"
            propertyLabel="name"
            label="Language"
            name="language"
            value={formData.language}
          />
        </Col>
      </Row>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <p className="text-gray-600 mb-4 text-sm font-urbanist">
        Configure how AI will generate educational material from the
        transcription. Provide specific instructions for the content generation.
      </p>
      <Row>
        <Col addClassName="sm:col-span-12">
          <div className="flex-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt for Text Generation
            </label>
            <textarea
              className="p-inputtextarea p-inputtext p-component p-filled p-inputtextarea-resizable default-input default-input"
              rows={5}
              value={formData.textContent?.promptText || ""}
              {...register("textContent.promptText")}
              placeholder="Enter the prompt that will be used to generate educational material from the transcription..."
              onChange={(e) => {
                console.log("promptText onChange:", e.currentTarget.value)
                setValue("textContent.promptText", e.currentTarget.value, {
                  shouldValidate: true,
                })
                setFormData({
                  ...formData,
                  textContent: {
                    ...formData.textContent,
                    promptText: e.currentTarget.value,
                  },
                })
              }}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col addClassName="sm:col-span-6">
          <Select
            label="Text Generation Model"
            name="textContent.textModel"
            defaultValue={formData?.textContent?.textModel}
            value={formData?.textContent?.textModel}
            control={control}
            propertyLabel="name"
            propertyKey="code"
            optionLabel="name"
            optionValue="code"
            items={textModels}
            placeholder="Select AI model for text generation"
          />
        </Col>
      </Row>
    </div>
  )

  const renderStep4 = () => (
    <div>
      <p className="text-gray-600 mb-4 text-sm font-urbanist">
        Customize the presentation generation with themes and visual options.
        This will create professional slides from your generated content.
      </p>
      <Row>
        <Col addClassName="sm:col-span-12">
          <div className="flex-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt for Presentation Generation
            </label>
            <textarea
              className="p-inputtextarea p-inputtext p-component p-filled p-inputtextarea-resizable default-input default-input"
              rows={5}
              value={formData.presentation?.promptPresentation || ""}
              {...register("presentation.promptPresentation")}
              placeholder="Enter the prompt that will be used to generate presentation slides from the generated text..."
              onChange={(e) => {
                setValue(
                  "presentation.promptPresentation",
                  e.currentTarget.value,
                  {
                    shouldValidate: true,
                  }
                )
                setFormData({
                  ...formData,
                  presentation: {
                    ...formData.presentation,
                    promptPresentation: e.currentTarget.value,
                  },
                })
              }}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col addClassName="sm:col-span-4">
          <InputNumber
            label="Nº of Cards"
            name="presentation.numCards"
            value={formData.presentation?.numCards}
            defaultValue={formData.presentation?.numCards}
            control={control}
            placeholder="10"
          />
        </Col>
        <Col addClassName="sm:col-span-4">
          <Select
            label="Theme"
            name="presentation.themeId"
            value={formData.presentation?.themeId || ""}
            defaultValue={formData.presentation?.themeId || ""}
            control={control}
            items={gammaThemesOptions}
            propertyLabel="label"
            propertyKey="value"
            placeholder="Select a theme (optional)"
            disabled={loadingThemes || !gammaThemesOptions?.length}
            onChange={(e) => {
              const selectedTheme = gammaThemesOptions.find(
                (theme) => theme.value === e.value
              )
              setValue("presentation.themeId", e.value, {
                shouldValidate: true,
              })
              setValue(
                "presentation.themeName",
                selectedTheme?.label || defaultThemeOption.label,
                { shouldValidate: true }
              )
              setFormData((prev) => ({
                ...prev,
                presentation: {
                  ...prev.presentation,
                  themeId: e.value,
                  themeName: selectedTheme?.label || defaultThemeOption.label,
                },
              }))
            }}
          />
          {loadingThemes && (
            <p className="text-xs text-gray-500 mt-2">
              Carregando temas disponíveis no Gamma...
            </p>
          )}
          {!loadingThemes && themesError && (
            <p className="text-xs text-red-500 mt-2">{themesError}</p>
          )}
        </Col>
        <Col addClassName="sm:col-span-4">
          <Select
            items={imageOptions}
            control={control}
            propertyKey="code"
            propertyLabel="name"
            label="Image Source"
            name="presentation.imageOptions"
            value={formData.presentation?.imageOptions}
            placeholder="Select image source"
            onChange={(e) => {
              setCurrentImageOptions(e.value)
              setFormData({
                ...formData,
                presentation: {
                  ...formData.presentation,
                  imageOptions: e.value,
                },
              })
            }}
          />
        </Col>
      </Row>

      <Row>
        {/* Campos condicionais para AI Generated */}
        {currentImageOptions === "aiGenerated" && (
          <>
            <Col addClassName="sm:col-span-6">
              <Select
                items={imageModels}
                control={control}
                propertyKey="code"
                propertyLabel="name"
                label="Image AI Model"
                name="presentation.imageModel"
                value={formData.presentation?.imageModel}
                placeholder="Select AI model (optional)"
              />
            </Col>
            <Col addClassName="sm:col-span-6">
              <InputText
                label="Image Style"
                name="presentation.imageStyle"
                value={formData.presentation?.imageStyle}
                defaultValue={formData.presentation?.imageStyle}
                control={control}
                placeholder="e.g., photorealistic, minimal, educational"
              />
            </Col>
          </>
        )}
      </Row>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return renderStep1()
    }
  }

  const handleSave = async () => {
    const data = getValues()
    await save(data)
  }

  return (
    <div className="min-h-full flex flex-col">
      {renderStepIndicator()}
      {renderCurrentStep()}
      {error && <MessageError error={error} />}
      <div className="flex justify-between items-center mt-2 pt-4 border-t">
        <div>
          {currentStep > 1 && (
            <CircleButton
              label="Next"
              type="button"
              iconClass="pi pi-arrow-left"
              iconPos="left"
              onClick={prevStep}
            />
          )}
        </div>

        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <CircleButton
              label="Next"
              type="button"
              iconClass="pi pi-arrow-right"
              iconPos="right"
              onClick={nextStep}
            />
          ) : (
            <CircleButton
              label="Save"
              type="submit"
              iconClass="pi pi-check"
              bgClass="bg-success-50"
              textClass="text-success-400"
              loading={loading}
              onClick={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  )
}
