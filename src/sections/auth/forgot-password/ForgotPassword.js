import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import authApi from "~/apis/modules/auth.api.js";
import { useNavigate } from "react-router-dom";
import { ResetPasswordSchema } from "~/configs/zod.config.js";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [success, setSucces] = useState(false);

  const {
    register,
    formState: { errors, touchedFields },
    handleSubmit
  } = useForm({ resolver: zodResolver(ResetPasswordSchema) });

  const emailForm = useForm({
    defaultValues: {
      email: ""
    }
  });


  const onHandleSubmit = async (data) => {
    setErrorMessage(undefined);
    setIsLoginRequest(true);
    const { response, err } = await authApi.forgotPassword(data);
    setIsLoginRequest(false);
    if (response) {
      setSucces(true);
      toast.success("Đã gửi mã xác nhận về email!");
    }
    if (err) {
      setErrorMessage(err.message);
    }
  };

  const onHandleSubmitToken = async (data) => {
    setErrorMessage(undefined);
    setIsLoginRequest(true);
    const { response, err } = await authApi.resetPassword(data);
    setIsLoginRequest(false);
    if (response) {
      toast.success("Đã reset mật khẩu thành công, mời đăng nhập!");
      navigate("/login");
    }
    if (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <>
      <Box component="form" onSubmit={emailForm.handleSubmit(onHandleSubmit)}>
        <Stack spacing={3}>
          <TextField
            {
              ...emailForm.register("email", {
                required:true
              })
            }
            type="email"
            label="Email"
            name="email"
            fullWidth
            error={emailForm?.formState?.touchedFields && emailForm?.formState?.errors?.email?.message !== undefined}
            helperText={emailForm?.formState?.touchedFields && emailForm?.formState?.errors?.email?.message}
          />

        </Stack>
        {
          !success && <LoadingButton
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{ marginTop: 4 }}
            loading={isLoginRequest}
          >
                Gửi Email xác nhận
          </LoadingButton>
        }

        {errorMessage && (
          <Box sx={{ marginTop: 2 }}>
            <Alert severity="error" variant="outlined" >{errorMessage}</Alert>
          </Box>
        )}
      </Box>

      {
        success && <Box component="form" onSubmit={handleSubmit(onHandleSubmitToken)}>
          <Stack spacing={3}>
            <Typography>Đã gửi mã xác nhận qua email, vui lòng kiểm tra!</Typography>
            <TextField
              {
                ...register("token")
              }
              type="text"
              label="Token xác nhận"
              name="token"
              fullWidth
              autoComplete="current-password"
              error={touchedFields && errors?.token?.message !== undefined}
              helperText={touchedFields && errors?.token?.message}
            />
            <TextField
              {
                ...register("newPassword")
              }
              type="password"
              label="Mật khẩu"
              name="newPassword"
              fullWidth
              error={touchedFields && errors?.newPassword?.message !== undefined}
              helperText={touchedFields && errors?.newPassword?.message}
            />
            <TextField
              {
                ...register("confirmNewPassword")
              }
              type="password"
              label="Xác nhận mật khẩu"
              name="confirmNewPassword"
              fullWidth
              error={touchedFields && errors?.confirmNewPassword?.message !== undefined}
              helperText={touchedFields && errors?.confirmNewPassword?.message}
            />
          </Stack>

          <LoadingButton
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{ marginTop: 4 }}
            loading={isLoginRequest}
          >
                  Xác nhận
          </LoadingButton>

          {errorMessage && (
            <Box sx={{ marginTop: 2 }}>
              <Alert severity="error" variant="outlined" >{errorMessage}</Alert>
            </Box>
          )}
        </Box>
      }
      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => navigate("/login")}
      >
          Đăng nhập
      </Button>
    </>
  );
}
