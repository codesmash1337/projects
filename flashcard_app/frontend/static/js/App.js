class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            decks: [],
            selectedDeck: null,
            showCreateDeck: false
        };
    }

    componentDidMount() {
        this.loadDecks();
    }

    loadDecks = async () => {
        try {
            const response = await fetch('/api/decks');
            const decks = await response.json();
            this.setState({ decks });
        } catch (error) {
            console.error('Error loading decks:', error);
        }
    };

    handleDeckCreated = (newDeck) => {
        this.setState(prevState => ({
            decks: [...prevState.decks, newDeck],
            showCreateDeck: false
        }));
    };

    render() {
        return (
            <div className="app">
                <h1>Flashcard App</h1>
                {this.state.showCreateDeck ? (
                    <CreateDeck onDeckCreated={this.handleDeckCreated} />
                ) : this.state.selectedDeck ? (
                    <BulkImport 
                        deckId={this.state.selectedDeck.id}
                        onCardsAdded={() => {
                            this.setState({ selectedDeck: null });
                        }}
                    />
                ) : (
                    <div className="deck-list">
                        <button 
                            onClick={() => this.setState({ showCreateDeck: true })}
                            className="create-deck-button"
                        >
                            Create New Deck
                        </button>
                        <h2>Select a Deck</h2>
                        {this.state.decks.map(deck => (
                            <div 
                                key={deck.id} 
                                className="deck-item"
                                onClick={() => this.setState({ selectedDeck: deck })}
                            >
                                {deck.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));