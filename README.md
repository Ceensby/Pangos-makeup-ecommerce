<h1>Pangos 💄 – Makeup E-Commerce </h1>

<p>
  <b>Pangos</b> is a makeup-focused e-commerce web application built as a course project.
  It demonstrates a full-stack structure with a <b>React</b> frontend (using <b>Material UI</b>),
  a <b>Spring Boot</b> backend (REST API), and a <b>PostgreSQL</b> database layer.
</p>



<hr />

<h2>✨ Key Features</h2>
<ul>
  <li><b>Product Listing</b> – Display products on the home page by fetching data from the backend API.</li>
  <li><b>Product Details</b> – View detailed information for each product (image, description, pricing, details).</li>
  <li><b>Search & Filtering</b> – Backend supports query-based search and category-based filtering.</li>
  <li><b>Cart Flow</b> – Add products to cart, view cart, and proceed to checkout.</li>
  <li><b>Order & Payment API</b> – Backend includes endpoints for order creation and payment processing.</li>
  <li><b>Modern UI</b> – Clean and responsive UI with Material UI components (Grid, Cards, Buttons, Typography, etc.).</li>
</ul>

<hr />

<h2>🧰 Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li><b>React 18</b></li>
  <li><b>Material UI (MUI)</b> + MUI Icons</li>
  <li><b>React Router</b> (client-side routing)</li>
  <li><b>Axios</b> (API requests)</li>
  <li><b>Context API</b> (global cart state management)</li>
</ul>

<h3>Backend</h3>
<ul>
  <li><b>Spring Boot</b> (REST API)</li>
  <li><b>Spring Data JPA</b></li>
  <li><b>PostgreSQL Driver</b></li>
  <li><b>Validation</b> (Bean Validation)</li>
  <li><b>Maven</b> (dependency management)</li>
</ul>

<h3>Database</h3>
<ul>
  <li><b>PostgreSQL</b> database connection</li>
  <li>DB-related assets are stored in the <code>database/</code> folder</li>
</ul>

<hr />

<h2>📁 Project Structure</h2>
<p>
  The repository is organized to match the expected course submission structure: a root project folder
  containing separate folders for frontend, backend, and database source files. :contentReference[oaicite:1]{index=1}
</p>

<pre><code>Pangos-Workspace/
├─ frontend/         (React + Material UI)
├─ backend/          (Spring Boot REST API)
└─ database/         (DB exports / notes)
</code></pre>

<hr />

<h2>🚀 Getting Started</h2>

<h3>Prerequisites</h3>
<ul>
  <li><b>Node.js</b> (recommended: LTS)</li>
  <li><b>npm</b></li>
  <li><b>Java 21</b> (backend uses Java 21)</li>
  <li><b>Maven</b> (usually included via IntelliJ Maven integration)</li>
  <li><b>PostgreSQL</b></li>
</ul>

<details>
  <summary><b>Recommended Ports</b></summary>
  <ul>
    <li><b>Frontend:</b> http://localhost:3000</li>
    <li><b>Backend:</b> http://localhost:8080</li>
  </ul>
</details>


<h2>🔌 API Endpoints (Backend)</h2>

<p>
  The backend provides REST endpoints for products, orders, and payments.
  Below is a quick reference:
</p>

<h3>Products</h3>
<ul>
  <li><code>GET /api/products</code> – list products</li>
  <li><code>GET /api/products/{id}</code> – get a product by id</li>
  <li><code>GET /api/products/top</code> – get featured products</li>
</ul>

<p><b>Supported query params (for filtering/search):</b></p>
<ul>
  <li><code>?q=keyword</code> – search by name/description</li>
  <li><code>?mainCategory=...</code> – filter by main category</li>
  <li><code>?subCategory=...</code> – filter by sub category</li>
</ul>

<h3>Orders</h3>
<ul>
  <li><code>POST /api/orders</code> – create an order</li>
  <li><code>GET /api/orders</code> – list all orders</li>
  <li><code>GET /api/orders/{id}</code> – get order by id</li>
</ul>

<h3>Payments</h3>
<ul>
  <li><code>POST /api/payments</code> – process a payment request</li>
  <li><code>GET /api/payments/order/{orderId}</code> – get payment info by order id</li>
</ul>

<hr />

<h2>🧭 Frontend Pages (Routes)</h2>
<p>
  The frontend uses client-side routing to navigate between pages:
</p>

<ul>
  <li><b>Home / Product List</b> – product listing and quick actions</li>
  <li><b>Product Detail</b> – full product detail view</li>
  <li><b>Cart</b> – cart items and totals</li>
  <li><b>Checkout</b> – final review before purchase</li>
</ul>

<hr />

<h2>🗄️ Database Folder Notes</h2>
<p>
  The repository includes database-related documents under <code>database/</code> such as:
</p>
<ul>
  <li><code>ProductsTable.csv</code></li>
  <li><code>ProductsInfos.xlsx</code></li>
  <li><code>CategoriesInfos.docx</code></li>
</ul>

<p>
  These files can be used as a reference for product/category data and for preparing final SQL exports if required.
</p>

<hr />

<h2>🧪 Troubleshooting</h2>

<h3>1) Frontend cannot fetch products</h3>
<ul>
  <li>Make sure the backend is running on <code>http://localhost:8080</code>.</li>
  <li>Check CORS settings in Spring Boot if your frontend runs on a different port.</li>
  <li>Verify the API URL used in frontend services/pages points to the correct backend base URL.</li>
</ul>

<h3>2) PostgreSQL connection issues</h3>
<ul>
  <li>Check username/password and database name in <code>application.properties</code>.</li>
  <li>Confirm PostgreSQL service is running.</li>
  <li>Make sure the DB exists before running the backend.</li>
</ul>

<h3>3) Images not showing</h3>
<ul>
  <li>Confirm image URLs are correct.</li>
  <li>If backend serves static images, ensure they exist under <code>backend/src/main/resources/static/</code>.</li>
</ul>

<hr />

<h2>🛣️ Future Improvements</h2>
<ul>
  <li>User authentication (login/register)</li>
  <li>Real payment provider integration</li>
  <li>Product reviews & ratings</li>
  <li>Advanced filters (price range, brand, tags)</li>
  <li>Admin panel for adding/editing products</li>
</ul>

<hr />

<h2>👩‍💻 Author</h2>
<ul>
  <li><b>Name:</b> Cansu Bektaş</li>
  <li><b>Course:</b> Web Design and Programming</li>
</ul>

<hr />

<p>
  <i>If you are an instructor/reviewer:</i><br />
  This project was created to demonstrate the required technologies (React, Material UI, Spring Boot)
  and a basic e-commerce flow with backend integration. :contentReference[oaicite:2]{index=2}
</p>
