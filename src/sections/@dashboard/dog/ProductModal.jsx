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
import { useEffect, useState } from "react";
import dogApi from "~/apis/modules/dog.api";
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


export default function ProductModal({ open, setOpen, id }) {

  const handleClose = () => setOpen(false);
  const [dogDetail, setDogDetail] = useState(null);

  useEffect(() => {
    const getDog = async () => {
      const { response, err } = await dogApi.getDogByIdAdmin({ id });
      if (response) {
        setDogDetail(response);
      }
      if (err) {
        toast.error(err);
      }
    };
    getDog();
  }, [id]);


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
                  <FormLabel sx={{ fontWeight:"bold", fontSize:"20px" }}>
                    Tình trạng:
                    <Label color={dogDetail?.isDeleted ? "error" : !(dogDetail?.isInStock) ? "warning" : "success"} sx={{ ml:"10px", fontSize:"16px" }}>
                      {
                        dogDetail?.isDeleted ? "Bị xóa" : "Có sẵn"
                      } / {
                        dogDetail?.isInStock ? "Còn hàng" : "Hết hàng"
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
                  <TextField label={dogDetail?.dogName} variant="outlined"
                    disabled
                    fullWidth
                  />
                </FormControl>

                <Box display="flex" alignItems="center" gap={2}>
                  <FormControl sx={{ flex:1 }}>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Giống:
                    </FormLabel>
                    <TextField label={dogDetail?.dogSpeciesName} variant="outlined"
                      disabled
                    />
                  </FormControl>
                  <FormControl sx={{ flex:2 }}>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Màu sắc:
                    </FormLabel>
                    <TextField label={dogDetail?.color} variant="outlined"
                      fullWidth
                      disabled
                    />
                  </FormControl>
                  <FormControl sx={{ flex:1 }}>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Giới tính:
                    </FormLabel>
                    <TextField label={dogDetail?.sex} variant="outlined"
                      disabled
                    />
                  </FormControl>
                  <FormControl sx={{ flex:1 }}>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Tháng tuổi:
                    </FormLabel>
                    <TextField label={dogDetail?.age} variant="outlined"
                      disabled/>
                  </FormControl>
                  <FormControl sx={{ flex:2 }}>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                    Giá tiền:
                    </FormLabel>
                    <TextField label={valueLabelFormat(dogDetail?.price)} variant="outlined"
                      disabled/>
                  </FormControl>
                </Box>

                <Box display="flex" alignItems="center" gap={2} flexDirection="column">

                  <FormControl fullWidth>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                  Nguồn gốc:
                    </FormLabel>
                    <TextField label={dogDetail?.origin} variant="outlined" disabled
                      fullWidth/>
                  </FormControl>
                  <FormControl fullWidth>
                    <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                  Tình trạng sức khỏe:
                    </FormLabel>
                    <TextField label={dogDetail?.healthStatus} variant="outlined" disabled
                      fullWidth/>
                  </FormControl>

                </Box>
                <FormControl>
                  <FormLabel sx={{ mb:"10px", fontWeight:"bold" }}>
                  Mô tả:
                  </FormLabel>
                  <TextField
                    label={dogDetail?.description}
                    multiline
                    disabled
                    rows={2}
                    variant="outlined"
                  />
                </FormControl>
                <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
                  {dogDetail?.images?.map((item) => (
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