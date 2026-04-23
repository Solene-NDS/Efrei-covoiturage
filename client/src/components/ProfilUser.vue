<template>
  <div class="page-container">
    <div v-if="!user" class="not-logged">
      <p>Vous devez être connecté pour accéder à votre profil.</p>
      <router-link to="/auth" class="btn btn-primary">Se connecter</router-link>
    </div>

    <template v-else>
      <!-- En-tête profil -->
      <div class="profile-header card">
        <div class="avatar">{{ user.prenom[0] }}{{ user.nom[0] }}</div>
        <div>
          <h2>{{ user.prenom }} {{ user.nom }}</h2>
          <p class="email">{{ user.email }}</p>
        </div>
      </div>

      <!-- Mes trajets publiés -->
      <section class="section">
        <div class="section-header">
          <h3>Mes trajets publiés</h3>
          <button class="btn btn-primary" @click="showAjout = true">+ Publier un trajet</button>
        </div>

        <div v-if="mesTrajets.length === 0" class="empty-state">
          Vous n'avez pas encore publié de trajet.
        </div>

        <div v-else class="trajets-grid">
          <div v-for="t in mesTrajets" :key="t.id" class="trajet-card card">
            <div class="trajet-header">
              <span class="route">{{ t.lieu_depart }} → {{ t.destination }}</span>
              <span class="places" :class="{ full: t.nb_reservations >= t.places_disponibles }">
                {{ t.places_disponibles - t.nb_reservations }}/{{ t.places_disponibles }} places
              </span>
            </div>
            <div class="trajet-info">
              <span>📅 {{ formatDate(t.date_trajet) }}</span>
              <span>🕐 {{ t.heure_depart }}</span>
            </div>
            <p v-if="t.description" class="trajet-desc">{{ t.description }}</p>
            <div class="trajet-actions">
              <button class="btn btn-outline btn-sm" @click="editTrajet(t)">Modifier</button>
              <button class="btn btn-danger btn-sm" @click="deleteTrajet(t.id)">Supprimer</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Mes réservations -->
      <section class="section">
        <h3>Mes réservations</h3>
        <div v-if="mesReservations.length === 0" class="empty-state">
          Vous n'avez pas encore réservé de trajet.
        </div>
        <div v-else class="trajets-grid">
          <div v-for="r in mesReservations" :key="r.reservation_id" class="trajet-card card">
            <div class="trajet-header">
              <span class="route">{{ r.lieu_depart }} → {{ r.destination }}</span>
            </div>
            <div class="trajet-info">
              <span>📅 {{ formatDate(r.date_trajet) }}</span>
              <span>🕐 {{ r.heure_depart }}</span>
              <span>👤 {{ r.prenom }} {{ r.nom }}</span>
            </div>
            <div class="trajet-actions">
              <button class="btn btn-danger btn-sm" @click="cancelReservation(r.reservation_id)">Annuler</button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Modal ajout/modification -->
    <AjoutTrajet
      v-if="showAjout"
      :trajet="selectedTrajet"
      @close="closeModal"
      @saved="onSaved"
    />
  </div>
</template>

<script>
import axios from 'axios'
import AjoutTrajet from './AjoutTrajet.vue'
axios.defaults.withCredentials = true

export default {
  name: 'ProfilUser',
  components: { AjoutTrajet },
  props: { user: { type: Object, default: null } },
  data() {
    return {
      mesTrajets: [],
      mesReservations: [],
      showAjout: false,
      selectedTrajet: null
    }
  },
  mounted() { if (this.user) this.loadData() },
  watch: { user(v) { if (v) this.loadData() } },
  methods: {
    async loadData() {
      const [t, r] = await Promise.all([
        axios.get('/api/trajets/mes-trajets'),
        axios.get('/api/trajets/mes-reservations')
      ])
      this.mesTrajets = t.data
      this.mesReservations = r.data
    },
    editTrajet(t) { this.selectedTrajet = t; this.showAjout = true },
    closeModal() { this.showAjout = false; this.selectedTrajet = null },
    async onSaved() { this.closeModal(); await this.loadData() },
    async deleteTrajet(id) {
      if (!confirm('Supprimer ce trajet ?')) return
      await axios.delete(`/api/trajets/${id}`)
      await this.loadData()
    },
    async cancelReservation(id) {
      if (!confirm('Annuler cette réservation ?')) return
      await axios.delete(`/api/reservations/${id}`)
      await this.loadData()
    },
    formatDate(d) {
      return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })
    }
  }
}
</script>

<style scoped>
.not-logged { text-align: center; padding: 60px 20px; }
.not-logged p { margin-bottom: 20px; color: #666; font-size: 1.1rem; }
.profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
.avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: #003366; color: #f0c040;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; font-weight: 700;
}
.profile-header h2 { font-size: 1.4rem; color: #003366; }
.email { color: #666; font-size: 0.95rem; }
.section { margin-bottom: 40px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section h3 { font-size: 1.3rem; color: #003366; margin-bottom: 20px; }
.section-header h3 { margin-bottom: 0; }
.trajets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.trajet-card { border-left: 4px solid #003366; }
.trajet-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.route { font-weight: 600; color: #003366; font-size: 1rem; }
.places { font-size: 0.85rem; font-weight: 600; color: #27ae60; white-space: nowrap; margin-left: 8px; }
.places.full { color: #e74c3c; }
.trajet-info { display: flex; gap: 16px; flex-wrap: wrap; font-size: 0.9rem; color: #555; margin-bottom: 8px; }
.trajet-desc { font-size: 0.9rem; color: #666; font-style: italic; margin-bottom: 12px; }
.trajet-actions { display: flex; gap: 8px; margin-top: 12px; }
.empty-state { text-align: center; padding: 32px; color: #999; background: white; border-radius: 12px; }
</style>
