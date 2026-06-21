pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'yourdockerhubusername/todo-cicd'
        CONTAINER_NAME = 'todo-cicd'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build \
                    -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                    -t ${DOCKER_IMAGE}:latest .
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )
                ]) {
                    sh """
                        echo ${PASS} | docker login \
                        -u ${USER} --password-stdin

                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 3000:3000 \
                        -e APP_VERSION=${BUILD_NUMBER} \
                        ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    sleep 10
                    curl -f http://localhost:3000/health
                """
            }
        }

        stage('Smoke Test') {
            steps {
                sh """
                    curl -f http://localhost:3000/
                    curl -f http://localhost:3000/health
                """
            }
        }

        stage('Version Tag') {
            steps {
                sh """
                    git tag v${BUILD_NUMBER} || true
                """
            }
        }
    }

    post {
        success {
            echo 'Pipeline Successful'
        }

        failure {
            echo 'Pipeline Failed'
        }
    }
}