// import React, { useState, useEffect } from "react";
// import "./Chat.css";
// import UserAvatar from "../UserAvatar/UserAvatar";
// const Chat = ({ user, selectedContact, onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [contacts, setContacts] = useState([]);
//   const [activeContact, setActiveContact] = useState(null);

//   // Load contacts and messages from localStorage
//   useEffect(() => {
//     const storedContacts =
//       JSON.parse(localStorage.getItem("chatContacts")) || [];
//     setContacts(storedContacts);

//     if (selectedContact) {
//       setActiveContact(selectedContact);
//       const storedMessages =
//         JSON.parse(
//           localStorage.getItem(`chatMessages_${selectedContact.email}`)
//         ) || [];
//       setMessages(storedMessages);
//     }
//   }, [selectedContact]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim() || !activeContact) return;

//     const message = {
//       id: Date.now(),
//       sender: user.email,
//       text: newMessage,
//       timestamp: new Date().toISOString(),
//     };

//     const updatedMessages = [...messages, message];
//     setMessages(updatedMessages);
//     localStorage.setItem(
//       `chatMessages_${activeContact.email}`,
//       JSON.stringify(updatedMessages)
//     );
//     setNewMessage("");
//   };

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <button className="back-button" onClick={onClose}>
//           ←
//         </button>
//         <h3>Chat</h3>
//       </div>

//       <div className="chat-sidebar">
//         <div className="search-section">
//           <input type="text" placeholder="Search by Name" />
//         </div>

//         <div className="contacts-list">
//           {contacts.map((contact) => (
//             <div
//               key={contact.email}
//               className={`contact-item ${
//                 activeContact?.email === contact.email ? "active" : ""
//               }`}
//               onClick={() => {
//                 setActiveContact(contact);
//                 const storedMessages =
//                   JSON.parse(
//                     localStorage.getItem(`chatMessages_${contact.email}`)
//                   ) || [];
//                 setMessages(storedMessages);
//               }}
//             >
//               <UserAvatar user={contact} />
//               <div className="contact-info">
//                 <span className="contact-name">{contact.name}</span>
//                 <span className="last-message">
//                   {contact.lastMessage || ""}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="chat-main">
//         {activeContact ? (
//           <>
//             <div className="message-header">
//               <UserAvatar user={activeContact} />
//               <span className="contact-name">{activeContact.name}</span>
//               <span className="contact-phone">{activeContact.phone}</span>
//             </div>

//             <div className="messages-container">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`message ${
//                     message.sender === user.email ? "sent" : "received"
//                   }`}
//                 >
//                   <div className="message-content">
//                     <p>{message.text}</p>
//                     <span className="message-time">
//                       {formatTime(message.timestamp)}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="message-input">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type here..."
//                 onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//               />
//               <button onClick={handleSendMessage}>Send</button>
//             </div>
//           </>
//         ) : (
//           <div className="no-contact-selected">
//             Select a contact to start chatting
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect } from "react";
import "./Chat.css";
import UserAvatar from "../UserAvatar/UserAvatar";
import chevronLeft from "../../images/chevron-left.svg";
import { useMediaQuery } from "react-responsive";

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

  // Load contacts and messages from localStorage
  useEffect(() => {
    const storedContacts =
      JSON.parse(localStorage.getItem("chatContacts")) || [];
    setContacts(storedContacts);

    if (selectedContact) {
      setActiveContact(selectedContact);
      const storedMessages =
        JSON.parse(
          localStorage.getItem(`chatMessages_${selectedContact.email}`)
        ) || [];
      setMessages(storedMessages);
      if (isMobile) {
        setShowMessageView(true);
      }
    }
  }, [selectedContact, isMobile, setShowFooter]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContact) return;

    const message = {
      id: Date.now(),
      sender: user.email,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(
      `chatMessages_${activeContact.email}`,
      JSON.stringify(updatedMessages)
    );
    setNewMessage("");
  };

  const handleContactClick = (contact) => {
    setActiveContact(contact);
    const storedMessages =
      JSON.parse(localStorage.getItem(`chatMessages_${contact.email}`)) || [];
    setMessages(storedMessages);
    if (isMobile) {
      setShowMessageView(true);
      setIsInMessageView(true); // This will hide the footer
    }
  };

  const handleBackToContacts = () => {
    setShowMessageView(false);
    setIsInMessageView(false); // This will show the footer again
  };

  // And in the onClose handler for the back button in the header:
  const handleCloseChat = () => {
    onClose();
    setIsInMessageView(false); // Ensure footer shows when closing chat
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
            <span className="contact-name">{activeContact.name}</span>
          </div>
        </div>

        <div className="mobile-messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === user.email ? "sent" : "received"
              }`}
            >
              <div className="message-content">
                <p>{message.text}</p>
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
                    key={contact.email}
                    className={`contact-item ${
                      activeContact?.email === contact.email ? "active" : ""
                    }`}
                    onClick={() => handleContactClick(contact)}
                  >
                    <UserAvatar user={contact} />
                    <div className="contact-info">
                      <span className="contact-name">{contact.name}</span>
                      <span className="last-message">
                        {contact.lastMessage || ""}
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
                      <span className="contact-name">{activeContact.name}</span>
                      <span className="contact-status">Online</span>
                    </div>
                  </div>

                  <div className="messages-container">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message ${
                          message.sender === user.email ? "sent" : "received"
                        }`}
                      >
                        <div className="message-content">
                          <p>{message.text}</p>
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
