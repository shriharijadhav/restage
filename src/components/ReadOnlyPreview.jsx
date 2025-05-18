import React from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

function ReadOnlyPreview({ content }) {
  const previewEditor = useCreateBlockNote({
    initialContent: content,
    editable: false,
  });

  return <BlockNoteView editor={previewEditor} editable={false} theme="light" />;
}

export default ReadOnlyPreview;
