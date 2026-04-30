pipeline {
    agent any
    
    // Tools can be configured in Jenkins Global Tool Configuration
    // tools {
    //     nodejs 'node20'
    // }
    
    environment {
        // Change these to match your environment
        TOMCAT_PATH = 'C:/xampp/tomcat/webapps' // For Windows
        TOMCAT_PATH_LINUX = '/var/lib/tomcat9/webapps' // For Ubuntu
        APP_NAME = 'educonnect'
        WORKSPACE_DIR = 'client'
        TARGET_IP = '192.168.111.142'
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                dir("${WORKSPACE_DIR}") {
                    script {
                        if (isUnix()) {
                            sh 'npm install'
                        } else {
                            bat 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Build React App') {
            steps {
                dir("${WORKSPACE_DIR}") {
                    script {
                        if (isUnix()) {
                            sh 'npm run build'
                        } else {
                            bat 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Package WAR') {
            steps {
                dir("${WORKSPACE_DIR}") {
                    script {
                        if (isUnix()) {
                            sh "jar -cvf ${APP_NAME}.war -C build ."
                        } else {
                            bat "jar -cvf %APP_NAME%.war -C build ."
                        }
                    }
                }
            }
        }
        
        stage('Deploy to Tomcat') {
            steps {
                dir("${WORKSPACE_DIR}") {
                    script {
                        if (isUnix()) {
                            // Assumes Tomcat is on the same Ubuntu machine where Jenkins is running
                            sh "cp ${APP_NAME}.war ${TOMCAT_PATH_LINUX}/${APP_NAME}.war"
                        } else {
                            bat "copy %APP_NAME%.war \"%TOMCAT_PATH%\\%APP_NAME%.war\""
                        }
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "Successfully deployed to Tomcat: http://${TARGET_IP}:8080/${APP_NAME}"
        }
        failure {
            echo "Deployment failed. Check the logs above."
        }
    }
}
