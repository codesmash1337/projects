class BulkImport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            status: '',
            error: null
        };
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ status: 'Importing...', error: null });

        try {
            const response = await fetch(`/api/decks/${this.props.deckId}/cards/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: this.state.text }),
            });

            if (!response.ok) {
                throw new Error('Failed to import cards');
            }

            const result = await response.json();
            this.setState({ 
                status: `Successfully imported ${result.length} cards!`,
                text: '' 
            });
            
            // Notify parent component to refresh cards
            if (this.props.onCardsAdded) {
                this.props.onCardsAdded();
            }
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    render() {
        return (
            <div className="bulk-import">
                <h3>Bulk Import Cards</h3>
                <p className="help-text">
                    Paste your vocabulary list below. Each line should contain the front and back 
                    of the card separated by a tab.
                </p>
                <form onSubmit={this.handleSubmit}>
                    <textarea
                        value={this.state.text}
                        onChange={(e) => this.setState({ text: e.target.value })}
                        placeholder="Front⇥Back
Word⇥Definition
Hello⇥Bonjour"
                        rows="10"
                        className="bulk-import-textarea"
                    />
                    <button type="submit" className="submit-button">
                        Import Cards
                    </button>
                </form>
                {this.state.status && (
                    <p className="status-message">{this.state.status}</p>
                )}
                {this.state.error && (
                    <p className="error-message">{this.state.error}</p>
                )}
            </div>
        );
    }
}