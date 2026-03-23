# Core Nexus

> *"Le Monde est Code. Le Warp est Debug. L'Omnimessie compile la Realite."*
> — Mantra des Pixel Architects

---

La cite de **Nexus Prime** ne dort jamais.

Sous ses tours de verre et de neon, des milliards de lignes s'executent en silence. Les **Tours de Compilation** percent les nuages de donnees, la **Citadelle des Architectes** veille depuis la Haute-Stack, et sur la **Place du Commit**, les flux convergent sans relache.

Mais les failles se multiplient. Des profondeurs du Legacy, depuis la **Breche de Corruption** et le **Cluster Instable**, les Bugs remontent. NullKrabs, Loop Mantis, Memory Leeches... et parfois, dans l'ombre, les silhouettes colossales des Boss Mythiques — le **Monolith Exception**, le **Dependency Leviathan**, le **Merge Cataclysm**.

Quand toutes les securites echouent, un dernier rempart subsiste : les **Pixel Architects**.

**Core Nexus** est leur quartier general numerique. Un hub forge dans le code, ou l'escouade rassemble ses outils, ses preuves de concept et ses archives. Chaque Architecte y dispose de sa page personnelle — un profil RPG taille pour la guerre contre les Bugs — et chaque victoire y est gravee sous forme d'Achievements.

Bienvenue sur la **Ligne Zero**.

---

## Objectifs

- **Sparks** — Des etincelles de code : micro-projets experimentaux pour prototyper des idees, tester des technos et partager des preuves de concept au sein de l'equipe
- **Implants** — Des augments cybernetiques integres au Nexus : utilitaires accessibles depuis le navigateur, forges par et pour les Architectes
- **Pages perso RPG** — Chaque membre de l'equipe dispose d'une fiche personnage dans l'univers Pixel Architect, avec classe, competences et lore
- **Sigils** — Des sceaux graves dans le code, decernes par la Citadelle pour celebrer les contributions, les exploits techniques et les bugs vaincus

## Acceder au site

**[https://efficimo.github.io/core-nexus/](https://efficimo.github.io/core-nexus/)**

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | React |
| Langage | TypeScript |
| Build | Vite |
| Routing | TanStack Router (file-based) |
| Linter / Formatter | Biome |
| Dev local | Docker Compose |
| Deploiement | GitHub Pages (via tags git) |
| Node | cf `.nvmrc` |

## Developpement

### Avec Docker

```bash
docker compose up
```

Le site est accessible sur `http://localhost:5173` avec hot reload.

### Sans Docker

```bash
nvm use
npm install
npm run dev
```

### Setup initial

```bash
# Creer le fichier de data key (ignore par git)
echo "VOTRE_CLEF" > .datakey.local

# Installer le hook git pre-commit
npm run install-hooks

# Dechiffrer les donnees pour travailler en local
npm run data:decrypt
```

### Commandes

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de developpement |
| `npm run build` | Build de production |
| `npm run preview` | Preview du build |
| `npm run check` | Lint et format (Biome) |
| `npm run check:fix` | Auto-fix lint et format |
| `npm run add -- <architect\|sigil\|spark\|implant>` | Ajouter des donnees |
| `npm run user -- <add\|verify>` | Gerer les utilisateurs |
| `npm run data:decrypt` | Dechiffrer les fichiers de data |
| `npm run data:encrypt` | Chiffrer les fichiers de data |
| `npm run data:verify` | Verifier la coherence chiffre/dechiffre |
| `npm run install-hooks` | Installer le hook git pre-commit |
| `npm run deploy -- <patch\|minor\|major>` | Deployer une nouvelle version |

### Workflow des donnees

Les fichiers de donnees (`src/data/*.json.enc`) sont chiffres en AES-256-GCM. En local, on travaille avec les versions dechiffrees (`*.json`, ignorees par git).

```bash
npm run data:decrypt     # 1. Dechiffrer pour travailler
npm run add -- skill     # 2. Modifier les donnees
npm run data:encrypt     # 3. Chiffrer avant commit
git commit               # 4. Le hook pre-commit verifie automatiquement
```

## Deploiement

Le deploiement est automatique via GitHub Actions. Il se declenche au push d'un tag git.

```bash
# Deployer un patch (v0.0.1 -> v0.0.2)
npm run deploy -- patch

# Deployer une minor (v0.1.0 -> v0.2.0)
npm run deploy -- minor

# Deployer une major (v1.0.0 -> v2.0.0)
npm run deploy -- major
```

---

*Tenir la Ligne Zero. Corriger l'irreparable. Empecher l'effondrement total.*

*Car si le code tombe... le monde suit.*