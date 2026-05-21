pipeline {
    agent any

    environment {
        APP_NAME = "shynia-backend"
        CONTAINER_NAME = "shynia-backend-container"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/amancloud23/shynia.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t $APP_NAME .'
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                docker run -d \
                --name $CONTAINER_NAME \
                -p 6000:6000 \
                --env-file /home/ubuntu/shynia-env/.env \
                --restart always \
                $APP_NAME
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {

        success {
            echo 'Deployment Successful!'
        }

        failure {
            echo 'Pipeline Failed!'
        }
    }
}
