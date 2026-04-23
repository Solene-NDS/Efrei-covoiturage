<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">🎓 Communauté EFREI Paris</div>
        <h1>Covoiturez ensemble,<br><span>économisez ensemble</span></h1>
        <p>La plateforme de covoiturage dédiée aux étudiants et étudiantes d'EFREI Paris. Partagez vos trajets vers le campus, réduisez vos coûts et créez des liens.</p>
        <div class="hero-btns">
          <router-link to="/trajets" class="btn btn-secondary">Voir les trajets</router-link>
          <router-link to="/auth" class="btn btn-outline-white">Rejoindre la communauté</router-link>
        </div>
      </div>
      <div class="hero-img">🚗</div>
    </section>

    <!-- Features -->
    <section class="features page-container">
      <h2 class="section-title">Pourquoi EFREI Covoiturage ?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>Économisez</h3>
          <p>Partagez les frais de transport et réduisez vos dépenses quotidiennes.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🌱</div>
          <h3>Écologique</h3>
          <p>Moins de voitures sur la route, moins d'émissions de CO₂.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🤝</div>
          <h3>Solidaire</h3>
          <p>Rencontrez d'autres étudiants EFREI et renforcez les liens de la communauté.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>Simple</h3>
          <p>Publiez ou réservez un trajet en quelques clics seulement.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="page-container cta-inner">
        <h2>Prêt à covoiturer ?</h2>
        <p>Rejoignez la communauté EFREI Covoiturage dès aujourd'hui.</p>
        <router-link to="/auth" class="btn btn-secondary">Créer mon compte</router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default { name: 'HomePage' }
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #003366 0%, #00509e 100%);
  color: white;
  padding: 80px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  min-height: 480px;
}
.hero-content { max-width: 560px; }
.hero-badge {
  display: inline-block;
  background: rgba(240,192,64,0.2);
  color: #f0c040;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 20px;
}
.hero h1 { font-size: 2.8rem; line-height: 1.2; margin-bottom: 20px; }
.hero h1 span { color: #f0c040; }
.hero p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 32px; line-height: 1.6; }
.hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }
.btn-outline-white {
  display: inline-block; padding: 10px 22px; border-radius: 8px;
  border: 2px solid white; color: white; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.btn-outline-white:hover { background: white; color: #003366; }
.hero-img { font-size: 9rem; opacity: 0.15; }

.section-title { font-size: 1.8rem; font-weight: 700; color: #003366; text-align: center; margin-bottom: 40px; }
.features { padding-top: 60px; padding-bottom: 60px; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
.feature-card { background: white; border-radius: 12px; padding: 28px 24px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
.feature-icon { font-size: 2.5rem; margin-bottom: 14px; }
.feature-card h3 { font-size: 1.1rem; font-weight: 700; color: #003366; margin-bottom: 10px; }
.feature-card p { color: #666; font-size: 0.95rem; line-height: 1.5; }

.cta { background: #f0c040; padding: 60px 20px; }
.cta-inner { text-align: center; }
.cta h2 { font-size: 2rem; color: #003366; margin-bottom: 12px; }
.cta p { color: #333; margin-bottom: 28px; font-size: 1.05rem; }
</style>
