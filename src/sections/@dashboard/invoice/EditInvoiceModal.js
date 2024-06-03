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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Label from "~/components/label";
import { InvoiceSchema } from "~/configs/zod.config";
import { valueLabelFormat } from "~/utils/formatNumber";
import { useEditInvoice, useGetInvoice } from "~/hooks/invoice/useInvoice";
import Loading from "~/components/Loading";
import { Alert } from "@mui/material";
import { toast } from "react-toastify";


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

export default function EditInvoiceModal({ open, setOpen, id }) {
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);
  const [radio, setRadio] = useState("");
  const [radioPayment, setRadioPayment] = useState("");
  // fetch data
  const data = useGetInvoice(id);


  const {
    register,
    formState: { errors, touchedFields },
    handleSubmit
  } = useForm({ resolver: zodResolver(InvoiceSchema) });

  const editInvoice = useEditInvoice(id);
  const handleEdit = async (dataForm) => {
    setIsLoading(true);
    const form = { ...dataForm, id, payment: radioPayment || data?.data?.payment, status: radio || data?.data?.status };
    editInvoice.mutateAsync(form);
    setIsLoading(false);
  };

  if (editInvoice.isSuccess) {
    toast.success("Chỉnh sửa thành công!");
    setOpen(false);
  }

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
              data.isLoading && <Box sx={{ marginTop: 2 }}>
                <Loading />
              </Box>
            }
            {
              data.error instanceof Error && <Box sx={{ marginTop: 2 }}>
                <Alert severity="error" variant="outlined" >{data.error.message}</Alert>
              </Box>
            }
            {
              data.isSuccess && data.data && <Stack spacing={3}>
                {/* bread */}
                <div role="presentation">
                  <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="inherit" fontSize={20}>
                    Quản lý hóa đơn
                    </Typography>
                    <Typography color="text.primary" fontSize={20}>Chỉnh sửa hóa đơn</Typography>
                    <Typography color="inherit" fontSize={20}>
                      ID - # {id}
                    </Typography>
                    <Label color={(data?.data.status === "Đang lấy hàng" && "info") || "success"}
                      variant="outlined"
                    >{data?.data.status}</Label>
                    <Label color={(data?.data.payment === "chưa thanh toán" && "error") || "success"}>{data?.data.payment}</Label>
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
                    Tên khách hàng:
                    </FormLabel>
                    <TextField variant="outlined"
                      {
                        ...register("name")
                      }
                      error={touchedFields && errors?.name?.message !== undefined}
                      helperText={touchedFields && errors?.name?.message}
                      defaultValue={data?.data?.name}
                      fullWidth
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Số điện thoại:
                    </FormLabel>
                    <TextField variant="outlined"
                      {
                        ...register("phoneNumber")
                      }
                      error={touchedFields && errors?.phoneNumber?.message !== undefined}
                      helperText={touchedFields && errors?.phoneNumber?.message}
                      defaultValue={data?.data?.phoneNumber}
                      fullWidth
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Email:
                    </FormLabel>
                    <TextField variant="outlined"
                      {
                        ...register("email")
                      }
                      error={touchedFields && errors?.email?.message !== undefined}
                      helperText={touchedFields && errors?.email?.message}
                      defaultValue={data?.data?.email}
                      fullWidth
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Địa chỉ giao hàng:
                    </FormLabel>
                    <TextField variant="outlined"
                      {
                        ...register("address")
                      }
                      error={touchedFields && errors?.address?.message !== undefined}
                      helperText={touchedFields && errors?.address?.message}
                      defaultValue={data?.data?.address}
                      fullWidth
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                      Tên sản phẩm:
                    </FormLabel>
                    <TextField variant="outlined"
                      disabled
                      defaultValue={data?.data.data?.map(obj => `${obj.id}: ${obj.name}`)?.join(", ")}
                      fullWidth
                    />
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Tổng tiền:
                    </FormLabel>
                    <TextField variant="outlined"
                      disabled
                      defaultValue={valueLabelFormat(data?.data?.total)}
                      fullWidth
                    />
                  </FormControl>


                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr:5 }}>Tình trạng
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={(e) => setRadio(e.currentTarget.value)}
                      def
                    >
                      <FormControlLabel value="Đang lấy hàng" control={<Radio />} label="Đang lấy hàng"/>
                      <FormControlLabel value="Đang giao" control={<Radio />} label="Đang giao" />
                      <FormControlLabel value="Thành công" control={<Radio />} label="Thành công" />
                    </RadioGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel sx={{ mr:5 }}>Thanh toán
                    </FormLabel>
                    <RadioGroup
                      row
                      onChange={(e) => setRadioPayment(e.currentTarget.value)}
                      def
                    >
                      <FormControlLabel value="chưa thanh toán" control={<Radio />} label="Chưa thanh toán"/>
                      <FormControlLabel value="Đã thanh toán" control={<Radio />} label="Đã thanh toán" />
                    </RadioGroup>
                  </FormControl>
                </Box>

                {/* action btn */}
                <Box display="flex" alignItems="center" gap={2}>
                  <LoadingButton variant="contained" loading={isLoading}
                    onClick={handleSubmit(handleEdit)}
                  >Chỉnh sửa hóa đơn</LoadingButton>
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