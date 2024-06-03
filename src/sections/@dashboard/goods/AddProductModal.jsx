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
import { NumericFormat } from "react-number-format";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoodsSchema } from "~/configs/zod.config";
import { useCreatePet } from "./hooks/usePet";


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

export default function AddProductModal({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);

  const materialUITextFieldProps = {
    label: "Giá tiền",
    variant: "outlined"
  };

  const {
    register,
    formState: { errors, touchedFields },
    handleSubmit, setValue, reset
  } = useForm({ resolver: zodResolver(GoodsSchema) });

  const addPet = useCreatePet({ setOpen, reset });

  const handleAdd = async (dataForm) => {
    setIsLoading(true);
    const form = { ...dataForm };
    addPet.mutateAsync(form);
    setIsLoading(true);
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
                  Quản lý nhập hàng
                  </Typography>
                  <Typography color="text.primary" fontSize={20}>Nhập hàng</Typography>
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
                <TextField label="Tên sản phẩm" variant="outlined"
                  {
                    ...register("productName")
                  }
                  error={touchedFields && errors?.productName?.message !== undefined}
                  helperText={touchedFields && errors?.productName?.message}
                  fullWidth/>

                <Box display="flex" alignItems="center" gap={2}>

                  <TextField label="số lượng" variant="outlined"
                    fullWidth
                    {
                      ...register("quantity")
                    }
                    error={touchedFields && errors?.quantity?.message !== undefined}
                    helperText={touchedFields && errors?.quantity?.message}
                  />
                  <NumericFormat
                    suffix={" đ"}
                    thousandSeparator
                    customInput={TextField}
                    {...materialUITextFieldProps}
                    fullWidth
                    onValueChange={(values) => {
                      const { floatValue } = values;
                      // do something with floatValue
                      setValue("price", floatValue);
                    }}
                    {
                      ...register("price")
                    }
                    error={touchedFields && errors?.price?.message !== undefined}
                    helperText={touchedFields && errors?.price?.message}
                  />
                  <TextField label="Nhà cung cấp" variant="outlined"
                    fullWidth
                    {
                      ...register("supplier")
                    }
                    error={touchedFields && errors?.supplier?.message !== undefined}
                    helperText={touchedFields && errors?.supplier?.message}
                  />
                </Box>
                <TextField label="Số điện thoại" variant="outlined"
                  fullWidth
                  {
                    ...register("phoneNumber")
                  }
                  error={touchedFields && errors?.phoneNumber?.message !== undefined}
                  helperText={touchedFields && errors?.phoneNumber?.message}
                />
                <TextField
                  label="Địa chỉ"
                  variant="outlined"
                  {
                    ...register("address")
                  }
                  error={touchedFields && errors?.address?.message !== undefined}
                  helperText={touchedFields && errors?.address?.message}
                />
                <TextField
                  label="Lưu ý"
                  multiline
                  rows={2}
                  variant="outlined"
                  {
                    ...register("note")
                  }
                  error={touchedFields && errors?.note?.message !== undefined}
                  helperText={touchedFields && errors?.note?.message}
                />
              </Box>


              {/* content */}

              {/* action btn */}
              <Box display="flex" alignItems="center" gap={2}>
                <LoadingButton variant="contained" loading={isLoading}
                  onClick={handleSubmit(handleAdd)}
                >Nhập hàng</LoadingButton>
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