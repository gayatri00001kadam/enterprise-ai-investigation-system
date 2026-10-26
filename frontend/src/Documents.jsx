import React, { useState } from "react";
import {
  FileText,
  Upload,
  Search,
  RefreshCw,
  Trash2,
} from "lucide-react";

function Documents() {
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [documents, setDocuments] = useState([
    {
      name: "payment-service.md",
      type: "Markdown",
      status: "Indexed",
      chunks: 3,
    },
    {
      name: "deployment.md",
      type: "Markdown",
      status: "Indexed",
      chunks: 3,
    },
    {
      name: "incident.md",
      type: "Markdown",
      status: "Indexed",
      chunks: 3,
    },
    {
      name: "upload-test.txt",
      type: "Text",
      status: "Indexed",
      chunks: 1,
    },
  ]);

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a document first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Upload failed."
        );
      }

      const fileType = selectedFile.name
        .split(".")
        .pop()
        .toUpperCase();

      const newDocument = {
        name: data.filename,
        type:
          fileType === "MD"
            ? "Markdown"
            : fileType === "TXT"
            ? "Text"
            : fileType,
        status: "Indexed",
        chunks: 1,
      };

      setDocuments((currentDocuments) => {
        const alreadyExists = currentDocuments.some(
          (doc) => doc.name === newDocument.name
        );

        if (alreadyExists) {
          return currentDocuments;
        }

        return [
          ...currentDocuments,
          newDocument,
        ];
      });

      alert(
        `${data.filename} uploaded and indexed successfully.`
      );

      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);

      alert(
        `Upload failed: ${error.message}`
      );
    }
  };

  const handleDelete = async (documentName) => {
    const confirmed = window.confirm(
      `Delete ${documentName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/documents/${encodeURIComponent(
          documentName
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.deleted) {
        throw new Error(
          data.message || "Delete failed."
        );
      }

      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (doc) => doc.name !== documentName
        )
      );

      alert(
        `${documentName} deleted successfully.`
      );
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        `Delete failed: ${error.message}`
      );
    }
  };

  const handleReindex = async (documentName) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/documents/${encodeURIComponent(
          documentName
        )}/reindex`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.indexed) {
        throw new Error(
          data.message || "Re-index failed."
        );
      }

      setDocuments((currentDocuments) =>
        currentDocuments.map((doc) =>
          doc.name === documentName
            ? {
                ...doc,
                status: "Indexed",
              }
            : doc
        )
      );

      alert(
        `${documentName} re-indexed successfully.`
      );
    } catch (error) {
      console.error("Re-index error:", error);

      alert(
        `Re-index failed: ${error.message}`
      );
    }
  };

  return (
    <div className="documents-page">

      <div className="documents-header">
        <div>
          <h1>Document Management</h1>

          <p>
            Manage enterprise knowledge sources
          </p>
        </div>

        <label className="document-upload-button">
          <Upload size={18} />

          <span>
            Upload Document
          </span>

          <input
            type="file"
            accept=".txt,.md,.pdf"
            onChange={(event) => {
              setSelectedFile(
                event.target.files[0] || null
              );
            }}
          />
        </label>
      </div>

      <div className="document-stats">

        <div className="document-stat-card">
          <span>
            Total Documents
          </span>

          <strong>
            {documents.length}
          </strong>
        </div>

        <div className="document-stat-card">
          <span>
            Indexed
          </span>

          <strong>
            {
              documents.filter(
                (doc) =>
                  doc.status === "Indexed"
              ).length
            }
          </strong>
        </div>

        <div className="document-stat-card">
          <span>
            Processing
          </span>

          <strong>
            0
          </strong>
        </div>

        <div className="document-stat-card">
          <span>
            Failed
          </span>

          <strong>
            0
          </strong>
        </div>

      </div>

      {selectedFile && (
        <div className="selected-document">

          <div>
            <FileText size={20} />

            <strong>
              {selectedFile.name}
            </strong>
          </div>

          <button
            onClick={handleUpload}
            className="primary-button"
          >
            <Upload size={17} />

            Upload & Index
          </button>

        </div>
      )}

      <div className="document-search">

        <Search size={19} />

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />

      </div>

      <div className="documents-card">

        <div className="documents-card-header">

          <h2>
            Knowledge Documents
          </h2>

          <p>
            Documents currently available
            to the AI system
          </p>

        </div>

        <div className="document-list">

          {filteredDocuments.map((doc) => (

            <div
              className="document-row"
              key={doc.name}
            >

              <div className="document-name">

                <FileText size={20} />

                <span>
                  {doc.name}
                </span>

              </div>

              <span>
                {doc.type}
              </span>

              <span className="document-status">
                ✓ {doc.status}
              </span>

              <span>
                {doc.chunks} chunks
              </span>

              <div className="document-actions">

                <button
                  className="action-button"
                  title="Re-index"
                  onClick={() =>
                    handleReindex(doc.name)
                  }
                >
                  <RefreshCw size={17} />
                </button>

                <button
                  className="action-button delete"
                  title="Delete"
                  onClick={() =>
                    handleDelete(doc.name)
                  }
                >
                  <Trash2 size={17} />
                </button>

              </div>

            </div>

          ))}

        </div>

        {filteredDocuments.length === 0 && (
          <p className="documents-empty">
            No documents found.
          </p>
        )}

      </div>

    </div>
  );
}

export default Documents;