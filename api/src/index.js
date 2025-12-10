import express from "express";

const app = express();

app.get("/", (req, res) => {
   res.send("it works");

   res.end();
});

app.listen(5000, () => console.log(`Server is running on http://localhost:5000`));
