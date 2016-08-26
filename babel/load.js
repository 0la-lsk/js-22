"use strict";

let jsonText = '{ "testTitle" : "Frontend Test", \
	"questions" : \
	[{"question" : "Какой командой в JS вывести сообщение в консоль? ",\
	"answers" : [["alert();","0"], ["console.log();","1"], ["printMessage();","0"]]},\
	{"question" : "Какая разница между операторами == и === ? ",\
	"answers" : [["=== - сравнение с привидением типов","1"], ["== - сравнение без приведения типов","1"], ["нет никакой","0"]]},\
	{"question" : "Каким тегом в HTML5 можно обернуть статью? ",\
	"answers" : [["article","1"], ["text","0"], ["block","0"]]}]\
}';

let testPattern = {
	testText : [],
	patternName : 'frontend-test',
	createScript () {
		let el = document.createElement("SCRIPT");
		el.type = "text/html";
		el.setAttribute("id", this.patternName);
		return el;
	},
createTestElement: function(elName, innerText, className) {
		let el = document.createElement(elName);
		el.innerHTML = "<" + innerText + ">";
		if (arguments.length === 3) el.className = className;
		return el;
	},
	createTestAnswers: function(id, innerText) {
		let elLabel = document.createElement('label');
		let elChkbox = document.createElement('input');
		elChkbox.setAttribute("type", "checkbox");
		elChkbox.setAttribute("id", id);
		elLabel.innerHTML = "<" + innerText + ">";
		elLabel.className = "test-answer";
		elLabel.insertBefore(elChkbox, elLabel.firstChild);
		return elLabel;
	},
	createForm: function(parent) {
		let el = document.createElement('form');
		el.setAttribute('id', 'pattern-test');
		parent.appendChild(el);
		//return el;
	},
	createSubmit: function () {
		let el = document.createElement('input');
		el.setAttribute('id', 'test-submit');
		el.setAttribute('type', 'submit');
		el.setAttribute('value', 'Результат');
		document.getElementById('pattern-test').appendChild(el);
		//return el;
	},
	createTestBlock: function () {

		let varScript = this.createScript();

		let varTitle = this.createTestElement('h1', '%= testPattern.testText.testTitle %');
		varScript.appendChild(varTitle);

		let textNode = document.createTextNode('<% for (var i = 0; i < testPattern.testText.questions.length; i++) { %>');
		varScript.appendChild(textNode);

		let varQuestion =  this.createTestElement('p', '%=i+1%> <%= testPattern.testText.questions[i].question %');
		varScript.appendChild(varQuestion);

		let varAnswers = document.createTextNode('<% for (var j = 0; j < testPattern.testText.questions[i].answers.length; j++) { %>');
		varScript.appendChild(varAnswers);

		let varAnswer =  this.createTestAnswers('<%=i%>' + '<%=j%>', '%= testPattern.testText.questions[i].answers[j][0] %');
		varScript.appendChild(varAnswer);

		let varEnd1 = document.createTextNode('<% } %>');
		varScript.appendChild(varEnd1);

		let varEnd2 = document.createTextNode('<% } %>');
		varScript.appendChild(varEnd2);		

		return varScript;
	}
};

function initTest() {
	let varScript = testPattern.createTestBlock();
	testPattern.createForm(document.body);
	let html_tmpl = varScript.innerHTML;

	html_tmpl = html_tmpl.replace(/&lt;/g, "<");
	html_tmpl = html_tmpl.replace(/&gt;/g, ">");
	//console.log("html_tmp", html_tmpl);
	let content = tmpl(html_tmpl, testPattern.testText);
	//console.log(content);

	$('#pattern-test').append(content);
	testPattern.createSubmit();
}

let StorageData = localStorage.getItem('objScript');

try {
	if ( StorageData === null) {
		localStorage.setItem('objScript', jsonText);
	} else {
		if (StorageData !== jsonText) {
			localStorage.removeItem('objScript');
			localStorage.setItem('objScript', jsonText);
		}
	};
}



catch (e) {
	console.log("Error reading datas from localStorage");
}
finally {
	StorageData = localStorage.getItem('objScript');
	//console.log(StorageData);
}

try {testPattern.testText = JSON.parse(StorageData); console.log("json loaded into object");}
catch (e) {alert("error reading test from json-pattern, ", e)};

function CheckAll (data) {
let s='';
let el, countAnswer = 0, attrAnswer, countQuestion = 0;
for (let i = 0; i < data.questions.length; i++) {
//for (let i of data.questions) {
	attrAnswer = 0;
	for (let j = 0; j < data.questions[i].answers.length; j++) {
	//for (let j of i) {

		el = document.getElementById(i.toString()+j.toString()).checked;
		++countQuestion; 
		if (el) ++attrAnswer;
		if (el == data.questions[i].answers[j][1]) ++countAnswer;		
	};
	if (attrAnswer == 0) s = 'Отвечено не на все вопросы!';
};

if (countAnswer === countQuestion ) return ("Тест пройден успешно!");
else return (`Неправильные ответы!  ${s}`);
}
