# 💸 SpendSantai

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.2-2D3748?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)

**Personal Finance Tracker with Modern "Liquid Glass" Design**

[Demo](#demo) • [Features](#features) • [Technology](#technology) • [Installation](#installation) • [Contributors](#contributors)

</div>

---

## 📖 About

**SpendSantai** is a personal finance management application designed to help users easily track their income, expenses, budgets, and financial goals. Built with a modern *Liquid Glass UI* interface that delivers a premium visual experience. The app is optimized for **Malaysian users** and uses **Malaysian Ringgit (MYR)** as the default currency.

---

## ✨ Features

### 🏦 Account Management
- Add various account types (Bank, Cash, E-Wallet)
- Monitor account balances in real-time
- Automatically update balances when transactions occur

### 💰 Transaction Recording
- Record income and expenses
- Categorize transactions (Food, Transport, Salary, PTPTN loan, TNB bill, etc.)
- Select account for each transaction
- Transaction history with search and filters

### 📊 Dashboard & Statistics
- Financial summary (Total Income, Expenses, Balance)
- Interactive charts (Daily, Weekly, Monthly, Yearly)
- Data visualization using Recharts

### 📋 Budgets
- Create budgets per category
- Monitor spending progress vs budget
- Notifications when approaching limits

### 🎯 Financial Goals
- Set savings targets
- Track progress towards goals
- Deadline for each goal

### 👤 User Profile
- Personalize name and profile picture
- Change password
- Account settings

---

## 🛠️ Technology

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.1 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4.0 |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma 6.2 |
| **Authentication** | NextAuth.js |
| **State Management** | Zustand |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts |

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Steps

1. **Clone repository**
   ```bash
   git clone https://github.com/BryanAlexanderSantoso/SpendSantai.git
   cd SpendSantai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root folder:
   ```env
   DATABASE_URL="postgresql://YOUR_SUPABASE_URL"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Sync database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

This application can be easily deployed to **Vercel**:

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BryanAlexanderSantoso/SpendSantai)

---

## 📱 Screenshots

<div align="center">
<i>Screenshots will be added soon.</i>
</div>

---

## 🗂️ Folder Structure

```
SpendSantai/
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static assets
├── src/
│   ├── actions/           # Server Actions (CRUD)
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   │   ├── dashboard/     # Dashboard components
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utilities & configurations
│   └── store/             # Zustand state management
├── .env                   # Environment variables
└── package.json
```

---

## 👨‍💻 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/BryanAlexanderSantoso">
        <img src="https://github.com/BryanAlexanderSantoso.png" width="100px;" alt="Bryan Alexander Santoso"/>
        <br />
        <sub><b>yunn</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ for Malaysia**

⭐ Don't forget to give a star if you like it! ⭐

</div>
