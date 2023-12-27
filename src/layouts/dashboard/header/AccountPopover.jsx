import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// @mui
import { alpha } from "@mui/material/styles";
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from "@mui/material"
;
// mocks_
import { setUser } from "~/redux/features/userSlice";
import account from "~/_mock/account";
import Iconify from "~/components/iconify";
import { Link } from "react-router-dom";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Trang chủ",
    icon: "eva:home-fill",
    path: "/"
  },
  {
    label: "Thông tin hồ sơ",
    icon: "eva:person-fill",
    path: "/profile"
  }
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { user } = useSelector(state => state.user);
  const [open, setOpen] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSignout = () => {
    dispatch(setUser(null));
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8)
            }
          })
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75
            }
          }
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <Link key={option.label} to={option.path} style={{ textDecoration:"none", color:"initial" }}>
              <MenuItem onClick={handleClose}>
                <Iconify icon={option.icon} color={"info.main"} sx={{ mr: 2 }} />
                {option.label}
              </MenuItem>
            </Link>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleSignout} sx={{ m: 1 }}>
          Đăng xuất
        </MenuItem>
      </Popover>
    </>
  );
}
