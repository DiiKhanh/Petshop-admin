import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Stack, TextField, Box, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authApi from "~/apis/modules/auth.api";
import { setUser } from "~/redux/features/userSlice";
import { SignInSchema } from "~/configs/zod.config";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const {
    register,
    formState: { errors, touchedFields },
    handleSubmit
  } = useForm({ resolver: zodResolver(SignInSchema) });

  const handleLogin = async (data) => {
    setErrorMessage(undefined);
    setIsLoginRequest(true);
    const { response, err } = await authApi.signin(data);
    setIsLoginRequest(false);
    if (response) {
      dispatch(setUser(response));
      toast.success("Đăng nhập thành công");
      navigate("/");
    }
    if (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email"
          {
            ...register("email")
          }
          type="text"
          fullWidth
          error={touchedFields && errors?.email?.message !== undefined}
          helperText={touchedFields && errors?.email?.message}
        />
        <TextField
          {
            ...register("password")
          }
          type="password"
          label="Mật khẩu"
          name="password"
          fullWidth
          error={touchedFields && errors?.password?.message !== undefined}
          helperText={touchedFields && errors?.password?.message}
        />
        {errorMessage && (
          <Box sx={{ marginTop: 2 }}>
            <Alert severity="error" variant="outlined" >{errorMessage}</Alert>
          </Box>
        )}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Quên mật khẩu
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit(handleLogin)}
        loading={isLoginRequest}
      >
        Đăng nhập
      </LoadingButton>
    </>
  );
}
