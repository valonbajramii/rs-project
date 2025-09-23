import React, { useState, useEffect } from "react";
import "./Chat.css";
import UserAvatar from "../UserAvatar/UserAvatar";
import chevronLeft from "../../images/chevron-left.svg";
import { useMediaQuery } from "react-responsive";
import { messagesApi, transportApi, packagesApi } from "../../API/api";

const Chat = ({
  user,
  selectedContact,
  onClose,
  setShowFooter = () => {},
  setIsInMessageView = () => {},
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [showMessageView, setShowMessageView] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 480 });

  // Load contacts from API
  // In Chat.jsx - Replace the entire useEffect that loads contacts
  // In Chat.jsx - Replace the contact processing logic
  useEffect(() => {
    const loadContacts = async () => {
      try {
        if (!user?.id) return;

        console.log("🔄 Loading contacts from backend for user:", user.id);

        // Get transport requests from both perspectives
        const [transportRequests, ownerRequests] = await Promise.all([
          transportApi.getUserRequests(user.id),
          transportApi.getOwnerRequests(user.id),
        ]);

        console.log("📞 Transport requests:", transportRequests);
        console.log("📞 Owner requests:", ownerRequests);

        // Combine all requests and filter accepted ones
        const allRequests = [...transportRequests, ...ownerRequests];

        // Debug function
        const debugRequests = (requests, currentUser) => {
          console.log("🐛 DEBUG REQUESTS ANALYSIS:");
          requests.forEach((request, index) => {
            console.log(`Request ${index + 1}:`, {
              id: request.id,
              requesterId: request.requesterId,
              ownerId: request.ownerId,
              packageId: request.packageId,
              status: request.status,
              currentUserIsRequester: request.requesterId === currentUser.id,
              currentUserIsOwner: request.ownerId === currentUser.id,
              hasRequesterId: !!request.requesterId,
              hasOwnerId: !!request.ownerId,
            });
          });
        };

        debugRequests(allRequests, user);

        const acceptedRequests = allRequests.filter(
          (request) =>
            request.status === "Accepted" ||
            request.status === "accepted" ||
            request.Status === "Accepted"
        );

        console.log("✅ Accepted requests:", acceptedRequests);

        // Use Set for proper deduplication
        const contactIds = new Set();

        // NEW LOGIC: Extract unique user IDs with better relationship detection
        acceptedRequests.forEach((request) => {
          console.log("🔍 Processing request:", request);

          const currentUserId = user.id;

          // CASE 1: If requesterId is the current user, then the OTHER user is the package owner
          if (request.requesterId === currentUserId) {
            console.log("🎯 Current user is the REQUESTER");

            // Try to get the package owner ID
            if (request.packageId) {
              console.log(
                `🔍 Package ID found: ${request.packageId}, fetching package details...`
              );

              // We need to fetch the package to get the owner ID
              // Since ownerId is undefined in the request, we'll handle this differently
            }

            // Since ownerId is undefined, we need to find the actual package owner
            // This is a backend issue, but we can work around it
            console.log(
              "⚠️ ownerId is undefined, cannot determine package owner"
            );
          }
          // CASE 2: If ownerId is the current user (or we can infer it), then the OTHER user is the requester
          else if (
            request.ownerId === currentUserId ||
            (request.requesterId && request.requesterId !== currentUserId)
          ) {
            console.log(
              "🎯 Current user is the PACKAGE OWNER (or can be inferred)"
            );

            // The other user is the requester
            if (request.requesterId && request.requesterId !== currentUserId) {
              console.log(
                `➕ Adding requester as contact: ${request.requesterId}`
              );
              contactIds.add(request.requesterId);
            }
          }
          // CASE 3: Manual fallback - if requesterId exists and is different from current user
          else if (
            request.requesterId &&
            request.requesterId !== currentUserId
          ) {
            console.log(
              `🔄 Fallback: Adding requester: ${request.requesterId}`
            );
            contactIds.add(request.requesterId);
          }

          // SPECIAL CASE: Handle the bug where requesterId equals current user ID
          // This means the backend has incorrect data, but we can try to find the real other user
          if (request.requesterId === currentUserId && request.packageId) {
            console.log("🚨 BUG DETECTED: requesterId equals current user ID");
            console.log("🔄 Attempting to find real package owner...");

            // We need to fetch the package to get the real owner
            // This will be handled in the next step
          }
        });

        // NEW: If we have package IDs but missing owner IDs, fetch package details
        const packagesToFetch = acceptedRequests
          .filter((req) => req.packageId && !req.ownerId)
          .map((req) => req.packageId);

        if (packagesToFetch.length > 0) {
          console.log(
            `📦 Fetching details for ${packagesToFetch.length} packages to find owners...`
          );

          for (const packageId of packagesToFetch) {
            try {
              const packageDetails = await packagesApi.getPackage(packageId);
              console.log(
                `📦 Package ${packageId} owner: ${packageDetails.userId}`
              );

              if (packageDetails.userId && packageDetails.userId !== user.id) {
                console.log(
                  `➕ Adding package owner as contact: ${packageDetails.userId}`
                );
                contactIds.add(packageDetails.userId);
              }
            } catch (error) {
              console.warn(`❌ Error fetching package ${packageId}:`, error);
            }
          }
        }

        const uniqueContactIds = Array.from(contactIds);
        console.log("👥 Unique contact IDs:", uniqueContactIds);

        // Fetch user details for each contact ID
        const contactsPromises = uniqueContactIds.map(async (userId) => {
          try {
            const userDetails = await packagesApi.getUser(userId);
            console.log(`✅ Found user: ${userDetails.fullName} (${userId})`);

            return {
              id: userDetails.id,
              name: userDetails.fullName || userDetails.name || "Unknown User",
              email: userDetails.email || "",
              profileImage: userDetails.profileImage || null,
            };
          } catch (error) {
            console.warn(`❌ User not found by ID ${userId}:`, error);
            return null;
          }
        });

        const contacts = (await Promise.all(contactsPromises)).filter(
          (contact) => contact !== null
        );

        console.log("📞 Final contacts from backend:", contacts);
        setContacts(contacts);
      } catch (error) {
        console.error("❌ Error loading contacts from backend:", error);
        setContacts([]);
      }
    };

    loadContacts();
  }, [user?.id]);

  // Load messages from API when contact is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeContact || !user?.id) return;

      try {
        const messagesData = await messagesApi.getConversation(
          activeContact.id
        );
        console.log("📨 Messages from API:", messagesData); // Debug log
        setMessages(messagesData);
      } catch (error) {
        console.error("Error loading messages:", error);
        // Fallback to localStorage if API fails
        if (user?.id) {
          const userMessagesKey = `chatMessages_${user.id}_${activeContact.email}`;
          const storedMessages = JSON.parse(
            localStorage.getItem(userMessagesKey) || "[]"
          );
          setMessages(storedMessages);
        }
      }
    };

    loadMessages();
  }, [activeContact, user?.id]);

  // Send message to API
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeContact || !user?.id) return;

    try {
      const messageData = {
        ReceiverId: activeContact.id,
        Content: newMessage,
      };

      const sentMessage = await messagesApi.sendMessage(messageData);
      console.log("✅ Sent message:", sentMessage); // Debug log

      // Add the sent message to local state
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message: " + (error.message || "Unknown error"));
    }
  };

  const handleContactClick = (contact) => {
    setActiveContact(contact);

    if (isMobile) {
      setShowMessageView(true);
      setIsInMessageView(true);
    }
  };

  const handleBackToContacts = () => {
    setShowMessageView(false);
    setIsInMessageView(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Mobile message view (full screen)
  if (isMobile && showMessageView && activeContact) {
    return (
      <div className="mobile-message-view">
        <div className="message-view-header">
          <button onClick={handleBackToContacts} className="back-button">
            <img src={chevronLeft} className="chevron-left" alt="Back" />
          </button>
          <div className="contact-info-header">
            <UserAvatar user={activeContact} />
            <span className="contact-name">
              {activeContact.fullName || activeContact.name}
            </span>
          </div>
        </div>

        <div className="mobile-messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.senderId === user.id ? "sent" : "received"
              }`}
            >
              <div className="message-content">
                <p>{message.content || message.text}</p>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mobile-message-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    );
  }

  // Default view (contacts list + messages side by side, or mobile contacts list)
  return (
    <div className={`chat-form-container ${isMobile ? "mobile-chat" : ""}`}>
      <div className="chat-modal-content">
        <div className="chat-container">
          <div className="chat-content">
            {!isMobile && (
              <div className="back-button-and-text">
                <img
                  src={chevronLeft}
                  className="chevron-left"
                  alt="Back"
                  onClick={onClose}
                />
                <h2 className="chat-h2">Chat</h2>
              </div>
            )}

            <div className="chat-contacts-container">
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Search by Name"
                  className="chat-search-input"
                />
              </div>

              <div className="contacts-list">
                {contacts.map((contact) => (
                  <div
                    key={contact.uniqueKey || contact.id || contact.email} // Use uniqueKey first
                    className={`contact-item ${
                      activeContact?.id === contact.id ? "active" : ""
                    }`}
                    onClick={() => handleContactClick(contact)}
                  >
                    <UserAvatar user={contact} />
                    <div className="contact-info">
                      <span className="contact-name">
                        {contact.fullName || contact.name}
                      </span>
                      <span className="last-message">
                        {/* You can add last message logic here later */}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!isMobile && <div className="vertical-divider"></div>}

          {!isMobile && (
            <div className="chat-messages-container">
              {activeContact ? (
                <>
                  <div className="message-header">
                    <UserAvatar user={activeContact} />
                    <div className="contact-details">
                      <span className="contact-name">
                        {activeContact.fullName || activeContact.name}
                      </span>
                      <span className="contact-status">Online</span>
                    </div>
                  </div>

                  <div className="messages-container">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message ${
                          message.senderId === user.id ? "sent" : "received"
                        }`}
                      >
                        <div className="message-content">
                          <p>{message.content || message.text}</p>
                          <span className="message-time">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="message-input-container">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="message-input"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                    />
                    <button onClick={handleSendMessage} className="send-button">
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-contact-selected">
                  <p>Select a contact to start chatting</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
