class Contenedor {
    constructor(name) {
        this.name = name;
        this.productos = [];
        this.asignadorDeId = 0;
    }

    addItem(producto) {
        this.asignadorDeId++;
        producto.id = this.asignadorDeId;
        this.productos.push(producto);
    }

    getProducts() {
        return this.productos;
    }

    findProduct(id) {
        return this.productos.find((item) => {
            return item.id === id;
        });
    }

    updateProduct(id, producto) {
        producto.id = id;
        const index = this.productos.findIndex((item) => item.id === id);
        if (index !== -1) {
            this.productos.splice(index, 1, producto);
            return true;
        } else {
            return false;
        }
    }

    deleteProduct(id) {
        const index = this.productos.findIndex((item) => item.id === id);
        if (index !== -1) {
            this.productos.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Contenedor;