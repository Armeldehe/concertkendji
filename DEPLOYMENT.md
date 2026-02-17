# 🚀 Guide de Déploiement Vercel - Kendji Concert

Ce guide vous accompagne pas à pas pour déployer votre site sur Vercel.

## Prérequis

- [x] Compte GitHub
- [ ] Compte Vercel (gratuit)
- [ ] Mot de passe d'application Gmail configuré

---

## Étape 1 : Configuration du Mot de Passe Gmail

**Avant de déployer**, vous devez créer un mot de passe d'application Gmail :

1. Allez sur [Google Account Security](https://myaccount.google.com/security)
2. Activez la **validation en 2 étapes** (si pas déjà fait)
3. Recherchez **"Mots de passe des applications"**
4. Créez un nouveau mot de passe pour **"Mail"** ou **"Autre (nom personnalisé)"**
5. **Copiez le mot de passe généré** (16 caractères sans espaces)
6. Gardez-le pour l'étape 4

---

## Étape 2 : Pousser le Code sur GitHub

```bash
# Dans le terminal, allez dans votre projet
cd c:\Users\Dell\Desktop\kendjiconcert

# Initialisez Git si pas déjà fait
git init

# Ajoutez tous les fichiers (le .gitignore protège .env)
git add .

# Créez votre premier commit
git commit -m "Initial commit - Kendji concert site"

# Créez un nouveau repository sur GitHub
# Puis liez-le à votre projet local
git remote add origin https://github.com/VOTRE_USERNAME/kendjiconcert.git
git branch -M main
git push -u origin main
```

> ⚠️ **Vérification importante** : Le fichier `.env` ne doit PAS être sur GitHub. Seulement `.env.example` doit être visible.

---

## Étape 3 : Déployer sur Vercel

### Option A : Via le Site Web Vercel (Recommandé)

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur **"Add New Project"**
4. Sélectionnez votre repository **"kendjiconcert"**
5. Vercel détectera automatiquement votre configuration
6. **NE DÉPLOYEZ PAS ENCORE** - Passez à l'étape 4 pour configurer les variables

### Option B : Via CLI

```bash
# Installez Vercel CLI
npm install -g vercel

# Déployez
vercel

# Suivez les instructions
# Répondez 'Y' pour lier avec votre compte Vercel
```

---

## Étape 4 : Configurer les Variables d'Environnement

Dans le dashboard Vercel avant de déployer :

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez les variables suivantes **UNE PAR UNE** :

| Nom | Valeur | Exemple |
|-----|--------|---------|
| `MONGODB_URI` | Votre URI MongoDB | `mongodb+srv://user:password@cluster.mongodb.net/` |
| `MONGODB_DB` | Nom de la base de données | `cardcode` |
| `MONGODB_COLLECTION` | Nom de la collection | `kendji` |
| `ALERT_EMAIL` | Email pour recevoir les notifications | `armeldehe878@gmail.com` |
| `GMAIL_USER` | Votre adresse Gmail | `armeldehe878@gmail.com` |
| `GMAIL_APP_PASSWORD` | Mot de passe d'app Gmail (Étape 1) | `xxxx xxxx xxxx xxxx` (16 caractères) |

3. Cliquez sur **"Save"** pour chaque variable
4. Cliquez sur **"Deploy"** ou **"Redeploy"**

---

## Étape 5 : Test du Déploiement

Une fois le déploiement terminé, Vercel vous donne une URL (ex: `https://kendjiconcert.vercel.app`)

### Tests à effectuer :

✅ **Navigation**
- [ ] Ouvrir l'URL → Doit afficher `index.html`
- [ ] Cliquer sur "Meet & Greet" → Redirige vers `payement.html`

✅ **Formulaire de Paiement**
- [ ] Remplir le formulaire avec des données de test
- [ ] Total affiché : **199,99 €**
- [ ] Entrer le code promo **"KENDJI878"**
- [ ] Prix réduit à **20,00 €**
- [ ] Cliquer sur "Payer"

✅ **Vérifications Backend**
- [ ] Modal de confirmation apparaît
- [ ] Données enregistrées dans MongoDB (vérifier via MongoDB Atlas)
- [ ] Email reçu sur `armeldehe878@gmail.com` avec les détails
- [ ] Email contient : nom, prénom, montant, code promo

✅ **Sécurité**
- [ ] Vérifier sur GitHub que `.env` n'est PAS visible
- [ ] Variables d'environnement uniquement dans Vercel Dashboard

---

## Commandes Utiles

```bash
# Voir les logs en temps réel
vercel logs

# Redéployer après des modifications
git add .
git commit -m "Description des changements"
git push

# Vercel redéploie automatiquement après chaque push !
```

---

## En Cas de Problème

### Email non reçu
- Vérifiez que `GMAIL_APP_PASSWORD` est correct dans Vercel
- Vérifiez les logs Vercel pour voir les erreurs : `vercel logs`
- Assurez-vous que la validation en 2 étapes est active sur Gmail

### Erreur MongoDB
- Vérifiez que `MONGODB_URI` est correct
- Dans MongoDB Atlas, vérifiez que l'IP `0.0.0.0/0` est autorisée dans Network Access

### Page 404
- Vérifiez que `vercel.json` est bien dans le repository
- Vérifiez la configuration dans le dashboard Vercel

---

## 🎉 Félicitations !

Votre site est maintenant en ligne ! Partagez le lien avec votre instructeur :

```
https://VOTRE_PROJET.vercel.app
```
