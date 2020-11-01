import React, {useState} from 'react';
import './style/App.css';
import Pageheader from './Pageheader';
import Slider from "./Slider";

// Et grensesnitt for tema-oppsettet til nettsiden
export interface Theme {
    webpage: {
        header: string;
        background: string;
        button: string;
    }
    tree: {
        leafColours: string[];
        trunk: string
    };
    ground: string;
    sky: string;
    sea: string;
    sand: string;
    text: string;
    background: string;
}

// Ulike tema med farger i en Arrya. Tema 0=winter, 1=spring, 2=summer, 3=fall
export const themes: Theme[] = [
    // winter
    {
        webpage: {header: "#bbe8f9", background: "#d9fffe", button: "#5fbfe3"},
        tree: {leafColours: ["#449687", "#34C5E4", "#BADEFF", "#EDFEFF"], trunk: "brown"},
        ground: "#DAD7D2",
        sky: "#6D97BE",
        sea: "#9AD",
        sand: "#D3CFB5",
        text: "#EDFEFF",
        background: "#449687"
    },
    // spring
    {
        webpage: {header: "#92e386", background: "#eaffb3", button: "#66eb52"},
        tree: {leafColours: ["#188416", "#30B03D", "#8BE384", "#c2e396"], trunk: "brown"},
        ground: "#86A65F",
        sky: "#648DDB",
        sea: "#62B8E8",
        sand: "#F9EEB5",
        text: "#E9EEE9",
        background: "#188416"
    },
    // summer
    {
        webpage: {header: "#eded4e", background: "#fffee6", button: "#dec328"},
        tree: {leafColours: ['#487342', '#1F835F', '#4E865A', '#5FAE75'], trunk: "brown"},
        ground: "#49982D",
        sky: "#3FA3FF",
        sea: "#62B8E8",
        sand: "#E2D58D",
        text: "#000000",
        background: "#f7f397"
    },
    // fall
    {
        webpage: {header: "#cc7641", background: "#ffcc85", button: "#d65200"},
        tree: {leafColours: ["#365131", "#B98602", "#F3AA53", "#F08456"], trunk: "brown"},
        ground: "#C06512",
        sky: "#002D84",
        sea: "#1774A9",
        sand: "#CFBE61",
        text: "#F08456",
        background: "#365131"
    }]
type contextType = {themeIndex: number, theme: Theme};
export const ThemeContext = React.createContext<contextType>({themeIndex: 0, theme: themes[0]});

//Funksjonell komponent for hovedapplikasjonen
function App() {
    const [theme, setTheme] = useState(parseInt(localStorage.getItem("themeStorage")!) || 0); //Henter tema fra localStorage, eller 0 hvis det ikke finnes

    function updateTheme(season: string) { //Oppdaterer tema
        const themeTable = ["winter", "spring", "summer", "fall"];
        setTheme(themeTable.indexOf(season));
        localStorage.setItem("themeStorage", themeTable.indexOf(season).toString()); 
    }

    document.body.style.backgroundColor = themes[theme].webpage.background; //Setter bakgrunnen på siden til riktig tema.

    return (
        <ThemeContext.Provider value={{themeIndex: theme, theme: themes[theme]}}>
            <div className="App">
                <Pageheader click={updateTheme} />
                <Slider/>
            </div>
        </ThemeContext.Provider>
    );
}


export default App;