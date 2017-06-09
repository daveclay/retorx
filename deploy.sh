#!/bin/bash

mvn clean && mvn release:prepare && mvn release:perform && scp web/target/art.war daveclay.com: && ssh -t daveclay.com "sudo ./deploy-art.sh"

until $(curl --output /dev/null --silent --head --fail http://daveclay.com); do
    printf '.'
    sleep 5
done

say "deployed"
