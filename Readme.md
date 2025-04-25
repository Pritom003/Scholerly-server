
---

### ✅ `backend/README.md` — **Scholerly Backend**

```md
# Scholerly 🎓 - Backend

TutorLink's backend is a powerful, scalable REST API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. It handles authentication, role-based access control, tutor management, bookings, payments, and real-time event handling with Socket.IO.

---

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Payment**: SurjoPay
- **Real-Time**: Socket.IO
- **Authentication**: JWT
- **Validation**: Zod
- **Notifications**: Socket.IO events
- **Modular Structure**

---


``` yaml
NODE_ENV=development

BCRYPT_SALT_ROUNDS=12
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_URL=your-db-url
DEFAULT_PASSWORD=your-default-password

# JWT Configuration
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_TOKEN_EXPIRES_IN=1d
JWT_REFRESH_TOKEN_EXPIRES_IN=200d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_URL=your-cloudinary-url

# ShurjoPay
SP_ENDPOINT=https://sandbox.shurjopayment.com
SP_USERNAME=your-username
SP_PASSWORD=your-password
SP_PREFIX=your-prefix
SP_RETURN_URL=https://your-client-url/verifyPayment
```
