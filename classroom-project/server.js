const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

const DATA_FILE = path.join(
    __dirname,
    "classroom.json"
);


// ============================================
// MIDDLEWARE
// ============================================

app.use(
    express.json()
);

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


// ============================================
// DEFAULT DATA
// ============================================

const defaultData = {

    className: "Kelas 6A",

    rows: 4,

    columns: 6,

    seats: [

        {
            id: 1,
            row: 1,
            column: 1,
            name: "Hendra",
            status: "assigned"
        },

        {
            id: 2,
            row: 1,
            column: 2,
            name: "Rinto",
            status: "assigned"
        },

        {
            id: 3,
            row: 1,
            column: 3,
            name: "Lidyawati",
            status: "assigned"
        },

        {
            id: 4,
            row: 1,
            column: 4,
            name: "Widyarti",
            status: "assigned"
        },

        {
            id: 5,
            row: 1,
            column: 5,
            name: "",
            status: "empty"
        },

        {
            id: 6,
            row: 1,
            column: 6,
            name: "",
            status: "empty"
        }

    ]

};


// ============================================
// CREATE EMPTY SEATS
// ============================================

function createSeats(
    rows,
    columns
) {

    const seats = [];

    let id = 1;

    for (
        let row = 1;
        row <= rows;
        row++
    ) {

        for (
            let column = 1;
            column <= columns;
            column++
        ) {

            seats.push({

                id: id,

                row: row,

                column: column,

                name: "",

                status: "empty"

            });

            id++;

        }

    }

    return seats;

}


// ============================================
// ENSURE JSON FILE EXISTS
// ============================================

function ensureDataFile() {

    if (
        !fs.existsSync(
            DATA_FILE
        )
    ) {

        const data = {

            className:
                "Kelas 6A",

            rows: 4,

            columns: 6,

            seats:
                createSeats(
                    4,
                    6
                )

        };


        fs.writeFileSync(

            DATA_FILE,

            JSON.stringify(
                data,
                null,
                4
            ),

            "utf8"

        );

    }

}


// ============================================
// READ JSON
// ============================================

function readData() {

    ensureDataFile();

    try {

        const text =
            fs.readFileSync(
                DATA_FILE,
                "utf8"
            );


        return JSON.parse(
            text
        );

    }

    catch(error) {

        console.error(
            "Gagal membaca classroom.json:",
            error
        );


        return {

            className:
                "Kelas 6A",

            rows: 4,

            columns: 6,

            seats:
                createSeats(
                    4,
                    6
                )

        };

    }

}


// ============================================
// WRITE JSON
// ============================================

function writeData(
    data
) {

    fs.writeFileSync(

        DATA_FILE,

        JSON.stringify(
            data,
            null,
            4
        ),

        "utf8"

    );

}


// ============================================
// GET CLASSROOM
// ============================================

app.get(
    "/api/classroom",
    (req, res) => {

        const data =
            readData();


        res.json(
            data
        );

    }
);


// ============================================
// SAVE CLASSROOM
// ============================================

app.post(
    "/api/classroom",
    (req, res) => {

        try {

            const data =
                req.body;


            if (
                !data ||
                !Array.isArray(
                    data.seats
                )
            ) {

                return res.status(
                    400
                ).json({

                    success: false,

                    message:
                        "Format data tidak valid."

                });

            }


            writeData(
                data
            );


            res.json({

                success: true,

                message:
                    "Data berhasil disimpan.",

                data:
                    data

            });

        }

        catch(error) {

            console.error(
                error
            );


            res.status(
                500
            ).json({

                success: false,

                message:
                    "Gagal menyimpan data."

            });

        }

    }
);


// ============================================
// RESET CLASSROOM
// ============================================

app.post(
    "/api/reset",
    (req, res) => {

        const rows =
            Number(
                req.body.rows
            ) || 4;


        const columns =
            Number(
                req.body.columns
            ) || 6;


        const data = {

            className:
                req.body.className ||
                "Kelas 6A",

            rows: rows,

            columns: columns,

            seats:
                createSeats(
                    rows,
                    columns
                )

        };


        writeData(
            data
        );


        res.json({

            success: true,

            data:
                data

        });

    }
);


// ============================================
// START SERVER
// ============================================

ensureDataFile();


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            ""
        );

        console.log(
            "================================"
        );

        console.log(
            " CLASSROOM SEATING CHART"
        );

        console.log(
            "================================"
        );

        console.log(
            `Server berjalan di port ${PORT}`
        );

        console.log(
            `http://localhost:${PORT}`
        );

        console.log(
            "================================"
        );

    }
);