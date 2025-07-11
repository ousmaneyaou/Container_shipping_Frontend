import axios from "axios";

export default class ApiService {
  static BASE_URL = "http://localhost:8020";
  //static BASE_URL = "http://backend:8020";

  static getToken() {
    return localStorage.getItem("token");
  }

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // ================= AUTH =================
  // Register User
  static async registerUser(registration) {
    const response = await axios.post(
      `${this.BASE_URL}/api/auth/register`,
      registration
    );
    return response.data;
  }
  // Login User
  static async loginUser(loginDetails) {
    const response = await axios.post(
      `${this.BASE_URL}/api/auth/login`,
      loginDetails
    );
    return response.data;
  }
  // Get all users (admin only)
  static async getAllUsers(token) {
    const response = await axios.get(`${this.BASE_URL}/api/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // Get current logged user details
  static async getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }

    try {
      const response = await axios.get(`${this.BASE_URL}/api/auth/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // si ta réponse est enveloppée dans { status, success, message, data }, il faudra accéder à response.data.data
    } catch (error) {
      // Gérer proprement l'erreur
      throw error;
    }
  }

  // Forgot password (send email)
  static async forgotPassword(email) {
    const response = await axios.post(
      `${this.BASE_URL}/api/auth/forgot-password`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  // Reset password (with token)
  static async changePassword(data) {
    const token = localStorage.getItem("token"); // ou sessionStorage

    const response = await axios.post(
      `${this.BASE_URL}/api/auth/change-password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  // ================= PAYMENT =================

  static async validatePayment(sessionId) {
    const response = await axios.get(
      `${this.BASE_URL}/payments/validate?session_id=${sessionId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async createPayment(userId, bookingId, data) {
    const response = await axios.post(
      `${this.BASE_URL}/payments/add/${userId}/${bookingId}`,
      data,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllPayments() {
    const response = await axios.get(`${this.BASE_URL}/payments/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getPaymentById(paymentId) {
    const response = await axios.get(`${this.BASE_URL}/payments/${paymentId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async updatePayment(paymentId, data) {
    const response = await axios.put(
      `${this.BASE_URL}/payments/update/${paymentId}`,
      data,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deletePayment(paymentId) {
    const response = await axios.delete(
      `${this.BASE_URL}/payments/delete/${paymentId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async confirmPayment(paymentId) {
    const response = await axios.put(
      `${this.BASE_URL}/payments/confirm/${paymentId}`,
      {},
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async rejectPayment(paymentId) {
    const response = await axios.put(
      `${this.BASE_URL}/payments/reject/${paymentId}`,
      {},
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async payForColis(colisId) {
    const response = await axios.post(
      `${this.BASE_URL}/payments/colis/${colisId}`,
      {},
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // ✅ Paiement individuel pour un colis
  static async initiateSinglePayment(colisId) {
    const response = await axios.post(
      `${this.BASE_URL}/payments/colis/${colisId}`,
      null,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }
  // Paiement individuel pour un seul colis
  static async initiateSinglePayment(colisId) {
    const response = await axios.post(
      `${this.BASE_URL}/payments/colis/${colisId}`,
      {},
      { headers: this.getHeader() }
    );
    return response.data;
  }

  // ================= COLIS =================
  // ✅ Récupérer les colis de l'utilisateur connecté
  static async getColisForCurrentUser() {
    const response = await axios.get(`${this.BASE_URL}/colis/user`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getColisByUserId(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/colis/par-utilisateur/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getColisParReservation(bookingId) {
    const response = await axios.get(
      `${this.BASE_URL}/colis/par-reservation/${bookingId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getColisParStatut(statut) {
    const response = await axios.get(
      `${this.BASE_URL}/colis/par-statut/${statut}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateColis(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}/colis/modifier/${id}`,
      data,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // ✅ Récupérer tous les colis (admin)
  static async getAllColis() {
    const res = await axios.get(`${this.BASE_URL}/colis/all`, {
      headers: this.getHeader(),
    });
    return res.data;
  }

  static async deleteColis(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/colis/supprimer/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static getColisById(colisId) {
    return axios
      .get(`${this.BASE_URL}/colis/${colisId}`, { headers: this.getHeader() })
      .then((res) => res.data);
  }

  static async getColisById(id) {
    const response = await axios.get(`${this.BASE_URL}/colis/${id}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  // ================= CONTAINER BOOKINGS =================

  static async searchBookings(filters) {
    if (filters.dateDepart) {
      filters.dateDepart = new Date(filters.dateDepart)
        .toISOString()
        .split("T")[0];
    }
    const response = await axios.get(`${this.BASE_URL}/bookings/by-date`, {
      headers: this.getHeader(),
      params: filters,
    });
    return response.data;
  }

  static async checkWeight(bookingDTO) {
    // Convertir et vérifier les valeurs de poids
    const poidsColis = parseFloat(bookingDTO.poidsColis);
    const poidsRestant = parseFloat(bookingDTO.poidsRestant);
    if (isNaN(poidsColis) || isNaN(poidsRestant)) {
      throw new Error("Valeurs de poids invalides.");
    }

    // Vérifier que le poids du colis est inférieur ou égal au poids restant
    if (poidsColis > poidsRestant) {
      throw new Error("no_container_enough_weight");
    }

    // Effectuer l'appel API si la vérification est validée
    try {
      const response = await axios.post(
        `${this.BASE_URL}/bookings/check-weight`,
        bookingDTO,
        {
          headers: this.getHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in checkWeight:", error);
      throw error;
    }
  }

  static async createBooking(data) {
    const response = await axios.post(`${this.BASE_URL}/bookings`, data, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getBookingById(id) {
    const response = await axios.get(`${this.BASE_URL}/bookings/${id}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAllBookings() {
    const response = await axios.get(`${this.BASE_URL}/bookings`);
    return response.data;
  }

  static async getBookingsByUser(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/bookings/user/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateBooking(id, data) {
    const response = await axios.put(`${this.BASE_URL}/bookings/${id}`, data, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async deleteBooking(id) {
    const response = await axios.delete(`${this.BASE_URL}/bookings/${id}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async updateBookingStatus(id, statut) {
    const response = await axios.put(
      `${this.BASE_URL}/bookings/${id}/status`,
      {},
      {
        headers: this.getHeader(),
        params: { statut },
      }
    );
    return response.data;
  }

  static async assignInsurance(bookingId, insuranceId) {
    const response = await axios.put(
      `${this.BASE_URL}/${bookingId}/insurance/${insuranceId}`,
      null,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async assignPayment(bookingId, paymentId) {
    const response = await axios.put(
      `${this.BASE_URL}/${bookingId}/payment/${paymentId}`,
      null,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async assignDocument(bookingId, documentId) {
    const response = await axios.put(
      `${this.BASE_URL}/${bookingId}/document/${documentId}`,
      null,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async assignTracking(bookingId, trackingId) {
    const response = await axios.put(
      `${this.BASE_URL}/${bookingId}/tracking/${trackingId}`,
      null,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async assignLogistique(bookingId, logistiqueId) {
    const response = await axios.put(
      `${this.BASE_URL}/${bookingId}/logistique/${logistiqueId}`,
      null,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async getMyBookings() {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/bookings/mes-reservations`,
        {
          headers: this.getHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des réservations de l'utilisateur :",
        error
      );
      throw error;
    }
  }

  // ================= INSURANCE =================
  static async getAllInsuranceOptions() {
    const response = await axios.get(`${this.BASE_URL}/insurance/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getInsuranceById(id) {
    const response = await axios.get(`${this.BASE_URL}/insurance/${id}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async updateInsurance(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}/insurance/update/${id}`,
      data,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteInsurance(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/insurance/delete/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // ================= LOGISTICS =================

  static async getAllLogistics() {
    const response = await axios.get(`${this.BASE_URL}/coordination/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getLogisticById(id) {
    const response = await axios.get(`${this.BASE_URL}/coordination/${id}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getLogisticsByBooking(bookingId) {
    const response = await axios.get(
      `${this.BASE_URL}/coordination/booking/${bookingId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async addLogistic(data, bookingId) {
    const response = await axios.post(
      `${this.BASE_URL}/coordination/add/${bookingId}`,
      data,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateLogistic(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}/coordination/update/${id}`,
      data,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteLogistic(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/coordination/delete/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // ================= CUSTOMS DOCUMENT =================

  static async getCustomsDocById(id) {
    const response = await axios.get(`${this.BASE_URL}/customs/${id}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAllCustomsDocs() {
    const response = await axios.get(`${this.BASE_URL}/customs/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async deleteCustomsDoc(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/customs/delete/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateCustomsDoc(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}/customs/update/${id}`,
      data,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getCustomsDocsByUser(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/customs/user/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getCustomsDocsByStatut(statut) {
    const response = await axios.get(
      `${this.BASE_URL}/customs/statut/${statut}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateCustomsDocStatut(id, statut) {
    const response = await axios.patch(
      `${this.BASE_URL}/customs/update-statut/${id}`,
      {},
      {
        headers: this.getHeader(),
        params: { statut },
      }
    );
    return response.data;
  }

  // ================= TRACKING =================

  static async createTracking(data, bookingId) {
    const response = await axios.post(
      `${this.BASE_URL}/api/tracking/add/${bookingId}`,
      data,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllTrackings() {
    const response = await axios.get(`${this.BASE_URL}/api/tracking/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getTrackingById(id) {
    const response = await axios.get(`${this.BASE_URL}/api/tracking/${id}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async deleteTracking(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/tracking/delete/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getTrackingsByBookingId(bookingId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/tracking/booking/${bookingId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // ================= NOTIFICATIONS =================

  static async createNotification(notification, userId) {
    const response = await axios.post(
      `${this.BASE_URL}/notifications/add`,
      {
        notification: notification,
        userId: userId,
      },
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getNotificationById(notificationId) {
    const response = await axios.get(
      `${this.BASE_URL}/notifications/${notificationId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllNotifications() {
    const response = await axios.get(`${this.BASE_URL}/notifications/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getNotificationsByUser(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/notifications/user/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async markNotificationAsRead(notificationId) {
    const response = await axios.put(
      `${this.BASE_URL}/notifications/read/${notificationId}`,
      {},
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteNotification(notificationId) {
    const response = await axios.delete(
      `${this.BASE_URL}/notifications/delete/${notificationId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /*** Vérification de l'authentification ***/

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  static isAuthenticated() {
    const token = localStorage.getItem("token");
    // Vérifie si le token existe et n'est pas vide
    return !!token;
  }

  static isAdmin() {
    const role = localStorage.getItem("role");
    // Vérifie si le rôle est défini et correspond à "ADMIN"
    return role?.toUpperCase() === "ADMIN";
  }

  // ✅ Créer un colis avec FormData
  static async createColis(bookingId, colisDTO, photoFile) {
    console.log("📤 Envoi à /colis/ajouter avec bookingId:", bookingId);
    console.log("🧾 Colis DTO:", colisDTO);
    console.log("🖼️ Fichier photo:", photoFile);

    const formData = new FormData();
    formData.append(
      "colis",
      new Blob([JSON.stringify(colisDTO)], { type: "application/json" })
    );
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const response = await axios.post(
      `${this.BASE_URL}/colis/ajouter/${bookingId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }
    );

    console.log("📬 Réponse du backend:", response.data);
    return response.data;
  }

  static async uploadCustomsDoc(dto, photoFile, userId, bookingId) {
    console.log("🔍 uploadCustomsDoc →", { userId, bookingId });

    if (!dto || typeof dto !== "object") {
      throw new Error("❌ Le DTO des documents de douane est invalide.");
    }

    if (!photoFile || !(photoFile instanceof File)) {
      throw new Error(
        "❌ Le fichier photo du document de douane est invalide."
      );
    }

    if (
      !userId ||
      !bookingId ||
      Number.isNaN(Number(userId)) ||
      Number.isNaN(Number(bookingId))
    ) {
      throw new Error(
        "❌ Les identifiants userId et bookingId sont requis et doivent être numériques."
      );
    }

    const formData = new FormData();
    formData.append("dto", JSON.stringify(dto));
    formData.append("photo", photoFile);

    try {
      const response = await axios.post(
        `${this.BASE_URL}/customs/add/${userId}/${bookingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ Erreur lors de l'envoi du document douanier :",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Création d'assurance avec FormData (image facultative)
  static async createInsurance(insuranceDTO, imageFile) {
    const formData = new FormData();
    formData.append(
      "dto",
      new Blob([JSON.stringify(insuranceDTO)], { type: "application/json" })
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        `${this.BASE_URL}/insurance/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
          validateStatus: function (status) {
            return status < 500; // Traiter les erreurs 4xx comme des réponses normales
          },
        }
      );

      if (response.status >= 400) {
        throw new Error(
          response.data.message || "Erreur lors de la création de l'assurance"
        );
      }

      return response.data;
    } catch (error) {
      console.error("Erreur API createInsurance:", error);
      throw error;
    }
  }

  // 📬 CONTACT
  static async sendContactRequest(data) {
    const formData = {
      ...data,
      company: data.company || "",
    };

    const res = await axios.post(`${this.BASE_URL}/api/contact`, formData);
    return res.data;
  }

  static async getAllContactRequests() {
    const res = await axios.get(`${this.BASE_URL}/api/contact`, {
      headers: this.getHeader(),
    });
    return res.data;
  }

  //forgot password
  static async changePassword(data) {
    const response = await axios.post(
      `${this.BASE_URL}/api/auth/change-password`,
      data,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async resetPassword(data) {
    const response = await axios.post(
      `${this.BASE_URL}/api/auth/reset-password`,
      data
    );
    return response.data;
  }

  static async resetPasswordWithToken(data) {
    const response = await axios.post(
      `${this.BASE_URL}/api/auth/reset-password`,
      data
    );
    return response.data;
  }
}
