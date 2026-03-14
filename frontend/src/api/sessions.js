import axiosInstance from "../lib/axios";

export const sessionApi = {
createSession: async (data) => {
try {
const res = await axiosInstance.post("/sessions", data);
return res.data;
} catch (error) {
throw error.response?.data || error.message;
}
},

getActiveSessions: async () => {
try {
const res = await axiosInstance.get("/sessions/active");
return res.data;
} catch (error) {
throw error.response?.data || error.message;
}
},

getMyRecentSessions: async () => {
try {
const res = await axiosInstance.get("/sessions/my-recent");
return res.data;
} catch (error) {
throw error.response?.data || error.message;
}
},

getSessionById: async (id) => {
try {
const res = await axiosInstance.get(`/sessions/${id}`);
return res.data;
} catch (error) {
throw error.response?.data || error.message;
}
},

joinSession: async (id) => {
try {
const res = await axiosInstance.post(`/sessions/${id}/join`);
return res.data;
} catch (error) {
throw error.response?.data || error.message;
}
},

endSession: async (id) => {
try {
const res = await axiosInstance.post(`/sessions/${id}/end`);
return res.data;
} catch (error) {
throw error.response?.data || error.message;
}
},

getStreamToken: async () => {
try {
const res = await axiosInstance.get("/chat/token");
return res.data;
} catch (error) {
throw error.response?.data || error.message;
}
},
};