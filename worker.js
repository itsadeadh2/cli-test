
const fs = require('fs');
const Table = require('cli-table');
const chalk = require('chalk');
const shell = require('shelljs');
const createApp = (name, description) => {
  const packageJson = `
  {
    "name": ${name},
    "version": "1.0.0",
    "description": ${description},
    "main": "bin/server.js",
    "bin": {
      "${name}": "server.js"
    },
    "dependencies": {
      "axios": "^0.19.1",
      "cors": "^2.8.5",
      "express": "^4.17.1",
      "js-yaml": "^3.13.1",
      "moment": "^2.24.0",
      "swagger-tools": "^0.10.4"
    },
    "devDependencies": {
      "chai": "^4.2.0",
      "mocha": "^7.0.0",
      "nodemon": "^2.0.2",
      "nyc": "^15.0.0",
      "supertest": "^4.0.2"
    },
    "scripts": {
      "test": "nyc ./node_modules/mocha/bin/mocha --recursive --exit --timeout 40000",
      "coverage": "nyc report --reporter=lcov",
      "start": "node bin/server.js",
      "dev": "nodemon bin/server.js"
    }
  }  
  `
  fs.writeFile('package.json', packageJson, (err) => {
    if (err) throw err;
    console.log('Package JSON created');
  })
}

const getJson = (path) => {
  const data = fs.existsSync(path) ? fs.readFileSync(path) : [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const saveJson = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, '\t'));

const showTodoTable = (data) => {
  const table = new Table({
    head: ['id', 'to-do', 'status'],
    colWidths: [10, 20, 10]
  });
  data.map((todo, index) => {
    table.push(
      [index, todo.title, todo.done ? chalk.green('feito') : 'pendente']
    )
  })
  console.log(table.toString());
}

const backupData = () => {
  shell.mkdir('-p', 'backup');
  const command = shell.exec('mv ./todos.json ./backup/todos.json', { silent: true });
  if (!command.code){
    console.log(chalk.green('Backup realizado com sucesso! To-dos zerados.'))
  } else {
    console.log(command.stderr);
    console.log(chalk.red('Erro ao realizar backup.'));
  }
}

module.exports = {
  createApp,
  getJson,
  saveJson,
  showTodoTable,
  backupData
}
