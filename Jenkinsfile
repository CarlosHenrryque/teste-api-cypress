pipeline {
    agent any
  
    stages {
        stage('Clonar repositório') {
        steps {
          git branch: 'main', url: 'https://github.com/CarlosHenrryque/teste-ebac-cypress.git'
            }
        }

        stage('Instalar dependencias') {
        steps {
          bat 'npm install'
            }
        }

        stage('Subir servidor') {
        steps {
          bat 'npm start'
            }
        }

        stage('Realizar os testes') {
        steps {
          bat 'npm run cy:run'
            }
        }
    }
}