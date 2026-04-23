<template>
  <div>
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          🚗 EFREI Covoiturage
        </router-link>
        <div class="nav-links">
          <router-link to="/trajets">Trajets</router-link>
          <router-link to="/about">À propos</router-link>
          <template v-if="user">
            <router-link to="/profil">Mon profil</router-link>
            <button class="btn btn-outline btn-sm" @click="logout">Déconnexion</button>
          </template>
          <template v-else>
            <router-link to="/auth" class="btn btn-primary btn-sm">Connexion</router-link>
          </template>
        </div>
      </div>
    </nav>
    <router-view :user="user" @login="setUser" @logout="clearUser" />
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true

export default {
  data() {
    return { user: null }
  },
  async mounted() {
    try {
      const res = await axios.get('/api/me')
      this.user = res.data.user
    } catch { this.user = null }
  },
  methods: {
    setUser(user) { this.user = user },
    clearUser() { this.user = null },
    async logout() {
      await axios.post('/api/logout')
      this.user = null
      this.$router.push('/')
    }
  }
}
</script>

<style>
.navbar {
  background: #003366;
  color: white;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.nav-logo {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f0c040;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-links a {
  color: white;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-links a:hover, .nav-links a.router-link-active { color: #f0c040; }
.btn-sm { padding: 7px 16px; font-size: 0.9rem; }
</style>
