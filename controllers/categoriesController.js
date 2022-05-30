import connection from "./../database.js";

export async function getAllCategories(req, res) {
    try {
        const categories = await connection.query("SELECT * FROM categories");
        res.send(categories.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send("Error recovering categories!");
    }
}

export async function addCategory(req, res) {
    try {
        const existingCategory = await connection.query("SELECT * FROM categories WHERE name = $1", [req.body.name]);
        if(existingCategory.rowCount > 0) return res.sendStatus(409);

        await connection.query("INSERT INTO categories (name) VALUES ($1)", [req.body.name]);

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Error while adding category!");
    }
}