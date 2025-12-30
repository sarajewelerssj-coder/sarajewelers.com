# 💎 Sara Jewelers - Premium E-Commerce & Admin Suite

Welcome to the official repository of **Sara Jewelers**, a state-of-the-art e-commerce platform designed for luxury jewelry and timepieces. This application provides a seamless shopping experience for customers and a powerful, data-driven dashboard for administrators.

---

## 🚀 Vision

To provide a premium digital experience that matches the elegance of high-end jewelry, combining cutting-edge technology with sophisticated design.

---

## ✨ Key Features

### 🛍️ Premium Customer Experience

- **Elegant UI/UX**: Built with high-end aesthetics, smooth GSAP animations, and a responsive layout.
- **Dynamic Catalog**: Browse by collections and categories with advanced filtering.
- **Smart Wishlist**: Save favorite pieces for later and manage your luxury desires.
- **Account Security**: Profile management with secure verification.

### 💳 Sophisticated Checkout Flow

- **Multi-Step Checkout**: Optimized for conversion with profile auto-fill.
- **Global Shipping Logic**: Automated shipping fee calculation based on store settings and order value (Free shipping thresholds).
- **Secure Payments**: Bank transfer integration with **mandatory transaction screenshot verification** for business security.

### 🔑 Advanced Authentication

- **Dual-Method Auth**: Supports both Google OAuth 2.0 and traditional Email/Password credentials.
- **OTP Verification**: Secure 6-digit email OTP for new user registrations.
- **Professional Outreach**: Automated beautifully branded emails for welcomes, verifications, and orders.

### 🛠️ Powerful Admin Dashboard

- **Inventory Engine**: Manage products, stock levels, discounts, and inventory statuses (Active/Draft) with ease.
- **Order Command Center**: Track order fulfillment, verify payment receipts, and update customer status.
- **Marketing Suite**:
  - Professional HTML Email Template Editor.
  - Bulk Email Campaigns with **Anti-Spam Technology** (sequential sending with 3s delays).
  - Protected System Templates (Welcome, Order, OTP).
- **Customer Insights**: Deep dive into customer order history and community reviews.

### 🤖 AI-Powered Intelligence (New)

- **Admin AI Strategist**: A sophisticated business consultant integrated into the dashboard.
  - **Real-Time Data**: Analysis of sales, revenue trends, inventory levels, and order statuses.
  - **Deep Customer Insights**: Access to VIP lists (Top Spenders), recent signups, and extensive customer data.
  - **Smart Controls**: Resizable chat window with "Stop Generation" capabilities.
- **"Sara" Customer Assistant**: A luxury sales persona helping customers navigate collections and find their perfect piece.
- **Marketing Auto-Write**: One-click AI generation for email campaigns, automatically creating:
  - High-converting Subject Lines.
  - Organized Internal Template Names.
  - Beautiful, responsive HTML email bodies.

---

## 🛠️ Technology Stack

| Layer        | Technology                               |
| :----------- | :--------------------------------------- |
| **Frontend** | Next.js 16, React 19, Tailwind CSS, GSAP |
| **Backend**  | Next.js API Routes (Serverless)          |
| **Database** | MongoDB with Mongoose ODM                |
| **Auth**     | NextAuth.js                              |
| **AI / LLM** | Groq SDK (Llama 3.3 70B Versatile)       |
| **Media**    | Cloudinary (Image/Video Hosting)         |
| **Emails**   | Nodemailer (Gmail SMTP Integration)      |
| **Language** | TypeScript                               |

---

## ⚙️ Project Setup

### 1. Prerequisites

- Node.js 18+
- MongoDB Instance (Atlas or Local)
- Google Cloud Project (for OAuth)
- Gmail App Password (for Email Sending)
- Cloudinary Account (for Media)

### 2. Environment Configuration

Create a `.env.local` file in the root directory and populate it with the following:

```env
# --- SERVER ---
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# --- AUTH ---
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# --- MEDIA ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# --- EMAIL (SMTP) ---
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# --- ADMIN ---
DEFAULT_ADMIN_NAME=Sara Jewelers Admin
NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL=admin@sarajewelers.com
DEFAULT_ADMIN_PASSWORD=your_secure_password
# --- SETUP & SEEDING ---
SETUP_TOKEN=your_secure_random_token_here
```

### 3. Installation

```bash
# Clone the repository
git clone https://github.com/AliHamza-Coder/SaraJewelers.com.git

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# One-Time Database Setup (Run after first deployment)
# Visit: https://your-domain.com/api/setup/db?token=your_secure_random_token_here
```

---

## 🛡️ Security Best Practices

- **Strict Validations**: Backend schema validation for all inputs.
- **Auth Protection**: Secure server-side session checks for all admin endpoints.
- **Spam Prevention**: Mandatory delays in bulk messaging to protect domain reputation.
- **Encrypted Storage**: Bcrypt hashing for all sensitive credentials.

---

## 👨‍💻 Developed By

**Ali Hamza** - [GitHub](https://github.com/AliHamza-Coder)

---

_© 2025 Sara Jewelers. All Rights Reserved._
