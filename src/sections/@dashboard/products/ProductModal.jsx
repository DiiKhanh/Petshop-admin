import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4
};

export default function ProductModal({ open, setOpen, id }) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Stack spacing={5}>
              {/* bread */}
              <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography color="inherit" fontSize={20}>
                  Quản lý sản phẩm
                  </Typography>
                  <Typography color="text.primary" fontSize={20}>ID - {id}</Typography>
                </Breadcrumbs>
              </div>
              {/* bread */}

              {/* content */}

              {/* content */}

              {/* action btn */}
              <Box display="flex" alignItems="center" gap={4}>
                <Button onClick={handleClose} variant="contained">
              Xác nhận
                </Button>
                <Button onClick={handleClose} variant="text" sx={{ color:"error.main" }}>
              Hủy
                </Button>
              </Box>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}