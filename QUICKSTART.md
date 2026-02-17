# 🚀 Quick Start - Déploiement Vercel

## Étapes Rapides

### 1️⃣ Créer un Mot de Passe Gmail (OBLIGATOIRE)

1. Allez sur https://myaccount.google.com/security
2. Cherchez "Mots de passe des applications"
3. Créez un mot de passe pour "Mail"
4. **COPIEZ-LE** (16 caractères)

### 2️⃣ Initialiser Git

```bash
cd c:\Users\Dell\Desktop\kendjiconcert
git init
git add .
git commit -m "Initial commit"
```

### 3️⃣ Créer Repository GitHub

1. Allez sur https://github.com/new
2. Nom: `kendjiconcert`
3. Créez le repository
4. Copiez les commandes affichées :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/kendjiconcert.git
git branch -M main
git push -u origin main
```

### 4️⃣ Déployer sur Vercel

1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub
3. Cliquez "Add New Project"
4. Sélectionnez `kendjiconcert`
5. **IMPORTANT** : Ajoutez les variables d'environnement :
   - `MONGODB_URI` → `mongodb+srv://viteauxmarie_db_user:Armel40561457@cluster0.sstr5xt.mongodb.net/`
   - `MONGODB_DB` → `cardcode`
   - `MONGODB_COLLECTION` → `kendji`
   - `ALERT_EMAIL` → `armeldehe878@gmail.com`
   - `GMAIL_USER` → `armeldehe878@gmail.com`
   - `GMAIL_APP_PASSWORD` → Votre mot de passe créé à l'étape 1
6. Cliquez "Deploy"

### 5️⃣ Tester

Votre site sera disponible sur : `https://VOTRE_PROJET.vercel.app`

✅ Testez :
- Accès page d'accueil
- Bouton "Meet & Greet"
- Code promo "KENDJI878"
- Vérifiez l'email reçu

---

## ⚠️ Problèmes Courants

**Email non reçu ?**
→ Vérifiez que `GMAIL_APP_PASSWORD` est correct dans Vercel

**Erreur MongoDB ?**
→ Dans MongoDB Atlas : Network Access → Ajoutez `0.0.0.0/0`

**Page 404 ?**
→ Vérifiez que `vercel.json` est bien poussé sur GitHub

---

Pour plus de détails, consultez [DEPLOYMENT.md](DEPLOYMENT.md)
