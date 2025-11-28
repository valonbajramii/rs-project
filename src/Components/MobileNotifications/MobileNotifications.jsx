import React, { useState } from "react";
import UserAvatar from "../UserAvatar/UserAvatar";
import "./MobileNotifications.css";

const MobileNotifications = ({
  pendingRequests,
  handleRequestAction,
  getRequesterInfo,
  formatRelativeTime,
  deliveryOptions,
}) => {
  const [activeRequestId, setActiveRequestId] = useState(null);

  const handleRequestClick = (requestId) => {
    setActiveRequestId(activeRequestId === requestId ? null : requestId);
  };

  return (
    <div className="mobile-notifications-container">
      {/* <div className="mobile-notifications-header">
        <h3>Notifications</h3>
        <p>You have {pendingRequests.length} pending requests</p>
      </div> */}

      <div className="mobile-notifications-list">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request, index) => {
            const requesterUser = getRequesterInfo(request.requester);
            const delivery = deliveryOptions.find(
              (d) => d.id === request.deliveryId
            );

            return (
              <div
                key={index}
                className={`mobile-notification-item ${
                  activeRequestId === request.requestId ? "active-request" : ""
                }`}
                onClick={() => handleRequestClick(request.requestId)}
              >
                <div className="notification-header">
                  <div className="mobile-notification-avatar">
                    <UserAvatar user={requesterUser} />
                  </div>
                  <div className="notification-details">
                    <div className="requester-info">
                      <p className="requester-name">{requesterUser.name}</p>
                      <p className="request-time">
                        {formatRelativeTime(request.timestamp)}
                      </p>
                    </div>
                    <p className="delivery-name">
                      Request to deliver: {delivery?.name}
                    </p>
                  </div>
                </div>

                {activeRequestId === request.requestId && (
                  <div className="mobile-notification-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestAction(request.requestId, "decline");
                      }}
                      className="mobile-decline-btn"
                    >
                      Decline
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestAction(request.requestId, "approve");
                      }}
                      className="mobile-approve-btn"
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="no-notifications">No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default MobileNotifications;
