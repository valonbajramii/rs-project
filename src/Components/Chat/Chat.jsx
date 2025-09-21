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
  useEffect(() => {
    const loadContacts = async () => {
      try {
        // Get all transport requests to see relationships
        const transportRequests = await transportApi.getUserRequests(user.id);

        // Also get requests where you are the requester (you applied to deliver)
        const ownerRequests = await transportApi.getOwnerRequests(user.id);

        console.log("📞 Your requests (transportRequests):", transportRequests);
        console.log("📞 Requests to you (ownerRequests):", ownerRequests);

        // Get ALL accepted requests from both perspectives
        const allAcceptedRequests = [
          ...transportRequests.filter(
            (request) =>
              request.status === "Accepted" ||
              request.status === "accepted" ||
              request.Status === "Accepted"
          ),
          ...ownerRequests.filter(
            (request) =>
              request.status === "Accepted" ||
              request.status === "accepted" ||
              request.Status === "Accepted"
          ),
        ];

        console.log("✅ All accepted requests:", allAcceptedRequests);

        // Get unique user IDs from both sides
        const contactIds = new Set();

        // Add users from all accepted relationships
        allAcceptedRequests.forEach((request) => {
          console.log("🔍 Processing request:", request);

          // Determine who the other user is in this relationship
          if (request.ownerId === user.id || request.OwnerId === user.id) {
            // Current user is the owner, so the other user is the requester
            const otherUserId = request.requesterId || request.RequesterId;
            if (otherUserId && otherUserId !== user.id) {
              console.log(`➕ Adding requester as contact: ${otherUserId}`);
              contactIds.add(otherUserId);
            }
          } else if (
            request.requesterId === user.id ||
            request.RequesterId === user.id
          ) {
            // Current user is the requester, so the other user is the owner
            const otherUserId = request.ownerId || request.OwnerId;
            if (otherUserId && otherUserId !== user.id) {
              console.log(`➕ Adding owner as contact: ${otherUserId}`);
              contactIds.add(otherUserId);
            }
          } else {
            // Fallback: try to extract from any available ID fields
            const possibleIds = [
              request.ownerId,
              request.requesterId,
              request.OwnerId,
              request.RequesterId,
              request.ownerID,
              request.requesterID,
              request.OwnerID,
              request.RequesterID,
            ];

            possibleIds.forEach((id) => {
              if (id && id !== user.id) {
                console.log(`➕ Adding contact ID (fallback): ${id}`);
                contactIds.add(id);
              }
            });
          }
        });

        console.log("👥 Contact IDs:", Array.from(contactIds));

        if (contactIds.size === 0) {
          console.warn(
            "⚠️ No contact IDs found. Trying email-based approach..."
          );

          // Try email-based approach as fallback
          allAcceptedRequests.forEach((request) => {
            if (
              request.requesterEmail &&
              request.requesterEmail !== user.email
            ) {
              console.log(
                `📧 Using requester email as ID: ${request.requesterEmail}`
              );
              contactIds.add(request.requesterEmail);
            }
            if (request.ownerEmail && request.ownerEmail !== user.email) {
              console.log(`📧 Using owner email as ID: ${request.ownerEmail}`);
              contactIds.add(request.ownerEmail);
            }
          });
        }

        console.log("👥 Final Contact IDs:", Array.from(contactIds));

        // Fetch user details for all contact IDs
        const contactsPromises = Array.from(contactIds).map(
          async (contactIdentifier) => {
            try {
              // Try to get user by ID/email
              const userDetails = await packagesApi.getUser(contactIdentifier);
              return userDetails;
            } catch (error) {
              console.error(`Error fetching user ${contactIdentifier}:`, error);

              // Create basic contact info from request data
              const matchingRequest = allAcceptedRequests.find(
                (req) =>
                  req.requesterId === contactIdentifier ||
                  req.ownerId === contactIdentifier ||
                  req.requesterEmail === contactIdentifier ||
                  req.ownerEmail === contactIdentifier
              );

              if (matchingRequest) {
                return {
                  id: contactIdentifier,
                  name:
                    matchingRequest.requesterName ||
                    matchingRequest.ownerName ||
                    (contactIdentifier.includes("@")
                      ? contactIdentifier.split("@")[0]
                      : "Unknown User"),
                  email:
                    matchingRequest.requesterEmail ||
                    matchingRequest.ownerEmail ||
                    (contactIdentifier.includes("@") ? contactIdentifier : ""),
                  profileImage: matchingRequest.requesterProfileImage || null,
                };
              }
              return null;
            }
          }
        );

        const contactsData = (await Promise.all(contactsPromises)).filter(
          (contact) => contact !== null
        );

        console.log("📞 Final contacts:", contactsData);

        // Also check localStorage for any previously saved contacts
        const userContactsKey = `chatContacts_${user.id}`;
        const storedContacts = JSON.parse(
          localStorage.getItem(userContactsKey) || "[]"
        );

        // Merge and deduplicate contacts
        const allContacts = [...contactsData, ...storedContacts];
        const uniqueContacts = allContacts.filter(
          (contact, index, array) =>
            array.findIndex(
              (c) => c.id === contact.id || c.email === contact.email
            ) === index
        );

        console.log("👥 All unique contacts:", uniqueContacts);
        setContacts(uniqueContacts);
      } catch (error) {
        console.error("Error loading contacts:", error);
        // Fallback to localStorage
        const userContactsKey = `chatContacts_${user.id}`;
        const storedContacts = JSON.parse(
          localStorage.getItem(userContactsKey) || "[]"
        );
        console.log("📦 Using stored contacts:", storedContacts);
        setContacts(storedContacts);
      }
    };

    if (user?.id) {
      loadContacts();
    }
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
                    key={contact.id || contact.email}
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
