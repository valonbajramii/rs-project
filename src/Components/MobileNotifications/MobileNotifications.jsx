import React from "react";
import UserAvatar from "../UserAvatar/UserAvatar";

const MobileNotifications = ({
  pendingRequests,
  handleRequestAction,
  getRequesterInfo,
  formatRelativeTime,
  deliveryOptions,
}) => {
  return (
    <div className="mobile-notifications-list">
      {pendingRequests.length > 0 ? (
        pendingRequests.map((request, index) => {
          const requesterUser = getRequesterInfo(request.requester);
          const delivery = deliveryOptions.find(
            (d) => d.id === request.deliveryId
          );

          return (
            <div key={index} className="mobile-notification-item">
              <div className="notification-header">
                <UserAvatar user={requesterUser} />
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
              <div className="notification-actions">
                <button
                  onClick={() =>
                    handleRequestAction(
                      request.deliveryId,
                      request.requestId,
                      "decline"
                    )
                  }
                  className="decline-btn"
                >
                  Decline
                </button>
                <button
                  onClick={() =>
                    handleRequestAction(
                      request.deliveryId,
                      request.requestId,
                      "approve"
                    )
                  }
                  className="approve-btn"
                >
                  Approve
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="no-notifications">No new notifications</p>
      )}
    </div>
  );
};

export default MobileNotifications;
