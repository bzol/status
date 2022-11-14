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

const Svg = (props) => {
	switch (props.type) {
		case "off":
			return (
				<div className="mystatus-availability">
					<svg viewBox="0  16 16">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M13.2894 13.0305L13.603 12.6115C13.9633 12.1301 14.1763 11.5339 14.1763 10.885C14.1763 9.29167 12.8846 8 11.2913 8C9.69792 8 8.40625 9.29167 8.40625 10.885C8.40625 12.4784 9.69792 13.77 11.2913 13.77C11.7632 13.77 12.2059 13.6575 12.5968 13.4587L12.9696 13.2691L13.4189 13.4189L13.2894 13.0305ZM14.8419 14.5257C14.907 14.7211 14.7211 14.907 14.5257 14.8419L13.0501 14.35C12.522 14.6186 11.9243 14.77 11.2913 14.77C9.14563 14.77 7.40625 13.0307 7.40625 10.885C7.40625 8.73938 9.14563 7 11.2913 7C13.4369 7 15.1763 8.73938 15.1763 10.885C15.1763 11.7572 14.8889 12.5623 14.4036 13.2107L14.8419 14.5257Z"
						></path>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M2.95245 9.37231L3.15819 9.75316L3.0213 10.1638L2.43629 11.9189L4.19133 11.3338L4.60198 11.197L4.98284 11.4027C5.68769 11.7835 6.49464 12 7.35515 12C7.4262 12 7.4969 11.9985 7.56722 11.9956C7.67016 12.3413 7.81992 12.6668 8.00914 12.9648C7.79434 12.9881 7.57614 13 7.35515 13C6.32463 13 5.35479 12.7402 4.50756 12.2825L2.041 13.1047L2.00153 13.1179L1.64572 13.2365L1.32949 13.3419C1.13405 13.407 0.948116 13.2211 1.01326 13.0257L1.11867 12.7094L1.23728 12.3536L1.25043 12.3141L2.07262 9.84759C1.61494 9.00035 1.35515 8.03052 1.35515 7C1.35515 3.68629 4.04144 1 7.35515 1C10.6689 1 13.3551 3.68629 13.3551 7C13.3551 7.1943 13.3459 7.38644 13.3279 7.576C13.0276 7.39079 12.7002 7.24531 12.353 7.14689C12.3544 7.0981 12.3551 7.04913 12.3551 7C12.3551 4.23858 10.1166 2 7.35515 2C4.59372 2 2.35515 4.23858 2.35515 7C2.35515 7.8605 2.57169 8.66745 2.95245 9.37231Z"
						></path>
					</svg>
				</div>
			);
			break;
		case "nodisturb":
			return <svg></svg>;
			break;
		case "meetme":
			return <svg></svg>;
			break;
	}
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
	const [myStatus, setMyStatus] = useState({
		location: "gdfg",
		note: "gdg",
		availability: "off",
	});
	const [palData, setPalData] = useState([
		{
			ship: "~dev",
			location: "Lisbon",
			note: "at Portugal",
			availability: "meetme",
		},
		{
			ship: "~paldev",
			location: "Austin",
			note: "at Austin",
			availability: "nodisturb",
		},
	]);

	// TODO scry with callback?
	useEffect(() => {
		// scryAll(setMyStatus, setPalData);
		// setInterval(() => scryAll(setMyStatus, setPalData), 15000);
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
