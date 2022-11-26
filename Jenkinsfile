node("ci-node") {
    stage("checkout") {
        checkout([$class: 'GitSCM', branches: [[name: '*/develop']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/mchekini-check-consulting/famille-ui.git']]])
    }
    stage("Quality Analyses"){
        sh "/opt/sonar-scanner/bin/sonar-scanner \\\n" +
                "  -Dsonar.projectKey=famille-ui \\\n" +
                "  -Dsonar.sources=. \\\n" +
                "  -Dsonar.host.url=http://3.87.90.191:11001 \\\n" +
                "  -Dsonar.login=sqp_f2aa22dfc3853804764c5a4fcbf2f05ad6bb7ebe"

    }

    stage("build") {
        sh "npm install"
        sh "ng build --configuration production"
    }
    stage("build docker image") {
        sh "sudo docker build -t famille ."
    }
    stage("push docker image") {
        sh "sudo docker login -u mchekini -p jskabyliE"
        sh "sudo docker tag famille mchekini/famille:1.0"
        sh "sudo docker push mchekini/famille:1.0"
    }
    node("integration-node") {
        stage("deploy famille ui") {
            try {
                sh "sudo docker stop famille"
                sh "sudo docker rm famille"
                sh "sudo docker rmi mchekini/famille:1.0"
            }catch(Exception e){
               println "No container famille running"
            }
          sh "sudo docker run -p 81:80 --name famille -d mchekini/famille:1.0"
        }
    }
}
