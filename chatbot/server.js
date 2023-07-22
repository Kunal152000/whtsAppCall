const express = require("express");
const bodyParser = require("body-parser");
const chatbot = require("./chatbot");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.post("/whatsapp-webhook", chatbot);
                                                                                                    
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
