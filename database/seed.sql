-- BookStore — dữ liệu mẫu (sinh từ js/data.js)
USE bookstore;
SET NAMES utf8mb4;
-- Cho phép chèn sách có id = 0 (giữ nguyên id cũ vì index.html gọi openModal(0)).
SET SESSION sql_mode = CONCAT(@@sql_mode, ',NO_AUTO_VALUE_ON_ZERO');

INSERT INTO categories (id,name,slug,emoji,image,description,sort_order) VALUES
(1,'Kỹ năng sống','ky-nang-song','🧠','ky-nang-song.jpg','Phát triển bản thân, kỹ năng mềm và tư duy',1),
(2,'Kinh tế & Đầu tư','kinh-te','📈','kinh-te.jpg','Tài chính cá nhân, kinh doanh và đầu tư',2),
(3,'Công nghệ','cong-nghe','💻','cong-nghe.jpg','Lập trình, AI và công nghệ thông tin',3),
(4,'Tiểu thuyết','tieu-thuyet','📖','tieu-thuyet.jpg','Tiểu thuyết trong nước và nước ngoài',4),
(5,'Lịch sử','lịch-sử','🏛️','lịch-sử.jpg','Lịch sử Việt Nam và thế giới',5),
(6,'Văn học','văn-học','🖋️','văn-học.jpg','Văn học kinh điển Việt Nam và quốc tế',6),
(7,'Thiếu nhi','thiếu-nhi','🌟','thiếu-nhi.jpg','Sách dành cho trẻ em và thanh thiếu niên',7),
(8,'Ngoại ngữ','ngoại-ngữ','🌍','ngoại-ngữ.jpg','Tiếng Anh, Nhật, Hàn, Trung và nhiều ngôn ngữ khác',8);

INSERT INTO books (id,title,author,category_id,price,orig_price,description,emoji,image,bg,badge,tags,rating,review_count,pages,publisher,`year`,lang,stock) VALUES
(0,'Đắc Nhân Tâm','Dale Carnegie',1,75000,89000,'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử với con người. Đã bán hơn 30 triệu bản trên toàn thế giới, được dịch ra hơn 30 thứ tiếng. Đây là cuốn sách gối đầu cho bất kỳ ai muốn thành công trong cuộc sống và công việc.','Đ','assets/images/đắc nhân tâm.jpg','linear-gradient(135deg,#f97316,#dc2626)','hot','bestseller',4.9,2148,320,'NXB Tổng Hợp TP.HCM',2023,'Tiếng Việt',150),
(1,'Atomic Habits','James Clear',1,98000,119000,'Thay đổi tí hon, hiệu quả bất ngờ. James Clear trình bày một framework được kiểm chứng khoa học để xây dựng thói quen tốt và loại bỏ thói quen xấu. Cuốn sách #1 New York Times Bestseller.','A','assets/images/atomic-habits.jpg','linear-gradient(135deg,#2563eb,#7c3aed)','sale','bestseller,sale',4.8,1523,280,'NXB Lao Động',2023,'Tiếng Việt',200),
(2,'Nghĩ Giàu Làm Giàu','Napoleon Hill',2,95000,NULL,'Bí quyết làm giàu từ những tư duy đúng đắn. Napoleon Hill đã nghiên cứu hơn 500 người thành công nhất nước Mỹ trong 20 năm để viết nên cuốn sách kinh điển này. Được dịch ra 70 thứ tiếng, bán hơn 100 triệu bản.','N','assets/images/nghi-giau-lam-giau.png','linear-gradient(135deg,#059669,#0284c7)','','bestseller',4.7,892,350,'NXB Hồng Đức',2022,'Tiếng Việt',80),
(3,'Clean Code','Robert C. Martin',3,159000,189000,'Hướng dẫn viết code sạch, dễ đọc và dễ bảo trì. Uncle Bob chia sẻ những nguyên tắc, patterns và thực hành tốt nhất để tạo ra code chất lượng cao. Cuốn sách gối đầu của mọi lập trình viên.','C','assets/images/clean_code.webp','linear-gradient(135deg,#1e293b,#334155)','sale','sale',4.9,3241,431,'NXB Thông Tin & Truyền Thông',2023,'Tiếng Việt',60),
(4,'Nhà Giả Kim','Paulo Coelho',4,65000,79000,'Tiểu thuyết nổi tiếng nhất của Paulo Coelho kể về hành trình của chàng chăn cừu Santiago theo đuổi ước mơ và khám phá kho báu. Bán được hơn 65 triệu bản trên toàn thế giới, dịch ra 80 ngôn ngữ.','N','assets/images/Nha-Gia-Kim.jpg','linear-gradient(135deg,#b45309,#92400e)','new','new,sale',4.8,4102,224,'NXB Hội Nhà Văn',2023,'Tiếng Việt',120),
(5,'Dám Bị Ghét','Ichiro Kishimi & Fumitake Koga',1,89000,109000,'Triết lý sống tự do dựa trên tư tưởng của Alfred Adler được trình bày qua hình thức đối thoại giữa triết gia và chàng thanh niên. Học cách sống cho bản thân, không bị ảnh hưởng bởi kỳ vọng của người khác.','D','assets/images/dám-bị-ghét.jpg','linear-gradient(135deg,#7c3aed,#4c1d95)','hot','bestseller,sale',4.7,987,278,'NXB Lao Động',2023,'Tiếng Việt',90),
(6,'Tư Duy Nhanh Và Chậm','Daniel Kahneman',2,125000,149000,'Khám phá hai hệ thống tư duy trong não bộ: Hệ thống 1 (nhanh, trực giác) và Hệ thống 2 (chậm, có lý trí). Daniel Kahneman — nhà kinh tế học đoạt Nobel — giải thích cách chúng ảnh hưởng đến mọi quyết định của bạn.','T','assets/images/tu-duy-nhanh-va-cham.jpg','linear-gradient(135deg,#0369a1,#075985)','new','new,sale',4.9,756,512,'NXB Thế Giới',2023,'Tiếng Việt',75),
(7,'Hoàng Tử Bé','Antoine de Saint-Exupéry',4,45000,55000,'Cuốn sách nổi tiếng nhất thế giới về tình bạn, tình yêu và ý nghĩa cuộc sống. Câu chuyện về chàng hoàng tử bé du hành qua các hành tinh, gặp gỡ nhiều nhân vật kỳ lạ và học được những bài học quý giá.','H','assets/images/hoàng-tử- bé.jpg','linear-gradient(135deg,#be185d,#9d174d)','new','new,sale',4.9,6341,120,'NXB Kim Đồng',2023,'Tiếng Việt',250),
(8,'Sử Việt Nhìn Từ Tài Liệu Nguồn','Trần Kinh Hòa',5,135000,159000,'Tập hợp và diễn giải các tư liệu nguồn quan trọng giúp người đọc tiếp cận lịch sử Việt Nam theo hướng khách quan, có căn cứ và giàu chiều sâu.','S','assets/images/lich-su1.jpg','linear-gradient(135deg,#92400e,#451a03)','new','new',4.7,328,420,'NXB Đà Nẵng',2023,'Tiếng Việt',45),
(9,'Lịch Sử Sách','James Raven',5,168000,199000,'Một hành trình khảo cứu lịch sử hình thành, lưu truyền và phát triển của sách qua nhiều thời kỳ, từ bản thảo cổ đến ngành xuất bản hiện đại.','L','assets/images/lich-su-2.png','linear-gradient(135deg,#78350f,#1c1917)','','',4.6,214,360,'NXB Thông Tin & Truyền Thông',2022,'Tiếng Việt',38),
(10,'Khi Trẻ Người Ta Nghĩ Khác','Lê Khải Việt',6,89000,109000,'Một tác phẩm văn học giàu chất suy tưởng về tuổi trẻ, những lựa chọn, cô đơn và cách con người nhìn lại chính mình khi trưởng thành.','K','assets/images/van-hoc1.webp','linear-gradient(135deg,#f97316,#facc15)','new','new',4.5,412,248,'NXB Hội Nhà Văn',2023,'Tiếng Việt',72),
(11,'Chí Phèo','Nam Cao',6,52000,65000,'Truyện ngắn kinh điển của Nam Cao, khắc họa bi kịch con người trong xã hội cũ bằng giọng văn sắc lạnh, nhân văn và ám ảnh.','C','assets/images/van-hoc2.png','linear-gradient(135deg,#b91c1c,#f59e0b)','hot','bestseller',4.9,1260,160,'NXB Văn Học',2022,'Tiếng Việt',120),
(12,'Tôi Thấy Hoa Vàng Trên Cỏ Xanh','Nguyễn Nhật Ánh',6,78000,95000,'Câu chuyện trong trẻo về tuổi thơ, gia đình và những rung động đầu đời, được kể bằng lối văn giản dị, giàu cảm xúc của Nguyễn Nhật Ánh.','T','assets/images/van-hoc3.webp','linear-gradient(135deg,#84cc16,#15803d)','hot','bestseller,sale',4.8,2214,380,'NXB Trẻ',2023,'Tiếng Việt',96),
(13,'Cổ Tích Của Ba','Phi Tân',7,64000,79000,'Tản văn cho thiếu nhi với những câu chuyện gần gũi, ấm áp, gợi mở trí tưởng tượng và tình yêu gia đình cho độc giả nhỏ tuổi.','C','assets/images/thieu-nhi1.jpg','linear-gradient(135deg,#fb923c,#22c55e)','new','new',4.7,534,180,'NXB Trẻ',2023,'Tiếng Việt',88),
(14,'Charlotte Và Wilbur','E. B. White',7,72000,89000,'Tác phẩm thiếu nhi kinh điển về tình bạn, lòng dũng cảm và sự tử tế, phù hợp với cả trẻ em lẫn người lớn yêu văn chương nhẹ nhàng.','C','assets/images/thieu-nhi2.jpg','linear-gradient(135deg,#60a5fa,#f472b6)','hot','bestseller',4.8,908,240,'NXB Kim Đồng',2022,'Tiếng Việt',64),
(15,'Hiệp Sĩ Bọ Rùa Và Hội Mọt Sách','Corey R. Tabor',7,59000,NULL,'Một cuốn sách tranh vui nhộn về niềm yêu thích đọc sách, lòng can đảm và những cuộc phiêu lưu nhỏ đầy màu sắc.','H','assets/images/thieu-nhi3.png','linear-gradient(135deg,#38bdf8,#f97316)','','',4.6,276,96,'NXB Thanh Niên',2023,'Tiếng Việt',70),
(16,'10 Cách Học Ngoại Ngữ','Hoàng Thanh Hải',8,99000,120000,'Câu chuyện tự học tiếng Anh và nhiều ngoại ngữ khác, gợi ý phương pháp học thực tế, bền vững cho người mới bắt đầu.','N','assets/images/ngoai-ngu1.jpg','linear-gradient(135deg,#22c55e,#f97316)','new','new',4.7,685,260,'NXB Hà Nội',2023,'Tiếng Việt',82),
(17,'127 Chủ Điểm Ngữ Pháp Tiếng Anh Thường Dùng','Thiên Phúc',8,86000,105000,'Tổng hợp các chủ điểm ngữ pháp tiếng Anh phổ biến, trình bày rõ ràng cho người học muốn củng cố nền tảng và luyện tập nâng cao.','G','assets/images/ngoai-ngu2.webp','linear-gradient(135deg,#facc15,#ef4444)','sale','sale',4.5,742,320,'NXB Dân Trí',2022,'Tiếng Việt',110),
(18,'Tiếng Trung Cho Người Mới Bắt Đầu','Phương Linh',8,93000,NULL,'Giáo trình nhập môn tiếng Trung với từ vựng, mẫu câu và ngữ pháp cơ bản, phù hợp cho người học từ con số không.','T','assets/images/ngoai-ngu3.webp','linear-gradient(135deg,#f97316,#fb7185)','','',4.6,389,280,'NXB Dân Trí',2023,'Tiếng Việt',76);

INSERT INTO reviews (book_id,name,stars,content,helpful,verified,created_at) VALUES
(0,'Nguyễn Văn An',5,'Cuốn sách thay đổi cuộc đời tôi. Học được rất nhiều kỹ năng giao tiếp hữu ích!',0,0,'2024-01-12 12:00:00'),
(0,'Trần Thị Bình',5,'Tuyệt vời! Nên đọc ít nhất một lần trong đời.',0,0,'2024-02-05 12:00:00'),
(0,'Lê Minh Tuấn',4,'Nội dung hay nhưng bản dịch ở một số chỗ hơi cứng.',0,0,'2024-02-18 12:00:00'),
(1,'Phạm Thu Hà',5,'Đây là cuốn sách về thói quen hay nhất tôi từng đọc!',0,0,'2024-01-22 12:00:00'),
(1,'Hoàng Văn Đức',5,'Áp dụng được ngay vào thực tế. Highly recommend!',0,0,'2024-03-14 12:00:00'),
(2,'Nguyễn Thành Long',5,'Cuốn sách truyền cảm hứng mạnh mẽ. Đọc xong muốn làm giàu ngay!',0,0,'2023-11-10 12:00:00'),
(2,'Võ Thị Lan',4,'Nội dung sâu sắc, cần đọc nhiều lần để thấm.',0,0,'2023-12-28 12:00:00'),
(3,'Trần Công Minh',5,'Must-read cho mọi developer. Code của tôi cải thiện rõ rệt sau khi đọc!',0,0,'2024-01-05 12:00:00'),
(3,'Nguyễn Hữu Phát',5,'Kinh điển! Đọc lần 3 rồi vẫn thấy hay.',0,0,'2024-02-20 12:00:00'),
(4,'Đinh Thị Mai',5,'Cuốn sách hay nhất tôi từng đọc. Thay đổi cách nhìn về cuộc sống!',0,0,'2024-03-08 12:00:00'),
(4,'Lý Văn Hùng',5,'Đọc một mạch không dừng được. Mỗi trang là một bài học.',0,0,'2024-03-25 12:00:00'),
(5,'Bùi Thị Ngọc',5,'Cuốn sách giúp tôi thoát khỏi sự lo lắng về ý kiến người khác!',0,0,'2024-02-14 12:00:00'),
(5,'Đặng Văn Khoa',4,'Triết lý hay, định dạng đối thoại dễ đọc.',0,0,'2024-04-01 12:00:00'),
(6,'Phan Anh Tuấn',5,'Sách khó nhưng cực kỳ giá trị. Đọc xong hiểu tại sao con người hay ra quyết định sai.',0,0,'2024-01-17 12:00:00'),
(6,'Cao Thị Linh',5,'Masterpiece của tâm lý học hành vi. Bắt buộc phải đọc!',0,0,'2024-03-09 12:00:00'),
(7,'Trương Thị Hoa',5,'Cuốn sách cho mọi lứa tuổi. Đọc lại lần thứ 5 vẫn rơi nước mắt!',0,0,'2023-12-14 12:00:00'),
(7,'Ngô Đức Tài',5,'Kinh điển của văn học thế giới. Bản dịch rất hay!',0,0,'2024-01-28 12:00:00');

INSERT INTO coupons (code,discount_percent,min_order,is_active) VALUES ('BOOKSTORE10',10,0,1);

-- Tài khoản quản trị mặc định — ĐỔI MẬT KHẨU NGAY sau lần đăng nhập đầu tiên.
-- Email: admin@bookstore.local | Mật khẩu: Admin@123
INSERT INTO users (name,email,password_hash,role) VALUES ('Quản trị viên','admin@bookstore.local','$2b$12$n0k0/ig8H75YBbVOuhZIxO/zX0AqQdLvhqXJEIBJojaw0MTTjhgoG','admin');
