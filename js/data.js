/* =====================================================
   js/data.js — Toàn bộ dữ liệu sách & danh mục
   ===================================================== */

const BOOKS = [
  {
    id: 0,
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    cat: 'Kỹ năng sống',
    catSlug: 'ky-nang-song',
    price: 75000,
    orig: 89000,
    desc: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử với con người. Đã bán hơn 30 triệu bản trên toàn thế giới, được dịch ra hơn 30 thứ tiếng. Đây là cuốn sách gối đầu cho bất kỳ ai muốn thành công trong cuộc sống và công việc.',
    emoji: 'Đ',
    image: 'assets/images/đắc nhân tâm.jpg', 
    bg: 'linear-gradient(135deg,#f97316,#dc2626)',
    badge: 'hot',
    rating: 4.9,
    reviewCount: 2148,
    pages: 320,
    publisher: 'NXB Tổng Hợp TP.HCM',
    year: 2023,
    lang: 'Tiếng Việt',
    stock: 150,
    tags: ['all', 'bestseller'],
    reviews: [
      { name: 'Nguyễn Văn An', stars: 5, date: '12/01/2024', text: 'Cuốn sách thay đổi cuộc đời tôi. Học được rất nhiều kỹ năng giao tiếp hữu ích!' },
      { name: 'Trần Thị Bình', stars: 5, date: '05/02/2024', text: 'Tuyệt vời! Nên đọc ít nhất một lần trong đời.' },
      { name: 'Lê Minh Tuấn', stars: 4, date: '18/02/2024', text: 'Nội dung hay nhưng bản dịch ở một số chỗ hơi cứng.' }
    ]
  },
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    cat: 'Kỹ năng sống',
    catSlug: 'ky-nang-song',
    price: 98000,
    orig: 119000,
    desc: 'Thay đổi tí hon, hiệu quả bất ngờ. James Clear trình bày một framework được kiểm chứng khoa học để xây dựng thói quen tốt và loại bỏ thói quen xấu. Cuốn sách #1 New York Times Bestseller.',
    emoji: 'A',
    image: 'assets/images/atomic-habits.jpg',
    bg: 'linear-gradient(135deg,#2563eb,#7c3aed)',
    badge: 'sale',
    rating: 4.8,
    reviewCount: 1523,
    pages: 280,
    publisher: 'NXB Lao Động',
    year: 2023,
    lang: 'Tiếng Việt',
    stock: 200,
    tags: ['all', 'bestseller', 'sale'],
    reviews: [
      { name: 'Phạm Thu Hà', stars: 5, date: '22/01/2024', text: 'Đây là cuốn sách về thói quen hay nhất tôi từng đọc!' },
      { name: 'Hoàng Văn Đức', stars: 5, date: '14/03/2024', text: 'Áp dụng được ngay vào thực tế. Highly recommend!' }
    ]
  },
  {
    id: 2,
    title: 'Nghĩ Giàu Làm Giàu',
    author: 'Napoleon Hill',
    cat: 'Kinh tế',
    catSlug: 'kinh-te',
    price: 95000,
    orig: null,
    desc: 'Bí quyết làm giàu từ những tư duy đúng đắn. Napoleon Hill đã nghiên cứu hơn 500 người thành công nhất nước Mỹ trong 20 năm để viết nên cuốn sách kinh điển này. Được dịch ra 70 thứ tiếng, bán hơn 100 triệu bản.',
    emoji: 'N',
    image: 'assets/images/nghi-giau-lam-giau.png',
    bg: 'linear-gradient(135deg,#059669,#0284c7)',
    badge: '',
    rating: 4.7,
    reviewCount: 892,
    pages: 350,
    publisher: 'NXB Hồng Đức',
    year: 2022,
    lang: 'Tiếng Việt',
    stock: 80,
    tags: ['all', 'bestseller'],
    reviews: [
      { name: 'Nguyễn Thành Long', stars: 5, date: '10/11/2023', text: 'Cuốn sách truyền cảm hứng mạnh mẽ. Đọc xong muốn làm giàu ngay!' },
      { name: 'Võ Thị Lan', stars: 4, date: '28/12/2023', text: 'Nội dung sâu sắc, cần đọc nhiều lần để thấm.' }
    ]
  },
  {
    id: 3,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    cat: 'Công nghệ',
    catSlug: 'cong-nghe',
    price: 159000,
    orig: 189000,
    desc: 'Hướng dẫn viết code sạch, dễ đọc và dễ bảo trì. Uncle Bob chia sẻ những nguyên tắc, patterns và thực hành tốt nhất để tạo ra code chất lượng cao. Cuốn sách gối đầu của mọi lập trình viên.',
    emoji: 'C',
    image: 'assets/images/clean_code.webp',
    bg: 'linear-gradient(135deg,#1e293b,#334155)',
    badge: 'sale',
    rating: 4.9,
    reviewCount: 3241,
    pages: 431,
    publisher: 'NXB Thông Tin & Truyền Thông',
    year: 2023,
    lang: 'Tiếng Việt',
    stock: 60,
    tags: ['all', 'sale'],
    reviews: [
      { name: 'Trần Công Minh', stars: 5, date: '05/01/2024', text: 'Must-read cho mọi developer. Code của tôi cải thiện rõ rệt sau khi đọc!' },
      { name: 'Nguyễn Hữu Phát', stars: 5, date: '20/02/2024', text: 'Kinh điển! Đọc lần 3 rồi vẫn thấy hay.' }
    ]
  },
  {
    id: 4,
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    cat: 'Tiểu thuyết',
    catSlug: 'tieu-thuyet',
    price: 65000,
    orig: 79000,
    desc: 'Tiểu thuyết nổi tiếng nhất của Paulo Coelho kể về hành trình của chàng chăn cừu Santiago theo đuổi ước mơ và khám phá kho báu. Bán được hơn 65 triệu bản trên toàn thế giới, dịch ra 80 ngôn ngữ.',
    emoji: 'N',
    image: 'assets/images/Nha-Gia-Kim.jpg',
    bg: 'linear-gradient(135deg,#b45309,#92400e)',
    badge: 'new',
    rating: 4.8,
    reviewCount: 4102,
    pages: 224,
    publisher: 'NXB Hội Nhà Văn',
    year: 2023,
    lang: 'Tiếng Việt',
    stock: 120,
    tags: ['all', 'new', 'sale'],
    reviews: [
      { name: 'Đinh Thị Mai', stars: 5, date: '08/03/2024', text: 'Cuốn sách hay nhất tôi từng đọc. Thay đổi cách nhìn về cuộc sống!' },
      { name: 'Lý Văn Hùng', stars: 5, date: '25/03/2024', text: 'Đọc một mạch không dừng được. Mỗi trang là một bài học.' }
    ]
  },
  {
    id: 5,
    title: 'Dám Bị Ghét',
    author: 'Ichiro Kishimi & Fumitake Koga',
    cat: 'Kỹ năng sống',
    catSlug: 'ky-nang-song',
    price: 89000,
    orig: 109000,
    desc: 'Triết lý sống tự do dựa trên tư tưởng của Alfred Adler được trình bày qua hình thức đối thoại giữa triết gia và chàng thanh niên. Học cách sống cho bản thân, không bị ảnh hưởng bởi kỳ vọng của người khác.',
    emoji: 'D',
     image: 'assets/images/dám-bị-ghét.jpg',
    bg: 'linear-gradient(135deg,#7c3aed,#4c1d95)',
    badge: 'hot',
    rating: 4.7,
    reviewCount: 987,
    pages: 278,
    publisher: 'NXB Lao Động',
    year: 2023,
    lang: 'Tiếng Việt',
    stock: 90,
    tags: ['all', 'bestseller', 'sale'],
    reviews: [
      { name: 'Bùi Thị Ngọc', stars: 5, date: '14/02/2024', text: 'Cuốn sách giúp tôi thoát khỏi sự lo lắng về ý kiến người khác!' },
      { name: 'Đặng Văn Khoa', stars: 4, date: '01/04/2024', text: 'Triết lý hay, định dạng đối thoại dễ đọc.' }
    ]
  },
  {
    id: 6,
    title: 'Tư Duy Nhanh Và Chậm',
    author: 'Daniel Kahneman',
    cat: 'Kinh tế',
    catSlug: 'kinh-te',
    price: 125000,
    orig: 149000,
    desc: 'Khám phá hai hệ thống tư duy trong não bộ: Hệ thống 1 (nhanh, trực giác) và Hệ thống 2 (chậm, có lý trí). Daniel Kahneman — nhà kinh tế học đoạt Nobel — giải thích cách chúng ảnh hưởng đến mọi quyết định của bạn.',
    emoji: 'T',
     image: 'assets/images/tu-duy-nhanh-va-cham.jpg',
    bg: 'linear-gradient(135deg,#0369a1,#075985)',
    badge: 'new',
    rating: 4.9,
    reviewCount: 756,
    pages: 512,
    publisher: 'NXB Thế Giới',
    year: 2023,
    lang: 'Tiếng Việt',
    stock: 75,
    tags: ['all', 'new', 'sale'],
    reviews: [
      { name: 'Phan Anh Tuấn', stars: 5, date: '17/01/2024', text: 'Sách khó nhưng cực kỳ giá trị. Đọc xong hiểu tại sao con người hay ra quyết định sai.' },
      { name: 'Cao Thị Linh', stars: 5, date: '09/03/2024', text: 'Masterpiece của tâm lý học hành vi. Bắt buộc phải đọc!' }
    ]
  },
  {
    id: 7,
    title: 'Hoàng Tử Bé',
    author: 'Antoine de Saint-Exupéry',
    cat: 'Tiểu thuyết',
    catSlug: 'tieu-thuyet',
    price: 45000,
    orig: 55000,
    desc: 'Cuốn sách nổi tiếng nhất thế giới về tình bạn, tình yêu và ý nghĩa cuộc sống. Câu chuyện về chàng hoàng tử bé du hành qua các hành tinh, gặp gỡ nhiều nhân vật kỳ lạ và học được những bài học quý giá.',
    emoji: 'H',
     image: 'assets/images/hoàng-tử-bé.jpg',
    bg: 'linear-gradient(135deg,#be185d,#9d174d)',
    badge: 'new',
    rating: 4.9,
    reviewCount: 6341,
    pages: 120,
    publisher: 'NXB Kim Đồng',
    year: 2023,
    lang: 'Tiếng Việt',
    stock: 250,
    tags: ['all', 'new', 'sale'],
    reviews: [
      { name: 'Trương Thị Hoa', stars: 5, date: '14/12/2023', text: 'Cuốn sách cho mọi lứa tuổi. Đọc lại lần thứ 5 vẫn rơi nước mắt!' },
      { name: 'Ngô Đức Tài', stars: 5, date: '28/01/2024', text: 'Kinh điển của văn học thế giới. Bản dịch rất hay!' }
    ]
  }
];


const CATEGORIES = [
  {
    name: 'Kỹ năng sống',
    slug: 'ky-nang-song',
    emoji: '🧠',
    image: 'ky-nang-song.jpg',
    count: 24,
    desc: 'Phát triển bản thân, kỹ năng mềm và tư duy'
  },

  {
    name: 'Kinh tế & Đầu tư',
    slug: 'kinh-te',
    emoji: '📈',
    image: 'kinh-te.jpg',
    count: 18,
    desc: 'Tài chính cá nhân, kinh doanh và đầu tư'
  },

  {
    name: 'Công nghệ',
    slug: 'cong-nghe',
    emoji: '💻',
    image: 'cong-nghe.jpg',
    count: 31,
    desc: 'Lập trình, AI và công nghệ thông tin'
  },

  {
    name: 'Tiểu thuyết',
    slug: 'tieu-thuyet',
    emoji: '📖',
    image: 'tieu-thuyet.jpg',
    count: 42,
    desc: 'Tiểu thuyết trong nước và nước ngoài'
  },

  {
    name: 'Lịch sử',
    slug: 'lịch-sử',
    emoji: '🏛️',
    image: 'lịch-sử.jpg',
    count: 12,
    desc: 'Lịch sử Việt Nam và thế giới'
  },
   
  {
    name: 'Văn học',
    slug: 'văn-học',
    emoji: '🖋️',
    image: 'văn-học.jpg',
    count: 28,
    desc: 'Văn học kinh điển Việt Nam và quốc tế'
  },

  {
    name: 'Thiếu nhi',
    slug: 'thiếu-nhi',
    emoji: '🌟',
    image: 'thiếu-nhi.jpg',
    count: 35,
    desc: 'Sách dành cho trẻ em và thanh thiếu niên'
  },

  {
    name: 'Ngoại ngữ',
    slug: 'ngoại-ngữ',
    emoji: '🌍',
    image: 'ngoại-ngữ.jpg',
    count: 15,
    desc: 'Tiếng Anh, Nhật, Hàn, Trung và nhiều ngôn ngữ khác'
  },
];

/* Helper: tính % giảm giá */
function calcDiscount(orig, price) {
  if (!orig || orig <= price) return 0;
  return Math.round((orig - price) / orig * 100);
}

/* Helper: format giá VND */
function formatPrice(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

/* Helper: render sao */
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}