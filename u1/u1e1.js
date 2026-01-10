// T5. Técnicas para mejorar la estructura y robustez de código
// U1. Gestión de errores y excepciones
// Enunciado disponible en u1e1.md / Enunciat disponible a u1e1.md

//Escribe aquí tu solución / escriviu aquí la vostra solució:

export class InventoryManager {
    // Propiedad privada para la lista de productos
    #productList = [];

    constructor() {
        this.#productList = [];
    }

    // Devuelve la cantidad de productos actuales en el inventario.
    nProducts() {
        return this.#productList.length;
    }

    // Inicializa el inventario con una lista de productos.
    init(products) {
        const errors = [];

        products.forEach(product => {
            const result = this.addProduct(product);
            if (!result.status) {
                errors.push(result.message);
            }
        });

        // Si no hay errores devolvemos true, si hay, devolvemos el array de errores
        return errors.length === 0 ? true : errors;
    }

    // Valida si un producto cumple con todas las reglas de negocio.
    validateProduct(product) {
        // 1. Validación de Tipos y Datos vacíos
        // code, discount, amount: Enteros no negativos
        // name: String no vacío
        // price: Flotante positivo
        const isCodeValid = Number.isInteger(product.code) && product.code >= 0;
        const isDiscountTypeValid = Number.isInteger(product.discount) && product.discount >= 0;
        const isAmountTypeValid = Number.isInteger(product.amount); // Validamos rango numérico específico más abajo
        const isNameValid = typeof product.name === 'string' && product.name.trim().length > 0;
        
        // Validación de precio: Número positivo y máximo 2 decimales
        // Truco para decimales: multiplicar por 100 y ver si es entero para saber si tiene más de 2 decimales
        const isPriceValid = typeof product.price === 'number' && product.price > 0 && (Math.round(product.price * 100) / 100 === product.price);

        if (!isCodeValid || !isDiscountTypeValid || !isAmountTypeValid || !isNameValid || !isPriceValid) {
            // Usamos product.code si existe, si no "unknown" para evitar undefined en el mensaje
            const codeRef = product.code !== undefined ? product.code : 'unknown';
            throw new Error(`ERROR_DATA. Alguno de los datos del producto (${codeRef}) no tiene un formato válido.`);
        }

        // 2. Validación: Código único
        if (this.#productList.some(p => p.code === product.code)) {
            throw new Error(`INVENTORY_CODE. Ya existe otro producto con ese código (${product.code}).`);
        }

        // 3. Validación: Nombre único
        if (this.#productList.some(p => p.name === product.name)) {
            throw new Error(`INVENTORY_NAME. El nombre del producto (${product.code}) ya existe.`);
        }

        // 4. Validación: Precio inferior a 50
        if (product.price < 50) {
            throw new Error(`INVENTORY_PRICE. El precio del producto (${product.code}) no puede ser inferior a 50.`);
        }

        // 5. Validación: Descuento entre 0 y 10
        if (product.discount < 0 || product.discount > 10) {
            throw new Error(`INVENTORY_DISCOUNT. El descuento del producto (${product.code}) debe estar entre 0 y 10.`);
        }

        // 6. Validación: Cantidad negativa
        // NOTA: El enunciado tiene una errata (dice "inferior a 10" en un bloque y "negativa" en otro).
        // Nos guiamos por la regla lógica "No puede tener una cantidad negativa" y el ejemplo final.
        if (product.amount < 0) {
            throw new Error(`INVENTORY_AMOUNT. La cantidad de producto (${product.code}) no puede ser negativa.`);
        }

        return true;
    }

    // Intenta añadir un producto al inventario gestionando los errores.
    addProduct(product) {
        const response = {
            status: false,
            message: ''
        };

        try {
            // Intentamos validar. Si falla, validateProduct lanzará un throw que nos enviará al catch
            this.validateProduct(product);
            
            // Si pasa la validación, lo añadimos
            this.#productList.push(product);
            
            // Preparamos mensaje de éxito (se sobrescribirá en el finally si no hay error, 
            // pero lógica de éxito va aquí para mantener el flujo limpio)
            response.status = true;
            response.message = `INVENTORY_ADD. El producto (${product.code}) ha sido añadido con éxito al inventario.`;

        } catch (error) {
            // Capturamos el error lanzado por validateProduct
            response.status = false;
            response.message = error.message;
        } finally {
            // El bloque finally se ejecuta siempre. Retornamos la respuesta construida.
            return response;
        }
    }
}