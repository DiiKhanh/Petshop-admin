import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { Container, FormHelperText, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Unstable_Grid2";
import Label from "~/components/label";
import { sentenceCase } from "change-case";
import { useForm } from "react-hook-form";


const FormProfile = ({ user }) => {
  const {
    register,
    formState: { errors, touchedFields, isDirty },
    handleSubmit
  } = useForm();

  const handleEdit = (data) => {
    console.log(data);
  };
  return (
    <Container>
      <Stack spacing={3}>
        <Typography variant="h4" gutterBottom>
          Chỉnh sửa người dùng
        </Typography>
        <form onClick={handleSubmit(handleEdit)}>
          <Grid container spacing={3}>
            <Grid lg={3} md={6} xs={12}>
              <Card>
                <CardContent>
                  <Stack spacing={2} sx={{ alignItems: "center" }}>
                    <div>
                      <Avatar src={user?.avatarUrl} sx={{ height: "80px", width: "80px" }} />
                    </div>
                    <Stack spacing={1} sx={{ textAlign: "center" }}>
                      <Typography variant="h5">{user?.username}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        Trạng thái: <Label sx={{ ml: "5px" }} color={"success"}>{sentenceCase("Email Verified")}</Label>
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Account: <Label sx={{ ml: "5px" }} color={"success"}>{sentenceCase("Active")}</Label>
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Vai trò: <Label sx={{ ml: "5px" }} color={"success"}>{sentenceCase(`${user?.role[0]}`)}</Label>
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button fullWidth variant="text">
                    Upload picture
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid lg={9} md={6} xs={12}>
              <Card>
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid md={6} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Username</InputLabel>
                        <OutlinedInput label="Username" name="username" {
                          ...register("username")
                        }
                        defaultValue={user?.username}
                        disabled
                        />
                        {
                          touchedFields && errors?.username?.message && <FormHelperText error>
                            {errors?.username?.message}
                          </FormHelperText>
                        }
                      </FormControl>
                    </Grid>
                    <Grid md={6} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Last name</InputLabel>
                        <OutlinedInput defaultValue={user?.lastName} label="Last name" name="lastName"
                        />
                      </FormControl>
                    </Grid>
                    <Grid md={6} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>First name</InputLabel>
                        <OutlinedInput defaultValue={user?.firstName} label="First name" name="firstName"
                        />
                      </FormControl>
                    </Grid>
                    <Grid md={6} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Email address</InputLabel>
                        <OutlinedInput defaultValue={user?.email}label="Email address" name="email" />
                      </FormControl>
                    </Grid>
                    <Grid md={6} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Phone number</InputLabel>
                        <OutlinedInput label="Phone number" name="phone" type="tel" defaultValue={user?.phoneNumber}/>
                      </FormControl>
                    </Grid>
                    <Grid md={6} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Address</InputLabel>
                        <OutlinedInput label="City" />
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <LoadingButton disabled={!isDirty} variant="contained">Lưu thay đổi</LoadingButton>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Stack>

    </Container>
  );
};

export default FormProfile;