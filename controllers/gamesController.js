import connection from "./../database.js";

export async function getAllGames(req, res) {
    try {
        const games = await connection.query("SELECT * FROM games");
        const categories = await connection.query("SELECT * FROM categories");

        if(req.query.name) {
            const filteredGames = games.rows.filter(game => {
                const regex = new RegExp("^" + req.query.name, 'i');
                return regex.test(game.name);
            });
            res.send(filteredGames.map(game => {
                const categoryObj = categories.rows.find(element => game.categoryId === element.id);
                return {...game, categoryName: categoryObj.name};
            }))
        }
        else {
            res.send(games.rows.map(game => {
                const categoryObj = categories.rows.find(element => game.categoryId === element.id);
                return {...game, categoryName: categoryObj.name};
            }))
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Error recovering games!");
    }
}

export async function addGame(req, res) {
    try {
        const validCategoryId = await connection.query("SELECT * FROM categories WHERE id = $1", [req.body.categoryId]);
        if(validCategoryId.rowCount === 0) return res.sendStatus(400);

        const existingGame = await connection.query("SELECT * FROM games WHERE name = $1", [req.body.name]);
        if(existingGame.rowCount > 0) return res.sendStatus(409);

        await connection.query("INSERT INTO games (name, image, \"stockTotal\", \"categoryId\", \"pricePerDay\") VALUES ($1, $2, $3, $4, $5)", [req.body.name, req.body.image, req.body.stockTotal, req.body.categoryId, req.body.pricePerDay]);

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Error adding game!");
    }
}