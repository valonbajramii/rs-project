// import React, { useState, useEffect } from "react";
// import "./Chat.css";
// import UserAvatar from "../UserAvatar/UserAvatar";
// import chevronLeft from "../../images/chevron-left.svg";
// import { useMediaQuery } from "react-responsive";
// import { messagesApi, transportApi, packagesApi } from "../../API/api";

// const Chat = ({
//   user,
//   selectedContact,
//   onClose,
//   setShowFooter = () => {},
//   setIsInMessageView = () => {},
// }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [contacts, setContacts] = useState([]);
//   const [activeContact, setActiveContact] = useState(null);
//   const [showMessageView, setShowMessageView] = useState(false);
//   const isMobile = useMediaQuery({ maxWidth: 480 });

//   // Load contacts from API
//   // In Chat.jsx - Replace the entire useEffect that loads contacts
//   useEffect(() => {
//     const loadContacts = async () => {
//       try {
//         if (!user?.id) return;

//         console.log("🔄 Loading contacts from backend for user:", user.id);

//         // Get transport requests from both perspectives
//         const [transportRequests, ownerRequests] = await Promise.all([
//           transportApi.getUserRequests(user.id),
//           transportApi.getOwnerRequests(user.id),
//         ]);

//         console.log("📞 Transport requests:", transportRequests);
//         console.log("📞 Owner requests:", ownerRequests);

//         // Combine all requests and filter accepted ones
//         const allRequests = [...transportRequests, ...ownerRequests];
//         const acceptedRequests = allRequests.filter(
//           (request) =>
//             request.status === "Accepted" ||
//             request.status === "accepted" ||
//             request.Status === "Accepted"
//         );

//         console.log("✅ Accepted requests:", acceptedRequests);

//         // Use Set for proper deduplication
//         const contactIds = new Set();

//         // Process each accepted request to find the other user to chat with
//         for (const request of acceptedRequests) {
//           console.log("🔍 Processing request:", request);

//           const currentUserId = user.id;

//           // Try multiple possible property names for ownerId
//           const ownerId =
//             request.ownerId || request.packageOwnerId || request.ownerUserId;
//           const requesterId = request.requesterId || request.requesterUserId;

//           console.log(
//             `🔍 Current user: ${currentUserId}, Owner: ${ownerId}, Requester: ${requesterId}`
//           );

//           // CASE 1: Current user is the package owner - chat with requester
//           if (
//             ownerId === currentUserId &&
//             requesterId &&
//             requesterId !== currentUserId
//           ) {
//             console.log(`🎯 User is OWNER - Adding requester: ${requesterId}`);
//             contactIds.add(requesterId);
//           }
//           // CASE 2: Current user is the requester - chat with package owner
//           else if (
//             requesterId === currentUserId &&
//             ownerId &&
//             ownerId !== currentUserId
//           ) {
//             console.log(`🎯 User is REQUESTER - Adding owner: ${ownerId}`);
//             contactIds.add(ownerId);
//           }
//           // CASE 3: If ownerId is missing but we have packageId, fetch package details
//           else if (
//             requesterId === currentUserId &&
//             request.packageId &&
//             !ownerId
//           ) {
//             console.log(
//               `🔄 Owner ID missing, fetching package ${request.packageId} details...`
//             );
//             try {
//               const packageDetails = await packagesApi.getPackage(
//                 request.packageId
//               );
//               console.log("📦 Package details:", packageDetails);

//               // Try different property names for package owner
//               const packageOwnerId =
//                 packageDetails.userId ||
//                 packageDetails.ownerId ||
//                 packageDetails.ownerUserId ||
//                 packageDetails.userID;

//               if (packageOwnerId && packageOwnerId !== currentUserId) {
//                 console.log(`➕ Found package owner: ${packageOwnerId}`);
//                 contactIds.add(packageOwnerId);
//               } else {
//                 console.warn("❌ Could not find valid package owner ID");
//               }
//             } catch (error) {
//               console.error("❌ Error fetching package details:", error);
//             }
//           }
//           // CASE 4: Fallback - if we can infer the relationship
//           else if (requesterId && requesterId !== currentUserId && !ownerId) {
//             console.log(`🔄 Fallback - Adding requester: ${requesterId}`);
//             contactIds.add(requesterId);
//           } else {
//             console.log("⚪ Skipping request - no valid chat partner found");
//           }
//         }

//         const uniqueContactIds = Array.from(contactIds);
//         console.log("👥 Unique contact IDs:", uniqueContactIds);

//         // Fetch user details for each contact ID
//         const contactsPromises = uniqueContactIds.map(async (userId) => {
//           try {
//             const userDetails = await packagesApi.getUser(userId);
//             console.log(`✅ Found user: ${userDetails.fullName} (${userId})`);

//             return {
//               id: userDetails.id,
//               name: userDetails.fullName || userDetails.name || "Unknown User",
//               email: userDetails.email || "",
//               profileImage: userDetails.profileImage || null,
//             };
//           } catch (error) {
//             console.warn(`❌ User not found by ID ${userId}:`, error);
//             return null;
//           }
//         });

//         const contacts = (await Promise.all(contactsPromises)).filter(
//           (contact) => contact !== null
//         );

//         console.log("📞 Final contacts from backend:", contacts);
//         setContacts(contacts);
//       } catch (error) {
//         console.error("❌ Error loading contacts from backend:", error);
//         setContacts([]);
//       }
//     };

//     loadContacts();
//   }, [user?.id]);

//   // Load messages from API when contact is selected
//   useEffect(() => {
//     const loadMessages = async () => {
//       if (!activeContact || !user?.id) return;

//       try {
//         const messagesData = await messagesApi.getConversation(
//           activeContact.id
//         );
//         console.log("📨 Messages from API:", messagesData); // Debug log
//         setMessages(messagesData);
//       } catch (error) {
//         console.error("Error loading messages:", error);
//         // Fallback to localStorage if API fails
//         if (user?.id) {
//           const userMessagesKey = `chatMessages_${user.id}_${activeContact.email}`;
//           const storedMessages = JSON.parse(
//             localStorage.getItem(userMessagesKey) || "[]"
//           );
//           setMessages(storedMessages);
//         }
//       }
//     };

//     loadMessages();
//   }, [activeContact, user?.id]);

//   // Send message to API
//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !activeContact || !user?.id) return;

//     try {
//       const messageData = {
//         ReceiverId: activeContact.id,
//         Content: newMessage,
//       };

//       const sentMessage = await messagesApi.sendMessage(messageData);
//       console.log("✅ Sent message:", sentMessage); // Debug log

//       // Add the sent message to local state
//       setMessages((prev) => [...prev, sentMessage]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//       alert("Failed to send message: " + (error.message || "Unknown error"));
//     }
//   };

//   const handleContactClick = (contact) => {
//     setActiveContact(contact);

//     if (isMobile) {
//       setShowMessageView(true);
//       setIsInMessageView(true);
//     }
//   };

//   const handleBackToContacts = () => {
//     setShowMessageView(false);
//     setIsInMessageView(false);
//   };

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   // Mobile message view (full screen)
//   if (isMobile && showMessageView && activeContact) {
//     return (
//       <div className="mobile-message-view">
//         <div className="message-view-header">
//           <button onClick={handleBackToContacts} className="back-button">
//             <img src={chevronLeft} className="chevron-left" alt="Back" />
//           </button>
//           <div className="contact-info-header">
//             <UserAvatar user={activeContact} />
//             <span className="contact-name">
//               {activeContact.fullName || activeContact.name}
//             </span>
//           </div>
//         </div>

//         <div className="mobile-messages-container">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`message ${
//                 message.senderId === user.id ? "sent" : "received"
//               }`}
//             >
//               <div className="message-content">
//                 <p>{message.content || message.text}</p>
//                 <span className="message-time">
//                   {formatTime(message.timestamp)}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mobile-message-input-container">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type your message..."
//             className="message-input"
//             onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//           />
//           <button onClick={handleSendMessage} className="send-button">
//             Send
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Default view (contacts list + messages side by side, or mobile contacts list)
//   return (
//     <div className={`chat-form-container ${isMobile ? "mobile-chat" : ""}`}>
//       <div className="chat-modal-content">
//         <div className="chat-container">
//           <div className="chat-content">
//             {!isMobile && (
//               <div className="back-button-and-text">
//                 <img
//                   src={chevronLeft}
//                   className="chat-chevron-left"
//                   alt="Back"
//                   onClick={onClose}
//                 />
//                 <h2 className="chat-h2">Chat</h2>
//               </div>
//             )}

//             <div className="chat-contacts-container">
//               <div className="search-section">
//                 <input
//                   type="text"
//                   placeholder="Search by Name"
//                   className="chat-search-input"
//                 />
//               </div>

//               <div className="contacts-list">
//                 {contacts.map((contact) => (
//                   <div
//                     key={contact.uniqueKey || contact.id || contact.email} // Use uniqueKey first
//                     className={`contact-item ${
//                       activeContact?.id === contact.id ? "active" : ""
//                     }`}
//                     onClick={() => handleContactClick(contact)}
//                   >
//                     <div className="chat-avatar-container">
//                       <UserAvatar user={contact} />
//                     </div>
//                     <div className="contact-info">
//                       <span className="contact-name">
//                         {contact.fullName || contact.name}
//                       </span>
//                       <span className="last-message">
//                         {/* You can add last message logic here later */}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {!isMobile && <div className="vertical-divider"></div>}

//           {!isMobile && (
//             <div className="chat-messages-container">
//               {activeContact ? (
//                 <>
//                   <div className="message-header">
//                     <UserAvatar user={activeContact} />
//                     <div className="contact-details">
//                       <span className="contact-name">
//                         {activeContact.fullName || activeContact.name}
//                       </span>
//                       <span className="contact-status">Online</span>
//                     </div>
//                   </div>

//                   <div className="messages-container">
//                     {messages.map((message) => (
//                       <div
//                         key={message.id}
//                         className={`message ${
//                           message.senderId === user.id ? "sent" : "received"
//                         }`}
//                       >
//                         <div className="message-content">
//                           <p>{message.content || message.text}</p>
//                           <span className="message-time">
//                             {formatTime(message.timestamp)}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="message-input-container">
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       placeholder="Type your message..."
//                       className="message-input"
//                       onKeyPress={(e) =>
//                         e.key === "Enter" && handleSendMessage()
//                       }
//                     />
//                     <button onClick={handleSendMessage} className="send-button">
//                       Send
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="no-contact-selected">
//                   <p>Select a contact to start chatting</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect } from "react";
import "./Chat.css";
import UserAvatar from "../UserAvatar/UserAvatar";
import chevronLeft from "../../images/chevron-left.svg";
import camerIcon from "../../icons/camera-icon.svg";
import phoneCallIcon from "../../icons/phone-call-icon.svg";
import threeDots from "../../icons/threedots.svg";
import actionButtonBase from "../../icons/action-button-base.svg";
import emojiIcon from "../../icons/emoji.svg";
import actionButton from "../../icons/action-button.svg";
import subtractIcon from "../../icons/Subtract.svg";
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
  const [lastMessages, setLastMessages] = useState({}); // Track last messages per contact
  const isMobile = useMediaQuery({ maxWidth: 480 });

  // Function to truncate long messages
  const truncateMessage = (message, maxLength = 25) => {
    if (!message) return "";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  // Update last messages when messages change
  useEffect(() => {
    if (activeContact && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setLastMessages((prev) => ({
        ...prev,
        [activeContact.id]: lastMessage,
      }));
    }
  }, [messages, activeContact]);

  // Load last messages for all contacts when component mounts or contacts change
  useEffect(() => {
    const loadLastMessages = async () => {
      if (!user?.id || contacts.length === 0) return;

      try {
        const lastMessagesMap = {};

        // Load last message for each contact
        for (const contact of contacts) {
          try {
            const conversation = await messagesApi.getConversation(contact.id);
            if (conversation && conversation.length > 0) {
              lastMessagesMap[contact.id] =
                conversation[conversation.length - 1];
            }
          } catch (error) {
            console.error(
              `Error loading last message for contact ${contact.id}:`,
              error
            );
          }
        }

        setLastMessages(lastMessagesMap);
      } catch (error) {
        console.error("Error loading last messages:", error);
      }
    };

    loadLastMessages();
  }, [contacts, user?.id]);

  // Load contacts from API
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
        const acceptedRequests = allRequests.filter(
          (request) =>
            request.status === "Accepted" ||
            request.status === "accepted" ||
            request.Status === "Accepted"
        );

        console.log("✅ Accepted requests:", acceptedRequests);

        // Use Set for proper deduplication
        const contactIds = new Set();

        // Process each accepted request to find the other user to chat with
        for (const request of acceptedRequests) {
          console.log("🔍 Processing request:", request);

          const currentUserId = user.id;

          // Try multiple possible property names for ownerId
          const ownerId =
            request.ownerId || request.packageOwnerId || request.ownerUserId;
          const requesterId = request.requesterId || request.requesterUserId;

          console.log(
            `🔍 Current user: ${currentUserId}, Owner: ${ownerId}, Requester: ${requesterId}`
          );

          // CASE 1: Current user is the package owner - chat with requester
          if (
            ownerId === currentUserId &&
            requesterId &&
            requesterId !== currentUserId
          ) {
            console.log(`🎯 User is OWNER - Adding requester: ${requesterId}`);
            contactIds.add(requesterId);
          }
          // CASE 2: Current user is the requester - chat with package owner
          else if (
            requesterId === currentUserId &&
            ownerId &&
            ownerId !== currentUserId
          ) {
            console.log(`🎯 User is REQUESTER - Adding owner: ${ownerId}`);
            contactIds.add(ownerId);
          }
          // CASE 3: If ownerId is missing but we have packageId, fetch package details
          else if (
            requesterId === currentUserId &&
            request.packageId &&
            !ownerId
          ) {
            console.log(
              `🔄 Owner ID missing, fetching package ${request.packageId} details...`
            );
            try {
              const packageDetails = await packagesApi.getPackage(
                request.packageId
              );
              console.log("📦 Package details:", packageDetails);

              // Try different property names for package owner
              const packageOwnerId =
                packageDetails.userId ||
                packageDetails.ownerId ||
                packageDetails.ownerUserId ||
                packageDetails.userID;

              if (packageOwnerId && packageOwnerId !== currentUserId) {
                console.log(`➕ Found package owner: ${packageOwnerId}`);
                contactIds.add(packageOwnerId);
              } else {
                console.warn("❌ Could not find valid package owner ID");
              }
            } catch (error) {
              console.error("❌ Error fetching package details:", error);
            }
          }
          // CASE 4: Fallback - if we can infer the relationship
          else if (requesterId && requesterId !== currentUserId && !ownerId) {
            console.log(`🔄 Fallback - Adding requester: ${requesterId}`);
            contactIds.add(requesterId);
          } else {
            console.log("⚪ Skipping request - no valid chat partner found");
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

      // Update last message for this contact
      setLastMessages((prev) => ({
        ...prev,
        [activeContact.id]: sentMessage,
      }));

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

  // Get display message for contact
  const getLastMessageDisplay = (contact) => {
    const lastMessage = lastMessages[contact.id];
    if (!lastMessage) return "Start a conversation";

    const isFromCurrentUser = lastMessage.senderId === user?.id;
    const prefix = isFromCurrentUser ? "You: " : "";
    const messageContent = lastMessage.content || lastMessage.text || "";

    return prefix + truncateMessage(messageContent, 25);
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
              {message.senderId !== user.id ? (
                // Received message - avatar on left, text on right
                <>
                  <UserAvatar user={activeContact} />
                  <div className="message-content">
                    <p>{message.content || message.text}</p>
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </>
              ) : (
                // Sent message - just content on right (no avatar)
                <div className="message-content">
                  <p>{message.content || message.text}</p>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mobile-message-input-container">
          <button className="mobile-chat-button">+</button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <img src={emojiIcon} />
          <img
            onClick={handleSendMessage}
            className="send-button"
            src={subtractIcon}
          />
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
                  className="chat-chevron-left"
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
                    key={contact.uniqueKey || contact.id || contact.email}
                    className={`contact-item ${
                      activeContact?.id === contact.id ? "active" : ""
                    }`}
                    onClick={() => handleContactClick(contact)}
                  >
                    <div className="chat-avatar-container">
                      <UserAvatar user={contact} />
                    </div>
                    <div className="contact-info">
                      <span className="contact-name">
                        {contact.fullName || contact.name}
                      </span>
                      <span className="last-message">
                        {getLastMessageDisplay(contact)}
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
                    <UserAvatar
                      user={activeContact}
                      className="chat-mobile-avatar"
                    />
                    <div className="contact-details">
                      <span className="contact-name">
                        {activeContact.fullName || activeContact.name}
                      </span>
                      <span className="contact-status">Online</span>
                    </div>
                    <div className="contact-actions">
                      <div className="chat-camera-icon-container">
                        <img className="chat-camera-icon" src={camerIcon} />
                      </div>
                      <div className="chat-phone-call-icon-container">
                        <img
                          className="chat-phone-call-icon"
                          src={phoneCallIcon}
                        />
                      </div>
                      <button className="view-profile-button">
                        View profile
                      </button>
                      <div className="chat-three-dots-container">
                        <img className="chat-three-dots" src={threeDots} />
                      </div>
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
                        <div className="message-useravatar-container">
                          {/* Only show avatar and name for received messages */}
                          {message.senderId !== user.id && (
                            <div className="useravatar-text-container">
                              <UserAvatar
                                user={activeContact}
                                className="chat-mobile-avatar"
                              />
                              <span className="contact-name">
                                {activeContact.fullName || activeContact.name}
                              </span>
                            </div>
                          )}
                          <div className="message-content">
                            <p>{message.content || message.text}</p>
                            <span className="message-time">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="message-input-container">
                    <img src={actionButtonBase} alt="Action" />
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
                    <img src={emojiIcon} />
                    <img
                      onClick={handleSendMessage}
                      className="send-button"
                      src={actionButton}
                    />
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
