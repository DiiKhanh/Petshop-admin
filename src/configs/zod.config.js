import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Yêu cầu là email. Ví dụ: example@gmail.com").min(1, "Yêu cầu là email. Ví dụ: example@gmail.com"),
  password: z.string()
    .min(1, "Nhập mật khẩu của bạn")
    .min(3, "Mật khẩu phải có nhiều hơn 3 ký tự")
});


export const ChangePasswordSchema = z.object({
  password: z.string().min(3, "Mật khẩu phải nhiều hơn 3 ký tự"),
  newPassword: z.string().min(3, "Mật khẩu phải nhiều hơn 3 ký tự"),
  confirmNewPassword:z.string().min(3, "Mật khẩu phải nhiều hơn 3 ký tự")
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Mật khẩu xác nhận chưa trùng khớp!",
  path: ["confirmNewPassword"] }).refine((data) => data.password !== data.newPassword, {
  message: "Mật khẩu mới phải khác mật khẩu hiện tại!",
  path: ["newPassword"]
});

export const ResetPasswordSchema = z.object({
  token: z.string()
    .min(1, "Nhập token của bạn để xác nhận")
    .min(3, "Mã token phải có nhiều hơn 3 ký tự"),
  newPassword: z
    .string()
    .min(3, { message: "Mật khẩu phải có nhiều hơn 3 ký tự" }),
  confirmNewPassword: z
    .string()
    .min(1, { message: "Nhập lại mật khẩu" })
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  path: ["confirmNewPassword"],
  message: "Mật khẩu chưa trùng khớp"
});


export const DogItemSchema = z.object({
  dogName: z.string().min(3, "Tên sản phẩm nhiều hơn 3 ký tự"),
  speciesName: z.string(),
  price: z.coerce.number().positive(),
  color: z.string().min(1, "Yêu cầu"),
  sex: z.enum(["male", "female"]),
  type: z.enum(["dog", "cat"]),
  age: z.coerce.number().positive().int().max(200, "Số tháng quá lớn"),
  origin: z.string().min(1, "Yêu cầu"),
  healthStatus: z.string().min(1, "Yêu cầu"),
  description: z.string().min(1, "Yêu cầu")
});

export const GoodsSchema = z.object({
  productName: z.string().min(3, "Tên sản phẩm nhiều hơn 3 ký tự"),
  quantity: z.coerce.number().positive().int().max(200, "Số tháng quá lớn"),
  price: z.coerce.number().positive(),
  supplier: z.string().min(1, "Yêu cầu"),
  note: z.string(),
  phoneNumber:z.string().min(6, "Yêu cầu"),
  address: z.string().min(1, "Yêu cầu")
});

export const ItemSchema = z.object({
  itemName: z.string().min(3, "Tên sản phẩm nhiều hơn 3 ký tự"),
  category: z.string().min(1, "Yêu cầu"),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().positive().int().max(200, "Số tháng quá lớn"),
  description: z.string().min(1, "Yêu cầu")
});

export const InvoiceSchema = z.object({
  name: z.string().min(1, "Yêu cầu"),
  email: z.string().email("Yêu cầu là email. Ví dụ: example@gmail.com").min(1, "Yêu cầu là email. Ví dụ: example@gmail.com"),
  phoneNumber:z.string().min(6, "Yêu cầu"),
  address: z.string().min(1, "Yêu cầu")
});

export const VoucherShema = z.object({
  code: z.string().min(1, "Yêu cầu"),
  discount_value:z.coerce.number().positive(),
  max_usage: z.coerce.number().positive().int().max(200, "Số tháng quá lớn")
});

export const BookingSchema = z.object({
  result: z.string()
});