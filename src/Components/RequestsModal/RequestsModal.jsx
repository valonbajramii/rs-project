
// import React from "react";
// import "./RequestsModal.css";

// const RequestsModal = ({ isVisible, onClose, requests, onApprove }) => {
//   if (!isVisible) {
//     return null; // Do not render if not visible
//   }

//   return (
//     <div className="requests-modal-overlay" onClick={onClose}>
//       <div
//         className="requests-modal-content"
//         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
//       >
//         <button className="modal-close-button" onClick={onClose}>
//           Close
//         </button>
//         <h2>Delivery Requests</h2>
//         {requests.length > 0 ? (
//           requests.map((request, index) => (
//             <div key={index} className="request-item">
//               <p>Requester: {request.requesterName}</p>
//               <p>Delivery: {request.deliveryName}</p>
//               <button
//                 onClick={() => onApprove(index)}
//                 className="approve-button"
//                 disabled={request.isApproved}
//               >
//                 {request.isApproved ? "Approved" : "Approve"}
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No requests yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RequestsModal;