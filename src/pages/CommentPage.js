import { Container, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CommentView from "~/sections/@dashboard/comment/CommentView";

const BookingPage = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard: Comment - Petshop</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Quản lý bình luận đánh giá
        </Typography>

        <CommentView />
      </Container>
    </>
  );
};

export default BookingPage;