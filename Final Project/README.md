# Rental Equipment API Documentation

## Authentication Endpoints

### Register User
- **Endpoint**: `POST /auth/register`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Pengguna baru berhasil didaftarkan",
    "data": {
      "id": "integer",
      "name": "string",
      "email": "string"
    }
  }
  ```

### Login User
- **Endpoint**: `POST /auth/login`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login berhasil! Selamat datang [name] !",
    "token": "string"
  }
  ```

### Register Admin
- **Endpoint**: `POST /auth/adm-register`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Admin baru berhasil didaftarkan",
    "data": {
      "id": "integer",
      "name": "string",
      "email": "string"
    }
  }
  ```

### Login Admin
- **Endpoint**: `POST /auth/adm-login`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login berhasil! Selamat datang admin [name] !",
    "token": "string"
  }
  ```

### Change Password
- **Endpoint**: `POST /auth/change-password`
- **Request Body**:
  ```json
  {
    "newPassword": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password berhasil diubah"
  }
  ```

## Equipment Endpoints

### Get All Equipments
- **Endpoint**: `GET /equipment/get-all`
- **Query Parameters**:
  - `page`: integer (default: 1)
  - `limit`: integer (default: 10)
- **Response**:
  ```json
  {
    "data": {
      "equipment": [
        {
          "id": "integer",
          "name": "string",
          "price": "integer"
        }
      ],
      "pagination": {
        "page": "integer",
        "limit": "integer"
      }
    }
  }
  ```

### Get Equipment Detail
- **Endpoint**: `GET /equipment/get-equipment-detail/:id`
- **Response**:
  ```json
  {
    "data": {
      "equipment": [
        {
          "id": "integer",
          "name": "string",
          "description": "string",
          "price": "integer",
          "stock": "integer"
        }
      ]
    }
  }
  ```

### Register Equipment
- **Endpoint**: `POST /equipment/register`
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Produk baru berhasil didaftarkan",
    "data": {
      "id": "integer",
      "name": "string",
      "description": "string"
    }
  }
  ```

### Edit Equipment
- **Endpoint**: `PUT /equipment/edit`
- **Request Body**:
  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Produk berhasil diperbaharui",
    "data": {
      "id": "integer",
      "name": "string",
      "description": "string"
    }
  }
  ```

### Delete Equipment
- **Endpoint**: `DELETE /equipment/delete/:id`
- **Response**:
  ```json
  {
    "message": "Produk berhasil dihapus",
    "data": {
      "id": "integer",
      "name": "string"
    }
  }
  ```

## Cart Endpoints

### Add to Cart
- **Endpoint**: `POST /cart/add-to-cart`
- **Request Body**:
  ```json
  {
    "reservation_id": "integer",
    "equipment_id": "integer",
    "quantity": "integer"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Produk berhasil dimasukan ke cart",
    "data": {
      "reservation_id": "integer",
      "name": "string",
      "cart_detail": {
        "qty": "integer",
        "name": "string",
        "price": "integer"
      }
    }
  }
  ```

### Remove from Cart
- **Endpoint**: `POST /cart/remove-from-cart`
- **Request Body**:
  ```json
  {
    "reservation_id": "integer",
    "equipment_id": "integer"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "cart_id": "integer",
      "cart_detail": [
        {
          "name": "string",
          "price_per_item": "integer",
          "qty": "integer",
          "total_price": "integer"
        }
      ]
    }
  }
  ```

### Get Cart
- **Endpoint**: `GET /reservation/get-cart`
- **Response**:
  ```json
  {
    "data": {
      "cart_id": "integer",
      "cart_detail": [
        {
          "name": "string",
          "price_per_item": "integer",
          "qty": "integer",
          "total_price": "integer"
        }
      ]
    }
  }
  ```

### Minus from Cart
- **Endpoint**: `PUT /reservation/minus-from-cart`
- **Request Body**:
  ```json
  {
    "reservation_id": "integer",
    "equipment_id": "integer",
    "quantity": "integer"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "cart_id": "integer",
      "cart_detail": [
        {
          "name": "string",
          "price_per_item": "integer",
          "qty": "integer",
          "total_price": "integer"
        }
      ]
    }
  }
  ```

### Checkout
- **Endpoint**: `POST /reservation/checkout`
- **Request Body**:
  ```json
  {
    "reservation_id": "integer"
  }
  ```
- **Response**:
  ```json
  {
    "messages": "Pembayaran sukses, berikan order_id kepada admin untuk verifikasi.",
    "data": {
      "order_id": "integer"
    }
  }
  ```

## Reservation Endpoints

### Update Reservation Status
- **Endpoint**: `PUT /reservation/update-status`
- **Request Body**:
  ```json
  {
    "reservation_id": "integer",
    "status": "string"
  }
  ```
- **Response**:
  ```json
  {
    "messages": "Update reservation status berhasil!",
    "data": {
      "reservation_id": "integer",
      "reservation_detail": [
        {
          "id": "integer",
          "reservation_id": "integer",
          "equipments_id": "integer",
          "qty": "integer"
        }
      ]
    }
  }
  ```