
# DQMS - Digital Queue Management System

A backend system designed to digitalize physical queues in institutions like colleges, hospitals, and offices.  
It allows admins to manage queues efficiently while users can track their position in real time using a unique ID.

---

## 🚀 Overview

DQMS replaces traditional physical queues with a structured digital system.

### 🧑‍💼 Admin Workflow
- Admin logs in using JWT authentication  
- Adds users to queue (name + phone)  
- System generates:
  - **Unique ID** (4-digit hexadecimal)
  - **Token number** (queue position)

Admin can:
- View full queue (`getQueueStatus`)
- Move queue forward (`nextUser`)
- Delete a user (`deleteOne`)

---

### 👤 User Workflow
- User enters:
  - Unique ID
  - Institution name
  - Department
- Gets their **current queue position**

---

## ✨ Features

- Queue digitalization for institutions
- Unique ID generation (4-digit hex)
- Dynamic queue position updates
- Admin-controlled queue operations
- JWT-based authentication system
- SMS notification when user is near turn
- MongoDB aggregation pipelines for queue tracking

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (Access + Refresh Tokens)
- **Other:**
  - Aggregation pipelines
  - SMS integration

---

## ⚙️ API Endpoints

### Admin Routes

- `POST /signup` → Register admin
- `POST /login` → Login admin
- `GET /logout` → Logout admin

- `POST /addToQueue` → Add user to queue
- `GET /getQueueStatus` → Get full queue details
- `GET /nextUser` → Move queue forward
- `DELETE /deleteOne` → Delete user from queue

---

### User Route

- `POST /statusCheck` → Get current queue position

---

## 🔄 Queue Logic

- Each user gets a **token number** (position in queue)
- When `nextUser` is triggered:
  - First user is removed
  - All users shift forward
- When a user is deleted:
  - All users behind them move up

---

## 📩 SMS Functionality

- Users receive SMS notifications when they are close to their turn
- Triggered during:
  - Queue advancement
  - Position updates

---

## 📁 Project Structure
DQMS-Vishal/

```
├── src/
│   ├── index.js
│   ├── app.js
│   ├── constants.js
│   ├── db/
│   │   └── connect_db.js
│   ├── models/
│   │   ├── admin.details.models.js
│   │   ├── users.models.js
│   │   └── queue.models.js
│   ├── controllers/
│   │   ├── adminpanel.controllers.js
│   │   └── user.controllers.js
│   ├── routes/
│   │   ├── adminpanel.routes.js
│   │   └── user.routes.js
│   ├── middlewares/
│   │   ├── admin.auth.middlewares.js
│   │   └── fetchQueueId.middlewares.js
│   └── utils/
│       ├── apiResponse.js
│       ├── asyncHandler.js
│       ├── errorResponse.js
│       └── sms.handler.js
├── package.json
├── .gitignore
└── README.md
```

---  
  
## 📦 Installation  
  
```bash  
git clone https://github.com/Vishal-k391/DQMS-Vishal.git  
cd DQMS-Vishal  
npm install
```
----------
## ▶️ Running the Server

```bash
node index.js
```
----------

# 🔍 Example API Flow

## Add User to Queue

POST /addToQueue  
{  
 "fullname_user": "Rahul",  
 "phone": "9876543210"  
}


----------

### User Checks Queue Status

POST /statusCheck  
{  
 "uniqueid": "a3f2",  
 "institutionName" : "institution_name",
 "department": "department_name"
}

----------

## 🎯 Use Cases

-   College administrative queues
-   Hospital patient queues
-   Government service centers
-   Any institution handling physical queues

----------

## ⚠️ Future Improvements

-   Frontend dashboard for admins
-   Real-time updates (WebSockets)
-   Token display screen
-   Multi-queue support

----------

## 👤 Author

-   Vishal K
-   GitHub: https://github.com/Vishal-k391

  
---
