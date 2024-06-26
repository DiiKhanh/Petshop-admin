import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState } from "react";
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
  Alert
} from "@mui/material";
// components
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { InvoiceListHead, InvoiceListToolbar } from "../sections/@dashboard/invoice";
// mock
import { fDateTime } from "~/utils/formatTime";
import EditInvoiceModal from "~/sections/@dashboard/invoice/EditInvoiceModal";
import { useGetAllInvoice } from "~/hooks/invoice/useInvoice";
import Loading from "~/components/Loading";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "Mã hóa đơn", alignRight: false },
  { id: "name", label: "Tên khách hàng", alignRight: false },
  { id: "user_id", label: "Mã khách hàng", alignRight: false },
  { id: "payment", label: "Thanh toán", alignRight: false },
  { id: "phone", label: "Số điện thoại", alignRight: false },
  { id: "status", label: "Tình trạng", alignRight: false },
  { id: "create", label: "Ngày mua", alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function InvoicePage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // fetch
  const data = useGetAllInvoice();

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
      const newSelecteds = data?.data?.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.data.length) : 0;

  const filteredUsers = applySortFilter(data?.data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers?.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Invoice | Pet Shop </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Quản lý hóa đơn
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Thêm hóa đơn
          </Button> */}
        </Stack>

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
              <InvoiceListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <InvoiceListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={data?.data.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { id, name, payment, status, createAt, phoneNumber, user_id } = row;
                        const selectedUser = selected.indexOf(id) !== -1;

                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id)} />
                            </TableCell>

                            <TableCell align="left">
                          # {id}
                            </TableCell>

                            <TableCell align="left">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={name} src={name} />
                                <Typography variant="subtitle2" noWrap>
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">
                              {user_id}
                            </TableCell>

                            <TableCell align="left" sx={{ textTransform:"capitalize" }}> <Label color={(payment === "chưa thanh toán" && "error") || "success"}>{sentenceCase(payment)}</Label></TableCell>

                            <TableCell align="left">{phoneNumber}</TableCell>

                            <TableCell align="left">
                              <Label color={(status === "Đang lấy hàng" && "info") || "success"}
                                variant="outlined"
                              >{sentenceCase(status)}</Label>
                            </TableCell>
                            <TableCell align="left">{fDateTime(createAt)}</TableCell>

                            <TableCell align="right">
                              <IconButton size="large" color="inherit" onClick={handleOpenMenu(id)}>
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
                count={data?.data.length}
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
                          Chưa có thông tin Invoice
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
        PaperProps={{
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
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }}
          />
          Chỉnh sửa
        </MenuItem>

      </Popover>
      {
        openModal && <EditInvoiceModal open={openModal} setOpen={setOpenModal} id={selectedId} />
      }
    </>
  );
}
