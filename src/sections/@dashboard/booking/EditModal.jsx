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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Label from "~/components/label";
import { BookingSchema } from "~/configs/zod.config";
import bookingApi from "~/apis/modules/booking.api";


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
  const [radio, setRadio] = useState("");


  const {
    register,
    formState: { errors, touchedFields },
    handleSubmit
  } = useForm({ resolver: zodResolver(BookingSchema) });


  // fetch data
  const handleEdit = async (dataForm) => {
    setIsLoading(true);
    const form = { ...dataForm, id: item?.appointment_id, status: radio };
    const { response, err } = await bookingApi.update(form);
    setIsLoading(false);
    if (response) {
      toast.success("Chỉnh sửa thành công!");
      handleClose();
    }
    if (err) {
      toast.error("Có lỗi khi chỉnh sửa!!");
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
                    Quản lý lịch hẹn khám
                    </Typography>
                    <Typography color="text.primary" fontSize={20}>Chỉnh sửa lịch hẹn khám</Typography>
                    <Typography color="inherit" fontSize={20}>
                      ID - # {item?.appointment_id}
                    </Typography>
                    <Label color={(item?.status === "Pending" && "error") || "success"}
                      variant="outlined"
                    >{item.status}</Label>
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
                    Kết quả:
                    </FormLabel>
                    <TextField variant="outlined"
                      {
                        ...register("result")
                      }
                      error={touchedFields && errors?.result?.message !== undefined}
                      helperText={touchedFields && errors?.result?.message}
                      multiline
                      maxRows={5}
                      fullWidth
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel sx={{ mr:5 }}>Tình trạng đơn đăng ký
                    </FormLabel>
                    <RadioGroup
                      row
                      name="row-radio-buttons-group"
                      onChange={(e) => setRadio(e.currentTarget.value)}
                      def
                    >
                      <FormControlLabel value="Pending" control={<Radio />} label="Đang chờ"/>
                      <FormControlLabel value="Approved" control={<Radio />} label="Chấp nhận" />
                      <FormControlLabel value="Completed" control={<Radio />} label="Thành công" />
                      <FormControlLabel value="Rejected" control={<Radio />} label="Từ chối" />
                    </RadioGroup>
                  </FormControl>

                </Box>

                {/* action btn */}
                <Box display="flex" alignItems="center" gap={2}>
                  <LoadingButton variant="contained" loading={isLoading}
                    onClick={handleSubmit(handleEdit)}
                  >Chỉnh sửa lịch hẹn</LoadingButton>
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