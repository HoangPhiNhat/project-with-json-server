1 - done. Lỗi call api lấy danh sách 2 lần khi reload page
2 - done. Sort lỗi không ra đúng dữ liệu
3 - done. Giá hiện tại đang dạng string sửa lại thành number (vì giá là số nên nó phải ở dạng number, ở dạng string sort bị sai)
4. Khi sửa sản phẩm thành công bị reload page sửa gọi lại fetchProduct + giữ nguyên giá trị tham số bộ lọc hiện tại
5. Khi thêm sản phẩm giá trị tham số bộ lọc được đặt về ban đầu
6. Tìm kiếm hiện tại đang bị sai (Tìm kiếm dữ liệu tuyệt đối)