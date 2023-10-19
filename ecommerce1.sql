CREATE TABLE orders (
  id serial PRIMARY KEY,
  status varchar(50) NOT NULL,
  total_amount numeric(10, 2) NOT NULL,
  customer_id integer NOT NULL REFERENCES customers(id),
  order_date timestamp NOT NULL
);

CREATE TABLE orders_products (
  order_id integer REFERENCES orders(id),
  product_id integer NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  PRIMARY KEY(order_id, product_id)
);

CREATE TABLE customers (
  customer_id serial PRIMARY KEY,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  created_at timestamp NOT NULL 
);


CREATE TABLE products (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL,
  category_id integer NOT NULL REFERENCES categories(id),
  description text NOT NULL,
  price numeric(10, 2) NOT NULL
);

CREATE TABLE categories (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL
);

CREATE TABLE cart (
  cart_id serial PRIMARY KEY,  
  customer_id integer NOT NULL REFERENCES customers(id),  
  product_id integer NOT NULL REFERENCES  products(id),
  quantity integer NOT NULL,    
  created_at timestamp NOT NULL 
);


