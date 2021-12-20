import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
    state = {
        manager: '',
        players: [],
        balance: '',
        value: '',
        message: ''
    };

    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({manager, players, balance});
    }

    onSubmit = async (event) => {
        event.preventDefault();

        // Getting accounts
        const accounts = await web3.eth.getAccounts();

        this.setState({message: 'Wainting on transaction success...'});

        // Entering the lottery
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });

        this.setState({message: 'You have successfully entered!'});
    };

    onClick = async (event) => {
        const accounts = await web3.eth.getAccounts();

        this.setState({message: 'Wait a second. Picking a winner...'});

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        this.setState({message: `The winner has been picked!`});

    };

    render() {
        return (
            <div>
                <h2>Lottery Contract</h2>
                <p>
                    This contract is managed by {this.state.manager}
                </p>
                <span>
                    There are currently {this.state.players.length} people entered,
                    competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
                </span>

                <hr/>

                <form onSubmit={this.onSubmit}>
                    <h4>Want to try your luck?</h4>
                    <div>
                        <label>Amount of ether to enter</label>
                        <input type="text"
                               onChange={event => this.setState({value: event.target.value})}
                               value={this.state.value}/>
                    </div>
                    <button type="submit">
                        Enter
                    </button>
                </form>

                <hr/>

                <h4>Ready to pick a winner?</h4>
                <button type="button" onClick={this.onClick}>Pick a winner!</button>

                <hr/>

                <h1>
                    {this.state.message}
                </h1>
            </div>
        );
    }
}

export default App;
