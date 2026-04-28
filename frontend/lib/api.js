const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

const api = {
  teachers: {
    async login(username, password) {
      return request("/api/teachers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
    },

    async createSlot(teacherId, date, startTime) {
      return request("/api/teachers/create-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, date, startTime }),
      });
    },

    async getSlots(teacherId) {
      return request(`/api/teachers/slots/${teacherId}`);
    },
  },

  students: {
    async login(username, password) {
      return request("/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
    },

    async getAvailableSlots() {
      return request("/api/students/available-slots");
    },

    async bookSlot(slotId, studentId) {
      return request("/api/students/book-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId, studentId }),
      });
    },

    async getMyBookings(studentId) {
      return request(`/api/students/my-bookings/${studentId}`);
    },
  },
};

export default api;
