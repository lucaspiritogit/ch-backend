# Nest API

Documentacion de API en el entorno de desarrollo local

**El id debe ser un string ya que es de mongodb**

## Products

### Create new product

POST: http://localhost:3000/product
crea un nuevo producto

### Get all products

GET: http://localhost:3000/product
devuelve todos los productos

### Get product by id

GET: http://localhost:3000/product/${id}
devuelve un producto por id

### Delete product by id

DELETE: http://localhost:3000/product/${id}
elimina un producto por id, el id debe ser un string ya que es de mongodb

### Modify product by id

PUT: http://localhost:3000/product/${id}
Modifica un producto por id <br>
El body debe ser un json con los campos a modificar del producto, por ejemplo:

```json
{
  "title": "changed title",
  "price": 1000
}
```

## Cart

### Create new cart

POST: http://localhost:3000/cart

### Get all carts

GET: http://localhost:3000/cart

### Get cart by id

GET: http://localhost:3000/cart/${id}

### Delete cart by id

DELETE: http://localhost:3000/cart/${id}

### Add product to cart

PUT: http://localhost:3000/cart/${id} <br>
El body debe ser un json con el id del producto a agregar, por ejemplo:

```json
{
  "_id": "63c4982f9e98776e566a2ab7"
}
```

### Delete product from cart

PUT http://localhost:3000/cart/${cartId}/${productId}


