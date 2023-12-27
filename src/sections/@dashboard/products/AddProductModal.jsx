import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { NumericFormat } from "react-number-format";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1
});


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
  const [imageUrl, setImageUrl] = useState([]);
  const [arr, setArr] = useState([]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setArr([]);
    setImageUrl([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setArr([...arr, reader.result]);
          setImageUrl([...imageUrl, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const handleOnImageRemoveClick = (index) => {
    const filter = arr.filter((i, number) => number !== index );
    setArr(filter);
  };
  const materialUITextFieldProps = {
    label: "Giá tiền",
    variant: "outlined"
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
                  Quản lý sản phẩm
                  </Typography>
                  <Typography color="text.primary" fontSize={20}>Thêm sản phẩm</Typography>
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
                <TextField id="outlined-basic" label="Tên sản phẩm" variant="outlined"
                  fullWidth/>

                <Box display="flex" alignItems="center" gap={2}>
                  <TextField id="outlined-basic" label="Giống" variant="outlined"
                    fullWidth sx={{ flex:2 }}/>
                  <TextField id="outlined-basic" label="Màu sắc" variant="outlined"
                    fullWidth sx={{ flex:2 }}/>
                  <FormControl fullWidth sx={{ flex:1 }}>
                    <InputLabel id="demo-simple-select-label">Giới tính</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Giới tính"
                    >
                      <MenuItem value="male">Đực</MenuItem>
                      <MenuItem value="female">Cái</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <NumericFormat
                    suffix={" đ"}
                    thousandSeparator
                    customInput={TextField}
                    {...materialUITextFieldProps}
                    fullWidth
                  />

                  <TextField id="outlined-basic" label="Nguồn gốc" variant="outlined"
                    fullWidth/>
                  <TextField id="outlined-basic" label="Tháng tuổi" variant="outlined"
                    sx={{ width:"400px" }}/>
                </Box>

                <TextField id="outlined-basic" label="Tình trạng sức khỏe" variant="outlined"
                  fullWidth/>
                <TextField
                  label="Mô tả"
                  multiline
                  rows={5}
                  variant="outlined"
                />
              </Box>

              {/*  */}
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}
                sx={{ width:"200px" }}
              >
                  Tải hình ảnh
                <VisuallyHiddenInput type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}/>
              </Button>
              {
                arr.length > 0 && <ImageList cols={4} sx={{ height: 200 }} rowHeight={150} >
                  {arr?.map((item, index) => (
                    <ImageListItem key={item}>
                      <img
                        src={item}
                        alt="image-list"
                        loading="lazy"
                        style={{ objectFit:"cover" }}
                      />
                      <Button onClick={() => handleOnImageRemoveClick(index)}>Xóa</Button>
                    </ImageListItem>
                  ))}
                </ImageList>
              }
              {/* content */}

              {/* action btn */}
              <Box display="flex" alignItems="center" gap={2}>
                <LoadingButton variant="contained" loading={false}>Thêm sản phẩm</LoadingButton>
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