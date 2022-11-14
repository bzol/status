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

const scryPalData = (setPalData) => {
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
	const [myStatus, setMyStatus] = useState({
		location: "",
		note: "",
		availability: "off",
	});
	const [palData, setPalData] = useState([
		{'ship': '~pontus-fadpun-polrel-witter', location: 'Lisbonjfdlkgj gfdkgjlkerj r er tre te te rr egrljgeklj', note: 'Very long note hellooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooofjsdfsd fd fd gdf gfdgfdkerjlkerjt tre ter te rt e tqte rewwwwwwwwwwwww ret reeeeeeeeeeeeeeegrger grgreeeeeeeeeeger gre ggggggggggggggggr er t re', availability: 'off' }
	]);

	// TODO scry with callback?
	useEffect(() => {
		// scryAll(setMyStatus, setPalData);
		// setInterval(() => scryPalData(setPalData), 15000);
	}, []);

	const handleLocation = (location) => {
		setMyStatus({ ...myStatus, location });
	};

	const handleNote = (note) => {
		setMyStatus({ ...myStatus, note });
	};

	const handleAvailability = (availability) => {
		setMyStatus({ ...myStatus, availability });
	};

	const handleSubmitMyStatus = () => {
		console.log(myStatus);
		window.urbit.poke({
			app: "status",
			mark: "status-action",
			json: { "set-status": myStatus },
			// json: {"set-status": myStatus},
			onSuccess: () => alert("Status Submitted"),
		});
	};

	const handleSvg = (myStatus, setMyStatus) => {
		switch (myStatus.availability) {
			case "off":
				setMyStatus({ ...myStatus, availability: "nodisturb" });
				break;
			case "nodisturb":
				setMyStatus({ ...myStatus, availability: "meetme" });
				break;
			case "meetme":
				setMyStatus({ ...myStatus, availability: "off" });
				break;
		}
	};

	// TODO availability should be a multiple choice field, maybe location too
	return (
		<div class="home">
			<div className="mystatus">
				<div className="mystatus-location">
					<label for="location">Location:</label>
					<input
						id="location"
						type="text"
						value={myStatus.location}
						onChange={(e) => handleLocation(e.target.value)}
					/>
				</div>
				<div className="mystatus-location">
					<label for="note">Note:</label>
					<input
						id="note"
						className="mystatus-note"
						type="text"
						value={myStatus.note}
						onChange={(e) => handleNote(e.target.value)}
					/>
				</div>
				<div className="mystatus-location">
					<label for="location">Availability:</label>
					<select name="location" id="location"
						onChange={(e) => handleAvailability(e.target.value)}
					>
						<option value="off">Off</option>
						<option value="nodisturb">Do Not Disturb</option>
						<option value="meetme">Meet Me</option>
					</select>
				</div>
				<button className="mystatus-handle" onClick={handleSubmitMyStatus}>
					Set Status
				</button>
			</div>
			<div className="paldata">
				{palData.map((pal) => {
					return (
						<div className="pal">
							<div className="pal-ship">{pal.ship}</div>
							<div className="pal-location">{pal.location}</div>
							<div className="pal-note">{pal.note}</div>
							{ pal.availability === 'off' &&
							<div className="pal-availability">Off</div>
							}
							{ pal.availability === 'nodisturb' &&
							<div className="pal-availability">Do Not Disturb</div>
							}
							{ pal.availability === 'meetme' &&
							<div className="pal-availability">Meet Me</div>
							}
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
