<template>
  <div class="page-container">
    <div class="auth-wrapper">
      <div class="auth-tabs">
        <button :class="['tab', { active: mode === 'login' }]" @click="mode = 'login'">Connexion</button>
        <button :class="['tab', { active: mode === 'register' }]" @click="mode = 'register'">Inscription</button>
      </div>

      <!-- CONNEXION -->
      <div v-if="mode === 'login'" class="card">
        <h2>Connexion</h2>
        <div class="form-group">
          <label>Email</label>
          <input v-model="loginForm.email" type="email" placeholder="votre@email.com" />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input v-model="loginForm.password" type="password" placeholder="••••••••" />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button class="btn btn-primary w-full" @click="login">Se connecter</button>
        <p class="switch-text">Pas encore de compte ? <a @click="mode = 'register'">S'inscrire</a></p>
      </div>

      <!-- INSCRIPTION -->
      <div v-if="mode === 'register'" class="card">
        <h2>Créer un compte</h2>
        <div class="form-row">
          <div class="form-group">
            <label>Prénom</label>
            <input v-model="registerForm.prenom" type="text" placeholder="Marie" />
          </div>
          <div class="form-group">
            <label>Nom</label>
            <input v-model="registerForm.nom" type="text" placeholder="Dupont" />
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="registerForm.email" type="email" placeholder="votre@efrei.net" />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input v-model="registerForm.password" type="password" placeholder="Minimum 6 caractères" />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <p v-if="success" class="success-msg">{{ success }}</p>
        <button class="btn btn-primary w-full" @click="register">Créer mon compte</button>
        <p class="switch-text">Déjà un compte ? <a @click="mode = 'login'">Se connecter</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true

export default {
  name: 'AuthUser',
  emits: ['login'],
  data() {
    return {
      mode: 'login',
      error: '',
      success: '',
      loginForm: { email: '', password: '' },
      registerForm: { nom: '', prenom: '', email: '', password: '' }
    }
  },
  methods: {
    async login() {
      this.error = ''
      try {
        const res = await axios.post('/api/login', this.loginForm)
        this.$emit('login', res.data.user)
        this.$router.push('/profil')
      } catch (e) {
        this.error = e.response?.data?.error || 'Erreur de connexion'
      }
    },
    async register() {
      this.error = ''
      this.success = ''
      if (this.registerForm.password.length < 6) {
        this.error = 'Le mot de passe doit faire au moins 6 caractères'
        return
      }
      try {
        const res = await axios.post('/api/register', this.registerForm)
        this.$emit('login', res.data.user)
        this.$router.push('/profil')
      } catch (e) {
        this.error = e.response?.data?.error || 'Erreur lors de l\'inscription'
      }
    }
  }
}
</script>

<style scoped>
.auth-wrapper { max-width: 480px; margin: 0 auto; }
.auth-tabs { display: flex; margin-bottom: 0; }
.tab {
  flex: 1; padding: 14px; border: none; cursor: pointer;
  font-size: 1rem; font-weight: 600; background: #e9ecef; color: #666;
  transition: all 0.2s;
}
.tab:first-child { border-radius: 12px 0 0 0; }
.tab:last-child { border-radius: 0 12px 0 0; }
.tab.active { background: white; color: #003366; }
.card { border-radius: 0 0 12px 12px; }
.card h2 { font-size: 1.4rem; color: #003366; margin-bottom: 24px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.w-full { width: 100%; margin-top: 8px; }
.switch-text { text-align: center; margin-top: 16px; color: #666; font-size: 0.9rem; }
.switch-text a { color: #003366; font-weight: 600; cursor: pointer; }
.switch-text a:hover { text-decoration: underline; }
</style>
