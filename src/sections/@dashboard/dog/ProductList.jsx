import { filter } from "lodash";
import React, { useState } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Slide
} from "@mui/material";
// components
import Label from "~/components/label";
import Iconify from "~/components/iconify";
import Scrollbar from "~/components/scrollbar";
// sections
import { ProductListHead, ProductModal, EditProductModal } from "~/sections/@dashboard/dog";
import ListToolbar from "./ListToolbar";
import { valueLabelFormat } from "~/utils/formatNumber";
import { fDateTime } from "~/utils/formatTime";
import { CSVLink } from "react-csv";
import { useDeletePet, useGetAllPet } from "./hooks/usePet";
import Loading from "~/components/Loading";

// ----------------------------------------------------------------------
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TABLE_HEAD = [
  { id: "product", label: "Tên sản phẩm", alignRight: false },
  { id: "type", label: "Loại", alignRight: false },
  { id: "category", label: "Giống", alignRight: false },
  { id: "price", label: "Giá", alignRight: false },
  { id: "create_at", label: "Ngày tạo", alignRight: false },
  { id: "update_at", label: "Ngày chỉnh sửa", alignRight: false },
  { id: "status", label: "Tình trạng", alignRight: false },
  { id: "action" }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_dog) => _dog.dogName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function ProductList() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectId, setSelectId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  // react-query
  const newData = useGetAllPet();


  const handleOpenMenu = (id) => (event) => {
    setOpen(event.currentTarget);
    setSelectId(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = newData?.data?.map((n) => n.dogName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - newData?.data?.length) : 0;

  const filteredDogs = applySortFilter(newData?.data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredDogs?.length && !!filterName;

  const deletePet = useDeletePet();
  const handleSoftDelete = async (id) => {
    deletePet.mutateAsync(id);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Card>
          {
            newData.isLoading && <Box sx={{ marginTop: 2 }}>
              <Loading />
            </Box>
          }
          {
            newData.error instanceof Error && <Box sx={{ marginTop: 2 }}>
              <Alert severity="error" variant="outlined" >{newData.error.message}</Alert>
            </Box>
          }
          {
            newData.isSuccess && newData?.data?.length > 0 && <>
              <ListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <ProductListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={newData?.data?.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredDogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { dogItemId, dogName, images, dogSpeciesName, price, createAt, type,
                          updatedAt, isDeleted, isInStock } = row;
                        const selectedDog = selected.indexOf(dogName) !== -1;
                        return (
                          <TableRow hover key={dogItemId} tabIndex={-1} role="checkbox" selected={selectedDog}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedDog} onChange={(event) => handleClick(event, dogName)} />
                            </TableCell>

                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={dogName} src={images[0]} variant="square"
                                  sx={{ width: 100, height: 100 }}
                                />
                                <Typography variant="subtitle2" flexWrap="true">
                                  {dogName}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{type === "dog" ? "Chó" : "Mèo"}</TableCell>
                            <TableCell align="left">{dogSpeciesName}</TableCell>
                            <TableCell align="left">{price > 0 ? `${valueLabelFormat(price)}` : "0"}</TableCell>

                            <TableCell align="left">{fDateTime(createAt)}</TableCell>

                            <TableCell align="left">{updatedAt ? `${fDateTime(updatedAt)}` : "Chưa chỉnh sửa"}</TableCell>

                            <TableCell align="left">
                              <Label color={isDeleted ? "error" : !isInStock ? "warning" : "success"}>
                                {
                                  isDeleted ? "Bị xóa" : "Có sẵn"
                                } / {
                                  isInStock ? "Còn hàng" : "Hết hàng"
                                }
                              </Label>
                            </TableCell>

                            <TableCell align="right">
                              <IconButton size="large" color="inherit" onClick={handleOpenMenu(dogItemId)}>
                                <Iconify icon={"eva:more-vertical-fill"} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                            <Paper
                              sx={{
                                textAlign: "center"
                              }}
                            >
                              <Typography variant="h6" paragraph>
                              Không tìm thấy
                              </Typography>

                              <Typography variant="body2">
                                Không tìm thấy kết quả tìm kiếm &nbsp;
                                <strong>&quot;{filterName}&quot;</strong>.
                                <br /> Thử lại hoặc tìm kiếm sản phẩm khác
                              </Typography>
                            </Paper>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={newData?.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          }
          {
            newData.isSuccess && newData?.data.length === 0 && <>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: "center"
                        }}
                      >
                        <Typography variant="h6" paragraph>
                              Chưa có thông tin thú cưng
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          }
        </Card>
      </Container>
      {/* dialog confirm */}
      <React.Fragment>
        <Dialog
          open={openConfirm}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpenConfirm(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Xác nhận xóa"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            Bạn có chắc chắn muốn xóa?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenConfirm(false);
              handleSoftDelete(selectId); }
            } color="error">Xóa</Button>
            <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75
            }
          }
        }}
      >
        <MenuItem onClick={() => {
          setOpenModal(true);
          handleCloseMenu();
        }}>
          <Iconify icon={"eva:eye-outline"} sx={{ mr: 2 }} />
          Xem
        </MenuItem>

        <MenuItem onClick={() => {
          setOpenEditModal(true);
          handleCloseMenu();
        }}>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          Chỉnh sửa
        </MenuItem>

        <MenuItem sx={{ color: "error.main" }} onClick={() => {
          setOpenConfirm(true);
          handleCloseMenu();
        }}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Popover>

      {
        openModal && <ProductModal open={openModal} setOpen={setOpenModal} id={selectId}/>
      }
      {
        openEditModal && <EditProductModal open={openEditModal} setOpen={setOpenEditModal} id={selectId} />
      }
      {
        newData.isSuccess && newData?.data.length > 0 && <Button color="warning" variant="outlined"
          sx={{
            mt:4
          }}
        >
          <CSVLink
            data={newData?.data}
            filename={"my-pet.csv"}
            target="_blank"
            style={{ textDecorationLine:"none" }}
          >
          Export file Excel
          </CSVLink>
        </Button>
      }
    </>
  );
}
