<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal card">
      <div class="modal-header">
        <h3>{{ trajet ? 'Modifier le trajet' : 'Publier un trajet' }}</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="form-group">
        <label>Lieu de départ *</label>
        <input v-model="form.lieu_depart" type="text" placeholder="Ex: Paris 13e" />
      </div>
      <div class="form-group">
        <label>Destination *</label>
        <input v-model="form.destination" type="text" placeholder="Ex: EFREI Paris, Villejuif" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Date *</label>
          <input v-model="form.date_trajet" type="date" :min="today" />
        </div>
        <div class="form-group">
          <label>Heure de départ *</label>
          <input v-model="form.heure_depart" type="time" />
        </div>
      </div>
      <div class="form-group">
        <label>Nombre de places disponibles *</label>
        <input v-model.number="form.places_disponibles" type="number" min="1" max="8" />
      </div>
      <div class="form-group">
        <label>Description (optionnel)</label>
        <textarea v-model="form.description" rows="3" placeholder="Infos supplémentaires..."></textarea>
      </div>
      <p v-if="error" class="error-msg">{{ error }}</p>
      <div class="modal-footer">
        <button class="btn btn-outline" @click="$emit('close')">Annuler</button>
        <button class="btn btn-primary" @click="submit">{{ trajet ? 'Modifier' : 'Publier' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true

export default {
  name: 'AjoutTrajet',
  emits: ['close', 'saved'],
  props: { trajet: { type: Object, default: null } },
  data() {
    return {
      error: '',
      today: new Date().toISOString().split('T')[0],
      form: {
        lieu_depart: this.trajet?.lieu_depart || '',
        destination: this.trajet?.destination || '',
        date_trajet: this.trajet?.date_trajet || '',
        heure_depart: this.trajet?.heure_depart || '',
        places_disponibles: this.trajet?.places_disponibles || 1,
        description: this.trajet?.description || ''
      }
    }
  },
  methods: {
    async submit() {
      this.error = ''
      const { lieu_depart, destination, date_trajet, heure_depart, places_disponibles } = this.form
      if (!lieu_depart || !destination || !date_trajet || !heure_depart || !places_disponibles) {
        this.error = 'Veuillez remplir tous les champs obligatoires'
        return
      }
      try {
        if (this.trajet) {
          await axios.put(`/api/trajets/${this.trajet.id}`, this.form)
        } else {
          await axios.post('/api/trajets', this.form)
        }
        this.$emit('saved')
      } catch (e) {
        this.error = e.response?.data?.error || 'Erreur lors de la sauvegarde'
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.modal { width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.modal-header h3 { font-size: 1.3rem; color: #003366; }
.close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #666; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.modal-footer { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
</style>
