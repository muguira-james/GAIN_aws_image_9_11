# use a node image to start
FROM node:argon
# create a directory to hold all our work
RUN mkdir /app
WORKDIR /app
# by copying package.json we can get node setup
COPY package.json /app
# do the node setup (reads package.json)
RUN apt-get update
RUN apt-get install -y build-essential gfortran python-dev python-pip
RUN apt-get install -y libatlas3gf-base libatlas-dev libblas-dev liblapack-dev
RUN pip install numpy
RUN pip install scipy
RUN pip install gensim
RUN pip install NLTK
RUN pip install pymongo
RUN npm install
RUN apt-get install -y poppler-utils
#
# load the data BASE
# RUN mongoimport -d fas -c articles --file fas.json
#
# this is the port we will listen on (see app.js)
expose 3000
# this starts the app
CMD ["npm", "start"]
