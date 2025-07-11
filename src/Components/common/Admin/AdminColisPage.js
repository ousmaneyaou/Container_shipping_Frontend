import React, { useEffect, useState } from "react";
import ApiService from "../../../services/ApiServices";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Styles/AdminColisPage.css";

const AdminColisPage = () => {
  const [colisList, setColisList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [etatFilter, setEtatFilter] = useState("TOUS");
  const [paymentFilter, setPaymentFilter] = useState("TOUS");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllColis();
  }, []);

  const fetchAllColis = async () => {
    try {
      const response = await ApiService.getAllColis();
      const list = Array.isArray(response) ? response : [];
      setColisList(list);
      setFilteredList(list);
    } catch (error) {
      console.error("Erreur lors de la récupération des colis :", error);
      toast.error("Échec du chargement des colis.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (colisId) => {
    navigate(`/colis/${colisId}`);
  };

  const formatEtat = (etat) => {
    switch (etat?.toUpperCase()) {
      case "ENREGISTRE":
        return "Enregistré";
      case "EN_ATTENTE":
        return "En attente";
      case "EN_TRANSIT":
        return "En transit";
      case "LIVRE":
        return "Livré";
      case "ANNULE":
        return "Annulé";
      default:
        return etat || "Non spécifié";
    }
  };

  const handleFilterChange = (etatValue, payeValue) => {
    const etat = etatValue ?? etatFilter;
    const paye = payeValue ?? paymentFilter;

    setEtatFilter(etat);
    setPaymentFilter(paye);

    let filtered = [...colisList];

    if (etat !== "TOUS") {
      filtered = filtered.filter((colis) => colis.etat?.toUpperCase() === etat);
    }

    if (paye !== "TOUS") {
      const isPaye = paye === "PAYE";
      filtered = filtered.filter((colis) => !!colis.paymentId === isPaye);
    }

    setFilteredList(filtered);
  };

  const handleEtatChange = async (colisId, newEtat) => {
    const colis = colisList.find((c) => c.id === colisId);
    if (!colis) return;

    try {
      const updatedColis = { ...colis, etat: newEtat };
      await ApiService.updateColis(colisId, updatedColis);
      toast.success("État du colis mis à jour !");
      fetchAllColis();
    } catch (err) {
      console.error("Erreur de mise à jour :", err);
      toast.error("Impossible de mettre à jour l'état du colis.");
    }
  };

  const renderColisCard = (colis) => (
    <li
      key={colis.id}
      className={`colis-card ${colis.paymentId ? "paye" : ""}`}
    >
      <img
        src={colis.photoUrl || "/default-colis.png"}
        alt="Photo du colis"
        className="colis-image"
        onError={(e) => {
          e.target.src = "/default-colis.png";
        }}
      />
      <div className="colis-info">
        <p>
          <strong>Client:</strong> {colis.username || "Non spécifié"}
        </p>
        <p>
          <strong>Email:</strong> {colis.userEmail || "Non spécifié"}
        </p>
        <p>
          <strong>Téléphone:</strong> {colis.userPhone || "Non spécifié"}
        </p>
        <p>
          <strong>Poids:</strong> {colis.poids || "0"} kg
        </p>
        <p>
          <strong>Volume:</strong> {colis.volume || "0"} m³
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {colis.description || "Aucune description"}
        </p>
        <p>
          <strong>Prix estimé:</strong> {(colis.prixEstime || 0).toFixed(2)} $
        </p>
        <p>
          <strong>État:</strong>{" "}
          <select
            value={colis.etat}
            onChange={(e) => handleEtatChange(colis.id, e.target.value)}
          >
            <option value="ENREGISTRE">Enregistré</option>
            <option value="EN_ATTENTE">En attente</option>
            {/* <option value="EN_COURS">En cours</option> */}
            <option value="EN_TRANSIT">En transit</option>
            <option value="LIVRE">Livré</option>
            <option value="ANNULE">Annulé</option>
          </select>
        </p>
        <p>
          <strong>Payé :</strong> {colis.paymentId ? "Oui" : "Non"}
        </p>
      </div>
      <button onClick={() => handleViewDetails(colis.id)}>Voir détails</button>
    </li>
  );

  return (
    <div className="colis-list-page">
      <h1>Gestion des Colis</h1>

      <div className="filter-bar">
        <label>Filtrer par État :</label>
        <select
          value={etatFilter}
          onChange={(e) => handleFilterChange(e.target.value, null)}
        >
          <option value="TOUS">Tous</option>
          <option value="ENREGISTRE">Enregistré</option>
          <option value="EN_ATTENTE">En attente</option>
          {/* <option value="EN_COURS">En cours</option> */}
          <option value="EN_TRANSIT">En transit</option>
          <option value="LIVRE">Livré</option>
          <option value="ANNULE">Annulé</option>
        </select>

        <label>Filtrer par Paiement :</label>
        <select
          value={paymentFilter}
          onChange={(e) => handleFilterChange(null, e.target.value)}
        >
          <option value="TOUS">Tous</option>
          <option value="PAYE">Oui</option>
          <option value="NON_PAYE">Non</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-message">Chargement en cours...</p>
      ) : filteredList.length === 0 ? (
        <p className="empty-message">Aucun colis trouvé.</p>
      ) : (
        <ul className="colis-list">
          {filteredList.map((colis) => renderColisCard(colis))}
        </ul>
      )}

      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default AdminColisPage;
