FROM node:12 AS front-end-build
WORKDIR /react-app
COPY client/ .

RUN npm install
RUN npm run build

FROM node:12
WORKDIR /public
COPY . .
COPY --from=front-end-build /react-app/build/* ./client/build/
RUN npm install
# We use native postgres bindings on heroku because SSL works better
RUN npm install pg-native
EXPOSE 5000
CMD ["npm", "start"]
