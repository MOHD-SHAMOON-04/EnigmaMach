import { useEffect, useState } from "react";

const CopyBtn = ({ onClick }: { onClick: () => void }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleClick = () => {
    onClick();
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      className="ml-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? "✅" : "📋"}
    </button>
  )
};

export default CopyBtn;