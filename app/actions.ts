'use client'

// Define the type for the RSVP data
type RSVPData = {
  name: string;
  drink: "beer" | "whiskey" | "rum" | "vodka";
};

// Function to submit RSVP to JSON Bin
export async function submitRSVPP(data: RSVPData) {
  try {
    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
      }
    };

    req.open("PUT", "https://api.jsonbin.io/v3/b/67dc64978a456b796679a347", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", "$2a$10$Gpu5Y3/yOMEmBjwufBtQY.73WTJIesbK/u5DT3.LtB.rDaCSxzHHi");

    const payload = JSON.stringify({
      name: data.name,
      drink: data.drink,
      timestamp: new Date().toISOString(), // Add timestamp
    });

    req.send(payload);

    return { success: true };
  } catch (error) {
    console.error("Error submitting RSVP to JSON Bin:", error);
    throw new Error("Failed to submit RSVP");
  }
}

// Function to read and update RSVP data in JSON Bin
export async function submitRSVP(data: RSVPData) {
  try {
    const req = new XMLHttpRequest();

    // First, get the existing data
    req.onreadystatechange = () => {
      console.log(req?.responseText, 'req.responseText');
      if (req.readyState == XMLHttpRequest.DONE) {
        // @ts-ignore
        const existingData = JSON.parse(req.responseText)?.record;
        console.log(existingData, 'existingData');
        // Add new data with the user's name as the key
        existingData[data.name] = {
          drink: data.drink,
          timestamp: new Date().toISOString(), // Add timestamp
        };

        // Now, update the JSON Bin with the new data
        const updateReq = new XMLHttpRequest();
        updateReq.open("PUT", "https://api.jsonbin.io/v3/b/67dc64978a456b796679a347", true);
        updateReq.setRequestHeader("Content-Type", "application/json");
        updateReq.setRequestHeader("X-Master-Key", "$2a$10$Gpu5Y3/yOMEmBjwufBtQY.73WTJIesbK/u5DT3.LtB.rDaCSxzHHi");

        updateReq.onreadystatechange = () => {
          if (updateReq.readyState == XMLHttpRequest.DONE) {
            console.log(updateReq.responseText);
          }
        };

        updateReq.send(JSON.stringify(existingData));
      }
    };

    req.open("GET", "https://api.jsonbin.io/v3/b/67dc64978a456b796679a347/latest", true);
    req.setRequestHeader("X-Master-Key", "$2a$10$Gpu5Y3/yOMEmBjwufBtQY.73WTJIesbK/u5DT3.LtB.rDaCSxzHHi");
    req.send();

    return { success: true };
  } catch (error) {
    console.error("Error updating RSVP in JSON Bin:", error);
    throw new Error("Failed to update RSVP");
  }
}

