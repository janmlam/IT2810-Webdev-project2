import React, {useState} from 'react';
import { ThemeContext} from "./App";
import './style/Pageheader.css';

//Bruk av klasse istede for funksjonell kompoent. 
class Pageheader extends React.Component<{click: any}>{

    // original background colour rgb(187, 232, 249)
    //Returnerer en pageheader med overskrift og en moodKontroller 
    render() {
        return(
            <ThemeContext.Consumer>
                {value => (<div className="page-header" style={{backgroundColor: value.theme.webpage.header}}>
                    <h1>Prosjekt 2</h1>
                    <div className="mood-controller">
                        <ThemeButton click={this.props.click} season={"winter"} />
                        <ThemeButton click={this.props.click} season={"spring"} />
                        <ThemeButton click={this.props.click} season={"summer"} />
                        <ThemeButton click={this.props.click} season={"fall"} />
                    </div>
                </div>)}
            </ThemeContext.Consumer>
        );
    }
}

//Returnerer et SVG bilde som brukes som knapp for valg av tema på nettsiden. Knappen har to tilstander der den fargede indikterer at temaet er valgt. 
function ThemeButton(props: { season: string, click: any}) {
    const [hoverState, setHoverState] = useState(1);
    const themeTable = ["winter", "spring", "summer", "fall"];
    return (
        <ThemeContext.Consumer>
            {value => (
                <img
                    onMouseEnter={() => setHoverState(2)}
                    onMouseLeave={() => setHoverState(1)}
                    onClick={() => {
                        props.click(props.season)
                    }}
                    src={`media/SVG/${props.season}/${props.season}${(themeTable.indexOf(props.season) === value.themeIndex || hoverState === 2 ? 2 : 1)}.svg`}
                    alt="themeButtons" data-testid={props.season} />
            )}
        </ThemeContext.Consumer>
    )
}
export default Pageheader;