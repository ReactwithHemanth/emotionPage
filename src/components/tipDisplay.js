import DOMPurify from "dompurify"; // For sanitizing HTML

// Component to render the tip with sanitized HTML
export const TipDisplay = ({ tip }) => {
  const sanitizedTip = DOMPurify.sanitize(tip); // Sanitize the HTML
  return <div className="tip-container" dangerouslySetInnerHTML={{ __html: sanitizedTip }} />;
};
