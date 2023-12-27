import { Container, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import BookingView from "~/sections/@dashboard/booking/BookingView";

const BookingPage = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard: Booking - Petshop</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Quản lý lịch hẹn
        </Typography>

        <BookingView />
      </Container>
    </>
  );
};

export default BookingPage;