import { Helmet } from "react-helmet-async";
// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography, Box, Alert } from "@mui/material";
// components
// sections
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
  AppNewsUpdate,
  AppOrderTimeline,
  AppTrafficBySite,
  AppTasks
} from "../sections/@dashboard/app";
import { faker } from "@faker-js/faker";
import Iconify from "~/components/iconify";
import { useDashboardInvoice, useGetAllDashboard } from "~/hooks/dashboard/useDashboard";
import Loading from "~/components/Loading";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { format } from "date-fns";


// ----------------------------------------------------------------------
function Label({ componentName }) {
  const content = (
    <span>
      <strong>{componentName}</strong>
    </span>
  );
  return content;
}

export default function DashboardAppPage() {
  const theme = useTheme();
  const data = useGetAllDashboard();

  const [day, setDay] = useState(new Date());

  const getInvoice = useDashboardInvoice();
  const handleDay = async (date) => {
    setDay(date);
    const value = format(date, "MM dd yyyy");
    getInvoice.mutateAsync({ date: value });
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | Pet Shop </title>
      </Helmet>

      {
        data.isLoading && <Box sx={{ marginTop: 2 }}>
          <Loading />
        </Box>
      }
      {
        data.error instanceof Error && <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined" >{data.error.message}</Alert>
        </Box>
      }
      {
        data.isSuccess && data?.data &&
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Xin chào!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary title="Số lượng Pet" total={data?.data?.totalPet} icon={"openmoji:dog-face"} />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary title="Số lượng sản phẩm" total={data?.data?.totalProduct} icon={"tabler:dog-bowl"} />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary title="Người dùng" total={data?.data?.totalUser} color="info" icon={"ant-design:usergroup-add-outlined"} />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary title="Hóa đơn" total={data?.data?.totalInvoice} color="warning" icon={"lets-icons:order-fill"} />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary title="Phiếu giảm giá" total={data?.data?.totalVoucher} color="warning" icon={"mdi:voucher-outline"} />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary title="Doanh thu" total={data?.data?.totalMoney} color="error" icon={"carbon:summary-kpi"} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Thống kê hóa đơn"
              chartLabels={data?.data?.checkoutData?.map(i => ((i?.createAt)))}
              chartData={[
                {
                  name: "Khách hàng",
                  type: "column",
                  fill: "solid",
                  data: data?.data?.checkoutData?.map(i => i.total)
                }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DemoContainer
                components={[
                  "DatePicker"
                ]}
              >
                <DemoItem label={<Label componentName="Chọn thời gian"/>}>
                  <DatePicker
                    value={day}
                    onChange={handleDay}
                  />
                </DemoItem>

              </DemoContainer>
            </LocalizationProvider>
            {
              getInvoice.data && <AppWebsiteVisits
                title="Thống kê hóa đơn theo ngày"
                chartLabels={[getInvoice.data.date]}
                chartData={[
                  {
                    name: "Khách hàng",
                    type: "column",
                    fill: "solid",
                    data: [getInvoice.data.totalAmount]
                  }
                ]}
              />
            }
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Số lượt ghé thăm website"
              chartData={[
                { label: "Miền Nam", value: 5435 },
                { label: "Miền Bắc", value: 4000 },
                { label: "Miền Trung", value: 3000 }
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Mức độ hài lòng"
              chartData={[
                { label: "TP.Hồ Chí Minh", value: 470 },
                { label: "Hà Nội", value: 430 },
                { label: "Đà Nẵng", value: 300 },
                { label: "Cần Thơ", value: 400 }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Giống loài"
              chartLabels={["Corgi", "Alaska", "Husky", "Poodle", "Golden", "Shiba"]}
              chartData={[
                { name: "Nhóm 1", data: [80, 50, 30, 40, 100, 20] },
                { name: "Nhóm 2", data: [20, 30, 40, 80, 20, 80] },
                { name: "Nhóm 3", data: [44, 76, 78, 13, 43, 10] }
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `../../../assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent()
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  "1983, orders, $4220",
                  "12 Invoices have been paid",
                  "Order #37745 from September",
                  "New order placed #XF-2356",
                  "New order placed #XF-2346"
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past()
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: "FaceBook",
                  value: 323234,
                  icon: <Iconify icon={"eva:facebook-fill"} color="#1877F2" width={32} />
                },
                {
                  name: "Google",
                  value: 341212,
                  icon: <Iconify icon={"eva:google-fill"} color="#DF3E30" width={32} />
                },
                {
                  name: "Linkedin",
                  value: 411213,
                  icon: <Iconify icon={"eva:linkedin-fill"} color="#006097" width={32} />
                },
                {
                  name: "Twitter",
                  value: 443232,
                  icon: <Iconify icon={"eva:twitter-fill"} color="#1C9CEA" width={32} />
                }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: "1", label: "Create FireStone Logo" },
                { id: "2", label: "Add SCSS and JS files if required" },
                { id: "3", label: "Stakeholder Meeting" },
                { id: "4", label: "Scoping & Estimations" },
                { id: "5", label: "Sprint Showcase" }
              ]}
            />
          </Grid>
        </Grid>
      </Container>
      }
    </>
  );
}