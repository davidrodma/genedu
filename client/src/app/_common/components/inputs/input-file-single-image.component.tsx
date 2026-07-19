// /pages/index.tsx
import React, { useState } from 'react'
import { PATH_UPLOADS } from '../../configs/constants'

const InputFileSingleImage = ({
  setImageFile,
  label = 'Image',
  align = 'center',
  width = '100%',
  height = '100%',
  previewPath = '',
  eventDelete = undefined,
}: {
  setImageFile: (imageFile?: File) => void
  label?: string
  align?: 'center' | 'left' | 'right'
  width?: string
  height?: string
  previewPath?: string
  eventDelete?: (params?: any) => any
}) => {
  previewPath = previewPath ? `${PATH_UPLOADS}${previewPath}` : ''

  const [preview, setPreview] = useState<string | null>(previewPath)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setImageFile(undefined)
    if (eventDelete) {
      eventDelete()
    }
  }

  return (
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        flexGrow: 1,
        width: width,
        height: height,
      }}
    >
      <div
        className="cursor-pointer flex-col justify-center items-center border-2 border-dashed border-bgray-500 rounded-lg"
        style={{
          position: 'relative',
          display: 'flex',
          flexGrow: 1,
          height: '100%',
          margin: align == 'right' ? `0 0 0 auto` : align == 'left' ? `auto 0` : `0 auto`,
          cursor: 'pointer',

          backgroundImage: preview ? `url(${preview})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
        onClick={() => !preview && document.getElementById('fileInput')?.click()}
      >
        {!preview && (
          <>
            <i
              className="pi pi-image mt-3 p-5 text-bgray-600"
              style={{
                fontSize: '5em',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-b)',
                color: 'var(--surface-d)',
              }}
            ></i>
            <span className="text-lg text-bgray-600 font-medium">{label}</span>
          </>
        )}
        {preview && (
          <button
            onClick={handleRemoveImage}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            &times;
          </button>
        )}
      </div>
      <input id="fileInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
    </div>
  )
}

export default InputFileSingleImage
