
# Web IoT Project

## Giới thiệu
Dự án này xây dựng một hệ thống giám sát và điều khiển thiết bị IoT thông qua giao thức **MQTT**. Hệ thống bao gồm:

- **Backend**: Sử dụng **Node.js** để xử lý dữ liệu từ các thiết bị IoT.
- **Frontend**: Sử dụng **ReactJS** để hiển thị dữ liệu theo thời gian thực và điều khiển thiết bị.
- **MQTT**: Pub/Sub dữ liệu giữa các thiết bị IoT và hệ thống.
- **Arduino**: Điều khiển phần cứng, bao gồm cảm biến và thiết bị thông qua giao thức MQTT.

## Mục lục
- [Cài đặt](#cài-đặt)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Sử dụng](#sử-dụng)
- [API](#api)

## Cài đặt

### Yêu cầu
- **Node.js**
- **npm** hoặc **yarn**
- **XAMPP**
- **MQTT Broker** (ví dụ: Mosquitto)

### Hướng dẫn cài đặt
1. **Clone repository**:
    ```bash
    git clone https://github.com/Nammmmmmmm/IoT-Websites.git
    ```

2. **Cài đặt các gói phụ thuộc cho backend**:
    ```bash
    cd server
    npm install
    ```

3. **Cài đặt các gói phụ thuộc cho frontend**:
    ```bash
    cd ../client
    npm install
    ```

4. **Cấu hình cơ sở dữ liệu MySQL**:
    - Tạo một cơ sở dữ liệu mới.
    - Cập nhật thông tin kết nối trong file `server/dbconnect.js`.

5. **Chạy MQTT Broker**:
    - Cài đặt và khởi chạy **MQTT Broker** (ví dụ: Mosquitto).

6. **Chạy server**:
    ```bash
    cd ../server
    npm run dev
    ```

7. **Chạy client**:
    ```bash
    cd ../client
    npm start
    ```

## Cấu trúc dự án
```plaintext
your-repo/
├── client/             # Mã nguồn frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── server/             # Mã nguồn backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── dbconnect.js
│   ├── server.js
│   ├── package.json
│   └── ...
└── README.md
```

## Sử dụng

### Truy cập giao diện web:
- Mở trình duyệt và truy cập: **http://localhost:3000**.

### Giám sát và điều khiển thiết bị:
- Sử dụng giao diện để theo dõi dữ liệu từ các cảm biến và điều khiển các thiết bị trong thời gian thực.

### Hình ảnh giao diện:
- Dashboard:  
  ![Ảnh Dashboard](./client/public/anh6.png)
  
- Dữ liệu cảm biến:  
  ![Ảnh Datasensor Table](./client/public/anh7.png)
  
- Dữ liệu thiết bị:  
  ![Ảnh Device Table](./client/public/anh8.png)
  
- Trang cá nhân:  
  ![Ảnh Profile](./client/public/anh9.png)

## API

### Lấy dữ liệu cảm biến
- **Endpoint**: `/data_sensor`
- **Phương thức**: `GET`
- **Mô tả**: Lấy tất cả dữ liệu từ bảng `attributetable`.

### Lấy dữ liệu thiết bị
- **Endpoint**: `/data_device`
- **Phương thức**: `GET`
- **Mô tả**: Lấy tất cả dữ liệu từ bảng `devicetable`.

