import React, { useState, useEffect } from "react";
import "./Chat.css";
import UserAvatar from "../UserAvatar/UserAvatar";
import chevronLeft from "../../images/chevron-left.svg";
import { useMediaQuery } from "react-responsive";
import { messagesApi, transportApi } from "../../API/api";

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
        // First, get transport requests to see who you've accepted
        const transportRequests = await transportApi.getUserRequests(user.id);

        // Filter to only get accepted requests
        const acceptedRequests = transportRequests.filter(
          (request) =>
            request.status === "Accepted" || request.status === "accepted"
        );

        // Get the user IDs of people you've accepted
        const acceptedUserIds = acceptedRequests.map(
          (request) => request.requesterId
        );

        // Now get contacts from API but filter them
        const contactsData = await messagesApi.getContacts();

        // Only show contacts that you've accepted OR that have accepted you
        const filteredContacts = contactsData.filter(
          (contact) =>
            acceptedUserIds.includes(contact.id) ||
            contact.status === "Accepted" // If the contact has accepted you
        );

        console.log("📞 Filtered contacts (accepted only):", filteredContacts);
        setContacts(filteredContacts);
      } catch (error) {
        console.error("Error loading contacts:", error);
        // Fallback: use localStorage but still filter
        const storedContacts = JSON.parse(
          localStorage.getItem("chatContacts") || "[]"
        );

        // Try to get accepted requests for filtering
        try {
          const transportRequests = await transportApi.getUserRequests(user.id);
          const acceptedRequests = transportRequests.filter(
            (request) =>
              request.status === "Accepted" || request.status === "accepted"
          );
          const acceptedUserIds = acceptedRequests.map(
            (request) => request.requesterId
          );

          const filteredContacts = storedContacts.filter((contact) =>
            acceptedUserIds.includes(contact.id)
          );
          setContacts(filteredContacts);
        } catch {
          // If all else fails, show all contacts
          setContacts(storedContacts);
        }
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
