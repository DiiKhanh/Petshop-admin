import { faker } from "@faker-js/faker";

const dogs = [
  {
    id: faker.datatype.uuid(),
    name: "Chó Corgi Pembroke trắng vàng",
    images: ["https://dogily.vn/wp-content/uploads/2022/11/Corgi-duc-trang-vang-thuan-chung-bo-me-nhap.png", "https://dogily.vn/wp-content/uploads/2022/11/Corgi-duc-trang-vang-thuan-chung-bo-me-nhap-3-400x400.png", "https://dogily.vn/wp-content/uploads/2022/11/Corgi-duc-trang-vang-thuan-chung-bo-me-nhap-4-400x400.png", "https://dogily.vn/wp-content/uploads/2022/11/Corgi-duc-trang-vang-thuan-chung-bo-me-nhap-4-400x400.png", "https://dogily.vn/wp-content/uploads/2022/11/Corgi-duc-trang-vang-thuan-chung-bo-me-nhap-4-400x400.png", "https://dogily.vn/wp-content/uploads/2022/11/Corgi-duc-trang-vang-thuan-chung-bo-me-nhap-4-400x400.png"],
    category: "Corgi",
    price: 10000000,
    create_at: "05/10/2023",
    update_at: null,
    status: "có sẵn",
    color: "Vàng, xám",
    sex: "Đực",
    age: "10",
    healthy: "Sức khỏe tốt",
    origin: "Xuất xứ, chứng từ đầy đủ",
    description: "Em bé ngoan, dễ thương, hiền lành"
  },
  {
    id: faker.datatype.uuid(),
    name: "Chó Poodle Tiny vàng mơ",
    images: ["https://dogily.vn/wp-content/uploads/2023/08/cho-poodle-tiny-vang-mo-thuan-chung-cai-1.png", "https://dogily.vn/wp-content/uploads/2023/08/cho-poodle-tiny-vang-mo-thuan-chung-cai-2-400x400.png", "https://dogily.vn/wp-content/uploads/2023/08/cho-poodle-tiny-vang-mo-thuan-chung-cai-3-400x400.png"],
    category: "Poodle ",
    price: 12000000,
    create_at: "05/10/2023",
    update_at: "06/10/2023",
    status: "không có sẵn",
    color: "Vàng, xám",
    sex: "Đực",
    age: "10",
    healthy: "Sức khỏe tốt",
    origin: "Xuất xứ, chứng từ đầy đủ",
    description: "Em bé ngoan, dễ thương, hiền lành"
  },
  {
    id: faker.datatype.uuid(),
    name: "Chó Poodle Tiny vàng mơ",
    images: ["https://dogily.vn/wp-content/uploads/2023/08/cho-poodle-tiny-vang-mo-thuan-chung-cai-1.png", "https://dogily.vn/wp-content/uploads/2023/08/cho-poodle-tiny-vang-mo-thuan-chung-cai-2-400x400.png", "https://dogily.vn/wp-content/uploads/2023/08/cho-poodle-tiny-vang-mo-thuan-chung-cai-3-400x400.png"],
    category: "Poodle ",
    price: 12000000,
    create_at: "05/10/2023",
    update_at: "06/10/2023",
    status: "không có sẵn",
    color: "Vàng, xám",
    sex: "Cái",
    age: "10",
    healthy: "Sức khỏe tốt",
    origin: "Xuất xứ, chứng từ đầy đủ",
    description: "Em bé ngoan, dễ thương, hiền lành"
  }
];

export default dogs;