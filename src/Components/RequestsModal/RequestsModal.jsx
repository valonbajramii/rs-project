// import React from "react";
// import "./RequestsModal.css";

// const RequestsModal = ({ isVisible, onClose, requests, onApprove }) => {
//   if (!isVisible) {
//     return null;
//   }

//   return (
//     <div className="RequestsModal-overlay" onClick={onClose}>
//       <div
//         className="RequestsModal-content"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button className="requests-modal-xbutton" onClick={onClose}>
//           x
//         </button>
//         <h2>Requests</h2>
//         <div className="requests-list">
//           {requests.map((request, index) => (
//             <div className="request-item" key={index}>
//               <p>Requester: {request.requesterEmail}</p>
//               <p>Delivery: {request.deliveryName}</p>
//               <p>Approved: {request.isApproved ? "Yes" : "No"}</p>
//               {!request.isApproved && (
//                 <button onClick={() => onApprove(index)}>Approve</button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RequestsModal;

import React from "react";
import "./RequestsModal.css";

const RequestsModal = ({ delivery, onClose, handleRequestAction }) => {
  if (!delivery) {
    return null;
  }

  const handleApprove = (requestId) => {
    handleRequestAction(delivery.id, requestId, "approve");
  };

  const handleDecline = (requestId) => {
    handleRequestAction(delivery.id, requestId, "decline");
  };

  return (
    <div className="requests-modal-overlay" onClick={onClose}>
      <div
        className="requests-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="requests-modal-close-button" onClick={onClose}>
          x
        </button>
        <h2>Requests for {delivery.name}</h2>
        <hr />
        {delivery.requests && delivery.requests.length > 0 ? (
          delivery.requests.map((request, index) => (
            <div key={index} className="request-item">
              <p>Requested by: {request.requester}</p>
              <p>Status: {request.status}</p>
              <button
                onClick={() => handleApprove(request.id)}
                className="requests-modal-approve-button"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecline(request.id)}
                className="requests-modal-decline-button"
              >
                Decline
              </button>
            </div>
          ))
        ) : (
          <p>No requests yet.</p>
        )}
      </div>
    </div>
  );
};

export default RequestsModal;
