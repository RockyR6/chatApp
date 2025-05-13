import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    // Get all users
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            console.error(`Error in getUsers/ChatContext.js: ${error}`);
            toast.error(error.message);
        }
    };

    // Get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error(`Error in getMessages/ChatContext.js: ${error}`);
            toast.error(error.message);
        }
    };

    // Send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                console.error("Error in sendMessage/ChatContext");
                toast.error(data.message);
            }
        } catch (error) {
            console.error(`Error in sendMessage/ChatContext: ${error}`);
            toast.error(error.message);
        }
    };

    // Handle real-time incoming messages
    const subscribeToMessages = (newMessage) => {
        if (selectedUser && newMessage.senderId === selectedUser._id) {
            newMessage.seen = true;
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // ✅ Handle possible error from axios.put
            axios.put(`/api/messages/mark/${newMessage._id}`).catch(err => {
                console.error("Failed to mark message as seen:", err);
            });
        } else {
            setUnseenMessages((prev) => ({
                ...prev,
                [newMessage.senderId]: prev[newMessage.senderId]
                    ? prev[newMessage.senderId] + 1
                    : 1,
            }));
        }
    };

    // Unsubscribe from socket
    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    };

    // Subscribe when socket or selectedUser changes
    useEffect(() => {
        if (socket) {
            socket.on("newMessage", subscribeToMessages);
        }
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser, axios]); // ✅ Added axios

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
