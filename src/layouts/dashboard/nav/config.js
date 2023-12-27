// component
import SvgColor from "~/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: "dashboard",
    path: "/",
    icon: icon("ic_analytics")
  },
  {
    title: "Quản lý người dùng",
    path: "/user",
    icon: icon("ic_user")
  },
  {
    title: "Quản lý chó",
    path: "/dog",
    icon: icon("ic_blog")
  },
  {
    title: "Quản lý sản phẩm cho chó",
    path: "/dog-item",
    icon: icon("ic_blog")
  },
  {
    title: "Quản lý hóa đơn",
    path: "/invoice",
    icon: icon("ic_cart")
  },
  {
    title: "Quản lý phiếu giảm giá",
    icon: icon("ic_voucher"),
    path: "/voucher"
  },
  {
    title: "Quản lý lịch hẹn khám",
    icon: icon("ic_booking"),
    path: "/booking"
  },
  {
    title: "Quản lý bình luận",
    icon: icon("ic_comment"),
    path: "/comment"
  }
];

export default navConfig;
