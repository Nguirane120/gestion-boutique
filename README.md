# Gestion de boutique — Fatoush Store

Application web de gestion pour une boutique de vêtements : stock, ventes, dépenses et tableau de bord, accessible sur ordinateur comme sur téléphone.

🔗 **Démo :** https://gestion-boutique-lemon.vercel.app/

<!-- Ajouter une capture d'écran ici, par exemple : ![Tableau de bord](docs/dashboard.png) -->

## Fonctionnalités

- **Tableau de bord** : ventes, dépenses et bénéfice estimé, filtrables par jour, semaine ou mois.
- **Gestion du stock** : catalogue de produits par catégorie et taille, avec indicateur visuel (en stock, stock faible, rupture).
- **Ventes** : enregistrement des ventes avec mise à jour automatique du stock, et prise en compte du prix négocié par rapport au prix catalogue.
- **Dépenses** : historique des dépenses avec motif et montant (F CFA).
- **Authentification** : accès réservé à la gérante via Firebase Auth.
- **Application installable (PWA)** : s'ajoute à l'écran d'accueil du téléphone comme une application native.

## Stack technique

| Couche | Technologies |
| --- | --- |
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend | Firebase Firestore, Firebase Auth, règles de sécurité Firestore |
| Déploiement | Vercel |

## Lancer le projet en local

```bash
git clone https://github.com/Nguirane120/gestion-boutique.git
cd gestion-boutique
npm install
cp .env.local.example .env.local   # puis remplir les clés Firebase
npm run dev
```

L'application est disponible sur http://localhost:3000.

## Auteur

**Alioune Badara Nguirane** — Développeur Full Stack Web & Mobile
[GitHub](https://github.com/Nguirane120) · [LinkedIn](https://www.linkedin.com/in/alioune-badara-nguirane-711820197/)
