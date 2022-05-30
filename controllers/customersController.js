import connection from "./../database.js";

export async function getAllCustomers(req, res) {
    try {
        const customers = await connection.query("SELECT * FROM customers");

        if(req.query.cpf) {
            const filteredCustomers = customers.rows.filter(customer => {
                const regex = new RegExp("^" + req.query.cpf);
                return regex.test(customer.cpf);
            });
            res.send(filteredCustomers);
        }
        else {
            res.send(customers.rows);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Error recovering customers!");
    }
}

export async function getCustomer(req, res) {
    try {
        const customers = await connection.query("SELECT * FROM customers");

        const customer = customers.rows.find(element => element.id === parseInt(req.params.id));
        if(customer) {
            res.send(customer);
        }
        else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Error recovering customer!");
    }
}

export async function addCustomer(req, res) {
    try {
        const existingCustomer = await connection.query("SELECT * FROM customers WHERE cpf = $1", [req.body.cpf]);
        if(existingCustomer.rowCount > 0) return res.sendStatus(409);

        await connection.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)", [req.body.name, req.body.phone, req.body.cpf, req.body.birthday]);

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Error adding customer!");
    }
}

export async function updateCustomer(req, res) {
    try {        
        const customers = await connection.query("SELECT * FROM customers");

        const customer = customers.rows.find(element => element.id === parseInt(req.params.id));
        if(customer) {
            const existingCustomer = await connection.query("SELECT * FROM customers WHERE cpf = $1", [req.body.cpf]);
            if(existingCustomer.rowCount > 0) return res.sendStatus(409);

            await connection.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5", [req.body.name, req.body.phone, req.body.cpf, req.body.birthday, customer.id]);
            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Error updating customer!");
    }
}