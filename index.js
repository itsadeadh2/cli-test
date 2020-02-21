#! /usr/bin/env node

const program = require('commander');
const { join } = require('path');
const package = require('./package.json');
const worker = require('./worker');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');

program.version(package.version);
console.log(chalk.cyan(figlet.textSync('Chatuba Komiku')))
const todosPath = join(__dirname, 'todos.json');


program
    .command(`add [todo]`)
    .description('Adiciona um to-do')
    .option('-s, --status [status]', 'status inicial do to-do')
    .action( async (todo, options) => {
      let answers;
      if (!todo) {
        answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'todo',
            message: 'Qual é o seu to-do?',
            validate: value => value ? true : 'Não é permitido um to-do vazio'
          }
        ]);
      }
      const data = worker.getJson(todosPath);
      data.push({
        title: todo || answers.todo,
        done: (options.status === 'true') || false
      });
      worker.saveJson(todosPath, data);
      console.log(`${chalk.green('To-do adicionado com sucesso!')}`);
      worker.showTodoTable(data);
    });

program
    .command('list')
    .description('Lista os to-dos')
    .action(() => {
      const data = worker.getJson(todosPath);
      worker.showTodoTable(data);
    })

program
    .command('do [todo]')
    .description('Marca o to-do como feito')
    .action(async (todo) => {
      let answers = {};
      if (!todo) {
        answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'todo',
            message: 'Qual o id do to-do?',
            validate: value => value !== undefined ? true : 'Defina um to-do para ser atualizado!'
          }
        ]);
      } else {
        answers.todo = todo;
      }

      const data = worker.getJson(todosPath);
      data[answers.todo].done = true;
      worker.saveJson(todosPath, data);
      console.log(`${chalk.green('To-do salvo com sucesso!')}`);
      worker.showTodoTable(data);
    })

program
    .command('undo [todo]')
    .description('Marca o to-do como nao feito')
    .action(async (todo) => {
      let answers = {};
      if(!todo) {
        answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'todo',
            message: 'Qual o id do to-do?',
            validate: value => value ? true : 'Defina um to-do para ser atualizado'
          }
        ]);
      } else {
        answers.todo = todo;
      }

      const data = worker.getJson(todosPath);
      data[answers.todo].done = false;
      worker.saveJson(todosPath, data);
      console.log(`${chalk.green('To-do salvo com sucesso!')}`);
      worker.showTodoTable(data);
    })

program
    .command('backup')
    .description('Faz um backup dos todos')
    .action(() => {
      worker.backupData()
    })
program.parse(process.argv);