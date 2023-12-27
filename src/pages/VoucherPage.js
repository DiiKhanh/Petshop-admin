import { Container, Stack, Typography, Button } from "@mui/material";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import VoucherView from "~/sections/@dashboard/voucher/VoucherView";
import Iconify from "~/components/iconify";
import AddVoucherModal from "~/sections/@dashboard/voucher/AddVoucherModal";

const VoucherPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Dashboard: Voucher - petshop</title>
      </Helmet>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Quản lý voucher
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpen(true)}
          >
            Thêm voucher
          </Button>
        </Stack>

        <VoucherView />
        {/* modal add */}
        <AddVoucherModal open={open} setOpen={setOpen} />
      </Container>
    </>
  );
};

export default VoucherPage;