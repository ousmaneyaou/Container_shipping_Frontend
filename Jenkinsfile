pipeline {
  agent any

  tools {
    nodejs "Node16" // ou la version que tu as configurée dans Jenkins
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/ousmaneyaou/shipping-container-front.git'
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm install --legacy-peer-deps'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Deploy') {
      steps {
        echo '🔁 Tu peux copier le contenu du dossier build/ vers ton serveur web (Apache, Nginx, etc)'
        // Exemple : copier vers un serveur distant avec scp (si config ssh)
        // sh 'scp -r build/* user@server:/var/www/html/shipping-container'
      }
    }
  }

  post {
    success {
      echo '✅ Build frontend terminé avec succès !'
    }
    failure {
      echo '❌ Le build frontend a échoué.'
    }
  }
}
