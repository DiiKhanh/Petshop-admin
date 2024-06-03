import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { valueLabelFormat } from "~/utils/formatNumber";
import FormLabel from "@mui/material/FormLabel";
import Label from "~/components/label";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useGetItem } from "./hooks/useItem";
import Loading from "~/components/Loading";
import { Alert } from "@mui/material";


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
  const data = useGetItem(id);


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
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <Button onClick={handleClose} variant="outlined" sx={{ color:"error.main" }}>
                Đóng
              </Button>
            </Box>

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
              data.isSuccess && data?.data &&
            <Stack spacing={5}>
              {/* bread */}
              <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography color="inherit" fontSize={20}>
                Quản lý sản phẩm thú cưng
                  </Typography>
                  <Typography color="text.primary" fontSize={20}>ID - {id}</Typography>
                  <FormLabel sx={{ fontWeight:"bold", fontSize:"20px" }}>
                    Tình trạng:
                    <Label color={data?.data?.isDeleted ? "error" : !(data?.data?.isInStock) ? "warning" : "success"} sx={{ ml:"10px", fontSize:"20px" }}>
                      {
                        data?.data?.isDeleted ? "Bị xóa" : "Có sẵn"
                      } / {
                        data?.data?.isInStock ? "Còn hàng" : "Hết hàng"
                      }
                    </Label>
                  </FormLabel>
                </Breadcrumbs>
              </div>
              {/* bread */}

              {/* content */}

              <Box
                component="form"
                autoComplete="off"
                display="flex"
                flexDirection="column"
                gap={2}
              >
                <FormControl>
                  <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                Tên sản phẩm:
                  </FormLabel>
                  <TextField label={data?.data?.itemName} variant="outlined"
                    disabled
                    fullWidth
                  />
                </FormControl>

                <Box display="flex" alignItems="center" gap={2}>
                  <FormControl sx={{ flex:1 }}>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Loại:
                    </FormLabel>
                    <TextField label={data?.data?.category} variant="outlined"
                      disabled
                    />
                  </FormControl>
                  <FormControl sx={{ flex:2 }}>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Giá tiền:
                    </FormLabel>
                    <TextField label={valueLabelFormat(data?.data?.price)} variant="outlined"
                      disabled/>
                  </FormControl>
                </Box>

                <Box display="flex" alignItems="center" gap={2} flexDirection="column">

                  <FormControl fullWidth>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                  Số lượng:
                    </FormLabel>
                    <TextField label={data?.data?.quantity} variant="outlined" disabled
                      fullWidth/>
                  </FormControl>


                </Box>
                <FormControl>
                  <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                  Mô tả:
                  </FormLabel>
                  <TextField
                    label={data?.data?.description}
                    multiline
                    disabled
                    rows={2}
                    variant="outlined"
                  />
                </FormControl>
                <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
                  {data?.data?.images?.map((item) => (
                    <ImageListItem key={item}>
                      <img
                        srcSet={`${item}`}
                        src={`${item}`}
                        alt={item}
                        loading="lazy"
                        style={{ objectFit:"cover" }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
              {/* content */}
              {/* action btn */}

            </Stack>
            }
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}