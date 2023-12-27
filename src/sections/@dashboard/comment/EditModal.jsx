import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { toast } from "react-toastify";
import FormLabel from "@mui/material/FormLabel";
import Label from "~/components/label";
import commentApi from "~/apis/modules/comment.api";


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

export default function EditModal({ open, setOpen, item }) {
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);


  // fetch data
  const handleEdit = async () => {
    setIsLoading(true);
    const { response, err } = await commentApi.update({ id: item.comment_id, isAccept: true });
    setIsLoading(false);
    if (response) {
      toast.success("Đã phê duyệt thành công!");
      handleClose();
    }
    if (err) {
      toast.error("Có lỗi khi phê duyệt!!");
    }
  };

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
            {
              item && <Stack spacing={3}>
                {/* bread */}
                <div role="presentation">
                  <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="inherit" fontSize={20}>
                    Quản lý bình luận đánh giá
                    </Typography>
                    <Typography color="text.primary" fontSize={20}>Phê duyệt đánh giá</Typography>
                    <Typography color="inherit" fontSize={20}>
                      ID - # {item?.comment_id}
                    </Typography>
                    <Label color={(item?.isAccept === false&& "error") || "success"}
                      variant="outlined"
                    >{item?.isAccept ? "Đã duyệt" : "Chưa được duyệt"}</Label>
                  </Breadcrumbs>
                </div>
                {/* bread */}

                {/* content */}
                {/* form */}

                <Box
                  component="form"
                  autoComplete="off"
                  display="flex"
                  flexDirection="column"
                  gap={2}
                >
                  <FormControl>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Người bình luận:
                    </FormLabel>
                    <TextField value={item?.username} disabled/>
                  </FormControl>
                  <FormControl>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Nội dung bình luận:
                    </FormLabel>
                    <TextField value={item?.content} multiline maxRows={3} disabled/>
                  </FormControl>

                </Box>

                {/* action btn */}
                <Box display="flex" alignItems="center" gap={2}>
                  <LoadingButton variant="contained" loading={isLoading}
                    onClick={handleEdit}
                  >Phê duyệt bình luận</LoadingButton>
                  <Button onClick={handleClose} variant="text" sx={{ color:"error.main" }}>
                  Hủy
                  </Button>
                </Box>
              </Stack>
            }
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}