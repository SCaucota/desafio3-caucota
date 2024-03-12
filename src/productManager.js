const fs = require("fs").promises;

class ProductManager {
    static idProduct = 0;
    constructor() {
        this.path = "./src/books.json";
        this.products = [];
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        try {
            if (!title ||
                !description ||
                !price ||
                !thumbnail ||
                !code ||
                stock === undefined
            ) {
                console.error("Todos los campos del producto son obligatorios");
                return;
            }

            if (this.products.some(prod => prod.code === code)) {
                console.error(`El código (code) del producto ${title} ya está en uso`);
                return;
            }

            ProductManager.idProduct++

            this.products.push({
                id: ProductManager.idProduct,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            });

            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))
        } catch (error) {
            console.log("Error al agregar el producto", error);
        }
    }

    getProducts = async () => {
        try {
            const allProducts = await fs.readFile(this.path, "utf-8");
            const parsedProducts = JSON.parse(allProducts);

            if (parsedProducts.length === 0) {
                console.log("No hay productos disponibles.");
            } else {
                return parsedProducts;
            }
        } catch {
            return this.products;
        }
    }

    getProductById = async (id) => {
        try {
            const allProducts = await fs.readFile(this.path, "utf-8");

            const book = (JSON.parse(allProducts)).find(product => product.id === id);

            if (!book) {
                console.error(`El producto de id "${id}" no existe`);
                return;
            }

            return book;
        } catch (error) {
            console.log("No se pudo enconrar el producto requerido", error);
        }
    }

    updateProduct = async (id, field, newValue) => {
        const allProducts = await fs.readFile(this.path, "utf-8");

        const products = JSON.parse(allProducts);

        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            console.error(`El producto de id "${id}" no existe`);
            return;
        }

        products[productIndex][field] = newValue;

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        console.log(`Producto actualizado: ${field} = ${newValue}`);
    }

    deleteProduct = async (id) => {
        const allProducts = await fs.readFile(this.path, "utf-8");

        const products = JSON.parse(allProducts);

        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            products.splice(productIndex, 1);

            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log(`El producto de id "${id}" ha sido eliminado`);
        } else {
            console.log(`El producto de id "${id}" no existe`);
        }
    }
}

module.exports = ProductManager;

const book = new ProductManager();

book.addProduct("Bajo la misma estrella", "Romance", 8999, "Sin imagen", "abc1", 25);
book.addProduct("Harry Potter y la piedra filosofal", "Fantasía", 22000, "Sin imagen 2", "abc12", 30);
book.addProduct("El hobbit", "Fantasía y Aventura", 10500, "Sin imagen 3", "abc123", 15);
book.addProduct("Cinder", "Fantasía y Romance", 18500, "Sin imagen 4", "abc1234", 40);
book.addProduct("Yo antes de ti", "Romance", 12000, "Sin imagen 5", "abc12345", 20);
book.addProduct("Los devoradores de libros", "Suspenso", 1350, "Sin imagen 6", "abc123456", 20);
book.addProduct("El príncipe", "Suspenso", 10000, "Sin imagen 7", "abc1234567", 10);
book.addProduct("¿Quién mató a Alex?", "Misterio y Romance", 20000, "Sin Imagen 8", "abc12345678", 33);
book.addProduct("Veronika decide morir", "Historias de vida", 11000, "Sin imagen 9", "abc123456789", 12);
book.addProduct("La chica del tren", "Misterio", 22000, "Sin Imagen 10", "abc10", 50);

/* book.getProducts();

book.getProductById(2);
book.getProductById(9);

book.updateProduct(1, "title", "María Sofía Caucota");

book.deleteProduct(9);
book.deleteProduct(3); */