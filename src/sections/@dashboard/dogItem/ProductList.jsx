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
import { ProductListHead, ProductModal, EditProductModal } from "~/sections/@dashboard/dogItem";
import ListToolbar from "./ListToolbar";
import { valueLabelFormat } from "~/utils/formatNumber";
import { fDateTime } from "~/utils/formatTime";
import { CSVLink } from "react-csv";
import { useDeleteItem, useGetAllItem } from "./hooks/useItem";
import Loading from "~/components/Loading";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "product", label: "Tên sản phẩm", alignRight: false },
  { id: "quantity", label: "Số lượng", alignRight: false },
  { id: "category", label: "Loại", alignRight: false },
  { id: "price", label: "Giá", alignRight: false },
  { id: "create_at", label: "Ngày tạo", alignRight: false },
  { id: "update_at", label: "Ngày chỉnh sửa", alignRight: false },
  { id: "status", label: "Tình trạng", alignRight: false },
  { id: "action" }
];

// ----------------------------------------------------------------------
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    return filter(array, (_dogItem) => _dogItem.itemName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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

  const item = useGetAllItem();

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
      const newSelecteds = item?.data?.map((n) => n.itemName);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - item?.data?.length) : 0;

  const filteredItems = applySortFilter(item?.data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredItems?.length && !!filterName;

  const deleteItem = useDeleteItem();
  const handleSoftDelete = async (id) => {
    deleteItem.mutateAsync(id);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Card>
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
            item.isSuccess && item?.data.length > 0 && <>
              <ListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <ProductListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={item?.data?.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { dogProductItemId, itemName, images, category, price, createAt,
                          updatedAt, isDeleted, isInStock, quantity } = row;
                        const selectedDogItem = selected.indexOf(itemName) !== -1;
                        return (
                          <TableRow hover key={dogProductItemId} tabIndex={-1} role="checkbox" selected={selectedDogItem}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedDogItem} onChange={(event) => handleClick(event, itemName)} />
                            </TableCell>

                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={itemName} src={images[0]} variant="square"
                                  sx={{ width: 100, height: 100 }}
                                />
                                <Typography variant="subtitle2" flexWrap="true">
                                  {itemName}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{quantity}</TableCell>
                            <TableCell align="left">{category}</TableCell>
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
                              <IconButton size="large" color="inherit" onClick={handleOpenMenu(dogProductItemId)}>
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
                count={item?.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          }
          {
            item.isSuccess && item?.data.length === 0 && <>
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
                          Chưa có thông tin sản phẩm
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
              handleSoftDelete(selectId);
            }
            } color="error">Xóa</Button>
            <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      {
        openModal && <ProductModal open={openModal} setOpen={setOpenModal} id={selectId}/>
      }
      {
        openEditModal && <EditProductModal open={openEditModal} setOpen={setOpenEditModal} id={selectId} />
      }
      {
        item.isSuccess && item?.data.length > 0 && <Button color="warning" variant="outlined"
          sx={{
            mt:4
          }}
        >
          <CSVLink
            data={item?.data}
            filename={"my-pet-product.csv"}
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
