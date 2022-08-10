import { Command } from 'commander';
const commander = new Command();
//const commander = require('commander');

 function addOption({ type, name, message, choices, filter }, commander, alternativeChoices = undefined) {
	let flag, description;
	if (type === 'confirm') {
		flag = `-${name[0]}, --${name}`;
	} else {
		flag = `-${name[0]}, --${name} <${name}>`;
	}
	if (alternativeChoices) {
		description = `(${alternativeChoices.map(filter).join('|')}) ${message}`;
	} else if (choices) {
		description = `(${choices.map(filter).join('|')}) ${message}`;
	} else {
		description = message;
	}
	commander.option(
		flag,
		description,
		filter
	);
}

//Obtiene respuestas de usuario
export function getAnswersFromCommand(firstCategory, page, weapon, equipment) {
  const answers = {};

  // TODO Don't forget to remove 'equipment' and 'weapon' if firstCategory[2].choices change sometime.
  // .slice(2) is here to remove 'equipment' and 'weapon' because they are not valid categories
  // TODO add new category type here if they don't match firstCategory, equipment or weapon submenu
  //De la seleccion de equipos no cuenta weapon y equipment por eso empieza en [2], [0] es equipment y [1] weapon
  //como dice más arriba no son secciones válidas ya que equipment es sombrero, botas, capa, etc y weapon es espada, arco, escudo, etc
  const allChoices = [...firstCategory[2].choices.slice(2), ...equipment[0].choices, ...weapon[0].choices];

  addOption(firstCategory[0], commander);
  addOption(firstCategory[1], commander);
  addOption(equipment[0], commander, allChoices); // equipment[0] or weapon[0] works : we need use filter() of those variable and not filter() of firstCategory
  page.forEach(question => {
    addOption(question, commander);
  });

  //Se prodria agregar una opcion para empezar desde un numero en especifico, el problema es que si el orden en la web cambia
  //los datos ya obtenido con los que se van a obtener pueden no estar correctos

  commander.action((command) => {
    ['language', 'game', 'category', 'maxItem', 'all'].forEach(
      name => {
        switch (name) {
        case 'language':
          if (firstCategory[0].choices.map(firstCategory[0].filter).some(choice => choice === command[name]))
            answers[name] = command[name];
          break;
        case 'game':
          if (firstCategory[1].choices.map(firstCategory[1].filter).some(choice => choice === command[name]))
            answers[name] = command[name];
          break;
        case 'category':
          if (allChoices.map(equipment[0].filter).some(choice => choice === command[name]))
            answers[name] = command[name];
          break;
        case 'maxItem':
          if (Number.isInteger(command[name]))
            answers[name] = command[name];
          break;
        case 'all':
          answers[name] = command[name];
          break;
        }
      }
    );
  });

  commander.parse(process.argv);

  //console.log('Problems with arrows?? Try PowerShell')
  if (answers.language &&
      answers.game &&
      answers.category &&
      (answers.maxItem || answers.all)) {

      //console.log('\x1b[33m%s\x1b[0m', `Your options :\n - language : ${answers.language}\n - game : ${answers.game}\n - category : ${answers.category}\n - number of items : ${answers.all ? 'all' : answers.maxItem}`);
      return Promise.resolve(JSON.stringify(answers)); // Caller of getCategory expects a promise returning JSON
    } else {
      //console.log('\x1b[33m%s\x1b[0m', 'One of your parameter is missing or wrong, please use -h, --help to know all parameters and their options');
      return null;
  }

}

//module.exports = { getAnswersFromCommand, addOption };
