[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.idi.ntnu.no/#https://gitlab.stud.idi.ntnu.no/it2810-h20/team-55/prosjekt-2) 
# IT2810 - Team 55 -  Prosjekt 2
Dette repoet er laget ved hjelp av node.js, npm, React, og det er lagt opp for bruk av Gitpod ved å følge merkelappen øverst. 

## For å kjøre applikasjonen lokalt
Klon repoet, innstaller node.js, og npm.
## Kommandoer
I rot mappen kan du kjøre følgende kommandoer (merk, Gitpod er lagt opp så den automatisk laster ned npm, og kjører npm start):
### `npm start`
For å starte applikasjonen.

### `npm test`
For å kjøre tester laget i __test__ mappa. 

## Øvrig informasjon
### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## Beskrivelse

### Funksjonalitet og teknologi
Per oppgavebeskrivelse er det laget applikasjon ved hjelp av React og Typescript. Det er hovedsaklig brukt funksjonelle komponenter som anbefalt, men vi har også brukt klasse (f.eks som Pageheader) for å vise forståelse og forskjellen mellom de to. UI-komponentene er implementert fra bunnen, uten bruk av eksterne tredjepartskomponenter. Det er brukt Context API for å dele et globalt tema for nettsiden, for å forhindre unødvedig passing av props nedover i App

Presentasjonen av hver installasjon foregår som et slideshow hvor bruker kan bla fram og tilbake. Hver installasjon består av en tittel, et bilde, lyd og et dikt. Bildene er konstruert som SVG elementer, noe vi foretrekker fremfor canvas ved enkle animasjoner der objektene skal bevege seg på forskjellige måter. Ved mer detaljerte animasjoner ville vi nok benyttet oss av Canvas. Mange av SVG elementene er laget fra scratch, noen er hentet fra www.flaticon.com, mens annen kode er hentet ut fra figma. Lyden er hentet fra www.freesoundslibrary.com og lagret i mappen src/audio. Det er brukt HTML sin egen <Audio tag, og lyden spilles avhengig av hvilken installasjon man velger i slideshowet. Teksten er hentet dynamisk fra https://poetrydb.org/author,title/Shakespeare;Sonnet ved hjelp av React sin fetch() funksjon. Diktene er valgt tilfeldig for hver installasjon, men brukeren har mulighet til å laste inn nye dikt og dermed tilpasse installasjonene selv.

Brukerinteraksjon består av: 
- Valg av fargeteama i headeren.
- Start og stopp for lyd/animasjon
- Hente nytt dikt
- Bla fram og tilbake i slideshow

Applikasjonen bruker local storage for lagring av dikt og fargetema. For plassering i slideshow er det brukt session storage. Det betyr at brukerens valg av installasjon i slideshowet vil resettes til det første elementet når nettsiden lukkes, mens fargetema og dikt vil være det samme ettersom det lagres i localstorage. 

### Responsiv design
Innholdet på siden endrer seg i forhold til høyde og breddeformatet på vinduet, noe som bidrar til responsiv oppførsel. For å få til dette er det brukt prosent(%), viewHeight(vh), viewWidth(vw) og viewBox. F.eks. skalerer SVG bildene seg ved endring av vinduet samtidig som de opprettholder høyde/bredde formatet ved viewBox. Ved bruk av Media-queries i CSS vil overgang til mindre (vertikale) skjermer endre oppsettet av sideelementene. Knappene for slideshowet legger seg over installasjonen slik at installasjonen kan vises i vinduets fulle bredde samtidig som knappene blir bedre tilpasset mobile enheter ved at de blir større. Alt er kodet fra bunnen i CSS, og koden en forsøkt forkortet for å hindre unødvendige definisjoner. 


### Testing
Per dags dato er det lagt opp for snapshot testing med Jest. I tillegg er det laget en håndfull av simple tester for å sjekke at komponentene blir rendret. Referer til [Kommandoer](#Kommandoer) for hvordan en kjører tester via npm test. 
Under utvikling har det blitt avtalt på forhånd at alle bruker hver sin nettleser(Chrome, Firefox og Opera). Ved jevne mellomrom viser vi applikasjonen til hverandre, og sjekker at applikasjonen oppfører seg likt mellom oss. Dette gir en form for kontinuerlig testing for 3 nettlesere. Her burde vi nok heller valgt Safari, noe vi kommer tilbake til senere i [Bugs](#Bugs).

Enhetstesting ble gjort på 3 PC'er (2 stasjonær, 1 laptop), 4 mobile enheter(Android og iOS), og en tablet(Android). På PC ble det utført browsertesting i Chrome, Firefox, Safari og Opera. Det ble brukt mobilenheter med mindre oppløsning enn i media-queries for å sjekke at transformasjon av pageheader fungerer. Vi brukte en tabletenhet som hadde lengre bredde, men mindre høyde i forhold til en PC skjerm. Dette skal ikke aktivere transformasjonen av media-queries, men det var viktig for oss å teste at applikasjonen fungerer for enheter med lang bredde, og lav høyde. Til slutt brukte vi PC skjermer med vanlig 1080 oppløsning. Vi testet alle funksjonene samtidig på alle enhetene, og de oppførte seg som forventet, inkludert [Bugs](#Bugs), da noen CSS funksjoner ikke er støttet i Safari. I tillegg brukte vi nettleserens egen utviklerverktøy for test av responsivitet ved forskjellige oppløsninger, og transformasjon.

#### Bugs
- I Safari på MacOS fikk vi feil oppførsel av rotasjonspunkt til rotasjonselementene på vindmøllene når brukeren zoomer inn og ut ved "cmd+" eller "cmd-". Det er kun riktig oppførsel hvis zoomen er satt til 100%. Dette er en kjent bug i safari og vi fant heller ikke noen gunstig workaround. 
- På iOS enheter (før iOS 14) vises ikke vindmøllene eller skyene på iPhone(verken i Chrome eller Safari). Buggen er fikset i iOS 14 og har med definisjon av SVG elementer hentet med <Image taggen. 
- I noen av våre animasjoner er det brukt path-funksjonen, denne er ikke støttet i Safari, og det forventes at animasjonen ikke fungerer for beach. Vi brukte path for skyene også, men endret dette til transformX keyframes. For beach er det ikke noen gunstige alternativer til Path, da Solen ikke skal bevege seg i en rett linje som skyene gjør. Dette var noe vi oppdaget sent i utviklingen og valget om bruk av offset-path ble tatt tidlig. Her lærte vi viktigheten av å sjekke kompatibilitet til funksjoner vi ikke er kjent med før vi implementerer de. 

### GIT og Koding
Vi har kommentert koden med beskrivelse av hva funksjoner gjør og hva variabler brukes til der vi mener dette ikke er åpenbart. Vi har fulgt best practice når det kommer til navngivning av funksjoner, klasser og variabler. Ett av gruppemedlemmene har en bug i GitLab som medfører at de ikke kan godta merge requests. Som følge av dette fikk personen gjøre endringer direkte på master branchen hvis det var snakk om små endringer, selv om dette ikke er å regne som best practice. Vi håper dette ordner seg til prosjekt 3. Vi føler vi har valgt en oversiktlig struktur på repoet ved å legge SVG, Audio og Styling i hver sin mappe. Vi har delt inn komponentene i egne filer basert på deres bruksområde. Vi har satt opp issues på gitlab og hvert medlem har jobbet med issues de har fått tildelt. Vi har stort sett forholdt oss til egne brancher når vi jobbet med ulike deler av web-applikasjonen, og branchene har blitt gitt beskrivende navn knyttet til de ulike issued. Commits har stort sett blitt markert med hva oppdateringen legger til/fjerner, og hvilken issue den tilhører. Her kunne vi markert bedre med #(issue nr.), noe vi skal bli flinkere på i neste prosjekt.


