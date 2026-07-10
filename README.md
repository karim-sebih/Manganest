# MangaNest

Plateforme web de lecture de mangas avec système d'authentification, gestion de favoris et progression de lecture.

**React** · **Node.js / Express** · **MySQL / Sequelize** · **JWT** · **Vite** · **Tailwind CSS**

---

## Table des matières

1. [Overview](#overview)
2. [Fonctionnalités](#fonctionnalités)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Installation](#installation)
6. [Variables d'environnement](#variables-denvironnement)
7. [Base de données](#base-de-données)
8. [Lancer l'application](#lancer-lapplication)
9. [API Overview](#api-overview)
10. [Sécurité](#sécurité)
11. [Accessibilité (RGAA / WCAG 2.1)](#accessibilité-rgaa--wcag-21)
12. [Lighthouse / SEO](#lighthouse--seo)
13. [Améliorations futures](#améliorations-futures)
14. [Auteur](#auteur)

---

## Overview

**MangaNest** est une application web full-stack permettant aux utilisateurs de naviguer, rechercher et lire des mangas. Elle s'appuie sur l'API **MangaDex** pour récupérer des données manga à jour et propose un système complet de suivi de lecture personnel.

---

## Fonctionnalités

- Inscription / Connexion sécurisé avec JWT
- Navigation par genres, statuts, classements
- Système de favoris par utilisateur
- Progression de lecture (chapitre en cours)
- Double protection par rôles (frontend + backend)
- Internationalisation (FR / EN)
- Accessibilité conforme RGAA / WCAG 2.1
- API RESTful documentée

---

## Tech Stack

### Frontend

| Technologie | Version |
|---|---|
| React | 19.2 |
| Vite | 8.0 |
| React Router | 7.15 |
| TanStack Query | 5.100 |
| Tailwind CSS | 4.3 |
| Zod | 4.4 |
| i18next | 26.3 |
| Lucide React | 1.14 |

### Backend

| Technologie | Version |
|---|---|
| Node.js | 20+ |
| Express | 5.2 |
| Sequelize | 6.37 |
| MySQL | 8.0 |
| JWT (jsonwebtoken) | 9.0 |
| bcrypt | 6.0 |
| Multer | 2.1 |
| Axios | 1.15 |

---

## Architecture

```
Manganest/
|
|--back/                       # API Node.js / Express
|   |--config/                 # Configuration Sequelize
|   |--migrations/            # Schémas de base de données
|   |--seeders/                # Données de test
|   |--uploads/                # Fichiers statiques uploadés
|   |--src/
|       |--controllers/        # Contrôleurs (logique métier)
|       |--db/                 # Connexion MySQL
|       |--locals/             # Variables locales Express
|       |--middlewares/        # Auth, rôles, validation
|       |--models/             # Modèles Sequelize
|       |--routes/             # Définition des routes
|       |--services/           # Services métier
|       |--utils/              # Helpers / utilitaires
|   |--index.js                # Point d'entrée
|   |--.env.exemple
|   |--.sequelizerc
|
|--front/                      # Application React (Vite)
|   |--public/
|   |--src/
|       |--api/                # Appels Axios
|       |--assets/             # Images / ressources
|       |--components/         # Composants réutilisables
|       |--layouts/            # Structure de pages
|       |--lib/                 # Config et hooks
|       |--middleware/          # Guards côté client
|       |--pages/              # Pages SPA
|       |--utils/              # Helpers frontend
|   |--index.html
|   |--vite.config.js
|
|--README.md
|--package-lock.json
```

### Flux de données

```
  CLIENT                           SERVEUR
  React SPA                   Express API
  React Router                Middleware Auth
  TanStack Query      --JWT--> Routes
  Axios                   --> Controllers
                            --> Models (Sequelize)
                            --> MySQL

  MangaNest                 API MangaDex
  <-- données manga --      (source des mangas)
```

---

## Installation

### Prérequis

- Node.js 20+
- MySQL 8.0
- npm

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/karim-sebih/Manganest.git
cd Manganest

# 2. Backend
cd back
npm install

# 3. Frontend
cd ../front
npm install
```

---

## Variables d'environnement

Dans le dossier `back/`, créer un fichier `.env` à partir du modèle `.env.exemple` :

```env
# ============================================
# SERVEUR
# ============================================
PORT=3000

# ============================================
# BASE DE DONNÉES MySQL
# ============================================
DB_NAME=manganest
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=3306

# ============================================
# AUTHENTIFICATION JWT
# ============================================
JWT_SECRET=votre_secret_jwt_long_et_securise_minimum_64_caracteres
JWT_EXPIRES_IN=24h
```

> **Important** : Le JWT_SECRET doit contenir au moins 64 caractères. Utilisez une valeur aléatoire complexe et ne la partagez jamais.

---

## Base de données

### Créer la base

```sql
CREATE DATABASE manganest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Migrations (creation des tables)

```bash
cd back

# Exécuter toutes les migrations
npm run db:migrate

# Vérifier le statut des migrations
npm run db:migrate:status

# Annuler la dernière migration
npm run db:migrate:undo

# Annuler toutes les migrations
npm run db:migrate:undo:all
```

### Seeders (donnees de test)

```bash
# Lancer les seeders
npx sequelize-cli db:seed:all

# Annuler le dernier seeder
npx sequelize-cli db:seed:undo

# Annuler tous les seeders
npx sequelize-cli db:seed:undo:all
```

---

## Lancer l'application

### Backend

```bash
cd back

# Mode développement (nodemon, auto-reload)
npm run dev

# Mode développement + migration automatique
npm run dev:migrate

# Mode production
npm start
```

Le serveur API est accessible sur `http://localhost:3000`

### Frontend

```bash
cd front

# Mode développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

L'application est accessible sur `http://localhost:5173`
ou
L'application est accessible sur `http://localhost:4173` pour run preview

---

## API Overview

### Authentification

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/auth/register` | Inscription d'un nouvel utilisateur | Non |
| POST | `/api/auth/login` | Connexion (retourne le JWT) | Non |
| POST | `/api/auth/logout` | Déconnexion | Oui |
| GET | `/api/auth/me` | Profil de l'utilisateur courant | Oui |

### Utilisateurs (Admin)

| Méthode | Route | Description | Auth | Rôle |
|---------|-------|-------------|------|------|
| GET | `/api/users` | Liste tous les utilisateurs | Oui | Admin |
| PUT | `/api/users/:id` | Modifie un utilisateur | Oui | Admin |
| DELETE | `/api/users/:id` | Supprime un utilisateur | Oui | Admin |

### Manga (MangaDex Proxy)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/manga/feed` | Liste des mangas (filtres, tri, pagination) | Non |
| GET | `/api/manga/:id` | Détail d'un manga | Non |
| GET | `/api/manga/:id/chapters` | Chapitres d'un manga | Non |

### Favoris

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/favorites` | Liste des favoris de l'utilisateur | Oui |
| POST | `/api/favorites` | Ajouter un manga aux favoris | Oui |
| DELETE | `/api/favorites/:id` | Retirer un manga des favoris | Oui |

### Progression de lecture

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/progress` | Progression de lecture de l'utilisateur | Oui |
| PUT | `/api/progress` | Mettre à jour le chapitre en cours | Oui |

---

## Sécurité

### Double protection par rôles

L'application distingue les utilisateurs **ADMIN** et **USER**. La sécurité est appliquée à deux niveaux :

**Frontend (protection cosmétique)**
- Le routeur SPA vérifie le rôle stocké localement via `roleGuard` avant de charger les pages privées
- Masque les éléments visuels (menu admin) selon le rôle côté client

**Backend (protection réelle)**
- Chaque route protégée passe par le middleware `AuthMiddleware(rolesAutorisés)`
- Le middleware recharge le rôle réel de l'utilisateur depuis la **base de données** à chaque requête
- Toute falsification du rôle côté client est bloquée

### Mesures implémentées

| Mesure | Détail |
|--------|--------|
| JWT | Tokens signés HS256, expiration 24h, stockés côté client |
| bcrypt | Mots de passe hachés avec salt automatique (cost factor 10) |
| CORS | Origines whitelistées (`localhost:5173` + Vercel) |
| RBAC Middleware | Vérification du rôle en base à chaque requête protégée |
| Validation | Zod côté frontend, validation Express côté backend |
| Fichiers statiques | Dossier `/uploads` exposé en lecture seule (pas de code) |

---

## Accessibilité (RGAA / WCAG 2.1)

L'application respecte les critères du **Référentiel Général d'Amélioration de l'Accessibilité** et des normes **WCAG 2.1** :

| Critère | Mise en oeuvre |
|---------|---------------|
| Sémantique HTML | Balises `nav`, `main`, `section`, `footer` (pas de div génériques) |
| Hiérarchie des titres | Un seul `h1` par page, structure `h2` → `h3` respectée |
| Texte alternatif | Attribut `alt` descriptif sur toutes les images |
| Libellés explicites | Liens avec textes clairs (pas de "cliquez ici") |
| Focus visible | Contour rouge `#F80505` sur `:focus-visible` (WCAG 2.1 - 2.4.7) |
| Navigation clavier | Tous les éléments interactifs accessibles au clavier |

---

## Lighthouse / SEO

L'application est pensée pour les audits **Google Lighthouse** :

- Structure sémantique HTML利于 l'indexation par les moteurs de recherche
- Images avec attributs `alt` et dimensions déclarées
- Temps de chargement réduit grâce à **Vite** (HMR + code splitting automatique)
- Single Page Application — pas de rechargement complet de la page
- Audit Lighthouse complet prévu via GitHub Actions (CI/CD)

---

## Améliorations futures

- Ajout de tests automatisés (Jest + Supertest) sur les routes API
- Pipeline CI/CD avec GitHub Actions
- Déploiement continu (Vercel pour le frontend, Railway/Render pour le backend)
- Cache Redis pour les appels MangaDex (limiter les requêtes API)
- Système de commentaires et de notes sur les mangas
- Notifications email (rappel de lecture, newsletter)
- PWA (Progressive Web App) pour lecture hors-ligne
- Mode sombre / système de thèmes
- Tableau de bord analytique pour les administrateurs

---

## Auteur

**Karim Sebih**
- GitHub : [karim-sebih](https://github.com/karim-sebih)
- Projet : [Manganest](https://github.com/karim-sebih/Manganest)

---

*Développé dans le cadre d'un projet académique.*
