// Require the Twilio module and create a client
const dotenv = require("dotenv");
const twilio = require("twilio");
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
dotenv.config();
// Create a function to fetch student data from your API
async function getStudentData(studentId) {
  const apiUrl = `https://excited-seal-button.cyclic.app/whatsapp-webhook/`;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://excited-seal-button.cyclic.app/whatsapp-webhook",
    headers: {
      "Content-Type": "application/json",
    },
    data: { studentId },
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data.json();
    })
    .catch((error) => {
      console.log(error);
    });
}
async function sendWhatsAppMessage(body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  try {
    await client.messages.create({
      body: body,
      from: "whatsapp:+14155238886",
      to: req.body.From,
    });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.message);
  }
}
// Create the chatbot function to handle incoming messages
async function chatbot(req, res) {
  const twiml = new twilio.twiml.MessagingResponse();
  const userMessage = req.body.Body.toLowerCase().trim();

  if (userMessage.startsWith("studentid")) {
    const studentId = userMessage.split(" ")[1];
    const studentData = await getStudentData(studentId);

    if (studentData) {
      twiml.message(
        `Student ID: ${studentData.studentId}, Name: ${studentData.studentName}, Email: ${studentData.studentEmail}`
      );
      sendWhatsAppMessage(req.body.From, studentData);
    } else {
      twiml.message(`Student data not found for ID: ${studentId}`);
    }
  } else {
    twiml.message(
      'Invalid command. Please use "studenid 001" to get student data.'
    );
  }

  res.type("text/xml");
  res.send(twiml.toString());
}

module.exports = chatbot;
