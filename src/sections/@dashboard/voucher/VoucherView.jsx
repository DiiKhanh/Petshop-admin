import { filter } from "lodash";
import { sentenceCase } from "change-case";
import React, { useState } from "react";
// @mui
import {
  Card,
  Table,
  Paper,
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
import VoucherListToolbar from "./VoucherListToolbar";
import VoucherListHead from "./VoucherListHead";
// mock
import { fDateTime } from "~/utils/formatTime";
import { valueLabelFormat } from "~/utils/formatNumber";
import { parse } from "date-fns";
import { useDeleteVoucher, useGetAll } from "./hooks/useVoucher";
import Loading from "~/components/Loading";
import EditVoucherModal from "./EditVoucherModal";

// ----------------------------------------------------------------------
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const TABLE_HEAD = [
  { id: "voucher_id", label: "ID", alignRight: false },
  { id: "code", label: "Mã voucher", alignRight: false },
  { id: "discount_value", label: "Số tiền giảm", alignRight: false },
  { id: "start_date", label: "Thời gian bắt đầu", alignRight: false },
  { id: "end_date", label: "Thời gian kết thúc", alignRight: false },
  { id: "updated", label: "Chỉnh sửa", alignRight: false },
  { id: "max_usage", label: "Số lượng voucher", alignRight: false },
  { id: "current_usage", label: "Đã sử dụng", alignRight: false },
  { id: "status", label: "Tình trạng", alignRight: false },
  { id: "" }
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
    return filter(array, (_data) => _data.code?.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function VoucherView() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedId, setSelectedId] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const data = useGetAll();

  const handleOpenMenu = (id) => (event) => {
    setOpen(event.currentTarget);
    setSelectedId(id);
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
      const newSelecteds = data?.data?.map((n) => n.voucher_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, voucher_id) => {
    const selectedIndex = selected.indexOf(voucher_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, voucher_id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.data?.length) : 0;

  const filteredUsers = applySortFilter(data?.data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers?.length && !!filterName;

  const deleteVoucher = useDeleteVoucher();
  const handleDelete = async (id) => {
    deleteVoucher.mutateAsync(id);
  };


  return (
    <>

      <Container maxWidth="xl">
        <Card>
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
            data.isSuccess && data?.data?.length > 0 &&
            <>
              <VoucherListToolbar numSelected={selected?.length} filterName={filterName} onFilterName={handleFilterByName} />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <VoucherListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={data?.data?.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { voucher_id, code, discount_value, start_date, end_date, max_usage, current_usage, isDeleted, updatedAt } = row;
                        const selectedUser = selected.indexOf(voucher_id) !== -1;

                        return (
                          <TableRow hover key={voucher_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, voucher_id)} />
                            </TableCell>

                            <TableCell component="th" scope="row" padding="none" align="center">
                              <Typography variant="subtitle2" noWrap>
                                {voucher_id}
                              </Typography>

                            </TableCell>

                            <TableCell align="left">{code}</TableCell>

                            <TableCell align="left">{valueLabelFormat(discount_value)}</TableCell>

                            <TableCell align="left">{start_date ? fDateTime(start_date) : "No"}</TableCell>

                            <TableCell align="left">{end_date ? fDateTime(end_date) : "No"}</TableCell>
                            <TableCell align="left">{fDateTime(updatedAt)}</TableCell>

                            <TableCell align="left">{max_usage}</TableCell>
                            <TableCell align="left">{current_usage}</TableCell>
                            <TableCell align="left">
                              {
                                isDeleted ? <Label color={"error"}>{sentenceCase("Deleted")}</Label>
                                  : <Label color={(parse(end_date, "MM dd yyyy", new Date()) > new Date() && "success") || "error"}>{
                                    parse(end_date, "MM dd yyyy", new Date()) < new Date() ? sentenceCase("Hết hạn"):
                                      sentenceCase("Active")}</Label>
                              }

                            </TableCell>

                            <TableCell align="right">
                              <IconButton size="large" color="inherit" onClick={handleOpenMenu(voucher_id)}>
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
                            Not found
                              </Typography>

                              <Typography variant="body2">
                            No results found for &nbsp;
                                <strong>&quot;{filterName}&quot;</strong>.
                                <br /> Try checking for typos or using complete words.
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
                count={data?.data?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          }
          {
            data.isSuccess && data?.data.length === 0 && <>
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
                          Chưa có thông tin Voucher
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
              handleDelete(selectedId);
            }
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
          setOpenEditModal(true);
          handleCloseMenu();
        }}>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem sx={{ color: "error.main" }}
          onClick={() => {
            setOpenConfirm(true);
            handleCloseMenu();
          }}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }}
          />
          Xóa
        </MenuItem>
      </Popover>
      {
        openEditModal && <EditVoucherModal open={openEditModal} setOpen={setOpenEditModal} id={selectedId} />
      }
    </>
  );
}
