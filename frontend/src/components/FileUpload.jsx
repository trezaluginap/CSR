"use client"

// src/components/FileUpload.jsx
import { useState, useRef } from "react"

function FileUpload({ onFileSelect, accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png", maxSize = 5 * 1024 * 1024 }) {
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      return `File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB`
    }

    // Check file type
    const allowedTypes = accept.split(",").map((type) => type.trim())
    const fileExtension = "." + file.name.split(".").pop().toLowerCase()
    const mimeType = file.type

    const isValidExtension = allowedTypes.some(
      (type) => type === fileExtension || (type.startsWith(".") && fileExtension === type),
    )

    const isValidMimeType = allowedTypes.some((type) => {
      if (type === ".pdf") return mimeType === "application/pdf"
      if (type === ".doc") return mimeType === "application/msword"
      if (type === ".docx")
        return mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      if (type === ".jpg" || type === ".jpeg") return mimeType.startsWith("image/jpeg")
      if (type === ".png") return mimeType === "image/png"
      return false
    })

    if (!isValidExtension && !isValidMimeType) {
      return `Tipe file tidak didukung. Yang diizinkan: ${allowedTypes.join(", ")}`
    }

    return null
  }

  const handleFileSelect = (file) => {
    setError("")

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)
    onFileSelect(file)

    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    setError("")
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="file-upload-wrapper">
      {!selectedFile ? (
        <div
          className={`file-upload-area ${dragOver ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            accept={accept}
            className="file-input-hidden"
            style={{ display: "none" }}
          />

          <div className="upload-content">
            <div className="upload-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17,8 12,3 7,8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h4>Upload File Pendukung</h4>
            <p>Drag & drop file atau klik untuk memilih</p>
            <small>
              Maksimal {maxSize / 1024 / 1024}MB - {accept}
            </small>
          </div>
        </div>
      ) : (
        <div className="file-selected">
          <div className="file-info">
            <div className="file-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
            </div>
            <div className="file-details">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">{formatFileSize(selectedFile.size)}</span>
            </div>
            <button type="button" className="remove-file-btn" onClick={handleRemoveFile} aria-label="Hapus file">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {uploadProgress < 100 && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}

          {uploadProgress === 100 && (
            <div className="upload-success">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>File berhasil dipilih</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="file-upload-error">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

export default FileUpload
