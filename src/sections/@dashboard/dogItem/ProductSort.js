import { useState } from "react";
// @mui
import { Menu, Button, MenuItem, Typography } from "@mui/material";
// component
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "priceDesc", label: "Giá: Cao - Thấp" },
  { value: "priceAsc", label: "Giá: Thấp - Cao" }
];

export default function ShopProductSort() {
  const [open, setOpen] = useState(null);
  const [value, setValue] = useState("newest");

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMenuItemClick = (newValue) => {
    setValue(newValue);
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? "eva:chevron-up-fill" : "eva:chevron-down-fill"} />}
      >
        Sắp xếp:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: "text.secondary" }}>
          {SORT_BY_OPTIONS.find((option) => option.value === value).label} {/* Hiển thị giá trị hiện tại */}

        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === value} // Đánh dấu tùy chọn hiện tại
            onClick={() => handleMenuItemClick(option.value)} // Xử lý khi chọn
            sx={{ typography: "body2" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
