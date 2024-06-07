// const Chat = require('../../module/Chat'); 


// // Function to add a new message from user A to user B using aggregate
// const addNewMessage = async(from, to, message, sent, received, seen, messageId) => {
//   try {
    
//     const updatedChatDocument = await Chat.aggregate([
//       // Step 1: Match the document for user A
//       {
//         $match: { mobile: from },
//       },
//       // Step 2: Find the chat array for user B within the chats array
//       {
//         $project: {
//           chats: {
//             $filter: {
//               input: '$chats',
//               as: 'chat',
//               cond: { $eq: ['$$chat.mobile', to] },
//             },
//           },
//         },
//       },
//       // Step 3: Add the new message to the chat array for user B
//       {
//         $addFields: {
//           'chats.0.chat': {
//             $concatArrays: [
//               '$chats.0.chat',
//               [
//                 {
//                   _id: messageId,
//                   message: message,
//                   sent: sent, // Use the current timestamp for the sent field
//                   received: received,   // Set received and seen as null initially
//                   seen: seen,
//                 },
//               ],
//             ],
//           },
//         },
//       },
//       // Step 4: Save the updated document to the collection
//       {
//         $merge: {
//           into: 'chats', // Replace 'chats' with your collection name
//           on: '_id',
//           whenMatched: 'replace',
//           whenNotMatched: 'insert',
//         },
//       },
//     ]);

//     console.log('New message added:', updatedChatDocument);
//   } catch (error) {
//     console.error('Error adding new message:', error);
//   }
// }

// // Usage example
// // const from = '1234567890'; // Replace with the mobile number of user A
// // const to = '9876543210'; // Replace with the mobile number of user B
// // const message = 'Hello, user B! This is a new message from user A.';

// // addNewMessage(from, to, message);

// module.exports = addNewMessage
