import { filter } from "lodash";
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
import BookingListToolbar from "./BookingListToolbar";
import BookingListHead from "./BookingListHead";
// mock

import { toast } from "react-toastify";
import EditModal from "./EditModal";
import commentApi from "~/apis/modules/comment.api";
import { fDateTime } from "~/utils/formatTime";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "ID", alignRight: false },
  { id: "username", label: "Tên khách hàng", alignRight: false },
  { id: "content", label: "Đánh giá", alignRight: false },
  { id: "product_id", label: "ID sản phẩm", alignRight: false },
  { id: "status", label: "Trạng thái", alignRight: false },
  { id: "time", label: "Thời gian", alignRight: false },
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
    return filter(array, (_user) => _user.user_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function CommentView() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [item, setItem] = useState();

  const handleOpenMenu = (item) => (event) => {
    setOpen(event.currentTarget);
    setItem(item);
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
        const { response, err } = await commentApi.getAll();
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
  }, [openModal]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers?.length && !!filterName;

  return (
    <>

      <Container maxWidth="xl">


        <Card>
          <BookingListToolbar numSelected={selected?.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <BookingListHead
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
                    const { comment_id, content, createAt, product_id, isAccept, username } = row;
                    const selectedUser = selected.indexOf(comment_id) !== -1;

                    return (
                      <TableRow hover key={comment_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, comment_id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>

                            <Typography variant="subtitle2" noWrap>
                              {comment_id}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{username}</TableCell>
                        <TableCell align="left">{content}</TableCell>
                        <TableCell align="left">{product_id}</TableCell>
                        <TableCell align="left">
                          <Label color={(isAccept && "success") || "error" }>
                            {isAccept ? "Đã duyệt" : "Chưa được duyệt"}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{fDateTime(createAt)}</TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu(row)}>
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
          onClick={() => setOpenModal(true)}
        >
          <Iconify icon={"eva:edit-2-outline"} sx={{ mr: 2 }}
          />
          Chỉnh sửa
        </MenuItem>
      </Popover>

      {
        openModal && <EditModal open={openModal} setOpen={setOpenModal} item={item} />
      }
    </>
  );
}
