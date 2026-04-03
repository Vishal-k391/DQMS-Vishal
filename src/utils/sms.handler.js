import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createMessage(toPhone, institutionName , department) {
 
  try {
    const message = await client.messages.create({
    body: `Your up next in the queue , report ASAP . From ${department} , ${institutionName} `,
    from: `+${process.env.FROM_PHONENUMBER}`,
    to: `+91${toPhone}`,
  });
  return (message?.body);
  } catch (error) {
    return null
  }
}

export {createMessage}