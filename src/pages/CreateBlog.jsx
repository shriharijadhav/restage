import React, { useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Modal,
  Box,
} from "@mui/material";
import ReadOnlyPreview from "../components/ReadOnlyPreview";

export default function CreateBlog() {
  const editor = useCreateBlockNote();
  const [open, setOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);

  const handleOpen = () => {
    const content = editor.document;
    setPreviewContent(content);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPreviewContent(null);
  };

  const handleSave = () => {
    const content = editor.document;
    console.log("Payload to save:", content);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Start writing your awesome blog!
          </Typography>
          <Button variant="contained" onClick={handleOpen} sx={{ mr: 2 }}>
            Preview
          </Button>
        </Toolbar>
      </AppBar>

      {/* Editor Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          py: 4,
          px: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "800px", px: 2 }}>
          <BlockNoteView editor={editor} theme="light" />
        </Box>
      </Box>

      {/* Save Button (Bottom-Right Corner) */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>

      {/* Preview Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Blog Preview (Read-only)
          </Typography>
          {previewContent && <ReadOnlyPreview content={previewContent} />}
        </Box>
      </Modal>
    </Box>
  );
}
