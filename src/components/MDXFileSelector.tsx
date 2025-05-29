import React from "react";

interface MDXFileSelectorProps {
  currentFile: string;
  onFileChange: (file: string) => void;
}

const MDXFileSelector: React.FC<MDXFileSelectorProps> = ({
  currentFile,
  onFileChange,
}) => {
  const mdxFiles = [
    { path: "/src/mdx/content/welcome.mdx", name: "Welcome" },
    { path: "/src/mdx/content/example.mdx", name: "Example" },
    { path: "/src/mdx/content/awesome-terminal.mdx", name: "Terminal" },
    { path: "/src/mdx/content/writing-effect-inspired-by-apple.mdx", name: "Apple" },
  ];

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto 2rem",
        padding: "1rem",
        backgroundColor: "#ffffff",
        borderRadius: "0.5rem",
        border: "1px solid #e9ecef",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ margin: "0 0 1rem", color: "#495057" }}>选择MDX文件</h3>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {mdxFiles.map((file) => (
          <button
            key={file.path}
            onClick={() => onFileChange(file.path)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #dee2e6",
              borderRadius: "0.25rem",
              backgroundColor:
                currentFile === file.path ? "#007bff" : "#ffffff",
              color: currentFile === file.path ? "#ffffff" : "#495057",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: "0.9rem",
            }}
            onMouseEnter={(e) => {
              if (currentFile !== file.path) {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }
            }}
            onMouseLeave={(e) => {
              if (currentFile !== file.path) {
                e.currentTarget.style.backgroundColor = "#ffffff";
              }
            }}
          >
            {file.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MDXFileSelector;
