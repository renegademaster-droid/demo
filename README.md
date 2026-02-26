# GDS Demo

React-sovellus, joka käyttää GDS-design-järjestelmää.

## Kehitys

```bash
pnpm install   # tai npm install
pnpm dev       # tai npm run dev
```

## GitHub Pages -julkaisu

Sovellus on valmis julkaistavaksi [GitHub Pages](https://pages.github.com/) -sivustoksi.

### 1. Luo repo ja työnnä koodi

Käyttäjätunnuksesi: **renegademaster-droid**

```bash
# Jos et ole vielä git-repossa (vain demo-kansio)
cd /path/to/demo
git init
git add .
git commit -m "Initial commit: GDS demo"

# Luo GitHubissa uusi repo nimellä "demo" (Settings → ei valita README)
# Sitten:
git remote add origin https://github.com/renegademaster-droid/demo.git
git branch -M main
git push -u origin main
```

**Huom:** Jos projekti on osa isompaa monorepoa (gds/demo ja gds/GDS), voit joko:
- työntää koko monorepon GitHubiin ja konfiguroida workflowin buildaamaan juuri tämän `demo`-kansion, tai
- kopioida vain `demo`-kansion omaan repoonsa ja korvata `package.json`:n `workspace:*`-riippuvuudet (@gds/icons, @gds/react) julkaistuilla versioilla tai poistaa ne väliaikaisesti.

### 2. Ota GitHub Pages käyttöön

1. Avaa **https://github.com/renegademaster-droid/demo**
2. **Settings** → **Pages**
3. **Build and deployment** -kohdassa:
   - **Source:** GitHub Actions
4. Tallenna

### 3. Deploy-workflow

Kun työnnät muutokset haaraan `main`, workflow **Deploy to GitHub Pages** buildaa sovelluksen ja julkaisee sen. Ensimmäinen käynnistys tapahtuu pushin jälkeen.

**Sivuston osoite:**  
**https://renegademaster-droid.github.io/demo/**

### 4. SPA-reititys

Sovellus on single-page app (React Router). GitHub Pages ei tue palvelinpuolen reititystä, joten workflow kopioi `index.html` → `404.html`. Tällöin suora linkki (esim. `/demo/sauna`) lataa saman sovelluksen ja reititys toimii.

## Rakenteen lyhyt kuvaus

- **Layout:** Päälayout, navigaatio, mobiilivalikko (drawer)
- **Sivut:** Etusivu, Lumon, Sauna, Theme, Study, Summary
- **Sauna:** Dashboard, kartta (Leaflet), WCAG 2.1 AA -auditointi (axe-core dev-tilassa)
- **WCAG:** Skip-linkki, landmarkit, aria-labelit; lisätietoa: `docs/WCAG-2.1-AA-check.md`
