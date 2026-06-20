import TemplateA from './TemplateA';
import TemplateB from './TemplateB';
import TemplateC from './TemplateC';

export const templates = [
  {
    id: 'template-a',
    name: 'Hóa Đơn Sang Trọng (Template A)',
    description: 'Bố cục hóa đơn công ty chuẩn mực với tiêu đề nổi bật, bảng chi tiết và phần tổng thanh toán.',
    component: TemplateA,
  },
  {
    id: 'template-b',
    name: 'Biên Lai Tối Giản (Template B)',
    description: 'Thiết kế dạng hóa đơn bán lẻ/biên lai cửa hàng với phông chữ đơn cách, ngăn cách nét đứt cá tính.',
    component: TemplateB,
  },
  {
    id: 'template-c',
    name: 'Báo Cáo Chứng Nhận (Template C)',
    description: 'Mẫu chứng nhận/báo cáo trang trọng đi kèm khung viền họa tiết đối xứng và chữ ký phê duyệt.',
    component: TemplateC,
  },
];
