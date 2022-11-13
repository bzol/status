import React, { useState, useEffect, Component } from "react";
import Urbit from "@urbit/http-api";
import "./App.css";

// project worked on for 6 hours so far

const scryStatus = (path) => {
	return window.urbit.scry({
		app: "status",
		path: path,
	});
};

const scryAll = (setMyStatus, setPalData) => {
	scryStatus("/mystatus")
		.then((res) => {
			console.log(res);
			setMyStatus(res);
		})
		.catch((err) => {
			alert("Failed to fetch mystatus");
		});
	scryStatus("/paldata")
		.then((res) => {
			console.log(res);
			setPalData(res);
		})
		.catch((err) => {
			alert("Failed to fetch paldata");
		});
};

const Home = () => {
	const [myStatus, setMyStatus] = useState(
		// {location: '', note: '', activity: 'off'}
		{}
	);
	const [palData, setPalData] = useState([
		// {ship: '~dev', location: 'Lisbon', note: 'at Portugal', activity: 'meetme'},
		// {ship: '~paldev', location: 'Austin', note: 'at Austin', activity: 'working'},
	]);

	// TODO scry with callback?
	useEffect(() => {
		scryAll(setMyStatus, setPalData);
		setInterval(() => scryAll(setMyStatus, setPalData), 15000);
	}, []);

	const handleLocation = (location) => {
		setMyStatus({ ...myStatus, location });
	};

	const handleNote = (note) => {
		setMyStatus({ ...myStatus, note });
	};

	const handleActivity = (activity) => {
		setMyStatus({ ...myStatus, activity });
	};

	const handleSubmitMyStatus = () => {
		console.log(palData);
		window.urbit.poke({
			app: "status",
			mark: "status-action",
			json: { "set-status": myStatus },
			// json: {"set-status": myStatus},
			onSuccess: () => alert("Status Submitted"),
		});
	};

	// TODO activity should be a multiple choice field, maybe location too
	return (
		<div class="home">
			<div className="mystatus">
				<input
					className="mystatus-location"
					type="text"
					value={myStatus.location}
					onChange={(e) => handleLocation(e.target.value)}
				/>
				<input
					className="mystatus-note"
					type="text"
					value={myStatus.note}
					onChange={(e) => handleNote(e.target.value)}
				/>
				<input
					className="mystatus-activity"
					type="text"
					value={myStatus.activity}
					onChange={(e) => handleActivity(e.target.value)}
				/>
				<button onClick={handleSubmitMyStatus}>
					Set
				</button>
			</div>
			<div className="paldata">
				{palData.map((pal) => {
					return (
						<div className="pal">
							<div className="pal-ship">{pal.ship}</div>
							<div className="pal-location">{pal.location}</div>
							<div className="pal-note">{pal.note}</div>
							<div className="pal-activity">{pal.activity}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

class App extends Component {
	constructor(props) {
		super(props);

		window.urbit = new Urbit("");
		window.urbit.ship = window.ship;

		window.urbit.onOpen = () => this.setState({ conn: "ok" });
		window.urbit.onRetry = () => this.setState({ conn: "try" });
		window.urbit.onError = () => this.setState({ conn: "err" });
	}
	render() {
		return <Home />;
	}
}

export default App;
