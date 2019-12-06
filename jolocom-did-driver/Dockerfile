# Dockerfile

FROM node
MAINTAINER Charles Cunningham <charles.cunningham@outlook.com>

USER root

RUN apt-get -y update

# build dependencies

RUN apt-get install -y --no-install-recommends git
RUN cd /opt/ && git clone https://github.com/jolocom/jolocom-did-driver.git
RUN cd /opt/jolocom-did-driver && npm install

# done

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 8080

ENTRYPOINT ["node", "/opt/jolocom-did-driver/index.js"]