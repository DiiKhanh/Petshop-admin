import { Helmet } from "react-helmet-async";
// @mui
import { styled } from "@mui/material/styles";
import { Container, Typography } from "@mui/material";
// hooks
import useResponsive from "../hooks/useResponsive";
// components
// sections
import { LoginForm } from "../sections/auth/login";
import ImgLogin from "../assets/illustrations/illustration_login.png";

// ----------------------------------------------------------------------

const StyledRoot = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));

const StyledSection = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 480,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default
}));

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive("up", "md");

  return (
    <>
      <Helmet>
        <title> Login | Pet Shop </title>
      </Helmet>

      <StyledRoot>
        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Xin chào!
            </Typography>
            <img src={ImgLogin} alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom marginY={3} textTransform="uppercase">
              Đăng nhập vào PetShop
            </Typography>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
