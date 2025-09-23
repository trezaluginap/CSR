// src/components/FileUpload.jsx
import { useState, useRef } from "react";

function FileUpload({
  onFileSelect,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 5 * 1024 * 1024,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      return `File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB`;
    }

    // Check file type
    const allowedTypes = accept.split(",").map((type) => type.trim());
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    const mimeType = file.type;

    const isValidExtension = allowedTypes.some(
      (type) =>
        type === fileExtension ||
        (type.startsWith(".") && fileExtension === type)
    );

    const isValidMimeType = allowedTypes.some((type) => {
      if (type === ".pdf") return mimeType === "application/pdf";
      if (type === ".doc") return mimeType === "application/msword";
      if (type === ".docx")
        return (
          mimeType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
      if (type === ".jpg" || type === ".jpeg")
        return mimeType.startsWith("image/jpeg");
      if (type === ".png") return mimeType === "image/png";
      return false;
    });

    if (!isValidExtension && !isValidMimeType) {
      return `Tipe file tidak didukung. Yang diizinkan: ${allowedTypes.join(
        ", "
      )}`;
    }

    return null;
  };

  const handleFileSelect = (file) => {
    setError("");

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError("");
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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
                fill="currentColor"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
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
                fill="currentColor"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div className="file-details">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">
                {formatFileSize(selectedFile.size)}
              </span>
            </div>
            <button
              type="button"
              className="remove-file-btn"
              onClick={handleRemoveFile}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {uploadProgress < 100 && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
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
                fill="currentColor"
              >
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              <span>File berhasil dipilih</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="file-upload-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
