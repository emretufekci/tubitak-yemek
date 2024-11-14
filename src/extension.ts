// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

let token = process.env.YEMEK_TOKEN;
const yemekConfig = {
	method: 'get', // GET request
	url: process.env.YEMEK_URL,
	headers: {
		"Accept": 'application/json, text/plain, */*',
		"Accept-Encoding": 'gzip, deflate, br',
		"Accept-Language": 'tr-TR,tr;q=0.9',
		"Authorization": `Bearer ${token}`,
	},
};

let yemekGebzeOglen: any = [];
let yemekGebzeAksam: any = [];
let yemekGebzeSalata: any = [];

async function loadYemekMenu() {
	try {
		const response = await axios({
			method: yemekConfig.method,
			url: yemekConfig.url,
			headers: yemekConfig.headers
		});
		
		const yemekList = response.data.data; // Adjusted to access data array
		
		/*
			YemekMenusuTuru // Gebze
				1: Gebze Öğlen,
				2: Gebze Akşam
				3: Gebze Diyet
				4: Gebze Vejeteryan
				5: Gebze Salata

			YemekMenusuTuru // Ankara
				1: Ankara Öğlen,
				2: Ankara Salata
		*/

		// Clear previous data
		yemekGebzeOglen = [];
		yemekGebzeAksam = [];
		yemekGebzeSalata = [];

		// Parse and load data based on food_type and location
		yemekList.forEach((yemek: any) => {
			if (yemek.location === "BİLGEM Gebze") {
				switch (yemek.food_type) {
					case "1": // Gebze Öğlen
						yemekGebzeOglen = yemek.foods;
						break;
					case "2": // Gebze Akşam
						yemekGebzeAksam = yemek.foods;
						break;
					case "5": // Gebze Salata
						yemekGebzeSalata = yemek.foods;
						break;
					// Add more cases as needed for other food types
				}
			}
		});
	} catch (error) {
		console.error("Error loading yemek menu:", error);
	}
}

// Activation function
export function activate(context: vscode.ExtensionContext) {
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

	let gebzeOglen = vscode.commands.registerCommand('tubitak-yemek.gebzeOglen', async () => {
		await loadYemekMenu();

		// Display Gebze Öğlen menu items
		yemekGebzeOglen.forEach((yemek: any, index: number) => {
			setTimeout(() => {
				vscode.window.showInformationMessage(yemek);
			}, index * 500);
		});
	});

	let gebzeAksam = vscode.commands.registerCommand('tubitak-yemek.gebzeAksam', async () => {
		await loadYemekMenu();

		// Display Gebze Akşam menu items
		yemekGebzeAksam.forEach((yemek: any, index: number) => {
			setTimeout(() => {
				vscode.window.showInformationMessage(yemek);
			}, index * 500);
		});
	});

	let gebzeSalata = vscode.commands.registerCommand('tubitak-yemek.gebzeSalata', async () => {
		await loadYemekMenu();

		// Display Gebze Salata menu items
		yemekGebzeSalata.forEach((yemek: any, index: number) => {
			setTimeout(() => {
				vscode.window.showInformationMessage(yemek);
			}, index * 500);
		});

		const header = "Gebze";
		const options: vscode.MessageOptions = { detail: 'TÜBİTAK Gebze Öğlen', modal: true };
		vscode.window.showInformationMessage(header, options, ...["Ok"]).then((selection) => {
			console.log("Selected:", selection);
		});
	});
	

	context.subscriptions.push(gebzeOglen, gebzeSalata, gebzeAksam);
}

// Deactivation function
export function deactivate() {}
