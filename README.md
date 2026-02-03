# Goat Meat Store

A premium e-commerce platform dedicated to delivering fresh, high-quality goat meat products directly to customers. Built with modern web technologies to ensure a seamless shopping experience and robust administrative control.

## 🚀 Usage

### Prerequisites

- Node.js 18+ installed

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/meat-store.git
    cd meat-store
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  Run the development server:

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand (Cart)
- **Notifications**: Sonner

## ✨ Features

### 🛍 User Storefront

- **Product Browsing**: View products in a responsive grid layout.
- **Product Details**: Detailed product views with images, descriptions, and pricing per unit/kg.
- **Shopping Cart**: Real-time cart management with local storage persistence.
- **Checkout FLow**: Streamlined checkout process (Success/Failure handling).
- **Mobile Responsive**: optimized for mobile, tablet, and desktop devices.
- **Order Tracking**: Track order status via ID.

### 🔐 Admin Dashboard

Access via `/admin` (Authentication required in production).

- **Dashboard Overview**: visual charts and stats for Revenue, Orders, and Customer Growth.
- **Order Management**:
  - View all orders with status badges.
  - Detailed timeline view of order progress.
  * **Refined Terminology**: Uses "Booking ID" for clarity.
- **Customer Management**:
  - Rich customer profiles with spending history.
  - Avatar generation and activity tracking.
- **Product Management**:
  - Create, Edit, and Delete products.
  - Image upload handling.
- **Settings**:
  - Configure store details (Name, Currency, Timezone).
  - Manage notification preferences.
  - Theme settings.

## 📱 Mobile Responsiveness

The application is fully responsive. Key mobile optimizations include:

- **Adaptive Grids**: Product grids scale from 1 column (mobile) to 4 columns (desktop).
- **Smart Navigation**: Auto-closing mobile menus and sidebars.
- **Touch-Friendly**: Larger touch targets for buttons and interactions.
- **Efficient Layouts**: Stacked forms and tables with horizontal scrolling to prevent layout breakage.

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── admin/              # Admin dashboard routes
│   │   ├── (dashboard)/    # Protected admin pages
│   │   └── ...
│   ├── checkout/           # Checkout flow
│   ├── products/           # Product browsing
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── ui/                 # Reusable UI components (Shadcn)
│   └── ...
├── lib/                    # Utilities and API functions
├── store/                  # State management (Zustand)
└── types/                  # TypeScript definitions
```

## 📄 License

This project is licensed under the MIT License.
