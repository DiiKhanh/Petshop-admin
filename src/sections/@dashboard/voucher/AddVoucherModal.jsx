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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VoucherShema } from "~/configs/zod.config";
import { toast } from "react-toastify";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";
import { useCreateVoucher } from "./hooks/useVoucher";

function Label({ componentName }) {
  const content = (
    <span>
      <strong>{componentName}</strong>
    </span>
  );
  return content;
}


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

const materialUITextFieldProps = {
  label: "Giá tiền",
  variant: "outlined"
};

export default function AddVoucherModal({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDis, setIsDis] = useState(false);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    // const formattedDate = format(date, "MM dd yyyy");
    // const formattedDateStart = format(startDate, "MM dd yyyy");
    if (startDate && date > startDate) {
      setEndDate(date);
      setIsDis(false);
      return;
    } else if (date <= startDate) {
      toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
      setEndDate(null);
      setIsDis(true);
      return;
    }
  };


  const {
    register,
    formState: { errors, touchedFields },
    handleSubmit, setValue, reset
  } = useForm({ resolver: zodResolver(VoucherShema) });

  const addVoucher = useCreateVoucher({ setOpen, reset });

  const handleAdd = async (dataForm) => {
    setIsLoading(true);
    addVoucher.mutateAsync({ ...dataForm, start_date: format(startDate, "MM dd yyyy"), end_date: format(endDate, "MM dd yyyy") });
    setIsLoading(false);
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
            <Stack spacing={3}>
              {/* bread */}
              <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography color="inherit" fontSize={20}>
                  Quản lý voucher
                  </Typography>
                  <Typography color="text.primary" fontSize={20}>Thêm voucher</Typography>
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
                <TextField label="Mã voucher" variant="outlined"
                  {
                    ...register("code")
                  }
                  error={touchedFields && errors?.code?.message !== undefined}
                  helperText={touchedFields && errors?.code?.message}
                  fullWidth/>


                <Box display="flex" alignItems="center" gap={2}>

                  <NumericFormat
                    suffix={" đ"}
                    thousandSeparator
                    customInput={TextField}
                    {...materialUITextFieldProps}
                    fullWidth
                    onValueChange={(values) => {
                      const { floatValue } = values;
                      // do something with floatValue
                      setValue("discount_value", floatValue);
                    }}
                    {
                      ...register("discount_value")
                    }
                    error={touchedFields && errors?.discount_value?.message !== undefined}
                    helperText={touchedFields && errors?.discount_value?.message}
                  />

                  <TextField label="Số lượng voucher" variant="outlined"
                    sx={{ width:"400px" }}
                    {
                      ...register("max_usage")
                    }
                    error={touchedFields && errors?.max_usage?.message !== undefined}
                    helperText={touchedFields && errors?.max_usage?.message}
                  />
                </Box>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DemoContainer
                    components={[
                      "DatePicker"
                    ]}
                  >
                    <DemoItem label={<Label componentName="Thời gian bắt đầu"/>}>
                      <DatePicker
                        value={startDate} onChange={handleStartDateChange}
                      />
                    </DemoItem>
                    <DemoItem label={<Label componentName="Thời gian kết thúc"/>}>
                      <DatePicker
                        value={endDate} onChange={handleEndDateChange}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Box>

              {/* acion btn */}
              <Box display="flex" alignItems="center" gap={2}>
                <LoadingButton variant="contained" loading={isLoading}
                  onClick={handleSubmit(handleAdd)}
                  disabled={isDis}
                >Thêm voucher</LoadingButton>
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