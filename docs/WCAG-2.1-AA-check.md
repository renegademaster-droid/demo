# WCAG 2.1 AA – tarkistuslista

Sovelluksessa on automaattinen axe-core -auditointi (WCAG 2.1 AA -tagit) ja tämä lista tukee manuaalista tarkistusta.

## Automaattinen auditointi (selaimessa)

1. Käynnistä dev-palvelin: `pnpm dev` tai `npm run dev`
2. Avaa sovellus selaimessa (esim. http://localhost:5173)
3. Avaa DevTools → **Console**
4. Noin 1 s latauksen jälkeen näet tulokset:
   - **Vihreä:** `[WCAG 2.1 AA] ✓ Ei havaintoja`
   - **Oranssi:** `[WCAG 2.1 AA] ⚠ X havaintoa` – klikkaa auki nähdäksesi säännöt ja kohde-elementit
5. Vaihda reittiä (esim. Sauna, Theme) – auditointi ajetaan uudestaan

Auditointi ajetaan vain kehitystilassa (`import.meta.env.DEV`).

## Tarkistetut asiat (koodipohja)

| Kriteeri | Tila | Huomio |
|----------|------|--------|
| **2.4.1 Bypass Blocks (A)** | ✅ | Skip-linkki "Siirry pääsisältöön" + `#main-content` |
| **2.4.2 Page Title (A)** | ✅ | `<title>GDS Demo</title>` index.html:ssa |
| **2.4.4 Link Purpose (A)** | ✅ | Linkkien teksti selkeä; logo `aria-label="Etusivu - GDS Demo"` |
| **2.4.6 Headings and Labels (AA)** | ⚠️ | Otsikot ja labelit tarkista sivu kerrallaan |
| **3.1.1 Language of Page (A)** | ✅ | `<html lang="fi">` |
| **4.1.2 Name, Role, Value (A)** | ✅ | IconButtonit `aria-label`, Drawer otsikko "Menu" |
| **Semanttiset landmarkit** | ✅ | `header`, `nav` (aria-label="Päävalikko"), `main` (id="main-content") |
| **Näppäimistö** | ✅ | Chakra-komponentit (Drawer, Menu, Dialog) tukevat fokusta ja Esc |

## Manuaalisesti tarkistettavaa

- **1.4.3 Contrast (Minimum) (AA):** Kontrasti design-tokenien varassa; tarkista tumma/vaalea teema.
- **2.4.7 Focus Visible (AA):** Varmista, että fokus on näkyvissä (Chakra teema).
- **Sivukohtaiset otsikkohierarkiat:** H1 → H2 → H3 järjestyksessä (ei hyppyjä).
- **Lomakkeet:** Kaikki syötteet labelilla tai `aria-label` / `aria-labelledby`.
- **Kuvat:** Kaikilla informatiivisilla kuvilla `alt`-teksti; dekoratiivisilla `alt=""` tai `role="presentation"`.

## Hyödyllisiä linkkejä

- [WCAG 2.1 at a Glance](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
