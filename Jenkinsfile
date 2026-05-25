pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "shynia-backend"
        FRONTEND_IMAGE = "shynia-frontend"

        BACKEND_CONTAINER = "shynia-backend-container"
        FRONTEND_CONTAINER = "shynia-frontend-container"

        NETWORK_NAME = "shynia-network"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/amancloud23/shynia.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t $BACKEND_IMAGE .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $FRONTEND_IMAGE .'
                }
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh '''
                docker stop $BACKEND_CONTAINER || true
                docker rm $BACKEND_CONTAINER || true

                docker stop $FRONTEND_CONTAINER || true
                docker rm $FRONTEND_CONTAINER || true
                '''
            }
        }

        stage('Run Backend Container') {
            steps {
                sh '''
                docker run -d \
                --name $BACKEND_CONTAINER \
                --network $NETWORK_NAME \
                -p 5000:5000 \
                --env-file /home/ubuntu/shynia-env/.env \
                --restart always \
                $BACKEND_IMAGE
                '''
            }
        }

        stage('Run Frontend Container') {
            steps {
                sh '''
                docker run -d \
                --name $FRONTEND_CONTAINER \
                --network $NETWORK_NAME \
                -p 5173:5173 \
                --restart always \
                $FRONTEND_IMAGE
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'docker ps'
            }
        }
    }
}