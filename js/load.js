"use strict";

var jsonText = '{ "testTitle" : "Frontend Test", \
	"questions" : \
	[{"question" : "Какой командой в JS вывести сообщение в консоль? ",\
	"answers" : [["alert();","0"], ["console.log();","1"], ["printMessage();","0"]]},\
	{"question" : "Какая разница между операторами == и === ? ",\
	"answers" : [["=== - сравнение с привидением типов","1"], ["== - сравнение без приведения типов","1"], ["нет никакой","0"]]},\
	{"question" : "Каким тегом в HTML5 можно обернуть статью? ",\
	"answers" : [["article","1"], ["text","0"], ["block","0"]]}]\
}';

var testPattern = {
	testText: [],
	patternName: 'frontend-test',
	createScript: function createScript() {
		var el = document.createElement("SCRIPT");
		el.type = "text/html";
		el.setAttribute("id", this.patternName);
		return el;
	},

	createTestElement: function createTestElement(elName, innerText, className) {
		var el = document.createElement(elName);
		el.innerHTML = "<" + innerText + ">";
		if (arguments.length === 3) el.className = className;
		return el;
	},
	createTestAnswers: function createTestAnswers(id, innerText) {
		var elLabel = document.createElement('label');
		var elChkbox = document.createElement('input');
		elChkbox.setAttribute("type", "checkbox");
		elChkbox.setAttribute("id", id);
		elLabel.innerHTML = "<" + innerText + ">";
		elLabel.className = "test-answer";
		elLabel.insertBefore(elChkbox, elLabel.firstChild);
		return elLabel;
	},
	createForm: function createForm(parent) {
		var el = document.createElement('form');
		el.setAttribute('id', 'pattern-test');
		parent.appendChild(el);
		//return el;
	},
	createSubmit: function createSubmit() {
		var el = document.createElement('input');
		el.setAttribute('id', 'test-submit');
		el.setAttribute('type', 'submit');
		el.setAttribute('value', 'Результат');
		document.getElementById('pattern-test').appendChild(el);
		//return el;
	},
	createTestBlock: function createTestBlock() {

		var varScript = this.createScript();

		var varTitle = this.createTestElement('h1', '%= testPattern.testText.testTitle %');
		varScript.appendChild(varTitle);

		var textNode = document.createTextNode('<% for (var i = 0; i < testPattern.testText.questions.length; i++) { %>');
		varScript.appendChild(textNode);

		var varQuestion = this.createTestElement('p', '%=i+1%> <%= testPattern.testText.questions[i].question %');
		varScript.appendChild(varQuestion);

		var varAnswers = document.createTextNode('<% for (var j = 0; j < testPattern.testText.questions[i].answers.length; j++) { %>');
		varScript.appendChild(varAnswers);

		var varAnswer = this.createTestAnswers('<%=i%>' + '<%=j%>', '%= testPattern.testText.questions[i].answers[j][0] %');
		varScript.appendChild(varAnswer);

		var varEnd1 = document.createTextNode('<% } %>');
		varScript.appendChild(varEnd1);

		var varEnd2 = document.createTextNode('<% } %>');
		varScript.appendChild(varEnd2);

		return varScript;
	}
};

function initTest() {
	var varScript = testPattern.createTestBlock();
	testPattern.createForm(document.body);
	var html_tmpl = varScript.innerHTML;

	html_tmpl = html_tmpl.replace(/&lt;/g, "<");
	html_tmpl = html_tmpl.replace(/&gt;/g, ">");
	//console.log("html_tmp", html_tmpl);
	var content = tmpl(html_tmpl, testPattern.testText);
	//console.log(content);

	$('#pattern-test').append(content);
	testPattern.createSubmit();
}

var StorageData = localStorage.getItem('objScript');

try {
	if (StorageData === null) {
		localStorage.setItem('objScript', jsonText);
	} else {
		if (StorageData !== jsonText) {
			localStorage.removeItem('objScript');
			localStorage.setItem('objScript', jsonText);
		}
	};
} catch (e) {
	console.log("Error reading datas from localStorage");
} finally {
	StorageData = localStorage.getItem('objScript');
	//console.log(StorageData);
}

try {
	testPattern.testText = JSON.parse(StorageData);console.log("json loaded into object");
} catch (e) {
	alert("error reading test from json-pattern, ", e);
};

function CheckAll(data) {
	var s = '';
	var el = void 0,
	    countAnswer = 0,
	    attrAnswer = void 0,
	    countQuestion = 0;
	for (var i = 0; i < data.questions.length; i++) {
		//for (let i of data.questions) {
		attrAnswer = 0;
		for (var j = 0; j < data.questions[i].answers.length; j++) {
			//for (let j of i) {

			el = document.getElementById(i.toString() + j.toString()).checked;
			++countQuestion;
			if (el) ++attrAnswer;
			if (el == data.questions[i].answers[j][1]) ++countAnswer;
		};
		if (attrAnswer == 0) s = 'Отвечено не на все вопросы!';
	};

	if (countAnswer === countQuestion) return "Тест пройден успешно!";else return 'Неправильные ответы!  ' + s;
}
