import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
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
  TablePagination
} from "@mui/material";
// components
import Label from "~/components/label";
import Iconify from "~/components/iconify";
import Scrollbar from "~/components/scrollbar";
// sections
import VoucherListToolbar from "./VoucherListToolbar";
import VoucherListHead from "./VoucherListHead";
// mock

import { toast } from "react-toastify";
import { fDateTime } from "~/utils/formatTime";
import voucherApi from "~/apis/modules/voucher.api";
import { valueLabelFormat } from "~/utils/formatNumber";
import { parse } from "date-fns";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "voucher_id", label: "ID", alignRight: false },
  { id: "code", label: "Mã voucher", alignRight: false },
  { id: "discount_value", label: "Số tiền giảm", alignRight: false },
  { id: "start_date", label: "Thời gian bắt đầu", alignRight: false },
  { id: "end_date", label: "Thời gian kết thúc", alignRight: false },
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
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function VoucherView() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([]);

  const [selectedId, setSelectedId] = useState(null);

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
      const newSelecteds = data?.map((n) => n.name);
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

  useEffect(() => {
    const getAll = async () => {
      try {
        const { response, err } = await voucherApi.getAll();
        if (err) {
          toast.error(err);
        }
        if (response) {
          setData(response);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    getAll();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers?.length && !!filterName;

  const handleDelete = async (id) => {
    const { response, err } = await voucherApi.delete({ id });
    if (response) {
      toast.success("Xóa thành công!");
      window.location.reload();
    }
    if (err) {
      toast.error("Có lỗi xảy ra!");
    }
  };


  return (
    <>

      <Container maxWidth="xl">


        <Card>
          <VoucherListToolbar numSelected={selected?.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <VoucherListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { voucher_id, code, discount_value, start_date, end_date, max_usage, current_usage, isDeleted } = row;
                    const selectedUser = selected.indexOf(voucher_id) !== -1;

                    return (
                      <TableRow hover key={voucher_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, voucher_id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>

                            <Typography variant="subtitle2" noWrap>
                              {voucher_id}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{code}</TableCell>

                        <TableCell align="left">{valueLabelFormat(discount_value)}</TableCell>

                        <TableCell align="left">{start_date ? fDateTime(start_date) : "No"}</TableCell>

                        <TableCell align="left">{end_date ? fDateTime(end_date) : "No"}</TableCell>

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
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
            count={data?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
        <MenuItem sx={{ color: "error.main" }}
          onClick={() => handleDelete(selectedId)}
        >
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }}
          />
          Xóa
        </MenuItem>
      </Popover>
    </>
  );
}
