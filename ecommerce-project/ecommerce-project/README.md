# General Goods — Full-Stack E-commerce (Spring Boot + MySQL + HTML/CSS/JS)

See the chat response for the full step-by-step walkthrough. Quick reference:

1. Create the database in MySQL Workbench using `database/schema.sql`.
2. Open `backend/` in IntelliJ IDEA as a Maven project.
3. Set your MySQL password in `backend/src/main/resources/application.properties`.
4. Run `BackendApplication.java` (starts API on http://localhost:8080).
5. Open `frontend/index.html` (storefront) and `frontend/admin.html` (CRUD dashboard) in your browser,
   ideally via a local server like VS Code's "Live Server" extension.

## Project structure
```
ecommerce-project/
├── backend/                Spring Boot REST API (Maven)
│   └── src/main/java/com/ecommerce/backend/
│       ├── model/Product.java
│       ├── repository/ProductRepository.java
│       ├── service/ProductService.java
│       ├── controller/ProductController.java
│       └── config/WebConfig.java
├── frontend/                Plain HTML/CSS/JS client
│   ├── index.html            customer storefront + cart
│   ├── admin.html            CRUD dashboard
│   ├── css/style.css
│   └── js/ (api.js, store.js, admin.js)
└── database/
    └── schema.sql            MySQL table + sample data
```

## API endpoints
| Method | URL                              | Purpose               |
|--------|-----------------------------------|------------------------|
| GET    | /api/products                     | list all products      |
| GET    | /api/products/{id}                 | get one product        |
| GET    | /api/products/search?keyword=x    | search by name         |
| GET    | /api/products/category/{category} | filter by category     |
| POST   | /api/products                     | create a product       |
| PUT    | /api/products/{id}                 | update a product       |
| DELETE | /api/products/{id}                 | delete a product       |
