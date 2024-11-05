class CreateDeck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            error: null,
            status: ''
        };
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ status: 'Creating...', error: null });

        try {
            const response = await fetch('/api/decks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    description: this.state.description
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create deck');
            }

            const result = await response.json();
            this.setState({ 
                status: 'Deck created successfully!',
                name: '',
                description: ''
            });
            
            if (this.props.onDeckCreated) {
                this.props.onDeckCreated(result);
            }
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    render() {
        return (
            <div className="create-deck">
                <h3>Create New Deck</h3>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Deck Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={this.state.name}
                            onChange={(e) => this.setState({ name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description (optional):</label>
                        <textarea
                            id="description"
                            value={this.state.description}
                            onChange={(e) => this.setState({ description: e.target.value })}
                            rows="3"
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Create Deck
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