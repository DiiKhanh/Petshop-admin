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
import React, { useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { NumericFormat } from "react-number-format";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemSchema } from "~/configs/zod.config";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Label from "~/components/label";
import { useEditItem, useGetItem } from "./hooks/useItem";
import Loading from "~/components/Loading";
import { Alert } from "@mui/material";


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

export default function EditProductModal({ open, setOpen, id }) {
  const handleClose = () => setOpen(false);
  const [imageUrl, setImageUrl] = useState([]);
  const [arr, setArr] = useState([]);
  const [listImg, setListImg] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [data, setData] = useState(null);
  const [url, setUrl] = useState([]);
  const [isRequest, setIsRequest] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [radio, setRadio] = useState("");

  const {
    register,
    formState: { errors, touchedFields, isDirty },
    handleSubmit, setValue
  } = useForm({ resolver: zodResolver(ItemSchema) });

  // fetch data
  const item = useGetItem(id);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setListImg((prev) => [...prev, e.target.files[0]]);
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
    const filterList = listImg.filter((i, number) => number !== index);
    setArr(filter);
    setListImg(filterList);
  };
  const handleOnImageRemoveClickData = (index) => {
    const updatedImages = [...item.data.images];
    updatedImages.splice(index, 1);
    setData({ ...item.data, images: updatedImages });
  };
  const materialUITextFieldProps = {
    label: "Giá tiền",
    variant: "outlined"
  };
  // cloudinary
  const uploadFiles = async (files) => {
    if (!files) return;
    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
    const PRESET_NAME = import.meta.env.VITE_PRESET_NAME;
    const FOLDER_NAME = import.meta.env.VITE_FOLDER_NAME;
    const urls = [];
    const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("upload_preset", PRESET_NAME);
    formData.append("folder", FOLDER_NAME);

    for (const file of files) {
      formData.append("file", file);
      const response = await axios.post(api, formData, {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });
      if (response) {
        setIsUpload(true);
        urls.push(response.data.secure_url);
      }
    }
    return urls;
  };

  const handleUploadImg = async () => {
    setIsRequest(true);
    const links = await uploadFiles(listImg);
    setIsRequest(false);
    if (links.length === 0) {
      toast.error("Lỗi upload ảnh!");
    }
    toast.success("Upload thành công!");
    setUrl(links);
  };

  const editItem = useEditItem(id);

  const handleEdit = async (dataForm) => {
    setIsLoading(true);
    let isDeleted = false;
    let isInStock = true;
    if (radio === "stock") {
      isDeleted = false;
      isInStock = true;
    } else if (radio === "notstock") {
      isDeleted = false;
      isInStock = false;
    } else if (radio === "stockdelete") {
      isDeleted = true;
      isInStock = true;
    } else if (radio === "notstockdelete") {
      isDeleted = true;
      isInStock = false;
    }

    let form;
    if (data?.images) {
      form = { ...dataForm, id, images:[...data.images, ...url], isDeleted, isInStock };
    } else {
      form = { ...dataForm, id, images:[...item.data.images, ...url], isDeleted, isInStock };
    }
    editItem.mutateAsync(form);
    setIsLoading(false);
  };

  if (editItem.isSuccess) {
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
              item.isLoading && <Box sx={{ marginTop: 2 }}>
                <Loading />
              </Box>
            }
            {
              item.error instanceof Error && <Box sx={{ marginTop: 2 }}>
                <Alert severity="error" variant="outlined" >{item.error.message}</Alert>
              </Box>
            }
            {
              item.isSuccess && item.data && <Stack spacing={3}>
                {/* bread */}
                <div role="presentation">
                  <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="inherit" fontSize={20}>
                  Quản lý sản phẩm thú cưng
                    </Typography>
                    <Typography color="text.primary" fontSize={20}>Chỉnh sửa sản phẩm</Typography>
                    <Typography color="inherit" fontSize={20}>
                      ID - {id}
                    </Typography>
                    <FormLabel sx={{ fontWeight:"bold", fontSize:"20px" }}>
                    Tình trạng:
                      <Label color={item?.data?.isDeleted ? "error" : !(item?.data?.isInStock) ? "warning" : "success"} sx={{ ml:"10px", fontSize:"20px" }}>
                        {
                          item?.data?.isDeleted ? "Bị xóa" : "Có sẵn"
                        } / {
                          item?.data?.isInStock ? "Còn hàng" : "Hết hàng"
                        }
                      </Label>
                    </FormLabel>
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
                    Tên sản phẩm:
                    </FormLabel>
                    <TextField variant="outlined"
                      {
                        ...register("itemName")
                      }
                      error={touchedFields && errors?.itemName?.message !== undefined}
                      helperText={touchedFields && errors?.itemName?.message}
                      defaultValue={item?.data?.itemName}
                      fullWidth
                    />
                  </FormControl>

                  <Box display="flex" alignItems="center" gap={2}>
                    <TextField label="Loại" variant="outlined" defaultValue={item?.data?.category}
                      fullWidth sx={{ flex:2, shrink:true }}
                      {
                        ...register("category")
                      }
                      error={touchedFields && errors?.category?.message !== undefined}
                      helperText={touchedFields && errors?.category?.message}
                    />
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <NumericFormat
                      suffix={" đ"}
                      thousandSeparator
                      customInput={TextField}
                      {...materialUITextFieldProps}
                      fullWidth
                      sx={{ shrink:true }}
                      defaultValue={item?.data?.price}
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

                    <TextField label="Số lượng" variant="outlined"
                      sx={{ width:"400px", shrink:true }}
                      defaultValue={+item?.data?.quantity}
                      {
                        ...register("quantity")
                      }
                      error={touchedFields && errors?.quantity?.message !== undefined}
                      helperText={touchedFields && errors?.quantity?.message}
                    />
                  </Box>

                  <TextField
                    label="Mô tả"
                    multiline
                    rows={3}
                    variant="outlined"
                    defaultValue={item?.data?.description}
                    {
                      ...register("description")
                    }
                    error={touchedFields && errors?.description?.message !== undefined}
                    helperText={touchedFields && errors?.description?.message}
                    sx={{ shrink:true }}
                  />
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Tình trạng</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={(e) => setRadio(e.currentTarget.value)}
                      def

                    >
                      <FormControlLabel value="stock" control={<Radio />} label="Có sẵn / Còn hàng" />
                      <FormControlLabel value="notstock" control={<Radio />} label="Có sẵn / Hết hàng" />
                      <FormControlLabel value="stockdelete" control={<Radio />} label="Bị xóa / Còn hàng" />
                      <FormControlLabel value="notstockdelete" control={<Radio />} label="Bị xóa / Hết hàng" />
                    </RadioGroup>
                  </FormControl>
                </Box>

                {/*  */}
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}
                  sx={{ width:"200px" }}
                >
                  Tải hình ảnh
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/png , image/jpeg, image/webp"
                    multiple
                    onChange={handleFileUpload}/>
                </Button>
                <Box display="flex" alignItems="center" justifyContent="start">
                  {
                    item?.data?.images?.length > 0 && <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={200}>
                      {item?.data?.images?.map((item, index) => (
                        <React.Fragment key={item}>
                          <ImageListItem >
                            <img
                              src={item}
                              alt="image-list"
                              loading="lazy"
                              style={{ objectFit:"cover" }}
                            />
                            <Button onClick={() => handleOnImageRemoveClickData(index)}>Xóa</Button>
                          </ImageListItem>
                        </React.Fragment>
                      ))}
                    </ImageList>
                  }
                  {
                    arr.length > 0 && <ImageList cols={4} sx={{ width: 500, height: 200 }} rowHeight={200} >
                      {arr?.map((item, index) => (
                        <React.Fragment key={item}>
                          <ImageListItem >
                            <img
                              src={item}
                              alt="image-list"
                              loading="lazy"
                              style={{ objectFit:"cover" }}
                            />
                            <Button onClick={() => handleOnImageRemoveClick(index)}>Xóa</Button>
                          </ImageListItem>
                        </React.Fragment>
                      ))}
                    </ImageList>
                  }
                </Box>

                {
                  arr.length > 0 && <LoadingButton sx={{ display: `${isUpload && "none"}` }}
                    onClick={handleUploadImg}
                    loading={isRequest}
                  >Xác nhận các hình ảnh</LoadingButton>
                }
                {/* content */}

                {/* action btn */}
                <Box display="flex" alignItems="center" gap={2}>
                  <LoadingButton variant="contained" loading={isLoading}
                    onClick={handleSubmit(handleEdit)} disabled={!isDirty}
                  >Chỉnh sửa sản phẩm</LoadingButton>
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