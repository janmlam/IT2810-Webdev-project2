import React, {useContext, useState} from "react";
import Art from "./Art";
import {ThemeContext} from "./App";


const artworks = ["woods", "windmill", "beach", "car", "mountain"];
let slideIndex =  parseInt(sessionStorage.getItem("slideIndex")!) ||  0;

//Retunrerer en slidekomponent som gjør det mulig å bevge seg mellom de ulike installasjoene
function Slider() {
    const theme = useContext(ThemeContext).theme;

    //Prøver å starte slideren der man var sist ved bruk av sessionStorage. Hvis browseren lukkes og startes på nytt blir element 0 valgt. Som er woods.
    const [slidePosition, setSlidePosition] = useState(parseInt(sessionStorage.getItem("sliderStorage")!) || 0);

    return (
        <div data-testid="Mainbox" className={"mainBox"}>
            <button className={"slideButton"} style={{backgroundColor: theme.webpage.button}}
                    onClick={() => {
                        slide("left");
                        setSlidePosition(slideIndex);
                    }}>←
            </button>
            <div className={"artCollection"}>
                {artworks.map((title, index) => {
                    sessionStorage.setItem("sliderStorage", slidePosition.toString()); 
                    return (
                        <Art index={index} title={title} key={title} slide={slidePosition}/>
                    )
                })}
            </div>
            <button className={"slideButton"} style={{backgroundColor: theme.webpage.button}}
                    onClick={() => {
                        slide("right");
                        setSlidePosition(slideIndex);
                    }}>→
            </button>
        </div>
    )
}

//Funksjon for å gå frem og tilbake i slideshowet. Når dette skjer startes lyden for den nye installasjonen og lyden fra den forrige stoppes. 
function slide(direction: 'left' | 'right') {
    if (direction === 'left' && slideIndex > 0) {
        slideIndex -= 1;
        sessionStorage.setItem("slideIndex", slideIndex.toString());
        let audio = document.getElementById(artworks[slideIndex]+"Audio") as HTMLAudioElement;
        let prev = document.getElementById(artworks[slideIndex+1]+"Audio") as HTMLAudioElement;
        prev.pause();
        audio.play();
        audio.volume = 0.2; //Lyden settes til 0,2, som vi mener er mer behagelig
    }
    else if (direction === 'right' && slideIndex < artworks.length - 1) {
        slideIndex += 1;
        sessionStorage.setItem("slideIndex", slideIndex.toString());
        let audio = document.getElementById(artworks[slideIndex]+"Audio") as HTMLAudioElement;
        let prev = document.getElementById(artworks[slideIndex-1]+"Audio") as HTMLAudioElement;
        prev.pause();
        audio.play();
        audio.volume = 0.2;
    }
}


export default Slider;