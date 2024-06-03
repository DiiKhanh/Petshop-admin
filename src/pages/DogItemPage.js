import { Helmet } from "react-helmet-async";
import { useState } from "react";
// @mui
import { Container, Stack, Typography, Button } from "@mui/material";
// components
import { ProductSort, ProductList, ProductFilterSidebar, AddProductModal } from "~/sections/@dashboard/dogItem";
// mock

import Iconify from "~/components/iconify";

// ----------------------------------------------------------------------

export default function DogItemPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <>
      <Helmet>
        <title> Products | Pet Shop </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Quản lý sản phẩm cho thú cưng
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpen(true)}
          >
            Thêm sản phẩm
          </Button>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>

            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList />
        {/* modal add */}
        <AddProductModal open={open} setOpen={setOpen} />
      </Container>
    </>
  );
}
