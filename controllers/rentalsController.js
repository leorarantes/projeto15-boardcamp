import connection from "./../database.js";
import dayjs from "dayjs";

// date
let year = dayjs().year();
year < 10 ? year = "0" + year : year = year.toString();
let month = dayjs().month();
month < 10 ? month = "0" + month : month = month.toString();
let day = dayjs().day();
day < 10 ? day = "0" + day : day = day.toString();
const date = year + '-' + month + '-' + day;

export async function getAllRentals(req, res) {
    const rentals = await connection.query(
    `SELECT rentals.*, customers.name as cname, games.name as gname, games.\"categoryId\", categories.name as catName
    FROM rentals
    JOIN customers ON rentals.\"customerId\"=customers.id
    JOIN games ON rentals.\"gameId\"=games.id
    JOIN categories ON games.\"categoryId\"=categories.id`
    );

    function generateRentalsArray(filteredRentals) {
        const arrayAux = filteredRentals.map(rental => {
            const {id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, cname, gname, categoryId, catName} = rental;
            return {
                id,
                customerId,
                gameId,
                rentDate,
                daysRented,
                returnDate,
                originalPrice,
                delayFee,
                customer: {
                    id: customerId,
                    name: cname
                },
                game: {
                    id: gameId,
                    name: gname,
                    categoryId,
                    categoryName: catName
                }
            };
        });
        return arrayAux;
    };

    try {
        if(req.query.customerId && req.query.gameId) {
            const filteredRentals = rentals.rows.filter(rental => {
                return (rental.customerId === parseInt(req.query.customerId) && rental.gameId === parseInt(req.query.gameId));
            });
            
            const rentalsArray = generateRentalsArray(filteredRentals);
            res.send(rentalsArray);
        }
        else if(req.query.customerId) {
            const filteredRentals = rentals.rows.filter(rental => {
                return (rental.customerId === parseInt(req.query.customerId));
            });

            const rentalsArray = generateRentalsArray(filteredRentals);
            res.send(rentalsArray);
        }
        else if(req.query.gameId) {
            const filteredRentals = rentals.rows.filter(rental => {
                return (rental.gameId === parseInt(req.query.gameId));
            });

            const rentalsArray = generateRentalsArray(filteredRentals);
            res.send(rentalsArray);
        }
        else {
            const rentalsArray = generateRentalsArray(rentals.rows);
            res.send(rentalsArray);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Error recovering rentals!");
    }
}

export async function addRental(req, res) {
    try {
        const customers = await connection.query("SELECT * FROM rentals WHERE customerId = $1", [req.body.customerId]);
        if(customers.rowCount === 0) return res.sendStatus(400);
        const games = await connection.query("SELECT * FROM rentals WHERE gameId = $1", [req.body.gameId]);
        if(games.rowCount === 0) return res.sendStatus(400);
        let gamesRented = 0;
        games.rows.forEach(() => {
            gamesRented++;
        });
        const game = await connection.query("SELECT * FROM games where id = $1", [req.body.gameId]);
        if(game.rows[0].stockTotal < (gamesRented + 1)) return res.sendStatus(400);

        const rentDate = date;
        const originalPrice = game.rows[0].pricePerDay * req.body.daysRented;

        await connection.query("INSERT INTO rentals (customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee) VALUES ($1, $2, $3, $4, null, $5, null)", [req.body.customerId, req.body.gameId, rentDate, req.body.daysRented, originalPrice]);

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Error adding rental!");
    }
}

export async function finishRental(req, res) {
    try {        
        const rental = await connection.query("SELECT * FROM rentals WHERE id = $1", [req.params.id]);
        if(rental.rowCount === 0) return res.sendStatus(404);
        if(rental.rows[0].returnDate !== null) return res.sendStatus(400);

        const rentDate = rental.rows[0].rentDate.toString();
        const returnDelay = parseInt(date.slice(8, 10)) - (parseInt(rentDate.slice(8, 10)) + rental.rows[0].daysRented);
        const price = rental.rows[0].originalPrice / rental.rows[0].daysRented;
        const delayFee = returnDelay > 0 ? price * returnDelay : 0;

        await connection.query("UPDATE rentals SET \"returnDate\"=$1, \"delayFee\"=$2 WHERE id = $3", [date, delayFee, req.params.id]);
        
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(500).send("Error finishing rental!");
    }
}

export async function deleteRental(req, res) {
    try {        
        const rental = await connection.query("SELECT * FROM rentals WHERE id = $1", [req.params.id]);
        if(rental.rowCount === 0) return res.sendStatus(404);
        if(rental.rows[0].returnDate !== null) return res.sendStatus(400);

        await connection.query("DELETE FROM rentals WHERE id = $1", [req.params.id]);
        
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(500).send("Error deleting rental!");
    }
}