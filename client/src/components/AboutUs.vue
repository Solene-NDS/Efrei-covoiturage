<template>
  <div class="page-container">
    <h1 class="page-title">À propos de nous</h1>

    <div class="about-intro card">
      <h2>EFREI Covoiturage</h2>
      <p>
        Cette plateforme a été développée dans le cadre du projet de <strong>Programmation Web Avancée</strong>
        à l'EFREI Paris (2024-2025). L'objectif est de faciliter les déplacements des étudiants
        vers le campus en proposant un service de covoiturage simple et gratuit.
      </p>
      <div class="tech-stack">
        <span class="tech-badge">Vue.js 3</span>
        <span class="tech-badge">Node.js</span>
        <span class="tech-badge">Express.js</span>
        <span class="tech-badge">SQLite</span>
        <span class="tech-badge">JWT</span>
        <span class="tech-badge">bcrypt</span>
      </div>
    </div>

    <h2 class="team-title">L'équipe</h2>
    <div class="team-grid">
  <div class="member-card card">
    <div class="member-avatar">SN</div>
    <h3>Solène N'Dah-Sekou</h3>
    <p class="member-role">Développeuse </p>
    <p class="member-desc">Étudiante en 1ère année de cycle ingénieur à l'EFREI Paris, spécialisation Data Science & IA.</p>
    <a href="https://www.linkedin.com/in/solene-n-dah-sekou" target="_blank" class="btn btn-outline btn-sm">LinkedIn</a>
  </div>
  <div class="member-card card">
    <div class="member-avatar">KD</div>
    <h3>Darryl Koudoupko</h3>
    <p class="member-role">Développeur </p>
    <p class="member-desc">Étudiant en 1ère année de cycle ingénieur à l'EFREI Paris.</p>
  </div>
  <div class="member-card card">
    <div class="member-avatar">BA</div>
    <h3>Ashley Biao</h3>
    <p class="member-role">Développeuse </p>
    <p class="member-desc">Étudiante en 1ère année de cycle ingénieur à l'EFREI Paris.</p>
  </div>
  <div class="member-card card">
    <div class="member-avatar">YP</div>
    <h3>Perrine Yehouessi</h3>
    <p class="member-role">Développeuse </p>
    <p class="member-desc">Étudiante en 1ère année de cycle ingénieur à l'EFREI Paris.</p>
  </div>
</div>

    <div class="project-info card">
      <h3>Fonctionnalités</h3>
      <ul>
        <li>✅ Inscription et connexion sécurisées (bcrypt + JWT)</li>
        <li>✅ Publication, modification et suppression de trajets</li>
        <li>✅ Réservation et annulation de places</li>
        <li>✅ Recherche de trajets par destination</li>
        <li>✅ Gestion du profil utilisateur</li>
        <li>✅ API REST complète avec Express.js</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default { name: 'AboutUs' }
</script>

<style scoped>
.about-intro { margin-bottom: 40px; }
.about-intro h2 { font-size: 1.5rem; color: #003366; margin-bottom: 12px; }
.about-intro p { color: #555; line-height: 1.7; margin-bottom: 20px; }
.tech-stack { display: flex; gap: 10px; flex-wrap: wrap; }
.tech-badge {
  background: #003366; color: white;
  padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 500;
}
.team-title { font-size: 1.5rem; color: #003366; margin-bottom: 20px; }
.team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; margin-bottom: 40px; }
.member-card { text-align: center; }
.member-avatar {
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(135deg, #003366, #00509e);
  color: #f0c040; font-size: 1.5rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.member-card h3 { font-size: 1.1rem; color: #003366; margin-bottom: 4px; }
.member-role { color: #f0c040; font-weight: 600; font-size: 0.9rem; margin-bottom: 10px; }
.member-desc { color: #666; font-size: 0.9rem; line-height: 1.5; margin-bottom: 16px; }
.project-info h3 { font-size: 1.2rem; color: #003366; margin-bottom: 16px; }
.project-info ul { list-style: none; }
.project-info li { padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; }
.project-info li:last-child { border-bottom: none; }
</style>
