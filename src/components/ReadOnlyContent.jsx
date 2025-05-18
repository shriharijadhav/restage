import React from "react";
import DOMPurify from "dompurify";
 import { marked } from "marked"; // Import the markdown parser
import { addTailwindClasses } from "../utils/markDown";

const ReadOnlyContent = ({ markdownContent }) => {

const sanitizedHtmlString = addTailwindClasses(DOMPurify.sanitize(marked(markdownContent)));
  return (
    <div
      className="prose max-w-full"
      dangerouslySetInnerHTML={{ __html: sanitizedHtmlString }}
    />
  );
};

export default ReadOnlyContent;
