class DeckView extends React.Component {
    // ... existing code ...

    render() {
        return (
            <div className="deck-view">
                <h2>{this.state.deck.name}</h2>
                
                {/* Add tabs or toggle for different input methods */}
                <div className="card-input-methods">
                    <button 
                        onClick={() => this.setState({ showBulkImport: !this.state.showBulkImport })}
                        className="toggle-button"
                    >
                        {this.state.showBulkImport ? 'Single Card Input' : 'Bulk Import'}
                    </button>
                    
                    {this.state.showBulkImport ? (
                        <BulkImport 
                            deckId={this.props.deckId} 
                            onCardsAdded={this.loadCards}
                        />
                    ) : (
                        <SingleCardInput 
                            deckId={this.props.deckId}
                            onCardAdded={this.loadCards}
                        />
                    )}
                </div>
                
                {/* Existing card list display */}
                <div className="card-list">
                    {/* ... */}
                </div>
            </div>
        );
    }
}