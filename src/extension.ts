// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
import * as dotenv from 'dotenv'
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

let token = process.env.YEMEK_TOKEN;
const yemekConfig = {
	method: 'post',
	url: process.env.YEMEK_URL,
	headers: {
		"Accept": '*/*',
		"User-Agent": 'Thunder Client (https://www.thunderclient.com)',
		"Authorization": `Bearer ${token}`,
		"Content-Type": 'application/json'
	},
	data: {
		"tarih":"01-02-2024", //Date format: dd-mm-yyyy date.now()
	}
};
var yemekGebzeOglen: any = [];
var yemekGebzeAksam: any = [];
var yemekGebzeSalata: any = [];


async function loadYemekMenu() {
	axios({
		method: yemekConfig.method,
		url: yemekConfig.url,
		headers: yemekConfig.headers,
		data: yemekConfig.data
	}).then((response) => {
		//console.log(response.data);
	
		var yemekList = response.data;
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
		 
		//Load Data
		yemekList.forEach((yemek:any, index:number) => {

			//Load Gebze Oglen
			if(yemek.YemekMenusuTuru == 1 && yemek.Lokasyon == "BİLGEM Gebze") {
				yemekGebzeOglen = yemek.YemekListesi;
			}

			//Load Gebze Aksam
			if(yemek.YemekMenusuTuru == 2 && yemek.Lokasyon == "BİLGEM Gebze") {
				yemekGebzeAksam = yemek.YemekListesi;
			}

			//Load Gebze Salata
			if(yemek.YemekMenusuTuru == 5 && yemek.Lokasyon == "BİLGEM Gebze") {
				yemekGebzeSalata = yemek.YemekListesi;
			}

		});
	}).catch((error) => {
		console.log(error);
	});
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

	let gebzeOglen = vscode.commands.registerCommand('tubitak-yemek.gebzeOglen', async () => {

		await loadYemekMenu();

			//Display
			yemekGebzeOglen.forEach((yemek:any, index:number) => {
				setTimeout(() => {
					vscode.window.showInformationMessage(yemek);
				}, index * 500); // Multiply index by 500 milliseconds to stagger the display of each yemek
			});

	});

	let gebzeSalata = vscode.commands.registerCommand('tubitak-yemek.gebzeSalata', async () => {

		await loadYemekMenu();

			//Display
			yemekGebzeSalata.forEach((yemek:any, index:number) => {
				setTimeout(() => {
					vscode.window.showInformationMessage(yemek);
				}, index * 500); // Multiply index by 500 milliseconds to stagger the display of each yemek
			});

			const header = "Gebze";
			const options: vscode.MessageOptions = { detail: 'TÜBİTAK Gebze Öğlen', modal: true };
			vscode.window.showInformationMessage(header, options, ...["Ok"]).then((yemekGebzeSalata)=>{
				console.log(yemekGebzeSalata);
			});

	
	});


	context.subscriptions.push(gebzeOglen, gebzeSalata);
}

// This method is called when your extension is deactivated
export function deactivate() {}
