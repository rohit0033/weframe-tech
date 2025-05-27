# WeframeTech Backend Hiring Task: Payload CMS with Multi-Tenancy & Form Builder

This project demonstrates the implementation of a robust backend system using Payload CMS, integrating with PostgreSQL (Supabase) for data storage, and implementing key features like a dynamic Form Builder and Multi-Tenancy. The application is deployed on Vercel.

## 🚀 Deployment

The application is deployed on Vercel's free tier.
**Deployed URL:** [https://weframe-tech-57kt.vercel.app/](https://weframe-tech-57kt.vercel.app/) 
**Admin Panel:** [https://weframe-tech-57kt.vercel.app/admin](https://weframe-tech-57kt.vercel.app/admin)

## 🗃️ Database Provider

**Supabase (PostgreSQL)** is used as the database provider.

* **Details:** Supabase offers a powerful and scalable PostgreSQL database, along with features like authentication and real-time capabilities. For this task, its PostgreSQL capabilities were leveraged to store Payload CMS data efficiently.
* **Connection:** The connection string is managed via the `DATABASE_URI` environment variable, configured securely in Vercel.

## ✨ Implemented Features

### 1. Form Builder

The official Payload CMS Form Builder plugin (`@payloadcms/plugin-form-builder`) was installed and configured to allow for the creation and management of dynamic forms directly from the Payload Admin Panel.

* **Setup Steps:**
    1.  Installed the plugin: `npm install @payloadcms/plugin-form-builder`
    2.  Integrated the plugin into `src/payload.config.ts` within the `plugins` array.
    3.  Configured the `fields` option to enable necessary input types (e.g., `text`, `textarea`, `email`, `message`) for form creation.
* **"Contact Us" Form:**
    * A "Contact Us" form was created in the Payload Admin Panel with the following fields:
        * **Full Name** (Text field)
        * **Email Address** (Email field)
        * **Message** (Textarea field)
    * This form is dynamically rendered and its submissions are stored in the `form-submissions` collection.

### 2. Multi-Tenancy

Multi-tenancy was implemented using the official Payload CMS Multi-Tenant plugin (`@payloadcms/plugin-multi-tenant`), ensuring data isolation between different tenants.

* **Setup Steps:**
    1.  Installed the plugin: `npm install @payloadcms/plugin-multi-tenant`
    2.  Integrated the plugin into `src/payload.config.ts` within the `plugins` array.
    3.  Defined a `tenants` collection in `src/payload.config.ts` with `name` and `slug` fields to manage different tenants.
    4.  Applied multi-tenancy to the `forms` and `form-submissions` collections within the plugin configuration:
        ```typescript
        multiTenantPlugin({
          collections: {
            forms: {}, // Multi-tenancy applied to Forms
            'form-submissions': {}, // Multi-tenancy applied to Form Submissions
          },
          // ... other optional configurations
        })
        ```
* **Data Isolation:**
    * Each tenant now has its own set of forms. For example, a form created under "Tenant A" will not be visible when "Tenant B" is selected in the admin panel.
    * Form submissions are also tied to the specific tenant under which they were submitted or associated, ensuring a tenant can only manage and view their own form data.
* **Admin Panel Functionality:**
    * A `Tenants` collection is available in the admin panel to create and manage tenant records.
    * A tenant selector dropdown appears in the top-right of the admin panel, allowing administrators to switch context and view data relevant to the selected tenant.
    * Admin users are assigned to specific tenants to control their data access.

## 🔌 API Endpoints

Payload CMS automatically generates REST and GraphQL APIs for all collections. The following REST endpoints were primarily used and tested for the form builder and multi-tenancy functionalities:

### 1. Form Fetch

* **Purpose:** To retrieve the schema/definition of a specific form by its ID or slug, allowing a frontend to dynamically render it.
* **Endpoint:** `GET /api/forms`
* **Example (Fetch by Slug for 'Contact Us' form):**
    ```
    GET [https://weframe-tech-57kt.vercel.app/api/forms?where](https://weframe-tech-57kt.vercel.app/api/forms?where)[slug][equals]=contact-us
    ```
* **Headers:**
    * `x-payload-tenant: [TENANT_ID]` (Required to fetch forms belonging to a specific tenant)
    * `Authorization: Bearer [ADMIN_TOKEN]` (If authenticated access is required for fetching forms, though forms can be public by default)
* **Usage:** A frontend application would typically fetch this form definition and then iterate over its `fields` array to render appropriate UI components.

### 2. Form Submission

* **Purpose:** To submit responses to a form.
* **Endpoint:** `POST /api/form-submissions`
* **Example:**
    ```bash
    curl --location '[https://weframe-tech-57kt.vercel.app/api/form-submissions](https://weframe-tech-57kt.vercel.app/api/form-submissions)' \
    --header 'Content-Type: application/json' \
    --header 'x-payload-tenant: YOUR_ACTUAL_TENANT_UUID' \
    --data-raw '{
      "form": "YOUR_CONTACT_US_FORM_UUID",
      "submissionData": [
        { "field": "fullName", "value": "Submitted Name" },
        { "field": "emailAddress", "value": "submit@example.com" },
        { "field": "message", "value": "This is a new submission via API." }
      ]
    }'
    ```

## 👨‍💻 Local Development Setup

To run this project locally:

1.  **Clone the repository:** `git clone [YOUR_REPO_URL] `
2.  **Navigate into the project directory:** `cd [YOUR_PROJECT_NAME]`
3.  **Install dependencies:** `npm install` (or `pnpm install` if you prefer pnpm)
4.  **Create a `.env` file:** Copy the content from `.env.example` (if provided) or manually create it:
    ```env
    DATABASE_URI="postgresql://postgres:[YOUR_LOCAL_DB_PASSWORD]@localhost:5432/postgres" # Or your Supabase local connection string
    PAYLOAD_SECRET="YOUR_LOCAL_RANDOM_PAYLOAD_SECRET"
    PAYLOAD_PUBLIC_SERVER_URL="http://localhost:3000"
    ```
5.  **Start the development server:** `npm run dev`
6.  **Access admin panel:** Open `http://localhost:3000/admin` in your browser.

---
