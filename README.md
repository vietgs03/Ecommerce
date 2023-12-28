# Ecommerce

Tìm hiểu cách config khi làm việc trong môi trường dev - tester - product
Tìm hiểu thread pool - OS ... 

# Task note 
- [x] Config database & env
- [x] Api sign-up shop
- [x] Handler Error
- [x] fix Check authentication
- [x] create new product
- [x] fix bug login logout không lấy được refreshtoken
- [ ]   
#
Note:
-  folder service dùng để viết function call tới db.
-  folder model tạo ra các model để create dữ liệu trong bảng.
-  folder controller viết function request tới service.
-  folder route request tới controller.
-  folder core để tạo function hanlder error
-  folder auth viết function check authencation

#
  --- Create product -----
  
#
1 - Welcome, welcome, welcome -   
 • Course: Node.js Backend Architecture ...  
 
2 - Những folders và packages cần thiết khi khởi tạo Project! -   
 • Section 2: Node.js Backend Architectu...  
 
3 - Connect MongoDB to Node.js Using Mongoose và 7 điều lưu ý  -   
 • Section 3: Connect MongoDB to Node.js...  
 
4 - Cách triển khai env cho các level khác nhau. -   
 • Section 4: Lịch sử của .env và cách k...  
 
5 - Sign-up Shop -   
 • Section 5: Reup Sign-up Shop (FULL) t...  
 
6 - Middleware apikey and permissions -   
 • Section 6:  Custom Dynamic Middleware...  
 
7 - Xử lý ErrorHandler trong API -   
 • Section 7: Xử lý ErrorHandler trong A...  
 
8 - Make Your API Response use class -   
 • Section 8:  Make Your API Response us...  
 
9 - Login Shop API -   
 • Section 9: Login Shop Api | Course No...  
 
10 - Logout vs Authentication  -  
 • Section 10: Logout vs Authentication ...  
 
11 - RefreshToken và phát hiện token đã sử dụng bởi hacker và cách xử lý -   
 • Section 11: Xử lý token được sử dụng ...  
 
11.V2 -  FIXED Bug bị sai và tối ưu hơn so với phiên bản cũ -   
 • Section 11( version 2 ): FIXED Bug bị...  
 
12 - Create schema Product -   
 • Section 12: Schema Product Ecommerce ...  
 
13 - Create new Product API, áp dụng Factory Pattern -   
 • Section13: API Product use Factory Pa...  
 
14 - Api Service Products (Optimal For LV.xxx) -   
 • Section14: Api Service Products (Opti...  
 ....
#
##
- Nhược điểm của cách connect cũ
- Cách connect mới, khuyên dùng
- Kiểm tra hệ thống có bao nhiêu connect
- THông báo khi server quá tải connect
- Có nên disConnect liên tục hay không?
- PoolSize là gì? vì sao lại quan trọng?
- Nếu vượt quá kết nối poolsize?
- MongoDB Desing pattern
      - Polymorphic pattern
      - Attribute pattern
      - Bucket pattern
      - Outlier pattern
      - Computed pattern
      - Subnet pattern
      - Extended reference pattern
      - Approximation pattern
      - Tree pattern
      - Preallocation pattern
      - Document versioning pattenr
      - Schema versioning pattern
### Handler auth
    https://github.com/madhums/node-express-mongoose-demo.git

### Api key
    `Lưu trữ key cung cấp cho các đối tác được truy cập vào hệ thống`

## REDIS
-STRING: Có thể là string, integer hoặc float. Redis có thể làm việc với cả string, từng phần của string, cũng như tăng/giảm giá trị của integer, float.

-LIST: Danh sách liên kết của các strings. Redis hỗ trợ các thao tác push, pop từ cả 2 phía của list, trim dựa theo offset, đọc 1 hoặc nhiều items của list, tìm kiếm và xóa giá trị.

-SET Tập hợp các string (không được sắp xếp). Redis hỗ trợ các thao tác thêm, đọc, xóa từng phần tử, kiểm tra sự xuất hiện của phần tử trong tập hợp. Ngoài ra Redis còn hỗ trợ các phép toán tập hợp, gồm intersect/union/difference.

-HASH: Lưu trữ hash table của các cặp key-value, trong đó key được sắp xếp ngẫu nhiên, không theo thứ tự nào cả. Redis hỗ trợ các thao tác thêm, đọc, xóa từng phần tử, cũng như đọc tất cả giá trị.

-ZSET (sorted set): Là 1 danh sách, trong đó mỗi phần tử là map của 1 string (member) và 1 floating-point number (score), danh sách được sắp xếp theo score này. Redis hỗ trợ thao tác thêm, đọc, xóa từng phần tử, lấy ra các phần tử dựa theo range của score hoặc của string.
