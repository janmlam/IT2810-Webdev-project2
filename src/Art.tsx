import React, {CSSProperties, useContext, useEffect, useState} from "react";
import './style/Art.css';
import { themes, ThemeContext } from "./App";
import beach from "./audio/beach.mp3";
import car from "./audio/car.mp3";
import mountain from "./audio/mountain.mp3";
import windmill from "./audio//windmill.mp3";
import woods from "./audio/woods.mp3";

//Nødvendig fordi man ikke kan referere til imports med string i AudioSetup funksjonen. 
const audioMap: Map<string, any> = new Map([
    ['beach', beach],
    ['mountain', mountain],
    ['windmill', windmill],
    ['car', car],
    ['woods', woods]
  ]);

//Funksjonell komponent for en installasjon
export function Art(props: { title: string, slide: number, index: number }) {
    const theme = useContext(ThemeContext).theme;
    let style = {
        transform: `translate(${-props.slide * 100}%) scale(${1 - Math.abs(props.index - props.slide) * 0.3}) `,
        backgroundColor: theme.background
    } as CSSProperties
    if(props.index !== props.slide) {
        style.filter ="blur(5px)";
    }
    return (
        <div data-testid={props.title} className={"artPiece"} style={style}>
            <h2 style={{color: theme.text}}>{props.title}</h2>
            <Svg title={props.title} index={props.index} slide={props.slide} />
            <AudioSetup title={props.title} />
            <FetchPoems title={props.title} />
        </div>
    )
}
//Setter opp riktig lydfil til riktig installasjon ved bruk av title og audioMap
function AudioSetup(props: { title: string }) {
    return (
    <audio className={"audioButton"}
        id={props.title+"Audio"}
        controls loop
        src={audioMap.get(props.title)}>
        Your browser does not support the <code>audio</code> element.
    </audio>
    );
}

//Returnerer en random Integer mellom to tall (min og max)
function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Henter dikt fra localstorage eller fra PoetryDB hvis det ikke eksisterer dikt lokalt
export function FetchPoems(props: {title: string }) {
    const theme = useContext(ThemeContext).theme;
    const [e, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [poems, setPoems] = useState([]);
    const style = {
        color: theme.text
    }
    function fetchPoem(reload: boolean = false) {
        setIsLoaded(false);
        if (reload) {
            localStorage.removeItem(props.title + "Storage");
        }
        if (localStorage.getItem(props.title + "Storage") !== null) {
            setIsLoaded(true);
            setPoems(JSON.parse(localStorage.getItem(props.title + "Storage")!))
        } else {
            fetch("https://poetrydb.org/author,title/Shakespeare;Sonnet")
                .then(res => res.json())
                .then(
                    (result) => {
                        setIsLoaded(true);
                        let getPoem = result[randInt(0, result.length - 1)].lines;
                        setPoems(getPoem);
                        localStorage.setItem(props.title + "Storage", JSON.stringify(getPoem));
                    },
                    (e) => {
                        setIsLoaded(true);
                        setError(e);
                    }
                )
        }
    }
    useEffect(() => {
        fetchPoem();
        // eslint-disable-next-line
    }, [])

    if (e) {
        return (<div>{"ERROR"} </div>);
    } else if (!isLoaded) { //Hvis man laster inn dikt spilles tail-spin SVGen av. (hentet fra https://samherbert.net/svg-loaders/)
        return (<div className="loadingDiv"><img src={"media/SVG/loading/tail-spin.svg"}  alt="loading..."/></div>)
    } else {
        return (
            //Returnerer en div av klassen "poemText" som har muligheten til å hente nye dikt  med knapp "button"
            <div className="poemText"> 
                <button className={"button"} style={{ backgroundColor: theme.webpage.button }} onClick={() => fetchPoem(true)}>Reload poem</button>
                {poems.map((poem, i) => <p style={style} key={poem[0] + poem[5] + poem[10] + i}>{poem}</p>)}
            </div>
        );
    }
}
/*  Setter opp en Svg komponentn med state som sier om animasjonen kjører eller ikke*/
export function Svg(props: { title: string, index: number, slide: number }) {
    const theme = useContext(ThemeContext).theme;
    const [paused, setPaused] = useState(false); //Sier at alle animasjonene skal starte.
    function togglePause() {
        setPaused(!paused);
    }
    const style = {backgroundColor: theme.webpage.button} as CSSProperties
    const pauseButton = <button className={"button"} style={style} onClick={togglePause}>{paused ? "Start animation" : "Pause animation"}</button>
    //Ulike caser for hvilket bilde som skal benyttes basert på tittelen
    switch (props.title) {
        case "windmill":
            return (
                <div>
                    {pauseButton}
                    <Windmill paused={paused} slide={props.slide} index={props.index}/>
                </div>
            )
        case "woods":
            return (
            <div>
                {pauseButton}
                <Woods paused={paused} slide={props.slide} index={props.index}/>
            </div>
            )
        case "beach":
            return (
                <div>
                    {pauseButton}
                    <Beach paused={paused} slide={props.slide} index={props.index}/>
                </div>
            )
        case "car":
            return (
                <div>
                    {pauseButton}
                    <Car paused={paused} slide={props.slide} index={props.index}/>
                </div>
            )
        case "mountain":
            return (
                <div>
                    {pauseButton}
                    <Mountain paused={paused} slide={props.slide} index={props.index}/>
                </div>
            )
        default:
            return (
                <svg viewBox={"0 0 1000 800"} className={"svgArt"}>
                    <rect x={0} y={0} height={800} width={1000} fill={theme.webpage.header}/>
                    <text fontSize={50} x={100} y={100} fill={theme.background}>
                        <tspan x={100} y={100}>
                            Seems like someone tried to
                        </tspan>
                        <tspan x={100} y={150}>
                            load an artwork that
                        </tspan>
                        <tspan x={100} y={200}>
                            doesn't exist... Awkward...
                        </tspan>
                    </text>
                </svg>
            )
    }
}
//En linear gradient definer alene for å forkorte koden slik at den kan gjenbrukes på flere bilder. Brukes på himmel og bakke på de fleste bildene.
const defs = (theme: number) => (
    <defs>
        <linearGradient id="paint0_linear" x1="500" y1="0" x2="500" y2="800" gradientUnits="userSpaceOnUse">
            <stop stopColor={themes[theme].sky} />
            <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="500" y1="600" x2="500" y2="800" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B9DFB8" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="200%" height="200%">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dx="4" dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
    </defs>
)

/** Funksjonen returnerer et bilde av 3 vindmøller som spinner rundt ved bruk av CSS keyframes på klassenavnet rotationElement*/
export function Windmill(props: { paused: boolean, slide:number, index:number}) {
    const theme = useContext(ThemeContext).theme;
    const themeIndex = useContext(ThemeContext).themeIndex;

    let animationStyle= {animationPlayState: "running"} as CSSProperties;
    if (props.paused || props.index !== props.slide) { //Spiller av animasjonen så lenge den ikke er pauset og er valgt i slideshowet.  
        animationStyle.animationPlayState = "paused";
    }
    return (
        <svg viewBox="0 0 1000 800">
            <rect width="1000" height="800" fill="#D6D6D6"/>
            <rect width="1000" height="800" fill="url(#paint0_linear)"/>
            <rect x="0" y="600" width="1000" height="200" fill={theme.ground}/>
            <rect x="0" y="600" width="1000" height="200" fill="url(#paint1_linear)"/>
            <line x1="250" y1="600" x2="250" y2="450" style={{stroke: "rgb(64,64,64)",strokeWidth: "2"}} />
            <line x1="500" y1="650" x2="500" y2="450" style={{stroke: "rgb(64,64,64)",strokeWidth: "4"}}/>
            <line x1="750" y1="600" x2="750" y2="450" style={{stroke: "rgb(64,64,64)",strokeWidth: "2"}}/>
            <image className={"rotationElement"} style={animationStyle} x="200" y="400" width="100" height="100" href="media/SVG/elements/windmill.svg"/>
            <image className={"rotationElement"} style={animationStyle} x="400" y="350" width="200" height="200" href="media/SVG/elements/windmill.svg"/>
            <image className={"rotationElement"} style={animationStyle} x="700" y="400" width="100" height="100" href="media/SVG/elements/windmill.svg"/>
            {defs(themeIndex)}
        </svg>
    );
}

/** Funksjonen returnerer et bilde av en strand med en sol som titter over horisonten ved bruk av CSS keyframes */
export function Beach(props: { paused: boolean, slide:number, index:number }) {
    const theme = useContext(ThemeContext).theme;
    const themeIndex = useContext(ThemeContext).themeIndex;
    let animationStyle= {animationPlayState: "running"} as CSSProperties;
    if (props.paused || props.index !== props.slide) { //Samme sjekk som over.
        animationStyle.animationPlayState = "paused";
    }
    return (
        <svg viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1000" height="800" fill="#D6D6D6" />
            <rect width="1000" height="800" fill="url(#paint0_linear)" />
            
            <g id="sun" style={animationStyle}>
                <g id="rays" style={animationStyle}>
                    <path id="svg_7" d="m270,427 c3,-13 9,-24 14,-36 c6,7 11,23 16,34 c-4,12 -10,24 -15,36 c-5,-10 -10,-22 -15,-34" fill="#ffff56" />
                    <path id="svg_11" d="m269,666 c3,-13 9,-24 14,-36 c6,7 11,23 16,34 c-4,12 -10,24 -15,36 c-5,-10 -10,-22 -15,-34" fill="#ffff56" />
                    <path transform="rotate(90 396,532) " d="m380,533 c3,-13 9,-24 14,-36 c6,7 11,23 16,34 c-4,12 -10,24 -15,36 c-5,-10 -10,-22 -15,-34" fill="#ffff56" />
                    <path transform="rotate(90 174,536) " d="m158,536 c3,-13 9,-24 14,-36 c6,7 11,23 16,34 c-4,12 -10,24 -15,36 c-5,-10 -10,-22 -15,-34" fill="#ffff56" />
                    <path transform="rotate(135 212,466) " d="m203,466 c1,-7 5,-13 8,-19 c3,3 6,12 8,18 c-2,7 -5,13 -8,19 c-3,-5 -5,-12 -8,-18" fill="#ff7b00" />
                    <path transform="rotate(135 365,617) " d="m357,618 c1,-7 5,-13 8,-19 c3,3 6,12 8,18 c-2,7 -5,13 -8,19c-3,-5 -5,-12 -8,-18" fill="#ff7b00" />
                    <path transform="rotate(45 362,475) " d="m354,475 c1,-7 5,-13 8,-19 c3,3 6,12 8,18 c-2,7 -5,13 -8,19 c-3,-5 -5,-12 -8,-18" fill="#ff7b00" />
                    <path transform="rotate(45 214,624) " d="m206,624 c1,-7 5,-13 8,-19 c3,3 6,12 8,18 c-2,7 -5,13 -8,19 c-3,-5 -5,-12 -8,-18" fill="#ff7b00" />
                </g>

                <ellipse ry="69.55261" rx="69.55261" id="svg_22" cy="548.09885" cx="285.39378" fill="#fed15f" />
            </g>
            <rect y="345.956" width="1000" height="454.044" fill={theme.sea} />
            <path
                d="M749.081 360.662C911.82 331.943 884.594 324.083 1000 298.162V800H385.11C381.504 798.794 388.887 745.261 468.95 736.581C569.029 725.73 418.413 662.94 413.603 657.537C401.329 643.75 404.873 645.588 373.162 627.206C342.506 609.435 424.947 604.228 441.176 604.228C457.405 604.228 469.879 594.649 480.699 571.14C491.518 547.63 526.112 542.453 498.162 530.699C470.212 518.944 464.075 514.08 507.353 509.559C550.63 505.038 462.639 501.61 468.95 493.472C475.261 485.334 518.899 460.92 498.162 452.782C481.572 446.272 531.241 444.603 578.125 444.301C599.463 439.479 560.253 432.71 541.36 419.485C522.978 406.618 515.488 400.169 492.647 399.265C551.471 384.559 670.956 374.449 749.081 360.662Z"
                fill={theme.sand} />
            <rect x="665.263" y="499.164" width="5.51471" height="91.9118" transform="rotate(13.5595 665.263 499.164)"
                fill="#C4C4C4" />
            <path
                d="M661.765 497.61C677.39 497.61 698.529 514.155 725.184 535.294L700.368 542.647H661.765L627.757 535.294L594.669 515.073C636.949 503.125 638.787 497.61 661.765 497.61Z"
                fill="#FF6565" />
            <path d="M699.449 595.037L590.074 605.147L605.699 631.801L718.75 620.772L699.449 595.037Z" fill="#9BEA5E" />
            
            {defs(themeIndex)}
        </svg>
    );
}

/** En funksjon som returnerer et bilde av en Bil som kjører på en vei. Animeres ved keyframes i Art.CSS på rotationElement klassen*/
export function Car(props: {paused: boolean, slide:number, index:number}) {
    const animationStyle = { //Annen måte å sjekke om animasjonen skal kjøre eller ikke.
        animationPlayState: (props.paused || props.index !== props.slide) ? "paused" : "running"
    } as CSSProperties
    return(
        <svg viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="723" width="1000" height="77" fill="#595959"/>
            <rect width="1000" height="723" fill="#EFFDFF"/>
            <rect width="1000" height="723" fill="url(#paint0_linear)"/>
            <path className={"rotationElement"} style={animationStyle} d="M383.999 729.706C383.833 712.029 369.369 697.835 351.694 698.001C334.023 698.176 319.835 712.634 320.001 730.306C320.014 731.675 320.139 733.002 320.322 734.326C322.453 750.087 335.996 762.157 352.299 761.998C369.056 761.844 382.651 748.84 383.886 732.434C383.955 731.537 384.007 730.623 383.999 729.706ZM349.039 710.185L349.124 719.389C348.117 719.657 347.18 720.067 346.307 720.603L339.726 714.148C342.389 712.081 345.556 710.697 349.039 710.185ZM335.854 718.102L342.446 724.566C341.943 725.455 341.557 726.389 341.31 727.387L332.115 727.481C332.553 723.989 333.856 720.802 335.854 718.102ZM332.131 733.019L341.395 732.933C341.667 733.924 342.061 734.854 342.58 735.706L336.101 742.308C334.059 739.661 332.655 736.486 332.131 733.019ZM340.096 746.157L346.542 739.583C347.399 740.071 348.345 740.436 349.327 740.684L349.416 749.912C345.95 749.469 342.775 748.134 340.096 746.157ZM371.833 727.103L362.63 727.193C362.37 726.19 361.96 725.256 361.445 724.387L367.907 717.794C369.961 720.457 371.321 723.616 371.833 727.103ZM354.576 710.133C358.075 710.587 361.266 711.911 363.962 713.916L357.511 720.494C356.63 719.982 355.68 719.588 354.669 719.341L354.576 710.133ZM354.954 749.859L354.868 740.631C355.855 740.375 356.784 739.989 357.637 739.478L364.205 745.937C361.562 747.959 358.416 749.352 354.954 749.859ZM368.135 742.015L361.514 735.515C362.005 734.647 362.423 733.733 362.679 732.722L371.869 732.637C371.419 736.12 370.136 739.336 368.135 742.015Z" fill="black"/>
            <path className={"rotationElement"} style={animationStyle} d="M629.999 729.706C629.833 712.029 615.369 697.835 597.694 698.001C580.023 698.176 565.835 712.634 566.001 730.306C566.014 731.675 566.139 733.002 566.322 734.326C568.453 750.087 581.996 762.157 598.299 761.998C615.056 761.844 628.651 748.84 629.886 732.434C629.955 731.537 630.007 730.623 629.999 729.706ZM595.039 710.185L595.124 719.389C594.117 719.657 593.18 720.067 592.307 720.603L585.726 714.148C588.389 712.081 591.556 710.697 595.039 710.185ZM581.854 718.102L588.446 724.566C587.943 725.455 587.557 726.389 587.31 727.387L578.115 727.481C578.553 723.989 579.856 720.802 581.854 718.102ZM578.131 733.019L587.395 732.933C587.667 733.924 588.061 734.854 588.58 735.706L582.101 742.308C580.059 739.661 578.655 736.486 578.131 733.019ZM586.096 746.157L592.542 739.583C593.399 740.071 594.345 740.436 595.327 740.684L595.416 749.912C591.95 749.469 588.775 748.134 586.096 746.157ZM617.833 727.103L608.63 727.193C608.37 726.19 607.96 725.256 607.445 724.387L613.907 717.794C615.961 720.457 617.321 723.616 617.833 727.103ZM600.576 710.133C604.075 710.587 607.266 711.911 609.962 713.916L603.511 720.494C602.63 719.982 601.68 719.588 600.669 719.341L600.576 710.133ZM600.954 749.859L600.868 740.631C601.855 740.375 602.784 739.989 603.637 739.478L610.205 745.937C607.562 747.959 604.416 749.352 600.954 749.859ZM614.135 742.015L607.514 735.515C608.005 734.647 608.423 733.733 608.679 732.722L617.869 732.637C617.419 736.12 616.136 739.336 614.135 742.015Z" fill="black"/>
            <path d="M292.288 712.766C292.653 711.99 293.329 711.391 294.149 711.137L297.431 710.096L295.123 699.266C294.684 697.203 295.718 695.108 297.636 694.211L301.863 692.228L299.55 679.022C299.132 676.601 300.704 674.293 303.113 673.798C329.382 668.381 456.959 634.307 539.629 661.251C563.819 669.129 601.15 683.409 601.15 683.409C601.15 683.409 657.105 692.888 691.336 726.447L688.272 733.589L690.608 742.935C690.789 743.651 690.636 744.403 690.198 745.006C689.76 745.594 689.076 745.96 688.34 746.004L630.736 748.915L628.126 748.887C630.716 744.717 632.502 739.992 633.193 734.896C633.422 733.248 633.535 731.804 633.547 730.392C633.732 710.623 617.795 694.376 598.017 694.183C578.079 694.183 561.985 710.124 561.796 729.713C561.788 730.746 561.844 731.764 561.92 732.781C562.343 738.379 564.088 743.615 566.81 748.204L387.995 746.201L383.306 745.895C385.349 742.155 386.744 738.013 387.347 733.589C387.581 731.941 387.689 730.497 387.701 729.085C387.886 709.316 371.949 693.069 352.172 692.876C332.233 692.876 316.135 708.821 315.95 728.41C315.942 729.443 315.994 730.461 316.071 731.478C316.336 735.037 317.152 738.443 318.395 741.636L315.512 741.447C312.085 741.218 309.009 739.3 307.312 736.324L299.136 732.242L292.223 715.239C291.905 714.439 291.93 713.546 292.288 712.766ZM577.693 685.05C578.425 684.809 578.931 684.145 578.971 683.377C579.012 682.621 578.577 681.897 577.882 681.583C574.182 679.898 567.997 677.272 559.419 674.172V689.703C565.455 688.862 573.02 686.586 577.693 685.05ZM526.937 679.545C527.971 677.405 530.215 676.122 532.58 676.323C539.199 676.878 551.939 678.579 553.495 683.558C554.255 685.991 545.665 689.996 545.665 689.996C545.665 689.996 550.471 690.258 555.518 690.049V672.793C547.073 669.861 536.649 666.603 524.267 663.378C506.48 658.753 481.869 657.796 459.119 659.107L452.13 680.655C491.79 686.59 527.251 688.01 527.251 688.01L526.411 683.57C526.149 682.215 526.334 680.799 526.937 679.545ZM440.13 678.732L446.174 660.113C425.604 662.14 408.215 665.944 401.431 670.335C413.72 673.726 426.987 676.488 440.13 678.732Z" fill="#B40000"/>
            <defs>
                <linearGradient id="paint0_linear" x1="500" y1="0" x2="500" y2="723" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#36CFFF" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
}
/** Returnerer et bilde av et fjelllandskap med skyer som beveger seg gjennom det. Animeres med CSS key strokes på #cloud1 og #cloud2 i Art.CSS*/
export function Mountain(props: {paused: boolean, slide:number, index:number }) {
    const animationStyle = {
        animationPlayState: (props.paused || props.slide !== props.index) ? "paused" : "running"
    } as CSSProperties
    return(
        <svg viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1000" height="600" fill="#EFFDFF" />
            <rect width="1000" height="600" fill="url(#paint0_linear)" />
            <path d="M570 44L897.358 611H242.642L570 44Z" fill="#CDCDCD" />
            <path d="M434 127L725.851 632.5H142.149L434 127Z" fill="#C4C4C4" />
            <path d="M534 232L774.755 649H293.245L534 232Z" fill="#D5D3D3" />
            <image id={"cloud"} style={animationStyle} x="-150" y="0" width="150" height="150" href="media/SVG/elements/cloud.svg"/>
            <image id={"cloud2"} style={animationStyle} x="-100" y="0" width="100" height="100" href="media/SVG/elements/cloud.svg"/>
            <rect y="550" width="1000" height="250" fill="#48DD14" />
            <rect y="550" width="1000" height="250" fill="url(#paint1_linear)" />
            <path d="M433.756 128L493.512 231.5H374L433.756 128Z" fill="white" />
            <path d="M534 232L593.756 335.5H474.244L534 232Z" fill="white" />
            <path d="M569.756 44L629.512 147.5H510L569.756 44Z" fill="white" />
            <defs>
                <linearGradient id="paint0_linear" x1="500" y1="0" x2="500" y2="600" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#36CFFF" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint1_linear" x1="500" y1="600" x2="500" y2="800" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EDFFE4" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
}


let i = 0;
/** Returnerer trær fra ulike koordinater. Brukes i opsettet av woods, og hvert tre blir animert med keystrokes i CSS */
function tree(x: number, y: number, colour: string[], size: number, paused: boolean, slide:number, index:number  ) {
    size = size * 2 / 100;
    let treeCoords = { x: [154, 169, 237, 101], y: [628, 628, 508, 548, 428, 468, 348, 388, 268] };
    treeCoords = {
        x: treeCoords.x.map(value => {
            return (value * (size)) + x - (treeCoords.x[0] * size - treeCoords.x[0]);
        }),
        y: treeCoords.y.map(value => {
            return (value * (size)) + y - (treeCoords.y[0] * size - treeCoords.y[0]);
        })
    }
    //counter for å holde styr på keynummer for hvert tre object
    function keyNr() {
        i++;
        return i;
    }
    const animationStyle = { 
        animationPlayState: (paused || index !== slide) ? "paused" : "playing" //Starter og stopper animasjonen basert på state eller om bildet er valgt i slidehsow
    } as CSSProperties
    return (
        <g key={i * 100}>
            <rect x={`${treeCoords.x[0]}`} y={`${treeCoords.y[0] - 50}`} width={30 * size} height={89 * size + 40} fill={colour[0]} />
            {[1, 2, 3, 4].map(index => {
                return (
                    <polygon
                        key={keyNr()}
                        id={"tree" + index}
                        className={"treePart"}
                        style={animationStyle}
                        fill={colour[index]}

                        points={
                            `${treeCoords.x[1]},${treeCoords.y[index * 2 - 1]}
                            ${treeCoords.x[2]},${treeCoords.y[index * 2 - 1]}
                            ${treeCoords.x[1]},${treeCoords.y[index * 2]}
                            ${treeCoords.x[3]},${treeCoords.y[index * 2 - 1]}`
                        }
                    />)
            }
            )}
        </g>
    )
}

//Grensesnitt for spesifisering av hvor et tree skal bli plassert og hvor stort det er
interface Tree { x: number, y: number, size: number }

/** Returnerer et bilde av et trelandksap*/
export function Woods(props: {paused: boolean, slide:number, index:number  }) {
    const themeIndex = useContext(ThemeContext).themeIndex;
    const theme = useContext(ThemeContext).theme;

    //Koordinatene og størrelse på de ulike trærne. hentet fra Tree grensesnittet
    const trees: Tree[] = [
        { x: 0, y: 0, size: 60 },
        { x: 311, y: 3, size: 58 },
        { x: 442, y: -2, size: 56 },
        { x: 555, y: 3, size: 54 },
        { x: 663, y: 5, size: 52 },
        { x: 189, y: 10, size: 50 },
        { x: 755, y: 31, size: 48 },
        { x: 555, y: 45, size: 46 },
        { x: 379, y: 39, size: 44 },
        { x: 204, y: 61, size: 42 },
        { x: 82, y: 55, size: 40 },
        { x: -68, y: 46, size: 38 },
        { x: 446, y: 61, size: 36 },
        { x: 656, y: 64, size: 34 },
    ]
    return (
        <span id="woodsFrame">
            <svg viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="1000" height="800" fill="#D6D6D6" />
                <rect width="1000" height="800" fill="url(#paint0_linear)" />
                <rect y="600" width="1000" height="200" fill={theme.ground} />
                <rect y="600" width="1000" height="200" fill="url(#paint1_linear)" />
                {trees.map(value => {
                    return tree(value.x, value.y, ['#7B6037'].concat(theme.tree.leafColours), value.size, props.paused, props.slide, props.index)
                })}
                {defs(themeIndex)}
            </svg>
        </span>
    );
}
export default Art;