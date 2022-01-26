import React, { Component } from 'react';
import PlayContainer from './PlayContainer.jsx';
import QuoteContainer from './QuoteContainer.jsx';
import ScoreContainer from './ScoreContainer.jsx';


class GameContainer extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            quoteData: {quote: 'Awaiting game start...'},
            animeDetail: {},
            imageDisplayed: false,
            dataIsLoaded: false,
            dataIsFetching: false,
            gameBegun: false,
            characterName: 'loading...',
            thisRoundsGuesses: ['Start the game below!', 'The text bubbles below will begin to fill in to provide you clues about the character\'s name as time progresses. Additional hints about the anime the character comes from will be displayed in the panel to the right. Your score for a correct answer will decrease with time.'],
        }
        this.state = this.defaultState;
        this.imageTrigger = this.imageTrigger.bind(this);
        this.makeGuess = this.makeGuess.bind(this);
        this.startGame = this.startGame.bind(this);
  

    }

    imageTrigger(){
        return this.setState({imageDisplayed: true})
    }

    startGame(){
        this.setState({...this.defaultState, gameBegun: true});
    }

    makeGuess(guessText){
        let currentGuesses = JSON.parse(JSON.stringify(this.state.thisRoundsGuesses));
        if (guessText.current.value.length > 0 && guessText.current.value.length < 40){
            if (guessText.current.value === this.state.characterName && 
                this.state.dataIsLoaded === true){
                return this.startGame()
            }
            currentGuesses.push(guessText.current.value)
            document.querySelector('input').value = '';
            return this.setState({thisRoundsGuesses: currentGuesses})
        } else {
            document.querySelector('input').value = '';
            currentGuesses.push("Invalid input!")
            return this.setState({thisRoundsGuesses: currentGuesses, badGuess: true})
        }
    }

    componentDidUpdate() {

        if (this.state.gameBegun === true && this.state.dataIsFetching === false){
            console.log('starting up a game')
        let pageRandom = Math.floor(Math.random()*6);
        let animeList = [
            'Naruto',
            'Death%20Note',
            'Bleach',
            'Dragon%20Ball%20Z',
            'Shingeki%20no%20Kyojin',
            'Fullmetal Alchemist',
            'FLCL',
        ]
        let animeRandom = Math.floor(Math.random()*animeList.length);

        //this.setState({quoteData: {quote: `Quote from ${animeList[animeRandom]} looking at page ${pageRandom}`}, dataIsFetching: true})
        this.setState({dataIsFetching: true})
        fetch(`https://animechan.vercel.app/api/quotes/anime?title=${animeList[animeRandom]}&page=${pageRandom}`)
            .then(response => response.json())
            .then(response => {
                let chosenQuote = response[Math.floor(Math.random()*(Object.keys(response).length))]
                this.setState({quoteData: {quote: chosenQuote.quote}, characterName: chosenQuote.character, dataIsLoaded: true})
            })
            .catch(error => {
                this.setState({quoteData: {quote: "failed to load data."}})
            })
        fetch(`https://api.jikan.moe/v3/search/anime?q=${animeList[animeRandom]}&page=1`)
            .then(response => response.json())
            .then(response => {
                for (let i = 0; i < response.results.length; i++){
                    console.log(response.results[i])
                    console.log(animeList[animeRandom].replaceAll('%20', ' '))
                    if (response.results[i].title === animeList[animeRandom].replaceAll('%20', ' ')){
                        this.setState({animeDetail: response.results[i]});
                        break;
                    }
                }
            })
        }
    }


    render(){
        return(
        <div className="gameplayContainers">
            <QuoteContainer 
            quoteData={this.state.quoteData} />
            <PlayContainer 
            quoteDetails={this.state.animeDetail} 
            imageDisplayed={this.state.imageDisplayed}
            characterName={this.state.characterName}
            thisRoundsGuesses={this.state.thisRoundsGuesses}
            gameBegun={this.state.gameBegun}
            makeGuess={this.makeGuess}
            imageTrigger={this.imageTrigger}
            startGame={this.startGame} />

            <ScoreContainer />
        </div>
        )
    }

}

export default GameContainer;