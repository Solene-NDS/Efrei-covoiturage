<template>
  <div class="page-container">
    <h1 class="page-title">Trajets disponibles</h1>

    <!-- Filtres -->
    <div class="filters card">
      <div class="form-group">
        <label>Destination</label>
        <input v-model="search" type="text" placeholder="Rechercher une destination..." />
      </div>
    </div>

    <div v-if="loading" class="loading">Chargement des trajets...</div>

    <div v-else-if="filteredTrajets.length === 0" class="empty-state card">
      Aucun trajet disponible pour le moment.
    </div>

    <div v-else class="trajets-list">
      <div v-for="t in filteredTrajets" :key="t.id" class="trajet-card card">
        <div class="trajet-main">
          <div class="route-info">
            <div class="route">
              <span class="depart">{{ t.lieu_depart }}</span>
              <span class="arrow">→</span>
              <span class="dest">{{ t.destination }}</span>
            </div>
            <div class="meta">
              <span>📅 {{ formatDate(t.date_trajet) }}</span>
              <span>🕐 {{ t.heure_depart }}</span>
              <span>👤 {{ t.prenom }} {{ t.nom }}</span>
            </div>
            <p v-if="t.description" class="desc">{{ t.description }}</p>
          </div>
          <div class="trajet-side">
            <div class="places-badge" :class="{ full: restePlaces(t) === 0 }">
              {{ restePlaces(t) === 0 ? 'Complet' : `${restePlaces(t)} place${restePlaces(t) > 1 ? 's' : ''}` }}
            </div>
            <button
              v-if="user && restePlaces(t) > 0 && t.conducteur_id !== user.id"
              class="btn btn-primary btn-sm"
              @click="reserver(t.id)"
            >
              Réserver
            </button>
            <router-link v-else-if="!user" to="/auth" class="btn btn-outline btn-sm">
              Connexion pour réserver
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true

export default {
  name: 'ListeTrajet',
  props: { user: { type: Object, default: null } },
  data() {
    return { trajets: [], search: '', loading: true }
  },
  computed: {
    filteredTrajets() {
      if (!this.search) return this.trajets
      const s = this.search.toLowerCase()
      return this.trajets.filter(t =>
        t.destination.toLowerCase().includes(s) || t.lieu_depart.toLowerCase().includes(s)
      )
    }
  },
  async mounted() {
    const res = await axios.get('/api/trajets')
    this.trajets = res.data
    this.loading = false
  },
  methods: {
    restePlaces(t) { return t.places_disponibles - t.nb_reservations },
    async reserver(id) {
      try {
        await axios.post('/api/reservations', { trajet_id: id })
        alert('Réservation effectuée !')
        const res = await axios.get('/api/trajets')
        this.trajets = res.data
      } catch (e) {
        alert(e.response?.data?.error || 'Erreur lors de la réservation')
      }
    },
    formatDate(d) {
      return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })
    }
  }
}
</script>

<style scoped>
.filters { margin-bottom: 24px; }
.filters .form-group { margin-bottom: 0; }
.loading { text-align: center; padding: 40px; color: #666; }
.empty-state { text-align: center; padding: 40px; color: #999; }
.trajets-list { display: flex; flex-direction: column; gap: 16px; }
.trajet-card { border-left: 4px solid #003366; }
.trajet-main { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.route { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.depart { font-weight: 700; font-size: 1.1rem; color: #003366; }
.arrow { color: #999; font-size: 1.2rem; }
.dest { font-weight: 700; font-size: 1.1rem; color: #003366; }
.meta { display: flex; gap: 16px; flex-wrap: wrap; font-size: 0.9rem; color: #555; margin-bottom: 6px; }
.desc { font-size: 0.9rem; color: #777; font-style: italic; }
.trajet-side { display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 130px; }
.places-badge {
  padding: 6px 14px; border-radius: 20px;
  background: #e8f5e9; color: #27ae60;
  font-weight: 600; font-size: 0.9rem; white-space: nowrap;
}
.places-badge.full { background: #fdecea; color: #e74c3c; }
</style>
