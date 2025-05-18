import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Function to convert vh/vw to rem
const convertToRem = (value, type) => {
  const baseSize = 16; // 1rem = 16px (default browser font size)
  if (typeof value === "string" && value.includes("vh")) {
    return `${(parseFloat(value) * window.innerHeight) / baseSize / 100}rem`;
  }
  if (typeof value === "string" && value.includes("vw")) {
    return `${(parseFloat(value) * window.innerWidth) / baseSize / 100}rem`;
  }
  return value; // Return original value if it's not vh/vw
};

const ReusableModalMUI = ({
  open,
  onClose,
  title,
  children,
  width = "50vw",  // Accept width in vw
  height = "50vh",  // Accept height in vh
  isNonClosableModal = false,
  overlayColor = "#00000080",
  customPositionForCloseIcon=false,
  customCloseTop,
  customCloseRight,
  customBorderRadius = "24px",
  setMinHeight = false ,
  setMinHeightValue
}) => {
  const [convertedWidth, setConvertedWidth] = useState(convertToRem(width, "vw"));
  const [convertedHeight, setConvertedHeight] = useState(convertToRem(height, "vh"));

  useEffect(() => {
    // Update rem values on resize
    const handleResize = () => {
      setConvertedWidth(convertToRem(width, "vw"));
      setConvertedHeight(convertToRem(height, "vh"));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width, height]);

  // Modal style
  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) translateZ(0)", // ✅ Forces CPU rendering
    width: convertedWidth,
    height: convertedHeight,
    ...(setMinHeight && { minHeight: setMinHeightValue }), 
    
    bgcolor: "background.paper",
    boxShadow: "none",
    borderRadius: customBorderRadius,
    border: "none",
    overflow: "hidden", // ✅ Prevents triggering GPU acceleration
    outline: "none",
  
    /* ✅ Ensure Text Clarity */
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };
  

  const contentStyle = {
    overflowY: "auto",
    "-webkit-overflow-scrolling": "touch", // ✅ Ensures smooth scrolling
    textRendering: "optimizeLegibility", // ✅ Improves text sharpness
    contain: "paint", // ✅ Avoids unnecessary re-renders
  };
  

  return (
    <Modal
      open={open}
      onClose={onClose} // Handles overlay click
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      closeAfterTransition
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: overlayColor, // ✅ Ensures no backdrop filter
            backdropFilter: "none", // ✅ Prevents unwanted blurring
          },
        },
      }}
    >
      <Box sx={modalStyle} >
        {!isNonClosableModal && (
          <>
          {
            customPositionForCloseIcon && customCloseTop && customCloseRight ? (<Box
              display="flex"
              justifyContent="flex-end"
              position="absolute"
              top={customCloseTop}
              right={customCloseRight}
              zIndex={1}
             >
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>):(<Box
              display="flex"
              justifyContent="flex-end"
              position="absolute"
              top="14px"
              right="14px"
              zIndex={1}
            >
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>)
          }
          </>
          
        )}

        {/* Apply modalContentStyle to the children (content inside the modal) */}
        <Box id="modal-description" width="100%" height="100%" sx={contentStyle}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default ReusableModalMUI;
