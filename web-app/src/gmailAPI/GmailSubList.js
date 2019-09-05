// import React from 'react'
const user = require('./gmailApi');

console.log(user.emails[0].content);
// get all subscriptions
// const subscriptions = user.emails.forEach(email => {
//     //check if content contains unsubscribe
//     if("unsubscribe" in email.content.toLower()){
//         return(
//             <li>
//                 ${email.from}
//             </li>
//         )
//     }
// });


// const GmailSubList = (props) => {

//     console.log(user.emails[0].content);
//     return(
//         <div>
//             <div>
//                 {/* {user.emails[0].content} */}
//             </div>
//         </div>
//     );
// }

// export default GmailSubList;