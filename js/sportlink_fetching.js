/*****************************************/
/*                                       */
/*  Author: Patrick Stel                 */
/*  Date: 31-08-2021                     */
/*  Purpose: sportlink data fetching     */
/*	Created for: W.V.V. 1896			 */
/* 	License: MIT License				 */
/*                                       */
/*****************************************/
/* https://data.sportlink.com/uitslagen?gebruiklokaleteamgegevens=NEE&thuis=JA&uit=JA&client_id= */

var sportlink_clientID = 'client_id=iLqhgc5Npa'
var sportlink_url = 'https://data.sportlink.com/'
var programma_dagen = '7'
var emptyCheck = 'start'

var scrollListHeight;

var toekomstDate = new Date();
var toekomst = (toekomstDate.setHours(toekomstDate.getHours()+2))
var toekomstUren = ("0" + toekomstDate.getHours()).slice(-2);

var toekomstDate2 = new Date();
var toekomst2 = (toekomstDate2.setHours(toekomstDate2.getHours()-2))
var toekomstUren2 = ("0" + toekomstDate2.getHours()).slice(-2);

var myPastDate=new Date();
myPastDate.setDate(myPastDate.getDate() - 6);//myPastDate is now 5 days in the past
var pastDateDay = ("0" + myPastDate.getDate()).slice(-2);
var pastDateMonth = ("0" + (myPastDate.getMonth() + 1)).slice(-2);
var pastDateYear = myPastDate.getFullYear();

var pastMatchDate = (pastDateYear + '-' + pastDateMonth + '-' +  pastDateDay);

var today = new Date();
var dag = ("0" + today.getDate()).slice(-2);
var maand = ("0" + (today.getMonth() + 1)).slice(-2);
var minuten = ("0" + today.getMinutes()).slice(-2);
var uren = ("0" + today.getHours()).slice(-2);
var seconden = ("0" + today.getMinutes()).slice(-2);
var vandaag = today.getFullYear()+'-'+ maand +'-'+ dag;
var todayDate = today.getFullYear()+'-'+ maand +'-'+ dag +'T'+ toekomstUren2 + ':' + minuten + ':' + seconden;
var todayDatePlus = today.getFullYear() + '-' + maand + '-' + dag + 'T' + toekomstUren + ':' + minuten + ':' + seconden
var matchProgramTimeNow = (vandaag + 'T' + uren + ':' + minuten + ':00');

function fetchMatchInformation() {
	$.ajax({
		url: sportlink_url + "programma?gebruiklokaleteamgegevens=NEE&eigenwedstrijden=JA&thuis=JA&uit=NEE&" + sportlink_clientID,
		async: false,
		dataType: 'json',
		success: function(matchInfo) {
			for (let i3 = 0; i3 < Object.keys(matchInfo).length; i3++) {
				var thuisteam = matchInfo[i3].thuisteam;
				var uitteam = matchInfo[i3].uitteam;
				var aanvangstijd = matchInfo[i3].aanvangstijd;
				var veld = matchInfo[i3].veld;
				var kleedkameruitteam = matchInfo[i3].kleedkameruitteam;
				var kleedkamerthuisteam = matchInfo[i3].kleedkamerthuisteam;
				var datum = matchInfo[i3].wedstrijddatum.split('+')[0];
				var matchdatum = matchInfo[i3].wedstrijddatum.split('T')[0];
				var matchtijd = matchInfo[i3].wedstrijddatum.split('T')[1];
				var status = matchInfo[i3].status;
				var amountGames = Object.keys(matchInfo).length;
				var calulContent = amountGames * 50 + 100;

				if(Date.parse(matchdatum) == Date.parse(vandaag)){
					if(matchtijd > toekomstUren2 && matchtijd < toekomstUren){
						var emptyCheck = 'Wedstrijden';
						//Fetch the DIV
						var el = document.getElementById("matchInfoTable")

						//Create new list item
						var node = document.createElement("tr");

						var td_datetime = document.createElement("td");
						td_datetime.innerHTML = ("<span class=\"datetime\">"+aanvangstijd+"</span>");

						var td_thuisteam = document.createElement("td");
						td_thuisteam.innerHTML = ("<span class=\"string\">"+thuisteam+"</span>");

						var td_thuisteamkleedkamer = document.createElement("td");
						td_thuisteamkleedkamer.innerHTML = ("<span class=\"integer\">"+kleedkamerthuisteam+"</span>");

						var td_uitteam = document.createElement("td");
						td_uitteam.innerHTML = ("<span class=\"string\">"+uitteam+"</span>");

						var td_uitteamkleedkamer = document.createElement("td");
						td_uitteamkleedkamer.innerHTML = ("<span class=\"integer\">"+kleedkameruitteam+"</span>");

						if(veld == null){
							var veld = '-';
						}

						var td_veldnummer = document.createElement("td");
						td_veldnummer.innerHTML = ("<span class=\"string\">"+veld+"</span>");

						//Build the hole thing

						node.appendChild(td_datetime);
						node.appendChild(td_thuisteam);
						node.appendChild(td_thuisteamkleedkamer);
						node.appendChild(td_uitteam);
						node.appendChild(td_uitteamkleedkamer);
						node.appendChild(td_veldnummer);
						el.appendChild(node);
					}
				}
			}

			if (emptyCheck != 'Wedstrijden'){
				//Fetch the DIV
				var el = document.getElementById("matchInfoTable");

				//Create new itemHeight
				var node = document.createElement("tr");
				node.innerHTML = ("<br><span>Geen thuis wedstrijden vandaag</span>");

				el.appendChild(node);
			}
			scrollListHeight = calulContent;
		}
	});
	document.cookie = "height="+scrollListHeight;
}


function fetchMatchResults(){
	$.ajax({
		url: sportlink_url+"uitslagen?gebruiklokaleteamgegevens=NEE&thuis=JA&uit=JA&" + sportlink_clientID,
		async: false,
		dataType: 'json',
		success: function(uitslag) {

			var matchCounter=0;
			for (let i2 = 0; i2 < Object.keys(uitslag).length; i2++) {
				var thuisteam = uitslag[i2].thuisteam;
				var uitteam = uitslag[i2].uitteam;
				var uitslagmatch = uitslag[i2].uitslag;
				var matchstatus = uitslag[i2].status;
				var matchdateresult = uitslag[i2].wedstrijddatum.split('T')[0];

				if(matchdateresult > pastMatchDate || matchdateresult == pastMatchDate){
					var emptyCheck = 'Uitslagen';
					matchCounter++;
					
					if (uitslag[i2].uitteamclubrelatiecode != '') {
						var uitlogo = "https://logoapi.voetbal.nl/logo.php?clubcode="+uitslag[i2].uitteamclubrelatiecode;
					} else {
						var uitlogo = "images/logo-knvb.png";
					}

					if (uitslag[i2].thuisteamclubrelatiecode != '') {
						var thuislogo = "https://logoapi.voetbal.nl/logo.php?clubcode="+uitslag[i2].thuisteamclubrelatiecode;
					} else {
						var thuislogo = "images/logo-knvb.png";
					}

					//Fetch the DIV
					var el = document.getElementById("match_results")

					//Create new list item
					var node = document.createElement("li");
					node.setAttribute('role', 'presentation');

					//Create tab-content with tg-tabscontent
					var tab_content = document.createElement("div");
					tab_content.setAttribute('class', 'tab-content tg-tabscontent');

					//Create tabpanel
					var tab_panel = document.createElement("div");
					tab_panel.setAttribute('role', 'tabpanel');
					tab_panel.setAttribute('class', 'tab-pane fade in active');
					tab_panel.setAttribute('id', 'one');

					//Create tg-matchresult
					var tg_matchresults = document.createElement("div");
					tg_matchresults.setAttribute('class', 'tg-matchresult');

					//Create tg-box
					var tg_box = document.createElement("div");
					tg_box.setAttribute('class', 'tg-box');

					//Wedstrijd gestaakt / afgelast?
					if (uitslagmatch == null) {
						var tg_score = document.createElement("div");
						tg_score.setAttribute('class','tg-score moveleft');
						tg_score.innerHTML = ('<h3>'+matchstatus+'</h3>');
					} else {
						//Create tg-score
						var tg_score = document.createElement("div");
						tg_score.setAttribute('class','tg-score');
						tg_score.innerHTML = ('<h3>'+uitslagmatch+'</h3>');
					}

					//Create tg-teamscorehome
					var tg_teamscorehome = document.createElement("div");
					tg_teamscorehome.setAttribute('class', 'tg-teamscore');
					tg_teamscorehome.innerHTML = ("<strong class='tg-team-logo'><br/><img src=\""+thuislogo+"\" class='voetbalapp'></strong><div class='tg-team-nameplusstatus'><h3>"+thuisteam+"</h3></div>");

					//Create tg-teamscoreaway
					var tg_teamscoreaway = document.createElement("div");
					tg_teamscoreaway.setAttribute('class', 'tg-teamscore');
					tg_teamscoreaway.innerHTML = ("<strong class='tg-team-logo'><br/><img src=\""+uitlogo+"\" class='voetbalapp'></strong><div class='tg-team-nameplusstatus'><h3>"+uitteam+"</h3></div>");

					//Build the hole thing
					tab_content.appendChild(tab_panel);
					tab_panel.appendChild(tg_matchresults);
					tg_matchresults.appendChild(tg_box);
					tg_box.appendChild(tg_score);
					tg_box.appendChild(tg_teamscorehome);
					tg_box.appendChild(tg_teamscoreaway);
					node.appendChild(tab_content);
					el.appendChild(node);
				}
			}

			if (emptyCheck != 'Uitslagen'){
				//Fetch the DIV
				var el = document.getElementById("match_results")

				var noMatchResults = document.createElement("div");
				noMatchResults.setAttribute('class','tg-box ');
				noMatchResults.innerHTML = ('<h1>Geen wedtrijden gespeeld in de afgelopen 5 dagen.</h1>');
				el.appendChild(noMatchResults);
			}
				
			var calulResult = matchCounter * 250;
			scrollListHeight = calulResult;
		}
  });
	document.cookie = "height="+scrollListHeight;
	}

function fetchProgramma(){
    $.ajax({
        url: sportlink_url+"programma?gebruiklokaleteamgegevens=NEE&aantaldagen=" + programma_dagen + "&eigenwedstrijden=JA&thuis=JA&uit=JA&" + sportlink_clientID,
        async: false,
        dataType: 'json',
        success: function(programma) {

			for (let i = 0; i < Object.keys(programma).length; i++) {
				var emptyCheck = 'Programma';
				var aanvangstijd = programma[i].aanvangstijd;
				var thuisteam = programma[i].thuisteam;
				var uitteam = programma[i].uitteam;
				var accommodatie = programma[i].accommodatie;
				var competitiesoort = programma[i].competitiesoort;
				var datumNumber = programma[i].datum.substring(0,2);
				var datumMonth = programma[i].datum.slice(-4);
				var datumMonthClean = datumMonth.substring(0,3);
				var matchDate = programma[i].wedstrijddatum.split('+')[0];

				if(competitiesoort == 'regulier') {
					competitiesoort = 'competitie'
				}

				if(competitiesoort == 'oefen') {
					competitiesoort = 'oefenwedstrijd'
				}

				var amountGames = Object.keys(programma).length;
				var calulContent = amountGames * 116 + 500;

				if(matchDate == matchProgramTimeNow || matchDate > matchProgramTimeNow){
					//Fetch the DIV
					var el = document.getElementById("match_program");

					//Create new list item
					var node = document.createElement("li");
					node.setAttribute('role', 'presentation');

					//Create ticketDiv
					var ticketDiv = document.createElement("div");
					ticketDiv.setAttribute('class', 'tg-ticket');

					//Create timeBox
					var timeBox = document.createElement("time");
					timeBox.setAttribute('class', 'tg-matchdate');
					timeBox.innerHTML = (datumNumber + " <span>" + datumMonthClean + "<br/>" + aanvangstijd + "</span>");

					//Create matchdetail
					var matchDetail = document.createElement("div");
					matchDetail.setAttribute('class', 'tg-matchdetail');
					matchDetail.innerHTML = ("<span><h4>" + thuisteam + "<span>&emsp;-&emsp;</span>" + uitteam + " &emsp; | &emsp; " + accommodatie + "</h4></span>");

					//Create themeTag
					var themeTag = document.createElement("span");
					themeTag.setAttribute('class', 'tg-theme-tag');
					themeTag.innerHTML = (competitiesoort);

					//Build the hole thing
					ticketDiv.appendChild(timeBox);
					matchDetail.appendChild(themeTag);
					ticketDiv.appendChild(matchDetail)
					node.appendChild(ticketDiv);
					el.appendChild(node);
				}
			}
			
			if (emptyCheck != 'Programma'){
				//Fetch the DIV
				var el = document.getElementById("match_program")

				var noMatchProgram = document.createElement("div");
				noMatchProgram.setAttribute('class','tg-ticket ');
				noMatchProgram.innerHTML = ('<h1>Geen programma bekend voor de komende 7 dagen.</h1>');
				el.appendChild(noMatchProgram);
			}
			
			scrollListHeight = calulContent;
		}
	});
	document.cookie = "height="+scrollListHeight;
}
