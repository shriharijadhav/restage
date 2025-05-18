
/**
 * Adds Tailwind classes to HTML string based on tag names.
 * @param {string} htmlString - The input HTML string.
 * @returns {string} - The modified HTML string with Tailwind classes.
 */
export const addTailwindClasses = (htmlString) => {
    // Parse the HTML string into a DOM structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
  
    // Define a mapping of tags to Tailwind classes
    const tagClassMapping = {
      // Headings
      h1: "text-xl font-bold mb-6",
      h2: "text-lg font-bold mb-4",
      h3: "text-base font-semibold mb-3",
      h4: "text-base font-medium mb-2",
      h5: "text-sm font-medium mb-2",
      h6: "text-sm font-medium mb-1",
  
      // Text and emphasis
      p: "text-base leading-relaxed mb-4",
      strong: "font-semibold text-gray-800",
      em: "italic text-gray-700",
      small: "text-sm text-gray-600",
      blockquote: "border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4",
  
      // Lists
      ul: "list-disc pl-5",
      ol: "list-decimal pl-5",
      li: "mb-1",
      dl: "mb-4",
      dt: "font-semibold",
      dd: "ml-4 mb-2",
  
      // Links
      a: "text-blue-500 underline hover:text-blue-700",
  
      // Code
      pre: "bg-gray-100 p-4 rounded mb-2 overflow-x-auto text-sm",
      code: "bg-gray-200 px-1 py-0.5 rounded text-sm font-mono",
  
      // Tables
      table: "table-auto border-collapse border border-gray-300 w-full mb-2",
      thead: "bg-gray-100",
      th: "border border-gray-300 px-4 py-2 text-left font-bold",
      tr: "border border-gray-300",
      td: "border border-gray-300 px-4 py-2",
  
      // Media
      img: "max-w-full h-auto rounded mb-2",
      figure: "mb-4",
      figcaption: "text-sm text-gray-500",
  
      // Forms
      input: "border border-gray-300 rounded px-3 py-2 w-full mb-2",
      textarea: "border border-gray-300 rounded px-3 py-2 w-full mb-2",
      button: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
      select: "border border-gray-300 rounded px-3 py-2 w-full mb-2",
      option: "",
  
      // Others
      hr: "border-t border-gray-300 my-2",
      br: "block mb-2",
      div: "mb-2",
      span: "",
    };
  
    // Traverse elements and add classes
    Object.keys(tagClassMapping).forEach((tag) => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach((element) => {
        element.className = tagClassMapping[tag];
      });
    });
  
    // Return the modified HTML string
    return doc.body.innerHTML;
  };
  