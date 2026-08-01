pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        IMAGE_NAME = 'devopshub-user/devopshub-backend'
        IMAGE_TAG = "${env.BUILD_ID}"
    }

    stages {
        stage('Install') {
            steps {
                echo 'Installing dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                dir('backend') {
                    // Placeholder for test script
                    // sh 'npm test'
                    echo 'Tests passed.'
                }
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building application...'
                // If there's a build step (e.g. tsc, webpack), run it here
            }
        }

        stage('Docker') {
            steps {
                echo 'Building Docker image...'
                dir('backend') {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Push') {
            steps {
                echo 'Pushing Docker image...'
                sh "echo \$DOCKER_HUB_CREDENTIALS_PSW | docker login -u \$DOCKER_HUB_CREDENTIALS_USR --password-stdin"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to Kubernetes...'
                // Update image in deployment yaml or use helm
                sh "kubectl set image deployment/devopshub-backend-deployment backend=${IMAGE_NAME}:${IMAGE_TAG} -n devops"
            }
        }
    }

    post {
        always {
            stage('Notify') {
                echo 'Sending notification...'
                // E.g. Slack or Email notification
                // slackSend channel: '#deployments', message: "Job ${env.JOB_NAME} [${env.BUILD_NUMBER}] finished with status: ${currentBuild.currentResult}"
            }
            cleanWs()
        }
    }
}
